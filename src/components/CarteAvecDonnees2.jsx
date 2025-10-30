import React, { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import EXCEL_URL from "../data/BDD_centres_plongees.xlsx?url";

const KEY = "gsmNeDjg2V0pS8etxXtI";
const STYLE = `https://api.maptiler.com/maps/streets/style.json?key=${KEY}`;

/* === Utils === */
const toNum = (v) => {
  if (v === null || v === undefined) return null;
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
};
const toSlug = (s = "") =>
  s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const LAT_CANDS = ["lat", "Lat", "LAT", "latitude", "Latitude", "lat.", "Lat.", "y"];
const LON_CANDS = ["long", "Long", "LONG", "lng", "Lon", "longitude", "Longitude", "long.", "x"];

const normLabel = (s = "") => {
  const t = s.toLowerCase();
  if (t.includes("both")) return "both";
  if (t.includes("blue")) return "blueflag";
  if (t.includes("green")) return "greenfins";
  return "none";
};
const normGF = (s = "") => {
  const t = s.toLowerCase();
  if (t.includes("gold")) return "gold";
  if (t.includes("silver")) return "silver";
  if (t.includes("bronze")) return "bronze";
  if (t.includes("inactive")) return "inactive";
  if (t.includes("digital")) return "digital";
  return "none";
};
const fixUrl = (u = "") => {
  if (!u) return "";
  const t = u.trim();
  if (/^https?:\/\//i.test(t)) return t;
  if (/^www\./i.test(t)) return "https://" + t;
  return `https://${t}`;
};

/* === Aliases pays (extrait, garde ta liste complète si besoin) === */
const COUNTRY_ALIASES = {
  "republique-dominicaine": ["dominican-republic"],
  "philippines": ["philippines"],
  "thailande": ["thailand"],
  "malaisie": ["malaysia"],
  "indonesie": ["indonesia"],
  "vietnam": ["vietnam"],
  "mexique": ["mexico"],
  "bahamas": ["bahamas"],
  "belize": ["belize"],
  "espagne": ["spain"],
  "france": ["france"],
  "italie": ["italy"],
  "australie": ["australia"],
};

/* === Centroïdes === */
const CENTROIDS = {
  "dominican-republic": [-70.1627, 18.7357],
  "philippines": [121.774, 12.8797],
  "thailand": [100.9925, 15.87],
  "malaysia": [109.0919, 3.139],
  "indonesia": [113.9213, -0.7893],
  "vietnam": [108.2772, 14.0583],
  "mexico": [-102.5528, 23.6345],
  "spain": [-3.7038, 40.4168],
  "france": [2.2137, 46.2276],
  "italy": [12.5674, 41.8719],
  "australia": [133.7751, -25.2744],
};

/* === Component === */
export default function CarteAvecDonnees2({
  countrySlug,
  countryNames = [],
  labelFilter = "all",
  gfLevels = { gold: true, silver: true, bronze: true, inactive: true, digital: true },
  mapId = "map-pays",
  heightClass = "h-[520px]",
  onCountsChange,
}) {
  const mapRef = useRef(null);
  const mapObj = useRef(null);
  const [rows, setRows] = useState([]);
  const lastCountsRef = useRef(null);

  /* 1) Charger Excel */
  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetch(EXCEL_URL);
      const buf = await res.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
      if (mounted) setRows(json);
    })();
    return () => (mounted = false);
  }, []);

  /* 2) Détecter colonnes */
  const keys = useMemo(() => {
    const r = rows[0] || {};
    const pick = (arr) => arr.find((k) => k in r);
    return {
      kLabel: pick(["label", "Label"]),
      kCountry: pick(["pays", "Pays", "country", "Country"]),
      kName: pick(["nom", "Nom", "name", "Name"]),
      kGF: pick(["certification_level", "greenfins_level", "gf_level"]),
      kSite: pick(["site", "website", "url", "URL", "site_du_centre"]),
      kLat: pick(LAT_CANDS),
      kLon: pick(LON_CANDS),
    };
  }, [rows]);

  /* 3) Slugs pays admis */
  const acceptedSlugs = useMemo(() => {
    const base = toSlug(countrySlug);
    return new Set([base, ...(COUNTRY_ALIASES[base] || []).map(toSlug), ...countryNames.map(toSlug)]);
  }, [countrySlug, countryNames]);

  /* 4) Tous les points du pays (pour compter) */
  const allCountryItems = useMemo(() => {
    if (!rows.length || !keys.kCountry) return [];
    return rows
      .filter((r) => acceptedSlugs.has(toSlug(r[keys.kCountry] || "")))
      .map((r) => ({
        label: normLabel(r[keys.kLabel] || ""),
        gf: normGF(r[keys.kGF] || ""),
        lat: toNum(r[keys.kLat]),
        lon: toNum(r[keys.kLon]),
      }));
  }, [rows, keys, acceptedSlugs]);

  /* 5) Points filtrés */
  const points = useMemo(() => {
    if (!rows.length) return [];
    const out = [];
    rows.forEach((r) => {
      if (!acceptedSlugs.has(toSlug(r[keys.kCountry] || ""))) return;

      const lat = toNum(r[keys.kLat]);
      const lon = toNum(r[keys.kLon]);
      if (lat == null || lon == null) return;

      const label = normLabel(r[keys.kLabel] || "");
      const gf = normGF(r[keys.kGF] || "");

      if (labelFilter === "greenfins" && !(label === "greenfins" || label === "both")) return;
      if (labelFilter === "blueflag" && !(label === "blueflag" || label === "both")) return;

      if (label === "greenfins" || label === "both") {
        const pass =
          (gf === "gold" && gfLevels.gold) ||
          (gf === "silver" && gfLevels.silver) ||
          (gf === "bronze" && gfLevels.bronze) ||
          (gf === "inactive" && gfLevels.inactive) ||
          (gf === "digital" && gfLevels.digital) ||
          (gf === "none" && Object.values(gfLevels).some(Boolean));
        if (!pass) return;
      }

      out.push({
        name: r[keys.kName] || "(Sans nom)",
        label,
        gf,
        site: r[keys.kSite] || "",
        lat,
        lon,
      });
    });
    return out;
  }, [rows, keys, acceptedSlugs, labelFilter, gfLevels]);

  /* ✅ 6) Envoyer compteurs sans boucle infinie */
  useEffect(() => {
    if (!onCountsChange) return;

    const isGF = (x) => x.label === "greenfins" || x.label === "both";
    const isBF = (x) => x.label === "blueflag" || x.label === "both";

    const gfTotal = allCountryItems.filter(isGF).length;
    const bfTotal = allCountryItems.filter(isBF).length;

    const gfByLevel = { gold: 0, silver: 0, bronze: 0, inactive: 0, digital: 0 };
    const gfShownByLevel = { gold: 0, silver: 0, bronze: 0, inactive: 0, digital: 0 };

    allCountryItems.forEach((p) => { if (isGF(p) && p.gf in gfByLevel) gfByLevel[p.gf]++; });
    points.forEach((p) => { if (isGF(p) && p.gf in gfShownByLevel) gfShownByLevel[p.gf]++; });

    const counts = { gfTotal, bfTotal, gfByLevel, gfShownByLevel };
    const key = JSON.stringify(counts);

    if (lastCountsRef.current !== key) {
      lastCountsRef.current = key;
      onCountsChange(counts);
    }
  }, [allCountryItems, points]);

  /* 7) Init carte */
  useEffect(() => {
    if (mapObj.current) return;
    const map = new maplibregl.Map({
      container: mapRef.current,
      style: STYLE,
      center: [0, 12],
      zoom: 2.8,
    });

    // 1) contrôle nav
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // 2) resize dès que le style est prêt
    map.on("load", () => map.resize());

    // 3) observer le conteneur pour redimensionner si sa taille change
    const ro = new ResizeObserver(() => map.resize());
    if (mapRef.current) ro.observe(mapRef.current);

    mapObj.current = map;

    return () => {
      ro.disconnect();
      map.remove();
      mapObj.current = null;
    };
  }, []);


  /* 8) Ajouter markers & fit bounds */
  useEffect(() => {
    const map = mapObj.current;
    if (!map) return;

    if (map._markers) map._markers.forEach((m) => m.remove());
    map._markers = [];

    if (!points.length) {
      const base = toSlug(countrySlug);
      const centroid = CENTROIDS[base];
      if (centroid) map.easeTo({ center: centroid, zoom: 5, duration: 600 });
      return;
    }

    const bounds = new maplibregl.LngLatBounds();

    points.forEach((p) => {
      const color =
        p.label === "both" ? "#7c3aed" :
        p.label === "greenfins" ? "#10b981" :
        p.label === "blueflag" ? "#2563eb" : "#444";

      // créer un pin svg coloré
      const el = document.createElement("div");
      el.innerHTML = `
        <svg width="26" height="36" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 7.5 10 20 10 20s10-12.5 10-20C22 6.48 17.52 2 12 2z" 
            fill="${color}" stroke="#ffffff" stroke-width="2"/>
          <circle cx="12" cy="12" r="4.5" fill="#ffffff"/>
        </svg>
      `;

      el.style.cursor = "pointer";
      el.style.transform = "translate(-50%, -100%)"; // pointe vers la coord gps


      const site = fixUrl(p.site);
      const html = `
        <div style="min-width:200px">
          <strong style="color:#1113a2">${p.name}</strong><br/>
          Label: ${p.label} ${p.gf !== "none" ? `• GF: ${p.gf}` : ""}
          ${site ? `<br/><a href="${site}" target="_blank" style="color:#fff;background:#1113a2;padding:5px 9px;border-radius:6px;display:inline-block;margin-top:6px;">Site web</a>` : ""}
        </div>`;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([p.lon, p.lat])
        .setPopup(new maplibregl.Popup({ offset: 10 }).setHTML(html))
        .addTo(map);

      bounds.extend([p.lon, p.lat]);
      map._markers.push(marker);
    });

    map.fitBounds(bounds, { padding: 60, maxZoom: 7, duration: 700 });
  }, [points, countrySlug]);

  return (
    <div
      id={mapId}
      ref={mapRef}
      className={`w-full ${heightClass} rounded-xl overflow-hidden shadow`}
    />
  );
}
