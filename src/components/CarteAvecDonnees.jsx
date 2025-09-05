// components/CarteAvecDonnees.jsx
import React, { useEffect, useRef, useCallback, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import dataPhilippines from "../data/Philippines_BDD_GF.json";
import dataIndonesie   from "../data/Indonesie_BDD_GF.json";
import dataJapon       from "../data/Japon_BDD_GF.json";
import dataMalaisie    from "../data/Malaisie_BDD_GF.json";
import dataThailande   from "../data/Thailande_BDD_GF.json";

/* ---------------- Styles HTTPS avec fallbacks + cache-bust ---------------- */
const MAPTILER_KEY = "gsmNeDjg2V0pS8etxXtI";
const STYLES = [
  `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`,
  `https://api.maptiler.com/maps/basic/style.json?key=${MAPTILER_KEY}`,
  "https://demotiles.maplibre.org/style.json",
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
];

/* ---------------- centrage initial par pays ---------------- */
const countrySettings = {
  philippines: { center: [121.774, 12.8797], zoom: 5 },
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

/* ---------------- helpers popup ---------------- */
function levelStyle(levelRaw) {
  const l = String(levelRaw || "").toLowerCase();
  if (l.includes("gold"))     return { bg:"#D4AF37", color:"#fff",    label:"Gold" };
  if (l.includes("silver"))   return { bg:"#C0C0C0", color:"#1f2937", label:"Silver" };
  if (l.includes("bronze"))   return { bg:"#CD7F32", color:"#fff",    label:"Bronze" };
  if (l.includes("inactive")) return { bg:"#e5e7eb", color:"#374151", label:"Inactive" };
  return { bg:"#374151", color:"#fff", label: levelRaw || "N/A" };
}
const hasValidWebsite = (w) =>
  !!w && typeof w === "string" &&
  !/^pas\s*de\s*lien$/i.test(w.trim()) &&
  w !== "#" && !w.toLowerCase().startsWith("mailto:");
const normalizeWebsite = (w) => (/^https?:\/\//i.test(w) ? w : `https://${w}`);

/* ---------------- tracking via go.php (base configurable) ---------------- */
const TRACKING_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_TRACKING_BASE) ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "https://go.guardianmap.com"
    : "");
const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
const toTrackingUrl = ({ centerId, country, region, destUrl }) => {
  const qs = new URLSearchParams({
    c: centerId || "",
    country: country || "",
    region: region || "",
    u: destUrl || "",
  });
  return `${TRACKING_BASE}/go.php?${qs.toString()}`;
};

/* ---------------- composant carte ---------------- */
export default function CarteAvecDonnees({ country, regionFilter, mapId }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const mountedRef = useRef(true);
  const destroyedRef = useRef(false);
  const retryTimerRef = useRef(null);

  const [mapReady, setMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /* -------- utils -------- */
  const bust = useCallback((url, seed = Date.now()) => {
    try {
      const u = new URL(url);
      u.searchParams.set("_t", String(seed));
      return u.toString();
    } catch { return url; }
  }, []);

  const cleanup = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    markersRef.current.forEach((m) => { try { m.remove(); } catch {} });
    markersRef.current = [];
    if (mapRef.current) {
      try { mapRef.current.remove(); } catch {}
      mapRef.current = null;
    }
  }, []);

  /* -------- ajout/maj des marqueurs (sans recréer la carte) -------- */
  const renderMarkers = useCallback((rows) => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    // reset
    markersRef.current.forEach((m) => { try { m.remove(); } catch {} });
    markersRef.current = [];

    if (!rows.length) return;

    rows.forEach((d, idx) => {
      const lng = Number(d.longitude);
      const lat = Number(d.latitude);
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;

      const gradId = `pinGrad-${(d.id || d.name || idx).toString().replace(/\W+/g,"")}`;

      const el = document.createElement("div");
      el.innerHTML = `
        <svg viewBox="0 0 24 24" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1113a2"/>
              <stop offset="100%" stop-color="#3f51b5"/>
            </linearGradient>
          </defs>
          <path fill="url(#${gradId})" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle fill="#fff" cx="12" cy="9" r="2.6"/>
        </svg>`;
      el.style.transform = "translate(-50%, -100%)";
      el.style.cursor = "pointer";

      const { bg, color, label } = levelStyle(d.certification_level);

      const centerId = slugify(d.id || d.slug || d.name);
      const destUrl  = normalizeWebsite(d.website);
      const goHref   = hasValidWebsite(d.website)
        ? toTrackingUrl({ centerId, country, region: d.region, destUrl })
        : null;

      const sitePart = goHref
        ? `<a href="${goHref}" target="_blank" rel="noopener noreferrer"
             style="display:inline-block;margin-top:10px;padding:8px 12px;border-radius:10px;
                    background:#1113a2;color:#fff;text-decoration:none;font-weight:600;">
             Accéder au site
           </a>`
        : `<div style="margin-top:10px;color:#6b7280;">Pas de lien</div>`;

      const popupHTML = `
        <div style="font-family:system-ui,Inter,Roboto; font-size:13px; max-width:280px; line-height:1.5;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <div style="font-weight:800; color:#1113a2;">${d.name || "Centre de plongée"}</div>
            <span style="display:inline-block;padding:4px 8px;border-radius:9999px;
                         background:${bg};color:${color};font-size:12px;font-weight:800;">
              ${label}
            </span>
          </div>
          <div><strong>Région :</strong> ${d.region || "—"}</div>
          ${sitePart}
        </div>`;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(popupHTML))
        .addTo(map);

      markersRef.current.push(marker);
    });

    // recentrage doux
    setTimeout(() => {
      if (!mapRef.current || !mountedRef.current) return;
      const b = new maplibregl.LngLatBounds();
      rows.forEach((d) => {
        const lng = Number(d.longitude), lat = Number(d.latitude);
        if (Number.isFinite(lng) && Number.isFinite(lat)) b.extend([lng, lat]);
      });
      if (!b.isEmpty()) {
        mapRef.current.fitBounds(b, { padding: 60, maxZoom: 9, duration: 400, essential: true });
      }
    }, 60);
  }, [country, mapReady]);

  /* -------- init carte robuste (watchdog + fallbacks) -------- */
  const initMap = useCallback((retryCount = 0, styleIndex = 0) => {
    const node = containerRef.current;
    const settings = countrySettings[(country || "").toLowerCase()];
    if (!node || !settings || !mountedRef.current) return;

    setIsLoading(true);
    setError(null);
    setMapReady(false);
    destroyedRef.current = false;

    // nettoie l'ancienne instance
    cleanup();

    const map = new maplibregl.Map({
      container: node,
      style: bust(STYLES[styleIndex], Date.now()),
      center: settings.center,
      zoom: settings.zoom,
      antialias: true,
      transformRequest: (url) => (/^https?:\/\//i.test(url) ? { url: bust(url, Date.now()) } : {}),
      failIfMajorPerformanceCaveat: false,
      preserveDrawingBuffer: true,
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // watchdog: si le style ne vient pas, bascule
    let tries = 0;
    const MAX_TRIES = 6;
    const TRY_DELAY = 2200;

    const tick = () => {
      if (destroyedRef.current || !mapRef.current) return;
      if (!map.isStyleLoaded()) {
        tries += 1;
        if (tries <= MAX_TRIES) {
          const next = (styleIndex + tries) % STYLES.length;
          try { map.setStyle(bust(STYLES[next], Date.now())); } catch {}
        } else {
          // recrée la map (rare)
          cleanup();
          if (retryCount < 2) initMap(retryCount + 1, (styleIndex + 1) % STYLES.length);
          else {
            setError("Impossible de charger la carte. Réessaie.");
            setIsLoading(false);
          }
          return;
        }
      }
      retryTimerRef.current = setTimeout(tick, TRY_DELAY);
    };
    retryTimerRef.current = setTimeout(tick, TRY_DELAY);

    const rerender = () => {
      if (!mountedRef.current) return;
      setTimeout(() => { try { map.resize(); } catch {} }, 50);

      const all = getDataByCountry(country).filter(
        (d) => Number.isFinite(Number(d.latitude)) && Number.isFinite(Number(d.longitude))
      );
      const rows = regionFilter
        ? all.filter(
            (d) =>
              d.region &&
              String(d.region).toLowerCase() === String(regionFilter).toLowerCase()
          )
        : all;
      renderMarkers(rows);
    };

    map.on("load", () => {
      setMapReady(true);
      setIsLoading(false);
      rerender();
    });
    map.on("styledata", rerender);
    map.on("idle", rerender);
    map.on("error", () => {
      // switch de style au moindre souci
      const next = (styleIndex + 1) % STYLES.length;
      try { map.setStyle(bust(STYLES[next], Date.now())); } catch {}
    });

    // WebGL lost → tenter de sauver
    map.getCanvas().addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      try { map.resize(); } catch {}
    });
  }, [country, regionFilter, renderMarkers, cleanup, bust]);

  /* -------- init quand visible -------- */
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !mapRef.current) {
          setTimeout(() => mountedRef.current && initMap(), 150);
        }
      },
      { threshold: 0.1 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [initMap]);

  /* -------- réinit si le pays change -------- */
  useEffect(() => {
    initMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  /* -------- mise à jour des marqueurs au changement de filtre -------- */
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const all = getDataByCountry(country).filter(
      (d) => Number.isFinite(Number(d.latitude)) && Number.isFinite(Number(d.longitude))
    );
    const rows = regionFilter
      ? all.filter(
          (d) =>
            d.region &&
            String(d.region).toLowerCase() === String(regionFilter).toLowerCase()
        )
      : all;
    renderMarkers(rows);
  }, [regionFilter, country, renderMarkers, mapReady]);

  /* -------- cleanup -------- */
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      destroyedRef.current = true;
      cleanup();
    };
  }, [cleanup]);

  /* -------- resize -------- */
  useEffect(() => {
    const onResize = () => { try { mapRef.current?.resize(); } catch {} };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      id={mapId || undefined}
      ref={containerRef}
      style={{
        height: "600px",
        width: "100%",
        borderRadius: "1rem",
        overflow: "hidden",
        background: "#eef1f6",
        position: "relative",
      }}
    >
      {isLoading && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5,
          background: "rgba(255,255,255,.85)"
        }}>
          <div style={{ textAlign: "center", color: "#1113a2", fontWeight: 600 }}>
            <div style={{
              width: 42, height: 42, margin: "0 auto 10px",
              border: "4px solid #e5e7eb", borderTop: "4px solid #1113a2",
              borderRadius: "50%", animation: "gdm-spin 1s linear infinite"
            }} />
            Chargement de la carte…
          </div>
        </div>
      )}

      {error && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 6,
          background: "rgba(255,255,255,.92)",
          color: "#dc2626", textAlign: "center"
        }}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{error}</div>
            <button
              onClick={() => initMap()}
              style={{
                padding: "8px 16px",
                background: "#1113a2",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      )}

      {/* petite anim CSS */}
      <style>{`
        @keyframes gdm-spin { 0% {transform: rotate(0)} 100% {transform: rotate(360deg)} }
      `}</style>
    </div>
  );
}
