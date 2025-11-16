// src/pages/continents/ContinentPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import EXCEL_URL from "../../data/BDD_centres_plongees.xlsx?url";
import { useTranslation } from "react-i18next";

const KEY = "gsmNeDjg2V0pS8etxXtI";
const STYLE = `https://api.maptiler.com/maps/streets/style.json?key=${KEY}`;

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

const LAT_CANDS = ["lat", "Lat", "latitude", "Latitude", "y", "Y"];
const LON_CANDS = ["long", "Long", "lng", "Lon", "longitude", "Longitude", "x", "X"];

/* Continents : alias => canonique */
const CONTINENT_ALIAS = {
  africa: "africa",
  afrique: "africa",
  "north-america": "north-america",
  "amerique-du-nord": "north-america",
  "amérique-du-nord": "north-america",
  "south-america": "south-america",
  "amerique-du-sud": "south-america",
  "amérique-du-sud": "south-america",
  asia: "asia",
  asie: "asia",
  europe: "europe",
  oceania: "oceania",
  oceanie: "oceania",
  "océanie": "oceania",
};

const CONTINENT_TITLE_FR = {
  africa: "Afrique",
  "north-america": "Amérique du Nord",
  "south-america": "Amérique du Sud",
  asia: "Asie",
  europe: "Europe",
  oceania: "Océanie",
};

/* Pays : corrections FR/slug (fallback = libellé source) */
const COUNTRY_FR = {
  curacao: ["Curaçao", "curacao"],
  curaçao: ["Curaçao", "curacao"],
  reunion: ["La Réunion", "reunion"],
  "united-states": ["États-Unis", "etats-unis"],
  "united-kingdom": ["Royaume-Uni", "royaume-uni"],
  "cote-divoire": ["Côte d’Ivoire", "cote-divoire"],
  "cabo-verde": ["Cap-Vert", "cap-vert"],
  "dominican-republic": ["République dominicaine", "republique-dominicaine"],
  "turks-and-caicos-islands": ["Îles Turques-et-Caïques", "iles-turques-et-caiques"],
  "saint-lucia": ["Sainte-Lucie", "sainte-lucie"],
  "south-korea": ["Corée du Sud", "coree-du-sud"],
  "united-arab-emirates": ["Émirats arabes unis", "emirats-arabes-unis"],
  "saudi-arabia": ["Arabie saoudite", "arabie-saoudite"],
  "cayman-islands": ["Îles Caïmans", "iles-caimans"],
  "new-zealand": ["Nouvelle-Zélande", "nouvelle-zelande"],
  "french-polynesia": ["Polynésie française", "polynesie-francaise"],
  martinique: ["Martinique", "martinique"],
};

