// src/pages/Zones_protegees.jsx
import { usePageSeo } from "../seo/usePageSeo";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTranslation } from "react-i18next";

import EXCEL_URL from "../data/BDD_zones_protegees.xlsx?url";
import oceanImage from "../assets/images/bannière_blog2.jpg";

const KEY = "gsmNeDjg2V0pS8etxXtI";
const STYLE = `https://api.maptiler.com/maps/streets/style.json?key=${KEY}`;

const DEFAULT_VIEW = { center: [0, 18], zoom: 1.6 };
const CLUSTER_MAX_ZOOM = 3; // ✅ comme tu veux

function CardShell({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-[3rem] border border-gray-200 bg-white shadow-sm overflow-hidden",
        className,
      ].join(" ")}
    >
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
  label: ["label", "Label", "LABEL"],
  continent: ["continent", "Continent", "zone", "Zone"],
  country: ["pays", "Pays", "country", "Country"],
  code: ["code_pays", "code", "Code", "ISO", "iso"],
  name: ["nom", "Nom", "name", "Name", "zone_name", "Zone_name"],
  website: ["site", "Site", "lien", "Lien", "url", "URL", "website", "Website"],
  lat: ["lat", "Lat", "LAT", "latitude", "Latitude", "y", "Y"],
  lon: [
    "lon",
    "Lon",
    "LON",
    "long",
    "Long",
    "LONG",
    "lng",
    "Lng",
    "LNG",
    "longitude",
    "Longitude",
    "x",
    "X",
  ],
};

function detectSchema(rows) {
  if (!rows.length) return null;
  const rawKeys = Object.keys(rows[0] || {});
  const keyMap = new Map(rawKeys.map((k) => [k.trim(), k]));
  const pick = (cands) => {
    const trimmed = new Set(rawKeys.map((k) => k.trim()));
    const found = cands.find((c) => trimmed.has(c));
    return found ? keyMap.get(found) : null;
  };
  return {
    kLabel: pick(COLS.label),
    kContinent: pick(COLS.continent),
    kCountry: pick(COLS.country),
    kCode: pick(COLS.code),
    kName: pick(COLS.name),
    kWeb: pick(COLS.website),
    kLat: pick(COLS.lat),
    kLon: pick(COLS.lon),
  };
}

function fitMapToGeoJSON(map, fc) {
  if (!map || !fc?.features?.length) return;
  if (fc.features.length === 1) {
    map.easeTo({ center: fc.features[0].geometry.coordinates, zoom: 7.5, duration: 700 });
    return;
  }
  const b = new maplibregl.LngLatBounds();
  fc.features.forEach((f) => b.extend(f.geometry.coordinates));
  map.fitBounds(b, { padding: 80, duration: 800, maxZoom: 6.5 });
}

