// components/CarteAvecDonnees.jsx
import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import dataPhilippines from "../data/Philippines_BDD_GF.json";
import dataIndonesie   from "../data/Indonesie_BDD_GF.json";
import dataJapon       from "../data/Japon_BDD_GF.json";
import dataMalaisie    from "../data/Malaisie_BDD_GF.json";
import dataThailande   from "../data/Thailande_BDD_GF.json";

const MAPTILER_KEY  = "gsmNeDjg2V0pS8etxXtI";
const STYLE_PRIMARY = `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`;

const countrySettings = {
  philippines: { center: [121.774, 12.8797], zoom: 5   },
  indonesie:   { center: [113.9213, -0.7893], zoom: 4.5 },
  japon:       { center: [138.2529, 36.2048], zoom: 4.5 },
  malaisie:    { center: [101.9758, 4.2105],  zoom: 5.2 },
  thailande:   { center: [100.9925, 15.87],   zoom: 5.2 },
  maldives:    { center: [73.5, 1.9],         zoom: 5.3 },
};

function getDataByCountry(country) {
  switch ((country || "").toLowerCase()) {
    case "philippines": return dataPhilippines;
    case "indonesie":   return dataIndonesie;
    case "japon":       return dataJapon;
    case "malaisie":    return dataMalaisie;
    case "thailande":   return dataThailande;
    case "maldives":    return [];
    default:            return [];
  }
}

// --- Helpers popup ---
function levelStyle(levelRaw) {
  const l = String(levelRaw || "").toLowerCase();
  if (l.includes("gold"))     return { bg:"#D4AF37", color:"#fff",    label:"Gold" };
  if (l.includes("silver"))   return { bg:"#C0C0C0", color:"#1f2937", label:"Silver" };
  if (l.includes("bronze"))   return { bg:"#CD7F32", color:"#fff",    label:"Bronze" };
  if (l.includes("inactive")) return { bg:"#e5e7eb", color:"#374151", label:"Inactive" };
  return { bg:"#374151", color:"#fff", label: levelRaw || "N/A" };
}
const hasValidWebsite = (w) =>
  !!w &&
  typeof w === "string" &&
  !/^pas\s*de\s*lien$/i.test(w.trim()) &&
  w !== "#" &&
  !w.toLowerCase().startsWith("mailto:");
const normalizeWebsite = (w) => (/^https?:\/\//i.test(w) ? w : `https://${w}`);

// --- Component ---
export default function CarteAvecDonnees({ country, regionFilter, mapId }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const node = containerRef.current;
    const settings = countrySettings[(country || "").toLowerCase()];
    if (!node || !settings) return;

    const map = new maplibregl.Map({
      container: node,
      style: STYLE_PRIMARY,
      center: settings.center,
      zoom: settings.zoom,
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      const rows = getDataByCountry(country).filter(
        (d) => Number.isFinite(Number(d.latitude)) && Number.isFinite(Number(d.longitude))
      );

      const filtered = regionFilter
        ? rows.filter(
            (d) =>
              d.region &&
              String(d.region).toLowerCase() === String(regionFilter).toLowerCase()
          )
        : rows;

      filtered.forEach((d) => {
        // PIN SVG dégradé
        const el = document.createElement("div");
        el.innerHTML = `
          <svg viewBox="0 0 24 24" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pinGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#1113a2"/>
                <stop offset="100%" stop-color="#3f51b5"/>
              </linearGradient>
            </defs>
            <path fill="url(#pinGrad)" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle fill="#fff" cx="12" cy="9" r="2.6"/>
          </svg>
        `;
        el.style.transform = "translate(-50%, -100%)";
        el.style.cursor = "pointer";

        // Badge GreenFins + bouton site (ou "Pas de lien")
        const { bg, color, label } = levelStyle(d.certification_level);
        const sitePart = hasValidWebsite(d.website)
          ? `<a href="${normalizeWebsite(d.website)}" target="_blank" rel="noopener noreferrer"
               style="display:inline-block;margin-top:10px;padding:8px 12px;border-radius:10px;
                      background:#1113a2;color:#fff;text-decoration:none;font-weight:600;">
               Accéder au site
             </a>`
          : `<div style="margin-top:10px;color:#6b7280;">Pas de lien</div>`;

        const popupHTML = `
          <div style="font-family:system-ui,Inter,Roboto; font-size:13px; max-width:280px; line-height:1.5;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <div style="font-weight:800; color:#1113a2;">
                ${d.name || "Centre de plongée"}
              </div>
              <span style="display:inline-block;padding:4px 8px;border-radius:9999px;
                           background:${bg};color:${color};font-size:12px;font-weight:800;">
                ${label}
              </span>
            </div>
            <div><strong>Région :</strong> ${d.region || "—"}</div>
            ${sitePart}
          </div>
        `;

        new maplibregl.Marker({ element: el })
          .setLngLat([Number(d.longitude), Number(d.latitude)])
          .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(popupHTML))
          .addTo(map);
      });

      if (filtered.length > 0) {
        const bounds = new maplibregl.LngLatBounds();
        filtered.forEach((d) => bounds.extend([Number(d.longitude), Number(d.latitude)]));
        map.fitBounds(bounds, { padding: 40 });
      }
    });

    return () => {
      try { map.remove(); } catch {}
      mapRef.current = null;
    };
  }, [country, regionFilter]);

  return (
    <div
      id={mapId || undefined}
      ref={containerRef}
      style={{
        height: "600px",
        width: "100%",
        borderRadius: "1rem",
        overflow: "hidden",
      }}
    />
  );
}
