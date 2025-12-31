// src/pages/activites/Plongée.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTranslation } from "react-i18next";

import EXCEL_URL from "../../data/BDD_centres_plongees.xlsx?url";
import observationData from "../../data/BDD_observation.json";

import oceanImage from "../../assets/images/bannière_blog2.jpg";

import gfLogo from "../../assets/images/GF_Logo.png";
import bfLogo from "../../assets/images/BF_Logo.webp";
import wcaLogo from "../../assets/images/WCA.webp";
import fotsLogo from "../../assets/images/FotS.png";

import userImg from "../../assets/images/utilisateur.png";


// ✅ Niveaux GF (images)
import gfGoldImg from "../../assets/images/labels_greenfins/GF_Gold.png";
import gfSilverImg from "../../assets/images/labels_greenfins/GF_Silver.png";
import gfBronzeImg from "../../assets/images/labels_greenfins/GF_Bronze.png";

// images pourquoi centre labellisé
import safetyImg1 from "../../assets/images/plongee_securite_humain_1.png";
import safetyImg2 from "../../assets/images/plongee_securite_humain_2.png";
import safetyImg3 from "../../assets/images/plongee_securite_humain_3.png";
import safetyImg4 from "../../assets/images/plongee_securite_humain_4.png";

import faunaImg1 from "../../assets/images/plongee_securite_faune_1.png";
import faunaImg2 from "../../assets/images/plongee_securite_faune_2.png";
import faunaImg3 from "../../assets/images/plongee_securite_faune_3.png";
import faunaImg4 from "../../assets/images/plongee_securite_faune_4.png";

const KEY = "gsmNeDjg2V0pS8etxXtI";
const STYLE = `https://api.maptiler.com/maps/streets/style.json?key=${KEY}`;

const Z_CONTINENT = 2.4;
const Z_PINS = 5.2;

/* ========= UI Shell ========= */
function CardShell({ children, className = "" }) {
  return (
    <div className={["rounded-[3rem] border border-gray-200 bg-white shadow-sm overflow-hidden", className].join(" ")}>
      {children}
    </div>
  );
}