/* Centroïdes fallback (lon,lat) — utile si un pays n’a aucune coordonnée) */
const CENTROIDS = {
  egypt: [30.8, 26.8],
  morocco: [-7.1, 31.8],
  "south-africa": [22.9, -30.6],
  tanzania: [34.9, -6.37],
  mozambique: [35.5, -18.66],
  mauritius: [57.55, -20.35],
  "cabo-verde": [-23.6, 15.1],
  seychelles: [55.49, -4.68],

  france: [2.2, 46.2],
  spain: [-3.7, 40.4],
  italy: [12.6, 41.9],
  portugal: [-8.2, 39.4],
  greece: [23.7, 38],
  switzerland: [8.2, 46.8],
  sweden: [18.6, 60.1],
  norway: [8.47, 60.47],
  netherlands: [5.3, 52.1],
  belgium: [4.5, 50.6],
  croatia: [16.4, 45.1],
  slovenia: [14.5, 46.1],
  montenegro: [19.3, 42.7],
  romania: [25, 45.9],
  poland: [19.1, 52.2],
  bulgaria: [25.5, 42.7],
  "united-kingdom": [-1.5, 52.3],
  ireland: [-8.2, 53.4],
  iceland: [-19, 64.9],
  cyprus: [33.4, 35.1],
  malta: [14.4, 35.9],
  reunion: [55.53, -21.12],

  "united-states": [-98.6, 39.8],
  canada: [-106.3, 56.1],
  mexico: [-102.5, 23.6],
  "dominican-republic": [-70.16, 18.73],
  bahamas: [-76, 24.25],
  belize: [-88.5, 17.2],
  aruba: [-69.97, 12.52],
  curacao: [-68.99, 12.17],
  bonaire: [-68.26, 12.2],
  barbados: [-59.56, 13.19],
  panama: [-80.78, 8.54],
  honduras: [-86.24, 15.2],
  "saint-lucia": [-60.98, 13.91],
  grenada: [-61.68, 12.12],
  "turks-and-caicos-islands": [-71.8, 21.69],
  martinique: [-61, 14.6],
  "u-s-virgin-islands": [-64.8, 18.35],
  "french-polynesia": [-149.4, -17.6],

  indonesia: [113.9, -0.79],
  malaysia: [109.1, 3.14],
  philippines: [121.77, 12.88],
  thailand: [101, 15.87],
  vietnam: [108.3, 14.06],
  japan: [138.25, 36.2],
  taiwan: [120.96, 23.7],
  "south-korea": [127.77, 35.91],
  india: [78.96, 20.59],
  jordan: [36.24, 30.59],
  "saudi-arabia": [45.08, 23.89],
  "united-arab-emirates": [54.38, 24.45],
  israel: [34.85, 31.05],
  maldives: [73.5, 3.2],
  "timor-leste": [125.73, -8.87],

  australia: [133.78, -25.27],
  "new-zealand": [174.89, -40.9],
  "cook-islands": [-159.78, -21.24],
  fiji: [178.07, -17.71],
  palau: [134.58, 7.52],
  vanuatu: [166.96, -15.38],
};

