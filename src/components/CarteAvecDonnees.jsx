// components/CarteAvecDonnees.jsx
import React, { useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import dataPhilippines from "../data/Philippines_BDD_GF.json";
import dataIndonesie   from "../data/Indonesie_BDD_GF.json";
import dataJapon       from "../data/Japon_BDD_GF.json";
import dataMalaisie    from "../data/Malaisie_BDD_GF.json";
import dataThailande   from "../data/Thailande_BDD_GF.json";

const MAPTILER_KEY   = "gsmNeDjg2V0pS8etxXtI";
const STYLE_PRIMARY  = `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`;
const STYLE_FALLBACK = `https://api.maptiler.com/maps/basic/style.json?key=${MAPTILER_KEY}`; // ✅
const STYLE_ULTIMATE = "https://demotiles.maplibre.org/style.json";

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

function levelStyle(levelRaw) {
  const l = String(levelRaw || "").toLowerCase();
  if (l.includes("gold"))    return { bg:"#D4AF37", color:"#fff",    label:"Gold" };
  if (l.includes("silver"))  return { bg:"#C0C0C0", color:"#1f2937", label:"Silver" };
  if (l.includes("bronze"))  return { bg:"#CD7F32", color:"#fff",    label:"Bronze" };
  if (l.includes("inactive"))return { bg:"#e5e7eb", color:"#374151", label:"Inactive" };
  return { bg:"#374151", color:"#fff", label: levelRaw || "N/A" };
}

const hasValidWebsite = (w) =>
  !!w && typeof w === "string" &&
  !/^pas\s*de\s*lien$/i.test(w.trim()) &&
  w !== "#" && !w.toLowerCase().startsWith("mailto:");

const normalizeWebsite = (w) => (/^https?:\/\//i.test(w) ? w : `https://${w}`);

export default function CarteAvecDonnees({ country, regionFilter }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const destroyedRef = useRef(false);

  const refreshMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const raw = getDataByCountry(country);

    // Conserver UNIQUEMENT des coords finies
    const valid = raw.filter((d) => {
      const lat = Number(d.latitude);
      const lon = Number(d.longitude);
      return Number.isFinite(lat) && Number.isFinite(lon);
    });

    // Nettoyage
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filtered = regionFilter
      ? valid.filter(
          (d) =>
            d.region &&
            String(d.region).toLowerCase() === String(regionFilter).toLowerCase()
        )
      : valid;

    filtered.forEach((d) => {
      const { bg, color, label } = levelStyle(d.certification_level);
      const email = d.email
        ? `<a href="mailto:${d.email}" style="text-decoration:underline;color:#1f2937;">${d.email}</a>`
        : `<span style="color:#9ca3af;">Contact non renseigné</span>`;

      const bottom = hasValidWebsite(d.website)
        ? `<div style="margin:0 18px 16px;display:flex;gap:10px;">
             <a class="gm-btn" href="${normalizeWebsite(d.website)}" target="_blank" rel="noopener noreferrer">Accéder au site</a>
           </div>`
        : `<div style="margin:0 18px 16px;font-size:13px;color:#6b7280;">Pas de site</div>`;

      const popupHTML = `
        <div style="font-family:ui-sans-serif,system-ui,Inter,Roboto; color:#1f2937; max-width:340px; background:#fff; border-radius:16px; box-shadow:0 14px 32px rgba(17,19,162,.18); overflow:hidden; font-size:13.5px;">
          <div style="background:#1113a2;color:#fff;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;">
            <div style="font-weight:800;font-size:15px;line-height:1.2;">${d.name || "Centre de plongée"}</div>
            <span style="display:inline-block;padding:4px 10px;border-radius:9999px;background:${bg};color:${color};font-size:12px;font-weight:800;">${label}</span>
          </div>
          <div style="padding:12px 18px;line-height:1.55;">
            <div><strong style="color:#1113a2;">Région :</strong> ${d.region || "—"}</div>
            <div style="margin-top:6px;"><strong style="color:#1113a2;">Contact :</strong> ${email}</div>
          </div>
          ${bottom}
        </div>`;

      const popup = new maplibregl.Popup({ offset: 28, closeButton: true, className: "gm-popup" }).setHTML(popupHTML);

      const el = document.createElement("div");
      el.innerHTML = `
        <svg viewBox="0 0 24 24" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="pinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1113a2"/><stop offset="100%" stop-color="#3f51b5"/>
          </linearGradient></defs>
          <path fill="url(#pinGrad)" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle fill="#fff" cx="12" cy="9" r="2.6"/>
        </svg>`;
      el.style.transform = "translate(-50%, -100%)";
      el.style.cursor = "pointer";

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([Number(d.longitude), Number(d.latitude)])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Vue
    const settings = countrySettings[(country || "").toLowerCase()];
    // bornes uniquement avec coords finies (utile si certaines lignes sont foireuses)
    const finitePairs = filtered
      .map((d) => [Number(d.longitude), Number(d.latitude)])
      .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));

    try {
      if (finitePairs.length > 0) {
        const b = new maplibregl.LngLatBounds();
        finitePairs.forEach((p) => b.extend(p));
        map.fitBounds(b, { padding: 60, maxZoom: 9, duration: 800, essential: true });
      } else if (settings) {
        // Aucun point valide → recentrage pays garanti
        map.jumpTo({ center: settings.center, zoom: settings.zoom });
      }
    } catch {
      if (settings) map.jumpTo({ center: settings.center, zoom: settings.zoom });
    }
  }, [country, regionFilter]);

  // Init carte + fallbacks + relances
  useEffect(() => {
    const node = containerRef.current;
    const c = (country || "").toLowerCase();
    const settings = countrySettings[c];
    if (!node || !settings) return;

    destroyedRef.current = false;

    const map = new maplibregl.Map({
      container: node,
      style: STYLE_PRIMARY,
      center: settings.center,
      zoom: settings.zoom,
    });
    mapRef.current = map;

    const onResize = () => map.resize();
    window.addEventListener("resize", onResize);

    const tried = { basic: false, ultimate: false };
    const switchToFallback = () => {
      if (destroyedRef.current) return;
      if (!tried.basic)   { tried.basic   = true; map.setStyle(STYLE_FALLBACK); return; }
      if (!tried.ultimate){ tried.ultimate= true; map.setStyle(STYLE_ULTIMATE); return; }
    };

    // Watchdog si le style ne vient pas
    const watchdog = setTimeout(() => {
      if (!map.isStyleLoaded()) switchToFallback();
    }, 3000);

    const onError = () => switchToFallback();

    const rerender = () => {
      // Quand un style arrive, on resize et on remet les marqueurs
      setTimeout(() => map.resize(), 50);
      refreshMarkers();
    };

    map.on("error", onError);
    map.on("load",  rerender);
    map.on("styledata", rerender);
    map.on("idle", rerender);

    return () => {
      destroyedRef.current = true;
      clearTimeout(watchdog);
      window.removeEventListener("resize", onResize);
      try {
        map.off("error", onError);
        map.off("load",  rerender);
        map.off("styledata", rerender);
        map.off("idle", rerender);
      } catch {}
      try {
        markersRef.current.forEach((m) => m.remove());
        map.remove();
      } catch {}
      markersRef.current = [];
      mapRef.current = null;
    };
  }, [country, refreshMarkers]);

  useEffect(() => { refreshMarkers(); }, [regionFilter, refreshMarkers]);

  return (
    <div
      ref={containerRef}
      className="shadow-xl"
      style={{
        height: "600px",
        width: "100%",
        borderRadius: "1rem",
        overflow: "hidden",
        background: "#eef1f6",
      }}
    />
  );
}
