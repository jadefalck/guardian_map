// src/pages/ExplorationTotale.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

// ===== Données =====
import EXCEL_URL from "../../data/BDD_centres_plongees.xlsx?url";
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
const toNum = (v) => {
  if (v === null || v === undefined) return null;
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

const normLabel = (s = "") => {
  const t = String(s || "").trim().toLowerCase();
  if (!t) return "none";
  if (t.includes("both")) return "both";
  if (t.includes("blue")) return "blueflag";
  if (t.includes("green")) return "greenfins";
  if (t === "bf") return "blueflag";
  if (t === "gf") return "greenfins";
  return "none";
};

const normGF = (s = "") => {
  const t = String(s || "").trim().toLowerCase();
  if (!t) return "none";
  if (t.includes("gold")) return "gold";
  if (t.includes("silver")) return "silver";
  if (t.includes("bronze")) return "bronze";
  if (t.includes("inactive")) return "inactive";
  if (t.includes("digital")) return "digital";
  if (t === "g") return "gold";
  if (t === "s") return "silver";
  if (t === "b") return "bronze";
  return "none";
};

const normObsLabel = (s = "") => {
  const t = String(s || "").trim().toLowerCase();
  if (!t) return "none";
  if (t.includes("wca") || t.includes("world cetacean")) return "wca";
  if (t.includes("friend") || t.includes("fots") || t.includes("friend of the sea")) return "fots";
  return "none";
};

const escapeHtml = (str = "") => String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;");

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

function makeGFPin(color = "#10b981") {
  const el = document.createElement("div");
  el.style.width = "18px";
  el.style.height = "18px";
  el.style.borderRadius = "9999px";
  el.style.background = color;
  el.style.border = "3px solid white";
  el.style.boxShadow = "0 12px 22px rgba(0,0,0,.30)";
  el.style.cursor = "pointer";
  return el;
}

function makeBFStar(color = "#2563eb") {
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

const pinSvg = (color = "#1113a2") => `
<svg viewBox="0 0 24 24">
  <path fill="${color}" d="M12 2C8.686 2 6 4.686 6 8c0 3.96 3.318 8.293 4.87 10.147a1 1 0 0 0 1.26 0C14.682 16.293 18 11.96 18 8c0-3.314-2.686-6-6-6z"/>
  <circle cx="12" cy="8" r="3" fill="white"/>
</svg>
`;

function CardShell({ children, className = "" }) {
  return (
    <div className={["rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden", className].join(" ")}>
      {children}
    </div>
  );
}

export default function ExplorationTotale() {
  const { t } = useTranslation();
  const location = useLocation();

  const mapRef = useRef(null);
  const mapObj = useRef(null);

  const [excelRows, setExcelRows] = useState([]);
  const [hasError, setHasError] = useState(false);

  const [searchCountry, setSearchCountry] = useState("");
  const [currentZoom, setCurrentZoom] = useState(1.8);

  const [mainCategory, setMainCategory] = useState("all"); // all | animals | amp | activities
  const [subCategory, setSubCategory] = useState("all"); // all | dive | obs
  const [gfLevels, setGfLevels] = useState({
    gold: false,
    silver: false,
    bronze: false,
    inactive: false,
    digital: false,
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

  // ✅ Lire ?country=... et pré-remplir la recherche (comme si tu avais tapé)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const c = (params.get("country") || "").trim();
    if (c) setSearchCountry(c);
  }, [location.search]);

  // ========= Load Excel =========
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(EXCEL_URL);
        if (!res.ok) throw new Error("Excel not found");
        const buf = await res.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws, { defval: "" });
        setExcelRows(data);
      } catch (e) {
        console.error(e);
        setHasError(true);
      }
    })();
  }, []);

  // ========= Normalize points (Excel + obs + species) =========
  const allPoints = useMemo(() => {
    const points = [];

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

      // swap si inversé
      if (lat != null && lon != null && Math.abs(lat) > 90 && Math.abs(lon) <= 90) {
        [lat, lon] = [lon, lat];
      }
      if (lat == null || lon == null) return;
      if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return;

      const label = normLabel(r.label ?? r.Label ?? r.certif ?? r.certification ?? "");
      const gfLevel = normGF(
        r.certification_level ?? r.gf_level ?? r.GF_level ?? r.greenfins_level ?? r.GreenFins_level ?? ""
      );

      const isAMP = label === "blueflag" || label === "both";
      const isDive = label === "greenfins" || label === "both";

      // filtres globaux
      if (mainCategory === "amp" && !isAMP) return;
      if (mainCategory === "activities" && subCategory === "dive" && !isDive) return;
      if (mainCategory === "activities" && subCategory === "obs") return;
      if (mainCategory === "animals") return;

      const anyLevel = Object.values(gfLevels).some(Boolean);
      if (anyLevel && !isDive) return;
      if (anyLevel && isDive) {
        if (gfLevels[gfLevel] !== true) return;
      }

      const country = (r.pays ?? r.Pays ?? r.country ?? r.Country ?? "").toString().trim();
      const name = (r.nom ?? r.Nom ?? r.name ?? r.Name ?? "").toString().trim();

      if (isAMP && (mainCategory === "all" || mainCategory === "amp" || mainCategory === "activities")) {
        points.push({
          id: `amp-${country}-${lat}-${lon}-${name}`,
          type: "amp",
          country,
          lat,
          lon,
          color: "#2563eb",
          name: name || "Zone Blue Flag",
          gfLevel,
        });
      }

      if (isDive && (mainCategory === "all" || mainCategory === "activities")) {
        points.push({
          id: `dive-${country}-${lat}-${lon}-${name}`,
          type: "dive",
          country,
          lat,
          lon,
          color: "#10b981",
          name: name || "Centre Green Fins",
          gfLevel,
        });
      }
    });

    // Observation
    if (mainCategory === "all" || (mainCategory === "activities" && (subCategory === "all" || subCategory === "obs"))) {
      (observationData || []).forEach((p) => {
        const lat = toNum(p.lat);
        const lon = toNum(p.lon);
        if (lat == null || lon == null) return;
        if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return;

        const country = String(p.country || p.pays || "").trim();
        const obsLabel = normObsLabel(p.label || p.certification || p.certif || p.program || "");

        points.push({
          id: `obs-${country}-${lat}-${lon}-${p.name || ""}`,
          type: "obs",
          country,
          lat,
          lon,
          color: "#1113a2",
          name: String(p.name || "Opérateur observation").trim(),
          obsLabel,
        });
      });
    }

    // Espèces
    if (mainCategory === "all" || mainCategory === "animals") {
      (speciesData || []).forEach((p) => {
        const lat = toNum(p.lat);
        const lon = toNum(p.lon);
        if (lat == null || lon == null) return;
        if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return;

        const isBad = p.ethique === "✗" || String(p.ethique || "").toLowerCase() === "x";
        const country = String(p.country || p.pays || "").trim();

        points.push({
          id: `species-${country}-${lat}-${lon}-${p.species || p.name || ""}`,
          type: "species",
          country,
          lat,
          lon,
          color: isBad ? "#dc2626" : "#6366f1",
          name: String(p.species || p.name || "Espèce").trim(),
          ethique: isBad ? "bad" : "good",
        });
      });
    }

    return points;
  }, [excelRows, mainCategory, subCategory, gfLevels]);

  const filteredPoints = useMemo(() => {
    const q = searchCountry.trim().toLowerCase();
    if (!q) return allPoints;
    return allPoints.filter((p) => (p.country || "").toLowerCase().includes(q));
  }, [allPoints, searchCountry]);

  // ========= Counts =========
  const counters = useMemo(() => {
    const speciesCount = (speciesData || []).length;

    const gfCount = excelRows.filter((r) => {
      const label = normLabel(r.label ?? r.Label ?? r.certif ?? r.certification ?? "");
      return label === "greenfins" || label === "both";
    }).length;

    const obsCount = (observationData || []).filter((p) => {
      const l = normObsLabel(p.label || p.certification || p.certif || p.program || "");
      return l === "wca" || l === "fots";
    }).length;

    return { speciesCount, gfCount, obsCount };
  }, [excelRows]);

  // ✅ Animated counters (sinon "animated is not defined")
  const [animated, setAnimated] = useState({ species: 0, gf: 0, obs: 0 });

  useEffect(() => {
    const prefersReduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduce) {
      setAnimated({ species: counters.speciesCount, gf: counters.gfCount, obs: counters.obsCount });
      return;
    }

    let raf = 0;
    const start = performance.now();
    const duration = 650;

    const from = { ...animated };
    const to = { species: counters.speciesCount, gf: counters.gfCount, obs: counters.obsCount };

    const tick = (now) => {
      const t01 = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - t01, 3);

      setAnimated({
        species: Math.round(from.species + (to.species - from.species) * ease),
        gf: Math.round(from.gf + (to.gf - from.gf) * ease),
        obs: Math.round(from.obs + (to.obs - from.obs) * ease),
      });

      if (t01 < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => cancelAnimationFrame(raf);
  }, [counters.speciesCount, counters.gfCount, counters.obsCount]);

  // ========= Country clusters (only when unfiltered "all") =========
  const countryClusters = useMemo(() => {
    const shouldCluster = currentZoom < 4 && !searchCountry.trim() && mainCategory === "all" && subCategory === "all";
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
  }, [filteredPoints, currentZoom, searchCountry, mainCategory, subCategory]);

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
      if (p.type === "species") {
        const el = document.createElement("div");
        el.innerHTML = pinSvg(p.color);
        el.style.width = "28px";
        el.style.height = "28px";
        el.style.cursor = "pointer";
        el.style.transform = "translateY(-4px)";

        const popupHtml = `
          <div style="font-size:12px; max-width:230px;">
            <div style="font-weight:900; color:#1113a2; margin-bottom:4px;">${escapeHtml(p.name || "")}</div>
            <div style="color:#6b7280; margin-bottom:6px;">${escapeHtml(p.country || "")}</div>
            <div style="font-weight:700; color:${p.ethique === "bad" ? "#dc2626" : "#16a34a"};">
              ${p.ethique === "bad" ? "Spot à risque (éthique)" : "Spot observé (éthique ok)"}
            </div>
          </div>
        `;

        const m = new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([p.lon, p.lat])
          .setPopup(new maplibregl.Popup({ offset: 8 }).setHTML(popupHtml))
          .addTo(map);

        map._gm_markers.push(m);
        return;
      }

      if (p.type === "obs") {
        const el = document.createElement("div");
        el.innerHTML = pinSvg("#1113a2");
        el.style.width = "28px";
        el.style.height = "28px";
        el.style.cursor = "pointer";
        el.style.transform = "translateY(-4px)";

        const badge = p.obsLabel === "wca" ? "WCA" : p.obsLabel === "fots" ? "Friend of the Sea" : "Opérateur";

        const popupHtml = `
          <div style="font-size:12px; max-width:240px;">
            <div style="font-weight:900; color:#1113a2; margin-bottom:4px;">${escapeHtml(p.name || "")}</div>
            <div style="color:#6b7280; margin-bottom:6px;">${escapeHtml(p.country || "")}</div>
            <div style="display:inline-flex; padding:3px 8px; border-radius:9999px; border:1px solid #c7d2fe; background:#eef2ff; color:#4338ca; font-weight:800; font-size:11px;">
              ${escapeHtml(badge)}
            </div>
          </div>
        `;

        const m = new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([p.lon, p.lat])
          .setPopup(new maplibregl.Popup({ offset: 8 }).setHTML(popupHtml))
          .addTo(map);

        map._gm_markers.push(m);
        return;
      }

      const isAmp = p.type === "amp";
      const el = isAmp ? makeBFStar("#2563eb") : makeGFPin("#10b981");

      const levelLine =
        !isAmp && p.gfLevel && p.gfLevel !== "none"
          ? `<div style="margin-top:6px; font-size:12px; color:#111827;">Niveau Green Fins : <strong>${escapeHtml(
              p.gfLevel
            )}</strong></div>`
          : "";

      const popupHtml = `
        <div style="font-size:12px; max-width:260px;">
          <div style="font-weight:900; color:#1113a2; margin-bottom:4px;">${escapeHtml(p.name || "")}</div>
          <div style="color:#6b7280; margin-bottom:6px;">${escapeHtml(p.country || "")}</div>
          <div style="color:#111827;">
            ${isAmp ? "Zone labellisée <strong>Blue Flag</strong>." : "Centre <strong>Green Fins</strong> (plongée / snorkeling)."}
          </div>
          ${levelLine}
        </div>
      `;

      const m = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([p.lon, p.lat])
        .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(popupHtml))
        .addTo(map);

      map._gm_markers.push(m);
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
    setSubCategory("all");
    setGfLevels({ gold: false, silver: false, bronze: false, inactive: false, digital: false });

    const map = mapObj.current;
    if (map) map.flyTo({ center: [10, 15], zoom: 1.8, duration: 800 });
  };

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      {/* TITRE fond gris */}
      <section className="py-12 px-6 text-center bg-gray-200">
        <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#1113a2]">Vision globale</div>
        <h1 className="mt-3 text-2xl md:text-5xl font-extrabold uppercase tracking-tight text-gray-900">
          Où voyages-tu ?
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-gray-700">
          Centres labellisés, opérateurs d’observation responsables, et spots d’espèces marines.
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
                    {t("activities.diving.error", { defaultValue: "Impossible de charger l’Excel pour l’instant." })}
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

            <div className="space-y-2">
              {[
                { id: "all", label: "Tout afficher" },
                { id: "animals", label: "Animaux à voir" },
                { id: "amp", label: "Zones protégées" },
                { id: "activities", label: "Activités" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setMainCategory(cat.id);
                    setSubCategory("all");
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all
                    ${
                      mainCategory === cat.id
                        ? "border-[#1113a2] bg-[#1113a2]/5 font-black text-[#1113a2] shadow-sm"
                        : "border-slate-100 bg-white text-slate-800 hover:border-slate-200"
                    }`}
                >
                  <span className="text-sm md:text-base">{cat.label}</span>
                  {mainCategory === cat.id && <span className="w-1.5 h-1.5 rounded-full bg-[#1113a2]" />}
                </button>
              ))}
            </div>

            {mainCategory === "activities" && (
              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => setSubCategory("all")}
                  className={`p-3 rounded-2xl border text-sm font-black transition
                    ${
                      subCategory === "all"
                        ? "bg-[#1113a2]/10 text-[#1113a2] border-[#1113a2]/30"
                        : "text-slate-800 border-slate-200 hover:bg-slate-50"
                    }`}
                >
                  Tout
                </button>
                <button
                  onClick={() => setSubCategory("dive")}
                  className={`p-3 rounded-2xl border text-sm font-black transition
                    ${
                      subCategory === "dive"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "text-slate-800 border-slate-200 hover:bg-slate-50"
                    }`}
                >
                  Plongée (Green Fins)
                </button>
                <button
                  onClick={() => setSubCategory("obs")}
                  className={`p-3 rounded-2xl border text-sm font-black transition
                    ${
                      subCategory === "obs"
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                        : "text-slate-800 border-slate-200 hover:bg-slate-50"
                    }`}
                >
                  Observation (WCA / FotS)
                </button>
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
            <p className="text-sm font-semibold">
              Astuce : zoome sur la carte pour voir tous les pins (centres, opérateurs, spots).
            </p>
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
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Centres Green Fins</p>
            <div className="mt-2 text-3xl md:text-4xl font-black text-[#1113a2] tracking-tight">{animated.gf}</div>
          </CardShell>
          <CardShell className="p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Opérateurs observation</p>
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

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: "Philippines", desc: "Plus d’options structurées côté plongée + observation." },
                { title: "Gabon", desc: "Cadres plus stricts sur certains spots clés." },
                { title: "Açores", desc: "Opérateurs plus lisibles, règles d’approche plus claires." },
              ].map((d) => (
                <div key={d.title} className="rounded-[2rem] border border-gray-200 bg-white p-5">
                  <p className="font-black text-lg text-[#1113a2]">{d.title}</p>
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">{d.desc}</p>
                  <button
                    type="button"
                    onClick={() => setSearchCountry(d.title)}
                    className="mt-4 w-full px-4 py-3 rounded-2xl bg-[#1113a2] text-white text-sm font-semibold hover:opacity-95 transition"
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
