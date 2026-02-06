// src/pages/ExplorationTotale.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

// ===== Données =====
import EXCEL_URL from "../../data/BDD_centres_plongees.xlsx?url";
import ZONES_EXCEL_URL from "../../data/BDD_zones_protegees.xlsx?url";
import observationData from "../../data/BDD_observation.json";
import speciesData from "../../data/BDD_especes_marines.json";

// ===== Assets =====
import oceanImage from "../../assets/images/bannière_blog2.jpg";

const KEY = "gsmNeDjg2V0pS8etxXtI";
const STYLE = `https://api.maptiler.com/maps/streets/style.json?key=${KEY}`;

/* ========= Configuration des Zooms par Continent ========= */
const CONTINENTS_VIEWS = {
  afrique: { center: [20, 5], zoom: 3 },
  asie: { center: [100, 15], zoom: 3 },
  europe: { center: [15, 50], zoom: 3.5 },
  amerique_nord: { center: [-100, 45], zoom: 3 },
  amerique_sud: { center: [-60, -20], zoom: 3 },
  oceanie: { center: [135, -25], zoom: 3 },
};

/* ========= Utils ========= */
const normalize = (s) => (s ?? "").toString().trim();

const normKey = (s) =>
  normalize(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const toNum = (v) => {
  if (v === null || v === undefined) return null;
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

const escapeHtml = (str = "") => String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * ✅ Ethics mapping EXACT comme dans Especes.jsx
 * - "✗" ou "x" => bad (rouge)
 * - "—" / "-" / "–" => medium (orange)
 * - sinon => good (bleu clair)
 */
function ethicsMeta(ethiqueRaw) {
  const e = normalize(ethiqueRaw);
  if (e === "✗" || e.toLowerCase() === "x") return { key: "bad", color: "#ef4444", label: "Zone pas éthique" };
  if (e === "—" || e === "-" || e === "–") return { key: "medium", color: "#f97316", label: "Zone à éviter" };
  return { key: "good", color: "#60a5fa", label: "Rien à signaler" };
}

const SPECIES_COLORS = {
  good: "#60a5fa", // bleu clair
  medium: "#f97316", // orange
  bad: "#ef4444", // rouge
  obs: "#8b5cf6", // violet (BDD observation)
};

/* ========= UI marker builders ========= */
function makeBubble({ text, size = 56, bg = "#1113a2" }) {
  const el = document.createElement("div");
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = "9999px";
  el.style.background = bg;
  el.style.color = "white";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.fontWeight = "900";
  el.style.fontSize = size >= 66 ? "16px" : "13px";
  el.style.boxShadow = "0 10px 20px rgba(0,0,0,.22)";
  el.style.cursor = "pointer";
  el.style.userSelect = "none";
  el.style.border = "2px solid white";
  el.textContent = String(text);
  return el;
}

/** ✅ Pin "goutte" bleu foncé (centres de plongée) */
const diveDropSvg = (color = "#1113a2") => `
<svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 1C10.1 1 4.5 6.6 4.5 13.5c0 8.6 12.5 28.9 12.5 28.9S29.5 22.1 29.5 13.5C29.5 6.6 23.9 1 17 1z"
    fill="${color}" stroke="white" stroke-width="1.6"/>
  <circle cx="17" cy="13.5" r="3.2" fill="white"/>
</svg>
`;

function makeDiveDropPin(color = "#1113a2") {
  const el = document.createElement("div");
  el.innerHTML = diveDropSvg(color);
  el.style.width = "34px";
  el.style.height = "44px";
  el.style.cursor = "pointer";
  el.style.transform = "translateY(-6px)";
  return el;
}

/** ✅ Étoile verte (zones protégées) */
function makeGreenStar(color = "#22c55e") {
  const el = document.createElement("div");
  el.style.width = "22px";
  el.style.height = "22px";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.cursor = "pointer";
  el.style.userSelect = "none";
  el.style.filter = "drop-shadow(0 10px 16px rgba(0,0,0,.28))";
  el.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.6l2.85 6.03 6.65.59-5.04 4.37 1.52 6.45L12 16.97 6.02 20.04l1.52-6.45L2.5 9.22l6.65-.59L12 2.6z"
        fill="${color}" stroke="white" stroke-width="1.6" />
    </svg>
  `;
  return el;
}

/** ✅ Ronds (animaux + observation) */
function makeDot(color, size = 18) {
  const el = document.createElement("div");
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = "9999px";
  el.style.background = color;
  el.style.border = "3px solid white";
  el.style.boxShadow = "0 12px 22px rgba(0,0,0,.30)";
  el.style.cursor = "pointer";
  return el;
}

function CardShell({ children, className = "" }) {
  return (
    <div className={["rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden", className].join(" ")}>
      {children}
    </div>
  );
}

/** ✅ mini icônes sidebar */
function IconDrop() {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 border border-slate-200">
      <svg width="16" height="16" viewBox="0 0 34 44" aria-hidden="true">
        <path
          d="M17 1C10.1 1 4.5 6.6 4.5 13.5c0 8.6 12.5 28.9 12.5 28.9S29.5 22.1 29.5 13.5C29.5 6.6 23.9 1 17 1z"
          fill="#1113a2"
          stroke="white"
          strokeWidth="3"
        />
        <circle cx="17" cy="13.5" r="3.2" fill="white" />
      </svg>
    </span>
  );
}
function IconStar() {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 border border-slate-200">
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2.6l2.85 6.03 6.65.59-5.04 4.37 1.52 6.45L12 16.97 6.02 20.04l1.52-6.45L2.5 9.22l6.65-.59L12 2.6z"
          fill="#22c55e"
          stroke="white"
          strokeWidth="1.8"
        />
      </svg>
    </span>
  );
}
function IconDot({ color = "#60a5fa" }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 border border-slate-200">
      <span className="w-3.5 h-3.5 rounded-full border-2 border-white shadow" style={{ background: color }} />
    </span>
  );
}

export default function ExplorationTotale() {
  const { t } = useTranslation();
  const location = useLocation();

  const mapRef = useRef(null);
  const mapObj = useRef(null);

  const [excelRows, setExcelRows] = useState([]); // centres plongée
  const [zonesRows, setZonesRows] = useState([]); // zones protégées
  const [hasError, setHasError] = useState(false);

  const [searchCountry, setSearchCountry] = useState("");
  const [currentZoom, setCurrentZoom] = useState(1.8);

  // ✅ filtres: Centres de plongée | Zones protégées | Animaux à voir (Reset = tout)
  const [mainCategory, setMainCategory] = useState("all"); // all | dive | amp | animals

  // ✅ filtres animaux (4 couleurs)
  const [animalFilters, setAnimalFilters] = useState({
    good: true, // bleu clair
    medium: true, // orange
    bad: true, // rouge
    obs: true, // violet (centres d'observation)
  });

  const [noCountryData, setNoCountryData] = useState(false);

  // ✅ Signalement (UI)
  const [reportForm, setReportForm] = useState({
    operator: "",
    country: "",
    animal: "",
    abuses: {
      feeding: false,
      touch: false,
      chase: false,
      overcrowded: false,
      distance: false,
    },
    details: "",
  });

  const [openReport, setOpenReport] = useState(false);

  const updateAbuse = (key) =>
    setReportForm((p) => ({ ...p, abuses: { ...p.abuses, [key]: !p.abuses[key] } }));

  const handleReportSubmit = (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-alert
    alert("Signalement envoyé (démo UI).");
    setReportForm({
      operator: "",
      country: "",
      animal: "",
      abuses: { feeding: false, touch: false, chase: false, overcrowded: false, distance: false },
      details: "",
    });
    setOpenReport(false);
  };

  // ✅ Lire ?country=... et pré-remplir la recherche
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const c = (params.get("country") || "").trim();
    if (c) setSearchCountry(c);
  }, [location.search]);

  // ========= Load Excel (centres) + zones protégées =========
  useEffect(() => {
    (async () => {
      try {
        const [resCentres, resZones] = await Promise.all([fetch(EXCEL_URL), fetch(ZONES_EXCEL_URL)]);
        if (!resCentres.ok) throw new Error("Centres Excel not found");
        if (!resZones.ok) throw new Error("Zones Excel not found");

        const [bufCentres, bufZones] = await Promise.all([resCentres.arrayBuffer(), resZones.arrayBuffer()]);

        const wb1 = XLSX.read(bufCentres, { type: "array" });
        const ws1 = wb1.Sheets[wb1.SheetNames[0]];
        setExcelRows(XLSX.utils.sheet_to_json(ws1, { defval: "" }));

        const wb2 = XLSX.read(bufZones, { type: "array" });
        const ws2 = wb2.Sheets[wb2.SheetNames[0]];
        setZonesRows(XLSX.utils.sheet_to_json(ws2, { defval: "" }));
      } catch (e) {
        console.error(e);
        setHasError(true);
      }
    })();
  }, []);

  // ========= Normalize points (Centres + Zones + obs + species) =========
  const allPoints = useMemo(() => {
    const points = [];

    // Centres de plongée (BDD_centres_plongees.xlsx)
    excelRows.forEach((r) => {
      let lat = toNum(r.lat ?? r.Lat ?? r.LAT ?? r.latitude ?? r.Latitude ?? r.LATITUDE ?? r.y ?? r.Y);
      let lon = toNum(
        r.long ??
          r.Long ??
          r.LONG ??
          r.lon ??
          r.Lon ??
          r.LON ??
          r.lng ??
          r.Lng ??
          r.LNG ??
          r.longitude ??
          r.Longitude ??
          r.x ??
          r.X
      );

      if (lat != null && lon != null && Math.abs(lat) > 90 && Math.abs(lon) <= 90) [lat, lon] = [lon, lat];
      if (lat == null || lon == null) return;
      if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return;

      if (mainCategory === "amp" || mainCategory === "animals") return;

      const country = (r.pays ?? r.Pays ?? r.country ?? r.Country ?? "").toString().trim();
      const name = (r.nom ?? r.Nom ?? r.name ?? r.Name ?? "Centre de plongée").toString().trim();

      points.push({
        id: `dive-${country}-${lat}-${lon}-${name}`,
        type: "dive",
        country,
        lat,
        lon,
        name,
      });
    });

    // Zones protégées (BDD_zones_protegees.xlsx)
    zonesRows.forEach((r) => {
      let lat = toNum(r.lat ?? r.Lat ?? r.LAT ?? r.latitude ?? r.Latitude ?? r.LATITUDE ?? r.y ?? r.Y);
      let lon = toNum(
        r.long ??
          r.Long ??
          r.LONG ??
          r.lon ??
          r.Lon ??
          r.LON ??
          r.lng ??
          r.Lng ??
          r.LNG ??
          r.longitude ??
          r.Longitude ??
          r.x ??
          r.X
      );

      if (lat != null && lon != null && Math.abs(lat) > 90 && Math.abs(lon) <= 90) [lat, lon] = [lon, lat];
      if (lat == null || lon == null) return;
      if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return;

      if (mainCategory === "dive" || mainCategory === "animals") return;

      const country = (r.pays ?? r.Pays ?? r.country ?? r.Country ?? "").toString().trim();
      const name = (r.nom ?? r.Nom ?? r.name ?? r.Name ?? "Zone protégée").toString().trim();

      points.push({
        id: `amp-${country}-${lat}-${lon}-${name}`,
        type: "amp",
        country,
        lat,
        lon,
        name,
      });
    });

    // Observation (BDD_observation.json) => violet
    if (mainCategory === "all" || mainCategory === "animals") {
      if (animalFilters.obs) {
        (observationData || []).forEach((p) => {
          const lat = toNum(p.lat);
          const lon = toNum(p.lon);
          if (lat == null || lon == null) return;
          if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return;

          const country = String(p.country || p.pays || "").trim();
          const name = String(p.name || "Centre d’observation").trim();

          points.push({
            id: `obs-${country}-${lat}-${lon}-${name}`,
            type: "obs",
            country,
            lat,
            lon,
            name,
          });
        });
      }
    }

    /**
     * ✅ Espèces (BDD_especes_marines.json)
     * IMPORTANT : on utilise la même logique que Especes.jsx :
     * - "✗" / "x" => rouge
     * - "—" / "-" / "–" => orange
     * - sinon => bleu clair
     */
    if (mainCategory === "all" || mainCategory === "animals") {
      (speciesData || []).forEach((p) => {
        const lat = toNum(p.lat);
        const lon = toNum(p.lon);
        if (lat == null || lon == null) return;
        if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return;

        const country = String(p.country || p.pays || "").trim();
        const eth = p.ethique ?? p.ethic ?? p.ethics ?? "";
        const meta = ethicsMeta(eth); // good | medium | bad

        if (!animalFilters[meta.key]) return;

        points.push({
          id: `species-${country}-${lat}-${lon}-${p.species || p.name || ""}`,
          type: "species",
          country,
          lat,
          lon,
          name: String(p.species || p.name || "Espèce").trim(),
          ethique: eth,
          ethicLevel: meta.key,
        });
      });
    }

    if (mainCategory === "dive") return points.filter((p) => p.type === "dive");
    if (mainCategory === "amp") return points.filter((p) => p.type === "amp");
    if (mainCategory === "animals") return points.filter((p) => p.type === "species" || p.type === "obs");

    return points;
  }, [excelRows, zonesRows, mainCategory, animalFilters]);

  const filteredPoints = useMemo(() => {
    const q = searchCountry.trim().toLowerCase();
    if (!q) return allPoints;
    return allPoints.filter((p) => (p.country || "").toLowerCase().includes(q));
  }, [allPoints, searchCountry]);

  // ========= Counts =========
  const counters = useMemo(() => {
    const speciesCount = (speciesData || []).length;
    const diveCount = excelRows.length;
    const obsCount = (observationData || []).length;
    return { speciesCount, diveCount, obsCount };
  }, [excelRows]);

  // ✅ Animated counters
  const [animated, setAnimated] = useState({ species: 0, gf: 0, obs: 0 });

  useEffect(() => {
    const prefersReduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const target = { species: counters.speciesCount, gf: counters.diveCount, obs: counters.obsCount };

    if (prefersReduce) {
      setAnimated(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const duration = 650;
    const from = { ...animated };

    const tick = (now) => {
      const t01 = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - t01, 3);

      setAnimated({
        species: Math.round(from.species + (target.species - from.species) * ease),
        gf: Math.round(from.gf + (target.gf - from.gf) * ease),
        obs: Math.round(from.obs + (target.obs - from.obs) * ease),
      });

      if (t01 < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => cancelAnimationFrame(raf);
  }, [counters.speciesCount, counters.diveCount, counters.obsCount]);

  // ========= Country clusters (only when unfiltered "all") =========
  const countryClusters = useMemo(() => {
    const shouldCluster = currentZoom < 4 && !searchCountry.trim() && mainCategory === "all";
    if (!shouldCluster) return [];

    const clusters = new Map();
    filteredPoints.forEach((p) => {
      const cName = p.country || "Inconnu";
      if (!clusters.has(cName)) clusters.set(cName, { count: 0, lats: [], lons: [], name: cName });
      const o = clusters.get(cName);
      o.count += 1;
      o.lats.push(p.lat);
      o.lons.push(p.lon);
    });

    return Array.from(clusters.values()).map((c) => {
      const lat = c.lats.reduce((a, b) => a + b, 0) / Math.max(1, c.lats.length);
      const lon = c.lons.reduce((a, b) => a + b, 0) / Math.max(1, c.lons.length);
      return { ...c, lat, lon };
    });
  }, [filteredPoints, currentZoom, searchCountry, mainCategory]);

  // ========= Map init =========
  useEffect(() => {
    if (mapObj.current || !mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: STYLE,
      center: [10, 15],
      zoom: 1.8,
      attributionControl: true,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    const updateZoom = () => setCurrentZoom(map.getZoom());
    map.on("load", () => {
      map.resize();
      updateZoom();
    });
    map.on("zoomend", updateZoom);
    map.on("moveend", updateZoom);

    const ro = new ResizeObserver(() => map.resize());
    ro.observe(mapRef.current);

    mapObj.current = map;

    return () => {
      ro.disconnect();
      map.remove();
      mapObj.current = null;
    };
  }, []);

  // ========= Auto zoom on country search =========
  useEffect(() => {
    const map = mapObj.current;
    const q = searchCountry.trim().toLowerCase();
    if (!map) return;

    if (!q) {
      setNoCountryData(false);
      return;
    }

    const matches = allPoints.filter((p) => (p.country || "").toLowerCase().includes(q));
    if (!matches.length) {
      setNoCountryData(true);
      return;
    }

    setNoCountryData(false);

    const bounds = new maplibregl.LngLatBounds();
    matches.forEach((p) => bounds.extend([p.lon, p.lat]));
    if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 70, maxZoom: 6, duration: 900 });
  }, [searchCountry, allPoints]);

  // ========= Markers =========
  useEffect(() => {
    const map = mapObj.current;
    if (!map) return;

    if (map._gm_markers) map._gm_markers.forEach((m) => m.remove());
    map._gm_markers = [];

    // Cluster view
    if (countryClusters.length) {
      countryClusters.forEach((c) => {
        const el = makeBubble({ text: c.count, size: 56, bg: "#1113a2" });
        el.onclick = () => map.flyTo({ center: [c.lon, c.lat], zoom: 5, duration: 800 });

        const popupHtml = `
          <div style="font-size:12px; max-width:240px;">
            <div style="font-weight:900; color:#1113a2; margin-bottom:4px;">${escapeHtml(c.name || "")}</div>
            <div><strong>${c.count}</strong> points</div>
          </div>
        `;

        const m = new maplibregl.Marker({ element: el, anchor: "center" })
          .setLngLat([c.lon, c.lat])
          .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(popupHtml))
          .addTo(map);

        map._gm_markers.push(m);
      });
      return;
    }

    // Pins view
    filteredPoints.forEach((p) => {
      // espèces = ronds (bleu clair / orange / rouge)
      if (p.type === "species") {
        const dotColor = SPECIES_COLORS[p.ethicLevel || "good"];
        const el = makeDot(dotColor, 18);

        const status =
          p.ethicLevel === "bad"
            ? { text: "Zone pas éthique", color: SPECIES_COLORS.bad }
            : p.ethicLevel === "medium"
            ? { text: "Zone à éviter", color: SPECIES_COLORS.medium }
            : { text: "Rien à signaler", color: SPECIES_COLORS.good };

        const popupHtml = `
          <div style="font-size:12px; max-width:230px;">
            <div style="font-weight:900; color:#1113a2; margin-bottom:4px;">${escapeHtml(p.name || "")}</div>
            <div style="color:#6b7280; margin-bottom:6px;">${escapeHtml(p.country || "")}</div>
            <div style="font-weight:900; color:${status.color};">${status.text}</div>
            ${
              normalize(p.ethique)
                ? `<div style="margin-top:6px; color:#6b7280;">Éthique : <b>${escapeHtml(normalize(p.ethique))}</b></div>`
                : ""
            }
          </div>
        `;

        const m = new maplibregl.Marker({ element: el, anchor: "center" })
          .setLngLat([p.lon, p.lat])
          .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(popupHtml))
          .addTo(map);

        map._gm_markers.push(m);
        return;
      }

      // observation = ronds VIOLETS
      if (p.type === "obs") {
        const el = makeDot(SPECIES_COLORS.obs, 18);

        const popupHtml = `
          <div style="font-size:12px; max-width:240px;">
            <div style="font-weight:900; color:#1113a2; margin-bottom:4px;">${escapeHtml(p.name || "")}</div>
            <div style="color:#6b7280; margin-bottom:6px;">${escapeHtml(p.country || "")}</div>
            <div style="font-weight:900; color:${SPECIES_COLORS.obs};">Centre d’observation</div>
          </div>
        `;

        const m = new maplibregl.Marker({ element: el, anchor: "center" })
          .setLngLat([p.lon, p.lat])
          .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(popupHtml))
          .addTo(map);

        map._gm_markers.push(m);
        return;
      }

      // zones protégées = étoiles VERTES
      if (p.type === "amp") {
        const el = makeGreenStar("#22c55e");

        const popupHtml = `
          <div style="font-size:12px; max-width:260px;">
            <div style="font-weight:900; color:#1113a2; margin-bottom:4px;">${escapeHtml(p.name || "")}</div>
            <div style="color:#6b7280; margin-bottom:6px;">${escapeHtml(p.country || "")}</div>
            <div style="color:#111827;">Zone <strong>protégée</strong>.</div>
          </div>
        `;

        const m = new maplibregl.Marker({ element: el, anchor: "center" })
          .setLngLat([p.lon, p.lat])
          .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(popupHtml))
          .addTo(map);

        map._gm_markers.push(m);
        return;
      }

      // centres de plongée = goutte bleu foncé
      if (p.type === "dive") {
        const el = makeDiveDropPin("#1113a2");

        const popupHtml = `
          <div style="font-size:12px; max-width:260px;">
            <div style="font-weight:900; color:#1113a2; margin-bottom:4px;">${escapeHtml(p.name || "")}</div>
            <div style="color:#6b7280; margin-bottom:6px;">${escapeHtml(p.country || "")}</div>
            <div style="color:#111827;">Centre de <strong>plongée</strong>.</div>
          </div>
        `;

        const m = new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([p.lon, p.lat])
          .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(popupHtml))
          .addTo(map);

        map._gm_markers.push(m);
      }
    });
  }, [filteredPoints, countryClusters]);

  const handleContinentClick = (key) => {
    const view = CONTINENTS_VIEWS[key];
    if (mapObj.current && view) mapObj.current.flyTo({ ...view, duration: 1100 });
  };

  const resetAll = () => {
    setSearchCountry("");
    setNoCountryData(false);
    setMainCategory("all");
    setAnimalFilters({ good: true, medium: true, bad: true, obs: true });

    const map = mapObj.current;
    if (map) map.flyTo({ center: [10, 15], zoom: 1.8, duration: 800 });
  };

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleAnimalFilter = (k) => setAnimalFilters((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      {/* TITRE fond gris */}
      <section className="py-12 px-6 text-center bg-gray-200">
        <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#1113a2]">Vision globale</div>
        <h1 className="mt-3 text-2xl md:text-5xl font-extrabold uppercase tracking-tight text-gray-900">
          Où voyages-tu ?
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-gray-700">
          Centres de plongée, zones protégées, centres d’observation et spots d’espèces marines.
        </p>
      </section>

      {/* HERO image + recherche + continents */}
      <section className="w-full relative overflow-hidden">
        <img src={oceanImage} alt="Fond océan" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 w-full py-10 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/95 backdrop-blur rounded-3xl shadow-xl border border-white/40 p-5 md:p-7 space-y-5">
              <div className="text-center">
                <div className="text-base md:text-xl font-extrabold uppercase tracking-tight text-gray-900">
                  Recherche pays
                </div>
                <p className="mt-2 text-base text-slate-700">Tape un pays pour zoomer automatiquement sur la carte.</p>
              </div>

              <div className="max-w-3xl mx-auto">
                <input
                  type="text"
                  placeholder="Rechercher un pays (ex : Philippines, Mexique...)"
                  className="w-full bg-slate-100 px-6 py-5 rounded-3xl outline-none shadow-inner text-base md:text-lg font-medium border-2 border-transparent focus:border-[#1113a2] transition"
                  value={searchCountry}
                  onChange={(e) => setSearchCountry(e.target.value)}
                />

                {noCountryData && searchCountry.trim() && (
                  <div className="mt-3 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 text-sm text-slate-800">
                    Nous n’avons pas encore de données pour <b>{searchCountry.trim()}</b>. Essaie un autre pays.
                  </div>
                )}

                {hasError && (
                  <p className="mt-3 text-sm text-orange-600 text-center">
                    {t("activities.diving.error", { defaultValue: "Impossible de charger les fichiers pour l’instant." })}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {Object.keys(CONTINENTS_VIEWS).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleContinentClick(key)}
                    className="px-4 py-2 rounded-full border border-white/60 bg-white/80 text-xs font-black text-slate-700 hover:bg-white hover:border-[#1113a2]/40 hover:text-[#1113a2] transition shadow-sm uppercase tracking-wider"
                  >
                    {key.replace("_", " ")}
                  </button>
                ))}

                <button
                  onClick={resetAll}
                  className="px-4 py-2 rounded-full border border-white/60 bg-white/80 text-xs font-black text-slate-700 hover:bg-white transition shadow-sm uppercase tracking-wider"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP & SIDEBAR */}
      <section className="py-8 px-4 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
        <aside className="space-y-4">
          <CardShell className="p-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Filtres</p>
              <button
                type="button"
                onClick={resetAll}
                className="text-[10px] font-black uppercase tracking-widest text-slate-600 px-3 py-2 rounded-full border border-slate-200 hover:bg-slate-50 transition"
              >
                Reset
              </button>
            </div>

            {/* ✅ 3 filtres sans “petite description” */}
            <div className="space-y-2">
              {[
                { id: "dive", label: "Centres de plongée", icon: <IconDrop /> },
                { id: "amp", label: "Zones protégées", icon: <IconStar /> },
                { id: "animals", label: "Animaux à voir", icon: <IconDot color={SPECIES_COLORS.good} /> },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setMainCategory(cat.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all
                    ${
                      mainCategory === cat.id
                        ? "border-[#1113a2] bg-[#1113a2]/5 font-black text-[#1113a2] shadow-sm"
                        : "border-slate-100 bg-white text-slate-800 hover:border-slate-200"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {cat.icon}
                    <span className="text-sm md:text-base">{cat.label}</span>
                  </div>
                  {mainCategory === cat.id && <span className="w-1.5 h-1.5 rounded-full bg-[#1113a2]" />}
                </button>
              ))}
            </div>

            {/* ✅ panneau filtres couleurs quand on est sur Animaux */}
            {mainCategory === "animals" && (
              <div className="mt-4 p-4 rounded-2xl border border-slate-200 bg-white">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Filtrer par couleur</p>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    { k: "bad", color: SPECIES_COLORS.bad, label: "Rouge — zone pas éthique" },
                    { k: "medium", color: SPECIES_COLORS.medium, label: "Orange — zone à éviter" },
                    { k: "good", color: SPECIES_COLORS.good, label: "Bleu clair — rien à signaler" },
                    { k: "obs", color: SPECIES_COLORS.obs, label: "Violet — centres d’observation" },
                  ].map((it) => (
                    <label
                      key={it.k}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 cursor-pointer select-none transition
                        ${animalFilters[it.k] ? "border-[#1113a2]/30 bg-[#1113a2]/5" : "border-slate-200 bg-white"}`}
                    >
                      <input
                        type="checkbox"
                        className="accent-[#1113a2]"
                        checked={Boolean(animalFilters[it.k])}
                        onChange={() => toggleAnimalFilter(it.k)}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border-2 border-white shadow"
                        style={{ background: it.color }}
                      />
                      <span className="text-sm text-slate-800">{it.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={() => scrollToId("how-choose-operator")}
                className="w-full text-center px-4 py-3 rounded-2xl bg-slate-900 text-white hover:opacity-95 transition text-sm font-black"
              >
                Comment choisir son opérateur ?
              </button>
            </div>
          </CardShell>

          <div className="bg-[#1113a2] text-white rounded-2xl px-5 py-4 shadow-lg">
            <p className="text-sm font-semibold">Astuce : zoome sur la carte pour voir tous les pins clairement.</p>
          </div>
        </aside>

        <div className="relative rounded-2xl overflow-hidden border-[10px] border-white shadow-2xl h-[720px] bg-slate-100">
          <div ref={mapRef} className="absolute inset-0 w-full h-full" />
        </div>
      </section>

      {/* Sous la carte */}
      <section className="max-w-[1440px] mx-auto px-6 mt-10 grid grid-cols-1 gap-8">
        {/* Barre d’état */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CardShell className="p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Spots espèces</p>
            <div className="mt-2 text-3xl md:text-4xl font-black text-[#1113a2] tracking-tight">{animated.species}</div>
          </CardShell>
          <CardShell className="p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Centres de plongée</p>
            <div className="mt-2 text-3xl md:text-4xl font-black text-[#1113a2] tracking-tight">{animated.gf}</div>
          </CardShell>
          <CardShell className="p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Centres d’observation</p>
            <div className="mt-2 text-3xl md:text-4xl font-black text-[#1113a2] tracking-tight">{animated.obs}</div>
          </CardShell>
        </div>
      </section>

      {/* Top 3 destinations */}
      <section className="w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
          <CardShell className="p-6 md:p-10">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#1113a2]">
                  Sélection
                </div>
                <h2 className="mt-2 text-xl md:text-2xl font-black uppercase tracking-tight text-gray-900">
                  Top 3 des destinations éthiques
                </h2>
                <p className="mt-3 text-sm md:text-base text-gray-700 max-w-3xl">
                  Des destinations où tu as plus de chances de trouver des pratiques encadrées.
                </p>
              </div>

              <button
                onClick={() => setSearchCountry("")}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition"
              >
                Vue globale
              </button>
            </div>

            {/* ✅ 3 cartes même taille (grid + hauteur homogène) */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
              {[
                {
                  title: "Philippines",
                  bullets: [
                    "Beaucoup d’opérateurs : on peut choisir ceux qui briefent, respectent les distances et limitent l’impact.",
                    "Présence de sites marins gérés + des zones où les règles sont plus lisibles (capacité, mouillages, etc.).",
                    "Bon terrain pour comparer : centres très “tourisme de masse” vs centres plus responsables (à privilégier).",
                  ],
                },
                {
                  title: "Gabon",
                  bullets: [
                    "Moins “industrie” et plus de contrôle sur certains spots clés : pression touristique souvent plus faible.",
                    "Cadres et saisons d’observation généralement plus structurés (approche, vitesse, comportement bateau).",
                    "Destination nature : plus d’incitation à faire “moins mais mieux” avec des opérateurs spécialisés.",
                  ],
                },
                {
                  title: "Açores",
                  bullets: [
                    "Culture d’observation : de nombreux opérateurs mettent l’accent sur les distances et le temps d’exposition.",
                    "Règles d’approche souvent plus strictes et facilement communiquées (briefing, nombre de bateaux, etc.).",
                    "Bonne lisibilité : avis, labels, et pratiques plus cohérentes entre opérateurs sur plusieurs îles.",
                  ],
                },
              ].map((d) => (
                <div
                  key={d.title}
                  className="rounded-[2rem] border border-gray-200 bg-white p-5 flex flex-col h-full"
                >
                  <p className="font-black text-lg text-[#1113a2]">{d.title}</p>

                  {/* ✅ même “volume” de texte : liste 3 puces pour chaque pays */}
                  <ul className="mt-3 text-sm text-gray-700 leading-relaxed list-disc pl-5 space-y-2 flex-1">
                    {d.bullets.map((b, i) => (
                      <li key={`${d.title}-b-${i}`}>{b}</li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => setSearchCountry(d.title)}
                    className="mt-5 w-full px-4 py-3 rounded-2xl bg-[#1113a2] text-white text-sm font-semibold hover:opacity-95 transition"
                  >
                    Zoomer
                  </button>
                </div>
              ))}
            </div>
          </CardShell>
        </div>
      </section>


      {/* Comment choisir */}
      <section id="how-choose-operator" className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
          <CardShell className="p-6 md:p-10">
            <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#1113a2]">Guide</div>
            <h2 className="mt-2 text-xl md:text-2xl font-black uppercase tracking-tight text-gray-900">
              Comment choisir son opérateur ?
            </h2>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { title: "Briefing clair", text: "Règles et distances annoncées." },
                { title: "Zéro contact", text: "Pas de nourrissage, pas de toucher." },
                { title: "Stop si l’animal s’éloigne", text: "On observe, on ne force pas." },
              ].map((c) => (
                <div key={c.title} className="rounded-[2rem] border border-gray-200 bg-gray-50 p-4">
                  <p className="font-black text-gray-900">{c.title}</p>
                  <p className="text-sm text-gray-700 mt-2">{c.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[2rem] border border-red-200 bg-red-50 p-5">
              <p className="font-black text-gray-900">Signaux d’alerte</p>
              <ul className="mt-2 text-sm text-gray-700 space-y-1.5 list-disc pl-5">
                <li>Promesse “rencontre garantie”.</li>
                <li>Pas de briefing / règles floues.</li>
                <li>Poursuite pour la photo.</li>
              </ul>
            </div>
          </CardShell>
        </div>
      </section>

      {/* Retours terrain + signalement (fond gris) */}
      <section id="retours-terrain" className="w-full bg-gray-100">
        <div className="py-14 px-6">
          <div className="max-w-7xl mx-auto">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Journal des signalements</p>
            <h3 className="mt-2 text-2xl md:text-4xl font-black text-slate-900">Derniers retours terrain</h3>

            <p className="mt-4 w-full text-base md:text-lg text-slate-700">
              Ces retours servent à repérer les zones où la pression touristique dérape (poursuite, trop de bateaux,
              contact, nourrissage), et à mieux orienter la communauté.
            </p>

            <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  place: "Oslob (Philippines)",
                  note:
                    "Requins-baleines : pression forte. Signalements liés à des approches trop proches et à une logique “attraction”.",
                },
                {
                  place: "Tanzanie",
                  note: "Dauphins : poursuite répétée + mises à l’eau insistantes. Impact sur repos et comportements.",
                },
                {
                  place: "Malaisie",
                  note:
                    "Tortues : surfréquentation sur certains spots. Risques : contact, flashs, dérangement des zones de repos.",
                },
              ].map((x) => (
                <div key={x.place} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-lg font-black text-slate-900">{x.place}</p>
                  <p className="mt-2 text-sm md:text-base text-slate-700 leading-relaxed">{x.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => setOpenReport((v) => !v)}
                className="inline-flex items-center justify-center px-6 py-4 rounded-2xl bg-white text-[#1113a2] text-sm md:text-base font-semibold shadow hover:opacity-95 transition"
              >
                Faire un signalement
              </button>
            </div>
          </div>
        </div>

        {/* Questionnaire */}
        {openReport && (
          <div className="max-w-7xl mx-auto px-6 -mt-10 pb-16">
            <CardShell className="p-6 md:p-8 shadow-xl">
              <h4 className="text-xl md:text-2xl font-black mb-1 text-gray-900">Signalement</h4>
              <p className="text-sm text-gray-600 mb-6">Démo UI : tu brancheras ensuite ton endpoint / base / email.</p>

              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Opérateur</label>
                    <input
                      value={reportForm.operator}
                      onChange={(e) => setReportForm((p) => ({ ...p, operator: e.target.value }))}
                      className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1113a2]/25"
                      placeholder="Ex : Ocean Dive Center"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Pays</label>
                    <input
                      value={reportForm.country}
                      onChange={(e) => setReportForm((p) => ({ ...p, country: e.target.value }))}
                      className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1113a2]/25"
                      placeholder="Ex : Philippines"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Espèce</label>
                    <input
                      value={reportForm.animal}
                      onChange={(e) => setReportForm((p) => ({ ...p, animal: e.target.value }))}
                      className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1113a2]/25"
                      placeholder="Ex : requin-baleine"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Nature de l’abus</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      ["feeding", "Nourrissage"],
                      ["touch", "Contact / toucher"],
                      ["chase", "Poursuite"],
                      ["overcrowded", "Sur-fréquentation"],
                      ["distance", "Distance non respectée"],
                    ].map(([k, label]) => (
                      <label
                        key={k}
                        className={`flex items-center gap-2 rounded-2xl border px-4 py-3 cursor-pointer select-none transition
                          ${reportForm.abuses[k] ? "border-[#1113a2] bg-[#1113a2]/5" : "border-gray-200 bg-white"}`}
                      >
                        <input
                          type="checkbox"
                          className="accent-[#1113a2]"
                          checked={Boolean(reportForm.abuses[k])}
                          onChange={() => updateAbuse(k)}
                        />
                        <span className="text-sm text-gray-800">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">Détails / lien</label>
                  <input
                    value={reportForm.details}
                    onChange={(e) => setReportForm((p) => ({ ...p, details: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1113a2]/25"
                    placeholder="Décris + lien photo/vidéo si tu as"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-red-500 text-white text-sm font-semibold shadow hover:opacity-95 transition"
                  >
                    Envoyer
                  </button>

                  <button
                    type="button"
                    onClick={() => setOpenReport(false)}
                    className="px-5 py-3 rounded-2xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
                  >
                    Fermer
                  </button>
                </div>
              </form>
            </CardShell>
          </div>
        )}
      </section>
    </div>
  );
}