/* ========= Utils ========= */
const toSlug = (s = "") =>
  s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const toNum = (v) => {
  if (v === null || v === undefined) return null;
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

const fixUrl = (u = "") => {
  if (!u) return "";
  const t = String(u).trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  if (/^www\./i.test(t)) return "https://" + t;
  return `https://${t}`;
};

const COLS = {
  label: ["label", "Label"],
  continent: ["continent", "Continent", "zone", "Zone"],
  country: ["pays", "Pays", "country", "Country"],
  name: ["nom", "Nom", "name", "Name", "zone_name", "Zone_name"],
  gfLevel: ["certification_level", "gf_level", "GF_level", "greenfins_level", "GreenFins_level"],
  website: ["site_du_centre", "site", "Site", "website", "Website", "url", "URL"],
  lat: ["lat", "Lat", "LAT", "latitude", "Latitude", "LATITUDE", "y", "Y"],
  lon: ["long", "Long", "LONG", "lon", "Lon", "LON", "lng", "Lng", "LNG", "longitude", "Longitude", "x", "X"],
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

function Pill({ text, kind = "blue" }) {
  const cls =
    kind === "dive"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : kind === "obs"
      ? "bg-purple-50 text-purple-700 border-purple-200"
      : kind === "zone"
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : "bg-blue-50 text-blue-700 border-blue-200";
  return <span className={`inline-flex items-center px-2 py-1 text-[11px] font-bold rounded-full border ${cls}`}>{text}</span>;
}

export default function Plongee() {
  const { t } = useTranslation();

  const mapRef = useRef(null);
  const mapObj = useRef(null);

  const [rows, setRows] = useState([]);
  const [hasError, setHasError] = useState(false);

  const [selectedContinent, setSelectedContinent] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [mapZoom, setMapZoom] = useState(1.6);

  const [countryQuery, setCountryQuery] = useState("");

  const [labelFilter, setLabelFilter] = useState("all"); // all | greenfins | blueflag | fots | wca
  const [gfLevels, setGfLevels] = useState({
    gold: false,
    silver: false,
    bronze: false,
    inactive: false,
    digital: false,
  });

  const [categoryFilter, setCategoryFilter] = useState("all"); // all | dive | observation | zones
  const [animalFilter, setAnimalFilter] = useState("all"); // all | baleine | dauphin

  const [openLabel, setOpenLabel] = useState(null); // "greenfins" | "blueflag" | "fots" | "wca" | null

  // ===== Form signalement (UI seulement) =====
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

  const updateAbuse = (key) => setReportForm((p) => ({ ...p, abuses: { ...p.abuses, [key]: !p.abuses[key] } }));

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
  };

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
        setRows(data);
      } catch (e) {
        console.error(e);
        setHasError(true);
      }
    })();
  }, []);

  // ========= Detect schema =========
  const schema = useMemo(() => {
    if (!rows.length) return null;
    const rawKeys = Object.keys(rows[0] || {});
    const keyMap = new Map(rawKeys.map((k) => [k.trim(), k]));

    const pick = (cands) => {
      const trimmedSet = new Set(rawKeys.map((k) => k.trim()));
      const found = cands.find((c) => trimmedSet.has(c));
      return found ? keyMap.get(found) : null;
    };

    return {
      kLabel: pick(COLS.label),
      kContinent: pick(COLS.continent),
      kCountry: pick(COLS.country),
      kName: pick(COLS.name),
      kGf: pick(COLS.gfLevel),
      kWeb: pick(COLS.website),
      kLat: pick(COLS.lat),
      kLon: pick(COLS.lon),
    };
  }, [rows]);

  // ========= Normalize dive centers =========
  const diveCenters = useMemo(() => {
    if (!rows.length || !schema?.kLat || !schema?.kLon) return [];
    const { kLabel, kContinent, kCountry, kName, kWeb, kGf, kLat, kLon } = schema;

    const out = [];
    for (const r of rows) {
      let lat = toNum(r[kLat]);
      let lon = toNum(r[kLon]);

      if (lat != null && lon != null && Math.abs(lat) > 90 && Math.abs(lon) <= 90) {
        [lat, lon] = [lon, lat];
      }
      if (lat == null || lon == null) continue;
      if (Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;

      const country = kCountry ? String(r[kCountry] || "").trim() : "";
      if (!country || country === "0") continue;

      const continent = kContinent ? String(r[kContinent] || "").trim() : "";
      const name = kName ? String(r[kName] || "").trim() : "";
      const website = kWeb ? fixUrl(r[kWeb]) : "";

      const label = kLabel ? normLabel(r[kLabel]) : "none";
      const gfLevel = kGf ? normGF(r[kGf]) : "none";

      const hasGf = label === "greenfins" || label === "both";
      const hasBf = label === "blueflag" || label === "both";

      out.push({
        type: "dive",
        continent,
        continentSlug: toSlug(continent) || "unknown",
        country,
        countrySlug: toSlug(country),
        name,
        website,
        lat,
        lon,
        label,
        gfLevel,
        hasGf,
        hasBf,
        hasFots: false,
        hasWca: false,
        animal: null,
        site: null,
      });
    }
    return out;
  }, [rows, schema]);

  // ========= Normalize observation operators =========
  const observationOps = useMemo(() => {
    const out = [];
    (observationData || []).forEach((p) => {
      const lat = toNum(p.lat);
      const lon = toNum(p.lon);
      if (lat == null || lon == null) return;
      if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return;

      const country = String(p.country || p.pays || "").trim();
      const continent = String(p.continent || p.zone || "").trim();

      const obsLabel = normObsLabel(p.label || p.certification || p.certif || p.program || "");
      const hasWca = obsLabel === "wca";
      const hasFots = obsLabel === "fots";

      const animal = String(p.animal || "").trim().toLowerCase();
      const website = p.website ? fixUrl(p.website) : "";

      out.push({
        type: "observation",
        continent,
        continentSlug: toSlug(continent) || "unknown",
        country,
        countrySlug: toSlug(country),
        name: String(p.name || "").trim(),
        site: String(p.site || "").trim(),
        website,
        lat,
        lon,
        label: obsLabel,
        gfLevel: "none",
        hasGf: false,
        hasBf: false,
        hasFots,
        hasWca,
        animal: animal || null,
      });
    });
    return out;
  }, []);

  const items = useMemo(() => [...diveCenters, ...observationOps], [diveCenters, observationOps]);

  // ========= Counts =========
  const worldCounts = useMemo(() => {
    const gfTotal = items.filter((c) => c.hasGf).length;
    const bfTotal = items.filter((c) => c.hasBf).length;
    const fotsTotal = items.filter((c) => c.hasFots).length;
    const wcaTotal = items.filter((c) => c.hasWca).length;

    const gfByLevel = { gold: 0, silver: 0, bronze: 0, inactive: 0, digital: 0, none: 0 };
    items.forEach((c) => {
      if (!c.hasGf) return;
      if (gfByLevel[c.gfLevel] !== undefined) gfByLevel[c.gfLevel] += 1;
      else gfByLevel.none += 1;
    });

    return { gfTotal, bfTotal, fotsTotal, wcaTotal, gfByLevel };
  }, [items]);

  // ========= Countries list =========
  const countryStats = useMemo(() => {
    const acc = new Map();
    items.forEach((c) => {
      const slug = c.countrySlug || "";
      const name = c.country || "";
      if (!slug || !name) return;
      if (!acc.has(slug)) acc.set(slug, { country: name, slug, count: 0 });
      acc.get(slug).count += 1;
    });

    const arr = Array.from(acc.values());
    arr.sort((a, b) => {
      const la = t(`countries.${a.slug}`, { defaultValue: a.country });
      const lb = t(`countries.${b.slug}`, { defaultValue: b.country });
      return la.localeCompare(lb, "fr");
    });
    return arr;
  }, [items, t]);

  const selectedCountrySlug = useMemo(() => (selectedCountry ? toSlug(selectedCountry) : ""), [selectedCountry]);

  // ========= Filter logic =========
  const passesFilters = (c) => {
    if (categoryFilter === "dive") {
      if (c.type !== "dive" || !c.hasGf) return false;
    }
    if (categoryFilter === "observation") {
      if (c.type !== "observation") return false;
    }
    if (categoryFilter === "zones") {
      if (c.type !== "dive" || !c.hasBf) return false;
    }

    if (labelFilter === "greenfins" && !c.hasGf) return false;
    if (labelFilter === "blueflag" && !c.hasBf) return false;
    if (labelFilter === "fots" && !c.hasFots) return false;
    if (labelFilter === "wca" && !c.hasWca) return false;

    if (c.type === "observation" && animalFilter !== "all") {
      if (!c.animal) return false;
      if (animalFilter === "baleine" && c.animal !== "baleine") return false;
      if (animalFilter === "dauphin" && c.animal !== "dauphin") return false;
    }

    const anyLevel = Object.values(gfLevels).some(Boolean);
    if (!anyLevel) return true;

    if (!c.hasGf) return false;
    const lvl = c.gfLevel;
    if (lvl in gfLevels) return Boolean(gfLevels[lvl]);
    return false;
  };

  // ========= Bubbles =========
  const continentBubbles = useMemo(() => {
    const acc = new Map();
    items.forEach((c) => {
      if (!passesFilters(c)) return;
      const key = c.continentSlug || "unknown";
      const label = c.continent || t("activities.diving.continentUnknown", { defaultValue: "Autre" });
      if (!acc.has(key)) acc.set(key, { continent: label, slug: key, count: 0, lats: [], lons: [] });
      const o = acc.get(key);
      o.count += 1;
      o.lats.push(c.lat);
      o.lons.push(c.lon);
    });

    return Array.from(acc.values()).map((o) => {
      const lat = o.lats.reduce((a, b) => a + b, 0) / Math.max(1, o.lats.length);
      const lon = o.lons.reduce((a, b) => a + b, 0) / Math.max(1, o.lons.length);
      return { ...o, lat, lon };
    });
  }, [items, t, labelFilter, gfLevels, animalFilter, categoryFilter]);

  const countryBubblesForContinent = useMemo(() => {
    const acc = new Map();
    const list = selectedContinent ? items.filter((c) => toSlug(c.continent) === toSlug(selectedContinent)) : items;

    list.forEach((c) => {
      if (!passesFilters(c)) return;
      const key = c.countrySlug || "";
      const countryName = c.country || "";
      if (!key || !countryName) return;
      if (!acc.has(key)) acc.set(key, { country: countryName, slug: key, count: 0, lats: [], lons: [] });
      const o = acc.get(key);
      o.count += 1;
      o.lats.push(c.lat);
      o.lons.push(c.lon);
    });

    return Array.from(acc.values()).map((o) => {
      const lat = o.lats.reduce((a, b) => a + b, 0) / Math.max(1, o.lats.length);
      const lon = o.lons.reduce((a, b) => a + b, 0) / Math.max(1, o.lons.length);
      return { ...o, lat, lon };
    });
  }, [items, selectedContinent, labelFilter, gfLevels, animalFilter, categoryFilter]);

  const getPins = (map) => {
    if (!map) return [];
    const b = map.getBounds();

    if (selectedCountry) {
      const selSlug = toSlug(selectedCountry);
      return items.filter((c) => c.countrySlug === selSlug && passesFilters(c));
    }

    const z = map.getZoom();
    if (z < Z_PINS) return [];

    const south = b.getSouth();
    const north = b.getNorth();
    const west = b.getWest();
    const east = b.getEast();
    const crossesAnti = west > east;

    return items.filter((c) => {
      if (!passesFilters(c)) return false;
      if (c.lat < south || c.lat > north) return false;
      if (!crossesAnti) return c.lon >= west && c.lon <= east;
      return c.lon >= west || c.lon <= east;
    });
  };

  // ========= Map init =========
  useEffect(() => {
    if (mapObj.current || !mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: STYLE,
      center: [0, 15],
      zoom: 1.6,
      attributionControl: true,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    const updateZoom = () => setMapZoom(map.getZoom());

    map.on("load", () => {
      map.resize();
      map.jumpTo({ center: [0, 15], zoom: 1.6 });
      updateZoom();
    });

    map.on("zoomend", updateZoom);
    map.on("moveend", updateZoom);

    const ro = new ResizeObserver(() => map.resize());
    if (mapRef.current) ro.observe(mapRef.current);

    mapObj.current = map;

    return () => {
      ro.disconnect();
      map.remove();
      mapObj.current = null;
    };
  }, []);

  useEffect(() => {
    if (selectedCountry && mapZoom < Z_PINS - 0.05) {
      setSelectedCountry("");
      setCountryQuery("");
    }
    if (selectedContinent && mapZoom < Z_CONTINENT - 0.05) {
      setSelectedContinent("");
    }
  }, [mapZoom, selectedCountry, selectedContinent]);

  // ========= Markers =========
  useEffect(() => {
    const map = mapObj.current;
    if (!map) return;

    if (map._gm_dive_markers) map._gm_dive_markers.forEach((m) => m.remove());
    map._gm_dive_markers = [];

    const z = map.getZoom();
    const forcePins = Boolean(selectedCountry);

    // Continent bubbles
    if (!forcePins && z < Z_CONTINENT && !selectedContinent) {
      const placeables = continentBubbles.filter((c) => c.lat != null && c.lon != null);

      placeables.forEach((c) => {
        const el = makeBubble({ text: c.count, size: 66 });
        el.onclick = () => {
          setSelectedContinent(c.continent);
          setSelectedCountry("");
          setCountryQuery("");

          const list = items.filter((x) => (x.continentSlug || "unknown") === c.slug && passesFilters(x));
          if (!list.length) return;

          const bounds = new maplibregl.LngLatBounds();
          list.forEach((p) => bounds.extend([p.lon, p.lat]));
          if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 70, maxZoom: 4.4, duration: 700 });
        };

        const title = t(`continents.${c.slug}`, { defaultValue: c.continent });

        const popupHtml = `
          <div style="font-size:12px; max-width:240px;">
            <div style="font-weight:900; color:#1113a2; margin-bottom:4px;">${title}</div>
            <div><strong>${c.count}</strong> opérateurs</div>
          </div>
        `;

        const marker = new maplibregl.Marker({ element: el, anchor: "center" })
          .setLngLat([c.lon, c.lat])
          .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(popupHtml))
          .addTo(map);

        map._gm_dive_markers.push(marker);
      });

      return;
    }

    // Country bubbles
    if (!forcePins && z < Z_PINS) {
      const placeables = countryBubblesForContinent.filter((c) => c.lat != null && c.lon != null);

      placeables.forEach((c) => {
        const el = makeBubble({ text: c.count, size: 52 });

        el.onclick = () => {
          setSelectedCountry(c.country);
          setCountryQuery(t(`countries.${c.slug}`, { defaultValue: c.country }));

          const list = items.filter((x) => x.countrySlug === c.slug && passesFilters(x));
          if (!list.length) return;

          const bounds = new maplibregl.LngLatBounds();
          list.forEach((p) => bounds.extend([p.lon, p.lat]));
          if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 70, maxZoom: 6.2, duration: 700 });
        };

        const title = t(`countries.${c.slug}`, { defaultValue: c.country });

        const popupHtml = `
          <div style="font-size:12px; max-width:240px;">
            <div style="font-weight:900; color:#1113a2; margin-bottom:4px;">${title}</div>
            <div><strong>${c.count}</strong> opérateurs</div>
          </div>
        `;

        const marker = new maplibregl.Marker({ element: el, anchor: "center" })
          .setLngLat([c.lon, c.lat])
          .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(popupHtml))
          .addTo(map);

        map._gm_dive_markers.push(marker);
      });

      return;
    }

    // Pins
    const pins = getPins(map);
    if (!pins.length) return;

    pins.forEach((p) => {
      // observation pins
      if (p.type === "observation") {
        const el = document.createElement("div");
        el.innerHTML = pinSvg("#1113a2");
        el.style.width = "28px";
        el.style.height = "28px";
        el.style.cursor = "pointer";
        el.style.transform = "translateY(-4px)";

        const websiteHtml = p.website
          ? `<a href="${p.website}" target="_blank" rel="noopener noreferrer" style="color:#1113a2;text-decoration:underline;word-break:break-word;">${p.website}</a>`
          : "<span style='color:#6b7280;'>Site web indisponible</span>";

        const popupHtml = `
          <div style="font-size:12px; max-width:220px;">
            <div style="font-weight:700; margin-bottom:2px;">${(p.name || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
            <div style="margin-bottom:4px;">${(p.site || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
            <div>${websiteHtml}</div>
          </div>
        `;

        const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([p.lon, p.lat])
          .setPopup(new maplibregl.Popup({ offset: 8 }).setHTML(popupHtml))
          .addTo(map);

        map._gm_dive_markers.push(marker);
        return;
      }

      // dive pins
      const isBFOnly = p.label === "blueflag";
      const isBoth = p.label === "both";
      const el = isBFOnly ? makeBFStar("#2563eb") : makeGFPin(isBoth ? "#7c3aed" : "#10b981");

      const titleCountry = p.countrySlug ? t(`countries.${p.countrySlug}`, { defaultValue: p.country }) : p.country || "";
      const safeName = (p.name || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const websiteHtml = p.website
        ? `<a href="${p.website}" target="_blank" rel="noopener noreferrer" style="color:#1113a2;text-decoration:underline;word-break:break-word;">${p.website}</a>`
        : "<span style='color:#6b7280;'>Site web indisponible</span>";

      let popupHtml = "";

      if (isBFOnly) {
        popupHtml = `
          <div style="font-size:12px; max-width:270px;">
            <div style="font-weight:900; color:#1113a2; margin-bottom:3px;">${safeName || "Zone Blue Flag"}</div>
            <div style="margin-bottom:6px;">${titleCountry}${p.continent ? ` • ${p.continent}` : ""}</div>
            <div style="color:#111827; margin-bottom:6px;">
              Cette zone est labellisée <strong>Blue Flag</strong> : elle suit des critères de qualité de l’eau, gestion et sécurité.
            </div>
            <div>${websiteHtml}</div>
          </div>
        `;
      } else {
        const gfLevelLine =
          p.gfLevel && p.gfLevel !== "none"
            ? `<div style="margin-bottom:6px;color:#111827;">Niveau Green Fins : <strong>${p.gfLevel}</strong></div>`
            : "";

        const extraBF = isBoth ? `<div style="margin-bottom:6px;color:#111827;">Zone associée : <strong>Blue Flag</strong></div>` : "";

        popupHtml = `
          <div style="font-size:12px; max-width:270px;">
            <div style="font-weight:900; color:#1113a2; margin-bottom:3px;">${safeName || "Centre de plongée"}</div>
            <div style="margin-bottom:6px;">${titleCountry}${p.continent ? ` • ${p.continent}` : ""}</div>
            <div style="color:#111827; margin-bottom:6px;">
              Centre <strong>Green Fins</strong> (plongée / snorkeling).
            </div>
            ${gfLevelLine}
            ${extraBF}
            <div style="margin-bottom:6px;color:#111827;">Réservation possible sur le site :</div>
            <div>${websiteHtml}</div>
          </div>
        `;
      }

      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([p.lon, p.lat])
        .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(popupHtml))
        .addTo(map);

      map._gm_dive_markers.push(marker);
    });
  }, [
    items,
    continentBubbles,
    countryBubblesForContinent,
    selectedContinent,
    selectedCountry,
    labelFilter,
    gfLevels,
    animalFilter,
    categoryFilter,
    mapZoom,
    t,
  ]);

  // ========= UI helpers =========
  const resetFilters = () => {
    setLabelFilter("all");
    setGfLevels({ gold: false, silver: false, bronze: false, inactive: false, digital: false });
    setAnimalFilter("all");
    setCategoryFilter("all");
  };

  const clearAll = () => {
    setSelectedContinent("");
    setSelectedCountry("");
    setCountryQuery("");
    resetFilters();
    const map = mapObj.current;
    if (map) map.easeTo({ center: [0, 15], zoom: 1.6, duration: 650 });
  };

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleLevel = (lvl) => setGfLevels((prev) => ({ ...prev, [lvl]: !prev[lvl] }));

  const shownCounts = worldCounts;

  // ===== Labels cards + modal content =====
  const labelCards = [
    {
      key: "greenfins",
      logo: gfLogo,
      title: "Green Fins",
      tag: <Pill text="Plongée" kind="dive" />,
      short: "Programme international pour réduire l’impact des centres plongée/snorkeling via des critères et évaluations.",
      long: (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            Green Fins est un programme international qui accompagne les centres de plongée et de snorkeling pour réduire leur impact
            sur les écosystèmes marins, via des critères et des évaluations.
          </p>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">Les niveaux (simplement)</p>
            <ul className="text-sm list-disc pl-5 space-y-1 text-gray-800">
              <li>
                <b>Gold</b> : très haut niveau de bonnes pratiques et de conformité.
              </li>
              <li>
                <b>Silver</b> : bonnes pratiques solides, avec quelques points à améliorer.
              </li>
              <li>
                <b>Bronze</b> : engagement réel, bases en place, progression attendue.
              </li>
              <li>
                <b>Digital</b> : participation/engagement via un format digital (selon pays).
              </li>
              <li>
                <b>Inactive</b> : centre non actif dans le programme actuellement (selon suivi local).
              </li>
            </ul>
          </div>
          <a
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition text-sm font-semibold text-[#1113a2]"
            href="https://cdwsstore.blob.core.windows.net/membership/downloads/rulesAndRegulations/144ea-GF_Egy_Eng_IconsExplained_A4.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Ouvrir les guidelines Green Fins (PDF)
          </a>
        </div>
      ),
    },
    {
      key: "blueflag",
      logo: bfLogo,
      title: "Blue Flag",
      tag: <Pill text="Zones maritimes protégées" kind="zone" />,
      short: "Label attribué à des plages et ports : qualité de l’eau, gestion environnementale, sécurité & éducation.",
      long: (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            Blue Flag est un label attribué à des plages et ports de plaisance. Il repose sur des critères de qualité de l’eau, gestion
            environnementale, sécurité et éducation.
          </p>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">À retenir</p>
            <ul className="text-sm list-disc pl-5 space-y-1 text-gray-800">
              <li>Label appliqué à des sites (plages/ports)</li>
              <li>Critères qualité de l’eau, gestion, sécurité</li>
              <li>Indicateur complémentaire pour choisir une zone</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: "fots",
      logo: fotsLogo,
      title: "Friend of the Sea",
      tag: <Pill text="Observation" kind="obs" />,
      short: "Certification durabilité : bonnes pratiques, réduction des impacts, gestion et sensibilisation.",
      long: (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            Friend of the Sea est une certification de durabilité (économie bleue) appliquée à plusieurs activités marines. Pour les
            opérateurs d’activités en mer, l’idée est de structurer une démarche : réduction d’impact, bonnes pratiques, sensibilisation.
          </p>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">Exemples de points souvent couverts</p>
            <ul className="text-sm list-disc pl-5 space-y-1 text-gray-800">
              <li>Règles d’approche et minimisation du dérangement</li>
              <li>Gestion des déchets / plastique à bord</li>
              <li>Communication et éducation des clients</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: "wca",
      logo: wcaLogo,
      title: "World Cetacean Alliance (WCA)",
      tag: <Pill text="Observation" kind="obs" />,
      short: "Réseau axé cétacés et observation responsable : respect, réduction du dérangement, éducation.",
      long: (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            La World Cetacean Alliance est un réseau international autour des cétacés et de l’observation responsable. L’objectif : faire
            progresser la qualité des pratiques (approche, vitesse, nombre de bateaux), et l’éducation.
          </p>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">Pourquoi c’est utile</p>
            <ul className="text-sm list-disc pl-5 space-y-1 text-gray-800">
              <li>Encadre l’observation pour éviter stress et comportements dangereux</li>
              <li>Renforce la sensibilisation des voyageurs</li>
              <li>Favorise des opérateurs plus sérieux</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];
  const currentLabel = labelCards.find((c) => c.key === openLabel) || null;

  // ===== Avis clients : FIX overflow horizontal =====
  useEffect(() => {
    const prevOverflowX = document.documentElement.style.overflowX;
    document.documentElement.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = prevOverflowX;
    };
  }, []);

  const reviews = useMemo(
    () => [
      { name: "Camille", rating: 5, text: "Super expérience : centre sérieux, briefing clair, et respect des règles." },
      { name: "Nicolas", rating: 4, text: "On se sent en confiance. Équipe pro, et vraie sensibilisation à l’impact." },
      { name: "Leïla", rating: 5, text: "Meilleure sortie observation : distance respectée, guide formé et attentif." },
      { name: "Thomas", rating: 5, text: "Très bon spot, tout est carré. Ça fait du bien de voir des pratiques propres." },
      { name: "Julie", rating: 4, text: "On a choisi via les labels et aucun regret. Équipe respectueuse & pédago." },
    ],
    []
  );

  const Stars = ({ rating = 5 }) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-lg ${i < rating ? "text-yellow-400" : "text-gray-300"}`} aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  );

  const reviewsViewportRef = useRef(null);
  const scrollReviews = (dir) => {
    const el = reviewsViewportRef.current;
    if (!el) return;

    // on scroll d'environ 1 carte
    const card = el.querySelector(".snap-start");
    const step = card ? card.getBoundingClientRect().width + 16 : Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };


  // ✅ important : wheel vertical => scroll horizontal (sinon “bloqué”)
  const trapWheelHorizontal = (e) => {
    const el = reviewsViewportRef.current;
    if (!el) return;

    // si le carrousel n'a pas de scroll possible, on ne bloque pas
    const canScroll = el.scrollWidth > el.clientWidth + 2;
    if (!canScroll) return;

    const absX = Math.abs(e.deltaX);
    const absY = Math.abs(e.deltaY);

    // trackpad: deltaX naturel
    if (absX > 0 && absX >= absY) {
      e.preventDefault();
      el.scrollLeft += e.deltaX;
      return;
    }

    // molette verticale: on mappe vers horizontal
    if (absY > 0) {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }
  };


  return (
    <div className="w-full">
      {/* TITRE (✅ “Plongée” un peu plus grand) */}
      <section className="py-12 px-6 text-center bg-gray-200">
        <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#1113a2]">
          {t("activities.diving.kicker", { defaultValue: "Plongée" })}
        </div>

        <h1 className="mt-3 text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-gray-900">
          {t("activities.diving.title", {
            defaultValue: "Centres certifiés de plongée et d’observation",
          })}
        </h1>

        <p className="mt-4 max-w-3xl mx-auto text-sm md:text-base text-gray-700">
          {t("activities.diving.subtitle", {
            defaultValue: "Nous recensons uniquement les centres et opérateurs ayant obtenu un label international (plongée, observation, zones).",
          })}
        </p>
      </section>

      {/* HERO / RECHERCHE */}
      <section className="w-full relative overflow-hidden">
        <img src={oceanImage} alt="Fond océan" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 w-full py-10 px-4 md:px-8">
          <div className="max-w-6xl mx-auto space-y-4">
            <CardShell className="bg-white/95 backdrop-blur shadow-xl border border-white/40 p-5 md:p-7">
              <div className="flex items-end gap-3 flex-wrap">
                <div className="flex-1 min-w-[260px]">
                  <div className="text-center">
                    <label className="text-base md:text-lg font-semibold text-gray-900">
                      {t("activities.diving.countrySearchLabel", { defaultValue: "Rechercher un pays" })}
                    </label>
                  </div>

                  <input
                    value={countryQuery}
                    onChange={(e) => setCountryQuery(e.target.value)}
                    placeholder={t("activities.diving.countrySearchPh", { defaultValue: "Ex : Philippines, France, Indonésie…" })}
                    className="mt-3 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-700">
                        {t("activities.diving.availableCountries", { defaultValue: "Pays disponibles" })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t("activities.diving.availableCountriesHint", { defaultValue: "Fais défiler horizontalement →" })}
                      </p>
                    </div>

                    <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-2 pr-2">
                      {countryStats
                        .filter((c) => {
                          const q = countryQuery.trim().toLowerCase();
                          if (!q) return true;
                          const label = t(`countries.${c.slug}`, { defaultValue: c.country }).toLowerCase();
                          return label.includes(q);
                        })
                        .map((c) => {
                          const label = t(`countries.${c.slug}`, { defaultValue: c.country });
                          const active = selectedCountrySlug && c.slug === selectedCountrySlug;

                          return (
                            <button
                              key={c.slug}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(c.country);
                                setSelectedContinent("");
                                setCountryQuery(label);

                                const map = mapObj.current;
                                if (map) {
                                  const list = items.filter((x) => x.countrySlug === c.slug && passesFilters(x));
                                  if (list.length) {
                                    const bounds = new maplibregl.LngLatBounds();
                                    list.forEach((p) => bounds.extend([p.lon, p.lat]));
                                    if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 70, maxZoom: 6.2, duration: 700 });
                                  }
                                }
                              }}
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition flex-none
                                ${
                                  active
                                    ? "border-[#1113a2] bg-[#1113a2]/10 text-[#1113a2] font-semibold"
                                    : "border-gray-200 bg-white hover:border-[#1113a2]/60"
                                }`}
                            >
                              <span>{label}</span>
                              <span className="ml-1 inline-flex items-center justify-center min-w-[26px] h-[20px] px-2 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                                {c.count}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>

                <div className="pb-1 flex gap-2">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition"
                  >
                    Tout réinitialiser
                  </button>
                </div>
              </div>

              {/* Informations */}
              <div className="mt-5">
                <div className="flex items-start gap-2">
                  <div className="mt-[2px] w-7 h-7 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-800">
                    i
                  </div>
                  <div className="w-full">
                    <div className="font-bold text-gray-900">Informations</div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <div className="rounded-xl bg-white/80 border border-gray-200 p-3 text-xs text-gray-700">
                        Les pins s’affichent surtout quand tu zoomes (ou si tu sélectionnes un pays).
                      </div>
                      <div className="rounded-xl bg-white/80 border border-gray-200 p-3 text-xs text-gray-700">
                        Les labels aident à repérer des opérateurs plus sérieux, mais ne remplacent pas ton jugement.
                      </div>
                      <div className="rounded-xl bg-white/80 border border-gray-200 p-3 text-xs text-gray-700">
                        Les filtres “Niveaux Green Fins” n’affichent que les centres Green Fins (et ceux “Both”).
                      </div>
                      <div className="rounded-xl bg-white/80 border border-gray-200 p-3 text-xs text-gray-700">
                        Clique sur “Pourquoi aller…” pour comprendre les critères (sécurité + respect des récifs).
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardShell>
          </div>
        </div>
      </section>

      {/* SECTION CARTE */}
      <section className="w-full bg-white py-10 px-2 md:px-3">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] gap-3">
            {/* Filtres */}
            <CardShell className="p-3">
              <div className="flex items-center justify-between px-2 pt-2">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-500">Filtres</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[11px] px-2 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition"
                >
                  Réinit.
                </button>
              </div>

              <div className="mt-3 max-h-[680px] overflow-y-auto pr-1 px-2 pb-3">
                <div>
                  <p className="text-xs font-semibold text-[#1113a2] mb-2">Type</p>
                  <div className="space-y-1.5 text-xs">
                    {[
                      ["all", "Tout"],
                      ["dive", "Plongée"],
                      ["observation", "Observation"],
                      ["zones", "Zones protégées"],
                    ].map(([val, label]) => (
                      <label
                        key={val}
                        className={`flex items-center gap-2 rounded-[1.25rem] px-3 py-2 border transition ${
                          categoryFilter === val ? "border-[#1113a2] bg-[#1113a2]/5 font-semibold" : "border-gray-200 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          className="accent-[#1113a2]"
                          name="categoryFilter"
                          checked={categoryFilter === val}
                          onChange={() => setCategoryFilter(val)}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-[#1113a2] mb-2">Label</p>
                  <div className="space-y-1.5 text-xs">
                    {[
                      ["all", "Tous"],
                      ["greenfins", "Green Fins"],
                      ["blueflag", "Blue Flag"],
                      ["fots", "Friend of the Sea"],
                      ["wca", "WCA"],
                    ].map(([val, label]) => (
                      <label
                        key={val}
                        className={`flex items-center gap-2 rounded-[1.25rem] px-3 py-2 border transition ${
                          labelFilter === val ? "border-[#1113a2] bg-[#1113a2]/5 font-semibold" : "border-gray-200 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          className="accent-[#1113a2]"
                          name="labelFilter"
                          checked={labelFilter === val}
                          onChange={() => setLabelFilter(val)}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-[#1113a2] mb-2">Niveaux Green Fins</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ["gold", "Gold", gfGoldImg, shownCounts.gfByLevel.gold || 0],
                      ["silver", "Silver", gfSilverImg, shownCounts.gfByLevel.silver || 0],
                      ["bronze", "Bronze", gfBronzeImg, shownCounts.gfByLevel.bronze || 0],
                    ].map(([lvl, label, img, count]) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => toggleLevel(lvl)}
                        className={`px-2.5 py-2 rounded-[1.25rem] border text-xs flex items-center gap-2 transition ${
                          gfLevels[lvl] ? "border-[#1113a2] bg-[#1113a2]/10" : "border-gray-200 bg-white"
                        }`}
                      >
                        <img src={img} alt={label} className="h-5 w-5 object-contain" />
                        <span>{label}</span>
                        <span className="ml-1 text-[11px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{count}</span>
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => toggleLevel("inactive")}
                      className={`px-2.5 py-2 rounded-[1.25rem] border text-xs transition ${
                        gfLevels.inactive ? "border-[#1113a2] bg-[#1113a2]/10" : "border-gray-200 bg-white"
                      }`}
                    >
                      Inactive{" "}
                      <span className="ml-1 text-[11px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                        {shownCounts.gfByLevel.inactive || 0}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleLevel("digital")}
                      className={`px-2.5 py-2 rounded-[1.25rem] border text-xs transition ${
                        gfLevels.digital ? "border-[#1113a2] bg-[#1113a2]/10" : "border-gray-200 bg-white"
                      }`}
                    >
                      Digital{" "}
                      <span className="ml-1 text-[11px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                        {shownCounts.gfByLevel.digital || 0}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold text-[#1113a2] mb-2">Animaux (obs.)</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ["all", "Tous"],
                      ["baleine", "Baleines"],
                      ["dauphin", "Dauphins"],
                    ].map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          if (val === "all") return setAnimalFilter("all");
                          setAnimalFilter((prev) => (prev === val ? "all" : val));
                        }}
                        className={`px-3 py-2 rounded-2xl border text-xs font-semibold transition ${
                          animalFilter === val ? "border-[#1113a2] bg-[#1113a2]/5 text-[#1113a2]" : "border-gray-200 bg-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">En savoir +</p>
                  <button
                    onClick={() => scrollToId("why-certified-dive")}
                    className="w-full text-center px-3 py-2 rounded-[1.25rem] bg-gray-100 text-[#1113a2] border border-gray-300 hover:bg-gray-200 transition text-xs font-semibold"
                  >
                    Pourquoi aller dans un centre certifié ?
                  </button>
                </div>
              </div>
            </CardShell>

            {/* Carte */}
            <CardShell className="p-3">
              <div className="relative">
                <div className="absolute top-3 left-3 z-20">
                  <div className="rounded-[1.75rem] border border-gray-200 bg-white/95 backdrop-blur-sm shadow-md px-3 py-2">
                    <p className="text-[10px] font-black text-gray-800 uppercase tracking-[0.35em]">Centres labellisés</p>

                    <div className="mt-2 flex items-center gap-2">
                      <img src={gfLogo} alt="Green Fins" className="h-5 w-auto object-contain" />
                      <span className="text-xs text-gray-700">Green Fins</span>
                      <span className="ml-auto text-xs text-gray-900 font-semibold">{shownCounts.gfTotal}</span>
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      <img src={bfLogo} alt="Blue Flag" className="h-5 w-auto object-contain" />
                      <span className="text-xs text-gray-700">Blue Flag</span>
                      <span className="ml-auto text-xs text-gray-900 font-semibold">{shownCounts.bfTotal}</span>
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      <img src={fotsLogo} alt="Friend of the Sea" className="h-5 w-auto object-contain" />
                      <span className="text-xs text-gray-700">Friend of the Sea</span>
                      <span className="ml-auto text-xs text-gray-900 font-semibold">{shownCounts.fotsTotal}</span>
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      <img src={wcaLogo} alt="WCA" className="h-5 w-auto object-contain" />
                      <span className="text-xs text-gray-700">WCA</span>
                      <span className="ml-auto text-xs text-gray-900 font-semibold">{shownCounts.wcaTotal}</span>
                    </div>

                    {hasError && (
                      <p className="mt-2 text-xs text-orange-600">
                        {t("activities.diving.error", { defaultValue: "Impossible de charger l’Excel pour l’instant." })}
                      </p>
                    )}
                  </div>
                </div>

                <div ref={mapRef} className="w-full h-[640px] rounded-[2rem] overflow-hidden bg-white" />
              </div>
            </CardShell>

            {/* Labels */}
            <CardShell className="p-3">
              <div className="px-2 pt-2">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-500">Labels</p>
                <h3 className="mt-2 text-lg md:text-xl font-black uppercase tracking-tight text-gray-900">Quels sont ces labels ?</h3>
              </div>

              <div className="mt-3 max-h-[680px] overflow-y-auto pr-1 space-y-2 px-2 pb-3">
                {labelCards.map((card) => (
                  <button
                    key={card.key}
                    type="button"
                    onClick={() => setOpenLabel(card.key)}
                    className="w-full text-left bg-gray-50 border border-gray-200 rounded-[2rem] p-3 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <img src={card.logo} alt={card.title} className="h-8 w-auto object-contain" />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{card.title}</p>
                        <div className="mt-1">{card.tag}</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{card.short}</p>
                  </button>
                ))}
              </div>
            </CardShell>
          </div>
        </div>
      </section>

      {/* AVIS + Codes promos (NOUVEAU : carrousel fiable + layout 2/3 - 1/3) */}
      <section className="w-full bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Avis (2/3) */}
            <div className="lg:col-span-2">
              <div className="flex items-end justify-between gap-4 mb-4">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-gray-900">
                  Avis clients
                </h2>
              </div>

              <div className="relative">
                {/* Flèches */}
                <button
                  type="button"
                  onClick={() => scrollReviews(-1)}
                  className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center hover:bg-gray-50"
                  aria-label="Précédent"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => scrollReviews(1)}
                  className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center hover:bg-gray-50"
                  aria-label="Suivant"
                >
                  ›
                </button>

                {/* ✅ LE VRAI SCROLLER */}
                <div
                  ref={reviewsViewportRef}
                  className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pr-2"
                  style={{
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "thin",
                  }}
                >
                  {reviews.map((r, idx) => (
                    <div
                      key={`${r.name}-${idx}`}
                      className="snap-start flex-none w-[85%] sm:w-[420px] md:w-[520px]"
                    >
                      <div className="bg-white border border-gray-200 shadow-sm rounded-[2rem] p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full border border-gray-300 overflow-hidden shrink-0 bg-white">
                            <img
                              src={userImg}
                              alt="Utilisateur"
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>

                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{r.name}</p>
                            <Stars rating={r.rating} />
                          </div>
                        </div>

                        <p className="mt-4 text-sm text-gray-700 leading-relaxed">
                          “{r.text}”
                        </p>

                        <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1113a2]">
                          Vérifié
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1113a2]" />
                          Expérience labellisée
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Codes promos (1/3) */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-[2rem] shadow-sm p-6">
                <div className="rounded-[1.75rem] border border-[#1113a2]/30 bg-[#1113a2] text-white p-5">
                  <p className="text-sm font-bold">Codes promos bientôt disponibles</p>
                  <p className="text-xs opacity-95 mt-1 leading-relaxed">
                    Des réductions pour réserver des <b>activités labellisées</b> (Green Fins, WCA, Friend of the Sea…).
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-xs font-semibold">
                    Coming soon
                  </div>
                </div>

                <div className="mt-5 text-sm text-gray-700">
                  <p className="font-semibold text-gray-900 mb-2">Comment ça marchera</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Codes visibles sur les fiches partenaires</li>
                    <li>Conditions affichées (dates, activités)</li>
                    <li>Réduction appliquée sur le site de l’opérateur</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Pourquoi aller dans un centre certifié ? */}
      <section id="why-certified-dive" className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
          <CardShell className="p-6 md:p-10">
            <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#1113a2]">Bonnes pratiques</div>
            <h2 className="mt-2 text-xl md:text-2xl font-black uppercase tracking-tight text-gray-900">
              Pourquoi aller dans un centre certifié ?
            </h2>

            <p className="text-gray-800 leading-relaxed mt-4 mb-7">
              La plongée est une activité magnifique, mais elle demande une bonne préparation, un encadrement sérieux et le respect des
              règles de sécurité. Un centre certifié suit des pratiques claires, vérifiables et cohérentes dans le temps.
            </p>

            <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-gray-900 mb-2">Pour ta sécurité</h3>

            <p className="text-gray-800 leading-relaxed mb-4">
              Un centre certifié met en place des standards : briefings, matériel entretenu, procédures, gestion des imprévus, et un
              encadrement adapté au niveau des plongeurs.
            </p>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[safetyImg1, safetyImg2, safetyImg3, safetyImg4].map((img, index) => (
                  <div
                    key={`safety-img-${index}`}
                    className="aspect-square rounded-[2rem] border border-gray-200 bg-white shadow-sm flex items-center justify-center p-3"
                  >
                    <img src={img} alt={`Sécurité plongée ${index + 1}`} className="max-h-full max-w-full object-contain" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            <p className="text-gray-800 leading-relaxed mb-9">
              Un mauvais encadrement augmente vite les risques : mauvaise gestion de la profondeur, de l’air, du stress ou des imprévus.
              La certification aide à repérer les structures les plus sérieuses.
            </p>

            <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-gray-900 mb-2">Pour la faune et les récifs</h3>

            <p className="text-gray-800 leading-relaxed mb-4">
              Une plongée mal encadrée peut abîmer les coraux, stresser les animaux ou encourager des comportements inadaptés. Les centres
              certifiés appliquent des règles pour limiter ces impacts.
            </p>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[faunaImg1, faunaImg2, faunaImg3, faunaImg4].map((img, index) => (
                  <div
                    key={`fauna-img-${index}`}
                    className="aspect-square rounded-[2rem] border border-gray-200 bg-white shadow-sm flex items-center justify-center p-3"
                  >
                    <img src={img} alt={`Protection de la faune ${index + 1}`} className="max-h-full max-w-full object-contain" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-gray-900 font-semibold text-lg">Un centre certifié protège le plongeur… et l’océan.</p>
          </CardShell>
        </div>
      </section>

      {/* ✅ Signalement : fond FULL WIDTH + 2 cartes “posées dessus” */}
      <section className="w-full relative">
        {/* fond pleine largeur */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-500 via-slate-500 to-slate-500" />
        <div className="absolute inset-0 opacity-25">
          <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 w-[520px] h-[520px] rounded-full bg-[#1113a2]/25 blur-3xl" />
        </div>

        {/* contenu */}
        <div className="relative max-w-7xl mx-auto px-4 md:px-10 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            <CardShell className="p-6 md:p-8 bg-white/95 border border-white/30">
              <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-gray-900 mb-1">
                Signaler un comportement non éthique
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Aide-nous à identifier les mauvaises pratiques (poursuite, nourrissage, non-respect des distances…).
              </p>

              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Nom du centre ou opérateur</label>
                    <input
                      value={reportForm.operator}
                      onChange={(e) => setReportForm((p) => ({ ...p, operator: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1113a2]/30"
                      placeholder="Ex : Ocean Dive Center"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Pays</label>
                    <input
                      value={reportForm.country}
                      onChange={(e) => setReportForm((p) => ({ ...p, country: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1113a2]/30"
                      placeholder="Ex : Philippines"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Espèce concernée</label>
                    <input
                      value={reportForm.animal}
                      onChange={(e) => setReportForm((p) => ({ ...p, animal: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1113a2]/30"
                      placeholder="Ex : dauphin, requin-baleine…"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Nature de l’abus</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                    {[
                      ["feeding", "Nourrissage (feeding)"],
                      ["touch", "Toucher l’animal"],
                      ["chase", "Harcèlement / poursuite"],
                      ["overcrowded", "Trop de touristes / bateaux"],
                      ["distance", "Non-respect des distances"],
                    ].map(([k, label]) => (
                      <label
                        key={k}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer select-none transition ${
                          reportForm.abuses[k] ? "border-[#1113a2] bg-[#1113a2]/5" : "border-gray-200 bg-white"
                        }`}
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
                  <label className="text-xs font-semibold text-gray-700">Détails / lien photo / vidéo (preuve)</label>
                  <input
                    value={reportForm.details}
                    onChange={(e) => setReportForm((p) => ({ ...p, details: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1113a2]/30"
                    placeholder="Décris ce qui s’est passé + lien si tu as"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#1113a2] text-white text-sm font-semibold shadow hover:opacity-95 transition"
                  >
                    Envoyer signalement
                  </button>

                  <p className="text-xs text-gray-500">Les signalements peuvent être anonymes et seront traités avec soin.</p>
                </div>
              </form>
            </CardShell>

            <CardShell className="p-6 md:p-8 bg-white/95 border border-white/30">
              <h4 className="text-sm font-black uppercase tracking-tight text-gray-900 mb-3">Pourquoi signaler ?</h4>
              <ol className="text-sm text-gray-700 space-y-2 list-decimal pl-5">
                <li>
                  <b>Protéger</b> la faune et limiter le stress / les blessures.
                </li>
                <li>
                  <b>Informer</b> les futurs voyageurs et améliorer les pratiques.
                </li>
                <li>
                  <b>Promouvoir</b> les opérateurs respectueux et durables.
                </li>
              </ol>

              <div className="mt-6 rounded-2xl bg-slate-900 text-white p-4">
                <p className="text-sm font-semibold">Sécurité & confidentialité</p>
                <p className="text-xs opacity-90 mt-1">
                  Nous ne publions jamais tes données personnelles. Les infos servent uniquement à l’analyse et au tri.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-xs font-semibold">
                  🔒 Données protégées
                </div>
              </div>
            </CardShell>
          </div>
        </div>
      </section>

      {/* MODALE : détails label */}
      {currentLabel && (
        <div className="fixed inset-0 z-[9999]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenLabel(null)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-start justify-between gap-4 p-5 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <img src={currentLabel.logo} alt={currentLabel.title} className="h-10 w-auto object-contain" />
                  <div>
                    <p className="text-lg font-bold text-gray-900">{currentLabel.title}</p>
                    <div className="mt-1">{currentLabel.tag}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenLabel(null)}
                  className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition flex items-center justify-center text-gray-700"
                  aria-label="Fermer"
                  title="Fermer"
                >
                  ✕
                </button>
              </div>

              <div className="p-5">{currentLabel.long}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