export default function ZonesProtegees() {
  const { t } = useTranslation();

  usePageSeo({
    title: "Exploration globale | Où voyages-tu ? | GuardianMap",
    description:
      "Carte mondiale pour explorer centres de plongée, zones maritimes protégées, centres d’observation et spots d’espèces marines. Recherche par pays et filtres éthiques.",
    canonical: "https://guardianmap.com/exploration",
    ogImage: "https://guardianmap.com/og/og-exploration.jpg",
  });


  const mapRef = useRef(null);
  const mapObj = useRef(null);

  // on garde la dernière donnée geojson même si la source n’existe pas encore
  const pendingGeoJSONRef = useRef(null);

  const [rows, setRows] = useState([]);
  const [hasError, setHasError] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryQuery, setCountryQuery] = useState("");

  /* ===== Load Excel ===== */
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

  const schema = useMemo(() => detectSchema(rows), [rows]);

  /** normalize points */
  const points = useMemo(() => {
    if (!rows.length || !schema?.kLat || !schema?.kLon) return [];
    const { kLabel, kContinent, kCountry, kCode, kName, kWeb, kLat, kLon } = schema;

    const out = [];
    for (const r of rows) {
      let lat = toNum(r[kLat]);
      let lon = toNum(r[kLon]);

      // inversion lat/lon parfois
      if (lat != null && lon != null && Math.abs(lat) > 90 && Math.abs(lon) <= 90) {
        [lat, lon] = [lon, lat];
      }

      if (lat == null || lon == null) continue;
      if (Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;

      const labelRaw = kLabel ? String(r[kLabel] || "").trim() : "";
      const label = labelRaw || "";

      const country = kCountry ? String(r[kCountry] || "").trim() : "";
      const code = kCode ? String(r[kCode] || "").trim() : "";
      const continent = kContinent ? String(r[kContinent] || "").trim() : "";
      const name = kName ? String(r[kName] || "").trim() : "";
      const website = kWeb ? fixUrl(r[kWeb]) : "";

      out.push({
        label,
        country,
        countrySlug: toSlug(country),
        code,
        continent,
        name,
        website,
        lat,
        lon,
      });
    }
    return out;
  }, [rows, schema]);

  /** stats pays */
  const countryStats = useMemo(() => {
    const acc = new Map();
    points.forEach((p) => {
      if (!p.countrySlug || !p.country) return;
      if (!acc.has(p.countrySlug)) acc.set(p.countrySlug, { slug: p.countrySlug, country: p.country, count: 0 });
      acc.get(p.countrySlug).count += 1;
    });
    const arr = Array.from(acc.values());
    arr.sort((a, b) => (a.country || "").localeCompare(b.country || "", "fr"));
    return arr;
  }, [points]);

  /** filtered points (country) */
  const filteredPoints = useMemo(() => {
    if (!selectedCountry) return points;
    const target = toSlug(selectedCountry);
    return points.filter((p) => p.countrySlug === target);
  }, [points, selectedCountry]);

  /** GeoJSON */
  const geojson = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: filteredPoints.map((p) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [p.lon, p.lat] },
        properties: {
          name: p.name || "Zone",
          country: p.country || "",
          code: p.code || "",
          continent: p.continent || "",
          label: p.label || "",
          website: p.website || "",
        },
      })),
    };
  }, [filteredPoints]);

  /** helper: push data to source when available */
  const pushGeoJSONToMap = (map, data) => {
    if (!map) return;
    pendingGeoJSONRef.current = data;

    const src = map.getSource("zones");
    if (src && src.setData) {
      src.setData(data);
    }
  };

  /* ===== Map init ===== */
  useEffect(() => {
    if (mapObj.current || !mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: STYLE,
      center: DEFAULT_VIEW.center,
      zoom: DEFAULT_VIEW.zoom,
      attributionControl: true,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      map.resize();
      map.jumpTo(DEFAULT_VIEW);

      // source (cluster)
      if (!map.getSource("zones")) {
        map.addSource("zones", {
          type: "geojson",
          data: pendingGeoJSONRef.current || { type: "FeatureCollection", features: [] },
          cluster: true,
          clusterMaxZoom: CLUSTER_MAX_ZOOM,
          clusterRadius: 56,
        });

        // clusters (bulles)
        map.addLayer({
          id: "zones-clusters",
          type: "circle",
          source: "zones",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#1113a2",
            "circle-opacity": 0.88,
            "circle-radius": ["step", ["get", "point_count"], 18, 25, 24, 60, 30, 150, 36, 400, 42],
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 2,
          },
        });

        // count on clusters
        map.addLayer({
          id: "zones-cluster-count",
          type: "symbol",
          source: "zones",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
          paint: { "text-color": "#ffffff" },
        });

        // unclustered pins
        map.addLayer({
          id: "zones-unclustered",
          type: "circle",
          source: "zones",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#1d4ed8",
            "circle-radius": 6,
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 2,
            "circle-opacity": 0.98,
          },
        });

        // ✅ sécurité : s’assure que nos layers sont tout en haut
        // (si un style ré-injecte des layers, ça évite de se retrouver dessous)
        const ensureTop = () => {
          const top = map.getStyle()?.layers?.[map.getStyle().layers.length - 1]?.id;
          // pas de moveLayer vers "top" direct : on les remonte en dernier en les move successifs
          ["zones-clusters", "zones-cluster-count", "zones-unclustered"].forEach((id) => {
            if (map.getLayer(id)) map.moveLayer(id, top);
          });
        };
        ensureTop();

        // click cluster => zoom
        map.on("click", "zones-clusters", (e) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ["zones-clusters"] });
          const clusterId = features?.[0]?.properties?.cluster_id;
          const source = map.getSource("zones");
          if (!source || clusterId == null) return;

          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: Math.min(zoom, 8.5),
              duration: 650,
            });
          });
        });

        // click point => popup
        map.on("click", "zones-unclustered", (e) => {
          const f = e.features?.[0];
          if (!f) return;

          const props = f.properties || {};
          const name = (props.name || "Zone").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          const country = (props.country || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          const label = (props.label || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          const code = props.code ? ` (${props.code})` : "";
          const continent = props.continent ? ` • ${props.continent}` : "";

          const website = props.website || "";
          const websiteHtml = website
            ? `<a href="${website}" target="_blank" rel="noopener noreferrer" style="color:#1113a2;text-decoration:underline;word-break:break-word;">${website}</a>`
            : "<span style='color:#6b7280;'>Lien indisponible</span>";

          const popupHtml = `
            <div style="font-size:12px; max-width:270px;">
              <div style="font-weight:900; color:#1113a2; margin-bottom:3px;">${name}</div>
              <div style="margin-bottom:6px;">${country}${code}${continent}</div>
              ${label ? `<div style="color:#111827; margin-bottom:8px;">Label : <strong>${label}</strong></div>` : ""}
              <div style="margin-bottom:6px;color:#111827;">Lien :</div>
              <div>${websiteHtml}</div>
            </div>
          `;

          new maplibregl.Popup({ offset: 10 })
            .setLngLat(f.geometry.coordinates)
            .setHTML(popupHtml)
            .addTo(map);
        });

        map.on("mouseenter", "zones-clusters", () => (map.getCanvas().style.cursor = "pointer"));
        map.on("mouseleave", "zones-clusters", () => (map.getCanvas().style.cursor = ""));
        map.on("mouseenter", "zones-unclustered", () => (map.getCanvas().style.cursor = "pointer"));
        map.on("mouseleave", "zones-unclustered", () => (map.getCanvas().style.cursor = ""));

        // ✅ on pousse la donnée dès que la source existe
        if (pendingGeoJSONRef.current) pushGeoJSONToMap(map, pendingGeoJSONRef.current);
      }
    });

    const ro = new ResizeObserver(() => map.resize());
    ro.observe(mapRef.current);

    mapObj.current = map;

    return () => {
      ro.disconnect();
      map.remove();
      mapObj.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ===== Update source when geojson changes ===== */
  useEffect(() => {
    const map = mapObj.current;
    if (!map) return;

    pushGeoJSONToMap(map, geojson);

    // auto-fit quand filtre pays
    if (selectedCountry && geojson.features.length && map.getSource("zones")) {
      const id = window.setTimeout(() => fitMapToGeoJSON(map, geojson), 120);
      return () => window.clearTimeout(id);
    }
  }, [geojson, selectedCountry]);

  const clearAll = () => {
    setSelectedCountry("");
    setCountryQuery("");
    const map = mapObj.current;
    if (map) map.easeTo({ ...DEFAULT_VIEW, duration: 650 });
  };

  const totalLoaded = points.length;
  const totalDisplayed = filteredPoints.length;

  return (
    <div className="w-full">
      {/* TITRE */}
      <section className="py-12 px-6 text-center bg-gray-200">
        <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#1113a2]">
          Lieux
        </div>
        <h1 className="mt-3 text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-gray-900">
          Zones marines protégées
        </h1>
        <p className="mt-3 text-sm md:text-base text-gray-700 max-w-3xl mx-auto">
          Repérez les zones maritimes engagées dans la protection des écosystèmes côtiers et marins grâce aux labels environnementaux.
        </p>
      </section>

      {/* HERO / RECHERCHE */}
      <section className="w-full relative overflow-hidden">
        <img src={oceanImage} alt="Fond océan" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 w-full py-10 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <CardShell className="bg-white/95 backdrop-blur shadow-xl border border-white/40 p-5 md:p-7">
              <div className="flex items-end gap-3 flex-wrap">
                <div className="flex-1 min-w-[260px]">
                  <div className="text-center">
                    <label className="text-base md:text-lg font-semibold text-gray-900">
                      Rechercher un pays
                    </label>
                  </div>

                  <input
                    value={countryQuery}
                    onChange={(e) => setCountryQuery(e.target.value)}
                    placeholder="Ex : France, Denmark, Indonesia…"
                    className="mt-3 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                  <div className="mt-4 flex gap-2 overflow-x-auto whitespace-nowrap pb-2 pr-2">
                    {countryStats
                      .filter((c) => {
                        const q = countryQuery.trim().toLowerCase();
                        if (!q) return true;
                        return (c.country || "").toLowerCase().includes(q);
                      })
                      .map((c) => {
                        const active = selectedCountry && toSlug(selectedCountry) === c.slug;
                        return (
                          <button
                            key={c.slug}
                            type="button"
                            onClick={() => setSelectedCountry(c.country)}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition flex-none
                              ${
                                active
                                  ? "border-[#1113a2] bg-[#1113a2]/10 text-[#1113a2] font-semibold"
                                  : "border-gray-200 bg-white hover:border-[#1113a2]/60"
                              }`}
                          >
                            <span>{c.country}</span>
                            <span className="ml-1 inline-flex items-center justify-center min-w-[26px] h-[20px] px-2 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                              {c.count}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>

                <div className="pb-1 flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition"
                  >
                    Tout réinitialiser
                  </button>
                </div>
              </div>

              {hasError ? (
                <div className="mt-4 text-xs text-orange-600 font-semibold">
                  ⚠️ Impossible de charger l’Excel.
                </div>
              ) : null}
            </CardShell>
          </div>
        </div>
      </section>

      {/* CARTE centrée + marges */}
      <section className="w-full bg-white py-10 px-4 md:px-8">
        <div className="max-w-[1100px] mx-auto">
          <CardShell className="p-3">
            <div ref={mapRef} className="w-full h-[560px] rounded-[2rem] overflow-hidden bg-white" />
          </CardShell>

          {/* petit debug visible : te dit si le problème est data vs rendu */}
          <div className="mt-3 text-xs text-gray-500">
            Données : <b>{totalLoaded}</b> points chargés • <b>{totalDisplayed}</b> points affichés (filtre pays)
          </div>

      {/* TEXTE sous la carte : explication Blue Flag */}
      <div className="max-w-[1100px] mx-auto mt-6 px-2">
        <CardShell className="p-6 md:p-8">
          <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[#1113a2]">
            À propos du label
          </div>

          <h2 className="mt-2 text-xl md:text-2xl font-extrabold text-gray-900">
            Blue Flag (Pavillon Bleu) : qu’est-ce que ça signifie ?
          </h2>

          <p className="mt-4 text-sm md:text-base text-gray-700 leading-relaxed">
            Le <b>Blue Flag (Pavillon Bleu)</b> est un label international de référence, attribué chaque année à des
            plages, marinas et ports de plaisance qui respectent des exigences strictes en matière de développement durable.
          </p>

          <p className="mt-3 text-sm md:text-base text-gray-700 leading-relaxed">
            Créé et coordonné par la <b>Foundation for Environmental Education</b>, ce label vise à encourager une gestion
            responsable des zones côtières et à garantir aux usagers des sites respectueux de l’environnement et des personnes.
          </p>

          <p className="mt-4 text-sm md:text-base text-gray-700 font-semibold">
            Les sites labellisés sont évalués selon plusieurs grands critères, notamment :
          </p>

          <ul className="mt-3 space-y-2 text-sm md:text-base text-gray-700 leading-relaxed list-disc pl-5">
            <li>
              <b>Gestion environnementale</b> : traitement des déchets, protection des écosystèmes marins et côtiers,
              limitation des pollutions
            </li>
            <li>
              <b>Qualité de l’eau et du site</b> : suivi régulier, propreté des infrastructures, respect des normes
              environnementales
            </li>
            <li>
              <b>Information et sensibilisation du public</b> : panneaux pédagogiques, actions de sensibilisation à
              l’environnement
            </li>
            <li>
              <b>Sécurité et bonnes pratiques</b> : équipements de sécurité, accès maîtrisé, règles claires pour les usagers
              et les plaisanciers
            </li>
          </ul>

          <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm md:text-base text-orange-900">
            <b>⚠️</b> Le label est réattribué chaque année : un site peut le perdre s’il ne respecte plus les critères exigés.
          </div>

          <p className="mt-4 text-sm md:text-base text-gray-700 leading-relaxed">
            Sur cette carte, vous retrouvez les zones associées au label <b>Blue Flag</b>, principalement des
            marinas et ports labellisés, afin d’identifier plus facilement des lieux engagés dans une démarche de tourisme et
            de navigation plus responsables.
          </p>
        </CardShell>
      </div>

      {/* POURQUOI PRIVILÉGIER LES ZONES PROTÉGÉES — style "CardShell" de Voyages.jsx + couleurs */}
      <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-gray-100 py-14 mt-6">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          {/* Intro */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[#1113a2]">
              Tourisme responsable
            </div>
            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold text-gray-900">
              Pourquoi privilégier les zones protégées quand c’est possible ?
            </h2>
            <p className="mt-4 text-sm md:text-base text-gray-700 leading-relaxed">
              Privilégier ces zones, c’est soutenir des pratiques respectueuses et encourager un{" "}
              <b>tourisme plus responsable</b>.
            </p>
          </div>

          {/* Bulles */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1 — COLONNE GAUCHE (BLEU) */}
            <div
              className={[
                "group relative overflow-hidden rounded-[2.5rem] bg-white p-7",
                "shadow-sm hover:shadow-xl transition-all duration-300",
                "ring-0 hover:ring-4 hover:ring-[#1113a2]/10",
                "hover:shadow-[0_18px_55px_rgba(17,19,162,0.22)]",
                "hover:-translate-y-0.5",
              ].join(" ")}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">Préserver la biodiversité</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Les zones protégées contribuent à la <b>sauvegarde</b> des écosystèmes fragiles : récifs coralliens,
                herbiers marins et espèces menacées.
              </p>
            </div>

            {/* 2 — COLONNE MILIEU (BLANC/NEUTRE) */}
            <div
              className={[
                "group relative overflow-hidden rounded-[2.5rem] bg-white p-7",
                "shadow-sm hover:shadow-xl transition-all duration-300",
                "ring-0 hover:ring-4 hover:ring-black/5",
                "hover:shadow-[0_18px_55px_rgba(0,0,0,0.16)]",
                "hover:-translate-y-0.5",
              ].join(" ")}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">Offrir des refuges à la vie marine</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Elles servent de zones de repos, de reproduction et d’alimentation : de vrais <b>refuges</b> pour
                de nombreuses espèces.
              </p>
            </div>

            {/* 3 — COLONNE DROITE (ROUGE) */}
            <div
              className={[
                "group relative overflow-hidden rounded-[2.5rem] bg-white p-7",
                "shadow-sm hover:shadow-xl transition-all duration-300",
                "ring-0 hover:ring-4 hover:ring-red-500/10",
                "hover:shadow-[0_18px_55px_rgba(239,68,68,0.22)]",
                "hover:-translate-y-0.5",
              ].join(" ")}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">Réduire l’impact humain</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Ces zones encadrent les usages pour limiter la <b>pollution</b>, la surfréquentation et les
                dégradations liées au tourisme et à la navigation.
              </p>
            </div>

            {/* 4 — COLONNE GAUCHE (BLEU) */}
            <div
              className={[
                "group relative overflow-hidden rounded-[2.5rem] bg-white p-7",
                "shadow-sm hover:shadow-xl transition-all duration-300",
                "ring-0 hover:ring-4 hover:ring-[#1113a2]/10",
                "hover:shadow-[0_18px_55px_rgba(17,19,162,0.22)]",
                "hover:-translate-y-0.5",
              ].join(" ")}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">Mieux gérer les espaces maritimes</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Les zones protégées reposent sur une gestion <b>structurée</b>, avec des règles claires, un suivi
                et des contrôles réguliers.
              </p>
            </div>

            {/* 5 — COLONNE MILIEU (BLANC/NEUTRE) */}
            <div
              className={[
                "group relative overflow-hidden rounded-[2.5rem] bg-white p-7",
                "shadow-sm hover:shadow-xl transition-all duration-300",
                "ring-0 hover:ring-4 hover:ring-black/5",
                "hover:shadow-[0_18px_55px_rgba(0,0,0,0.16)]",
                "hover:-translate-y-0.5",
              ].join(" ")}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">Protéger aujourd’hui pour demain</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                En laissant le temps aux écosystèmes de se régénérer, ces zones renforcent la <b>résilience</b> des
                océans face au changement climatique.
              </p>
            </div>

            {/* 6 — COLONNE DROITE (ROUGE) */}
            <div
              className={[
                "group relative overflow-hidden rounded-[2.5rem] bg-white p-7",
                "shadow-sm hover:shadow-xl transition-all duration-300",
                "ring-0 hover:ring-4 hover:ring-red-500/10",
                "hover:shadow-[0_18px_55px_rgba(239,68,68,0.22)]",
                "hover:-translate-y-0.5",
              ].join(" ")}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">Soutenir les acteurs engagés</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Choisir ces zones, c’est valoriser les acteurs locaux qui s’engagent <b>concrètement</b> pour la
                protection de l’océan.
              </p>
            </div>
          </div>
        </div>
      </section>





        </div>
      </section>
    </div>
  );
}