export default function ContinentPage() {
  const navigate = useNavigate();
  const { slug } = useParams(); // ex: "amerique-du-nord" / "afrique"
  const { t } = useTranslation();

  const canon = CONTINENT_ALIAS[toSlug(slug)] || "africa";
  const titleFR = CONTINENT_TITLE_FR[canon];

  const mapRef = useRef(null);
  const mapObj = useRef(null);

  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch(EXCEL_URL);
      const buf = await res.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      setRows(XLSX.utils.sheet_to_json(ws, { defval: "" }));
    })();
  }, []);

  const countries = useMemo(() => {
    if (!rows.length) return [];
    const sample = rows[0] || {};
    const keys = Object.keys(sample);
    const kCont = ["continent", "Continent", "CONTINENT", "continent_en", "Continent_en"].find(
      (k) => keys.includes(k)
    );
    const kPays = ["pays", "Pays", "country", "Country"].find((k) => keys.includes(k));
    const kLat = LAT_CANDS.find((k) => keys.includes(k));
    const kLon = LON_CANDS.find((k) => keys.includes(k));
    if (!kCont || !kPays) return [];

    const sameCont = rows.filter((r) => {
      const cont = CONTINENT_ALIAS[toSlug(String(r[kCont] || ""))];
      return cont === canon;
    });

    const acc = new Map();
    sameCont.forEach((r) => {
      const raw = String(r[kPays] || "").trim();
      if (!raw || raw === "0") return;
      const ps = toSlug(raw);
      if (!acc.has(ps)) acc.set(ps, { raw, count: 0, lats: [], lons: [] });
      const o = acc.get(ps);
      o.count += 1;
      const lat = kLat ? toNum(r[kLat]) : null;
      const lon = kLon ? toNum(r[kLon]) : null;
      if (lat !== null && lon !== null) {
        o.lats.push(lat);
        o.lons.push(lon);
      }
    });

    return Array.from(acc.entries())
      .map(([pSlug, o]) => {
        const frEntry = COUNTRY_FR[pSlug];
        const label = frEntry ? frEntry[0] : o.raw;
        const slugFr = frEntry ? frEntry[1] : toSlug(label);

        let lat = null,
          lon = null;
        if (o.lats.length) {
          lat = o.lats.reduce((a, b) => a + b, 0) / o.lats.length;
          lon = o.lons.reduce((a, b) => a + b, 0) / o.lons.length;
        } else if (CENTROIDS[pSlug]) {
          const [lo, la] = CENTROIDS[pSlug];
          lat = la;
          lon = lo;
        }
        return { label, slug: slugFr, count: o.count, lat, lon };
      })
      .sort((a, b) => a.label.localeCompare(b.label, "fr"));
  }, [rows, canon]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? countries.filter((c) => c.label.toLowerCase().includes(q)) : countries;
  }, [countries, query]);

  // Map init
  useEffect(() => {
    if (mapObj.current || !mapRef.current) return;
    const map = new maplibregl.Map({
      container: mapRef.current,
      style: STYLE,
      center: [0, 20],
      zoom: 2.5,
      attributionControl: true,
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.on("load", () => {
      map.resize();
      if (canon === "oceania") map.setRenderWorldCopies(false);
    });
    mapObj.current = map;
    return () => {
      map.remove();
      mapObj.current = null;
    };
  }, [slug, canon]);

  // markers
  useEffect(() => {
    const map = mapObj.current;
    if (!map) return;
    if (map._gm_markers) map._gm_markers.forEach((m) => m.remove());
    map._gm_markers = [];

    const placeables = filtered.filter((c) => c.lat !== null && c.lon !== null);
    if (!placeables.length) return;

    const bounds = new maplibregl.LngLatBounds();
    const centersLabel = t("continentPage.centersShort");

    placeables.forEach((c) => {
      const el = document.createElement("div");
      el.style.background = "#1113a2";
      el.style.color = "#fff";
      el.style.width = "40px";
      el.style.height = "40px";
      el.style.borderRadius = "9999px";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.fontWeight = "700";
      el.style.boxShadow = "0 6px 14px rgba(0,0,0,.25)";
      el.style.cursor = "pointer";
      el.textContent = String(c.count);
      el.onclick = () => navigate(`/pays2/${c.slug}`);

      new maplibregl.Marker({ element: el })
        .setLngLat([c.lon, c.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 10 }).setHTML(
            `<div style="font-weight:700;color:#1113a2">${c.label}</div>
             <div>${c.count} ${centersLabel}</div>`
          )
        )
        .addTo(map);

      bounds.extend([c.lon, c.lat]);
    });

    const fit = () => {
      if (canon === "oceania") {
        map.easeTo({
          center: [165, -20],
          zoom: 2.5,
          duration: 700,
        });
        return;
      }
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 60, maxZoom: 5, duration: 700 });
      }
    };
    map.loaded() ? fit() : map.once("idle", fit);
  }, [filtered, navigate, canon, t]);

  return (
    <div className="w-full">
      <section className="py-12 text-center bg-gray-100">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1113a2]">
          {t(`continents.${canon}`, { defaultValue: titleFR })}
        </h1>
      </section>

      <section className="w-full py-10 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl bg-white border border-gray-200 shadow overflow-hidden">
            <div ref={mapRef} className="w-full h-[480px]" />
          </div>

          <div className="mt-6 max-w-xl">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("continentPage.searchPlaceholder")}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {filtered.map((c) => (
              <button
                key={c.slug}
                onClick={() => navigate(`/pays2/${c.slug}`)}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:border-[#1113a2] hover:bg-[#1113a2]/5 text-sm text-gray-800 transition"
                title={`${c.label} • ${c.count} ${t("continentPage.centersShort")}`}
              >
                <span className="font-medium">
                  {t(`countries.${c.slug}`, { defaultValue: c.label })}
                </span>
                <span className="inline-flex items-center justify-center text-xs font-semibold rounded-full bg-gray-100 text-gray-700 px-2 py-0.5 group-hover:bg-[#1113a2]/10 group-hover:text-[#1113a2]">
                  {c.count}
                </span>
              </button>
            ))}
            {!filtered.length && (
              <div className="text-sm text-gray-500">{t("continentPage.noCountry")}</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
