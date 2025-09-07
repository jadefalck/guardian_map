// components/CarteAvecDonnees.jsx
import React, { useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import dataPhilippines from "../data/Philippines_BDD_GF.json";
import dataIndonesie   from "../data/Indonesie_BDD_GF.json";
import dataJapon       from "../data/Japon_BDD_GF.json";
import dataMalaisie    from "../data/Malaisie_BDD_GF.json";
import dataThailande   from "../data/Thailande_BDD_GF.json";

/* -------- Styles -------- */
const KEY = "gsmNeDjg2V0pS8etxXtI";
const STYLE_1 = `https://api.maptiler.com/maps/streets/style.json?key=${KEY}`;
const STYLE_2 = `https://api.maptiler.com/maps/basic/style.json?key=${KEY}`;
const STYLE_OSM = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};


const isMobile = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 768px)").matches;

const scrollToMap = () => {
  if (!mapId) return;
  const el = document.getElementById(mapId);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};


/* -------- Tracking base -------- */
const TRACKING_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_TRACKING_BASE) ||
  "https://go.guardianmap.com";

/* -------- Helpers -------- */
const countrySettings = {
  philippines: { center: [121.774, 12.8797], zoom: 5   },
  indonesie:   { center: [113.9213, -0.7893], zoom: 4.5 },
  japon:       { center: [138.2529, 36.2048], zoom: 4.5 },
  malaisie:    { center: [101.9758, 4.2105],  zoom: 5.2 },
  thailande:   { center: [100.9925, 15.87],   zoom: 5.2 },
};

function getDataByCountry(country) {
  switch ((country || "").toLowerCase()) {
    case "philippines": return dataPhilippines;
    case "indonesie":   return dataIndonesie;
    case "japon":       return dataJapon;
    case "malaisie":    return dataMalaisie;
    case "thailande":   return dataThailande;
    default:            return [];
  }
}

function levelStyle(levelRaw) {
  const l = String(levelRaw || "").toLowerCase();
  if (l.includes("gold"))     return { bg:"#D4AF37", color:"#fff",    label:"Gold",    id:"gold" };
  if (l.includes("silver"))   return { bg:"#C0C0C0", color:"#1f2937", label:"Silver",  id:"silver" };
  if (l.includes("bronze"))   return { bg:"#CD7F32", color:"#fff",    label:"Bronze",  id:"bronze" };
  if (l.includes("inactive")) return { bg:"#6b7280", color:"#fff",    label:"Inactive",id:"inactive" };
  return { bg:"#374151", color:"#fff", label: levelRaw || "N/A", id:"" };
}

const hasValidWebsite = (w) =>
  !!w &&
  typeof w === "string" &&
  !/^pas\s*de\s*lien$/i.test(w.trim()) &&
  w !== "#" &&
  !w.toLowerCase().startsWith("mailto:");

const normalizeWebsite = (w) => (/^https?:\/\//i.test(w) ? w : `https://${w}`);

const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

function toTrackingUrl({ centerId, country, region, destUrl }) {
  const qs = new URLSearchParams({
    c: centerId || "",
    country: country || "",
    region: region || "",
    u: destUrl || "",
  });
  return `${TRACKING_BASE}/go.php?${qs.toString()}`;
}

/* -------- Composant -------- */
export default function CarteAvecDonnees({
  country,
  regions = [],
  regionFilter = "",
  onRegionChange = () => {},
  mapId,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const hasInitializedRef = useRef(false); // empêche tout "reload" logique

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => { try { m.remove(); } catch {} });
    markersRef.current = [];
  }, []);

  /* -------- déplacement de vue (sans recréer la map) -------- */
  const moveToRows = useCallback((rows) => {
    const map = mapRef.current;
    if (!map) return;

    const bounds = new maplibregl.LngLatBounds();
    rows.forEach((d) => {
      const lat = +d.latitude, lng = +d.longitude;
      if (Number.isFinite(lat) && Number.isFinite(lng)) bounds.extend([lng, lat]);
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 9, duration: 450, essential: true });
    } else {
      const s = countrySettings[(country || "").toLowerCase()];
      if (s) map.easeTo({ center: s.center, zoom: s.zoom, duration: 350, essential: true });
    }
  }, [country]);

  /* -------- Popups + pins -------- */
  const renderPins = useCallback(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    clearMarkers();

    const all = getDataByCountry(country).filter(
      (d) => Number.isFinite(+d.latitude) && Number.isFinite(+d.longitude)
    );
    const rows = regionFilter
      ? all.filter(
          (d) =>
            String(d.region || "").toLowerCase() ===
            String(regionFilter).toLowerCase()
        )
      : all;

    rows.forEach((d, i) => {
      const lat = +d.latitude;
      const lng = +d.longitude;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const el = document.createElement("div");
      const gid = `g${i}-${Math.random().toString(36).slice(2)}`;
      el.innerHTML = `
        <svg viewBox="0 0 24 24" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1113a2"/><stop offset="100%" stop-color="#3f51b5"/>
          </linearGradient></defs>
          <path fill="url(#${gid})" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle fill="#fff" cx="12" cy="9" r="2.6"/>
        </svg>`;
      el.style.transform = "translate(-50%, -100%)";
      el.style.cursor = "pointer";

      const { bg, color, label, id: levelId } = levelStyle(d.certification_level);
      const centerId = slugify(d.id || d.slug || d.name);
      const siteUrl  = hasValidWebsite(d.website) ? normalizeWebsite(d.website) : null;
      const goHref   = siteUrl
        ? toTrackingUrl({ centerId, country, region: d.region || "", destUrl: siteUrl })
        : null;

      const sitePart = goHref
        ? `<a href="${goHref}" target="_blank" rel="noopener noreferrer"
              class="gdm-open-site"
              style="display:inline-block;margin-top:10px;padding:8px 12px;border-radius:10px;
                     background:#1113a2;color:#fff;text-decoration:none;font-weight:700;">
             Accéder au site
           </a>`
        : `<div style="margin-top:10px;color:#6b7280;">Pas de lien</div>`;

      const popupHTML = `
        <div style="font-family:system-ui,Inter,Roboto; font-size:13px; max-width:280px; line-height:1.5;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <div style="font-weight:800; color:#1113a2;">${d.name || "Centre de plongée"}</div>
            <a href="#level-${levelId}" data-level="${levelId}"
               style="display:inline-block;padding:4px 8px;border-radius:9999px;
                      background:${bg};color:${color};font-size:12px;font-weight:800;text-decoration:none;">
              ${label}
            </a>
          </div>
          <div><strong>Région :</strong> ${d.region || "—"}</div>
          ${sitePart}
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(popupHTML);
      popup.on("open", () => {
        const root = popup.getElement();
        if (!root) return;
        root.querySelectorAll("[data-level]").forEach((a) => {
          a.addEventListener("click", (ev) => {
            ev.preventDefault();
            const lvl = a.getAttribute("data-level");
            const target = document.getElementById(`level-${lvl}`);
            if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
          });
        });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Déplacer la vue sur l’ensemble courant (pas de reload)
    moveToRows(rows);
  }, [country, regionFilter, clearMarkers, moveToRows]);

  const destroyMap = useCallback(() => {
    try { clearMarkers(); } catch {}
    try { mapRef.current?.remove(); } catch {}
    mapRef.current = null;
  }, [clearMarkers]);

  /** Initialisation avec fallback de style — jamais de "window.location.reload" */
  const initMap = useCallback(async (style = STYLE_1) => {
    const node = containerRef.current;
    const s = countrySettings[(country || "").toLowerCase()];
    if (!node || !s) return;

    destroyMap();
    const map = new maplibregl.Map({
      container: node,
      style,
      center: s.center,
      zoom: s.zoom,
      preserveDrawingBuffer: true,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    let triedBasic = false;
    let triedOSM = false;

    const onReady = () => {
      if (!hasInitializedRef.current) hasInitializedRef.current = true;
      setTimeout(() => map.resize(), 50);
      renderPins();
    };

    map.on("load", onReady);

    // Si le style ne se charge pas, on bascule sur un style plus simple (sans jamais recharger la page)
    map.on("error", () => {
      if (!triedBasic && style !== STYLE_2) {
        triedBasic = true;
        initMap(STYLE_2);
      } else if (!triedOSM && style !== STYLE_OSM) {
        triedOSM = true;
        initMap(STYLE_OSM);
      }
    });
  }, [country, destroyMap, renderPins]);

  // init à la création / changement de pays uniquement
  useEffect(() => {
    initMap(STYLE_1);
    return () => destroyMap();
  }, [country, initMap, destroyMap]);

  // quand le filtre change: on rerend les pins + déplacement (pas de re-création de carte)
  useEffect(() => { renderPins(); }, [regionFilter, renderPins]);

  return (
    <div style={{ width: "100%" }}>
      {/* Carte */}
      <div
        id={mapId || undefined}
        ref={containerRef}
        style={{
          height: "600px",
          width: "100%",
          borderRadius: "1rem",
          overflow: "hidden",
          background: "#eef1f6",
        }}
      />

      {/* Filtres intégrés (optionnels) */}
      {regions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-[#1113a2] font-semibold mb-2">Filtrer par région</h3>
          <div className="space-y-2 text-sm">
            {regions.map((region, i) => (
              <label key={i} className="inline-flex items-center gap-2 text-gray-800 mr-4">
                <input
                  type="radio"
                  name="region"
                  value={region}
                  className="accent-[#1113a2]"
                  checked={regionFilter === region}
                  onChange={() => {
                    onRegionChange(region);
                    if (isMobile()) scrollToMap(); // <= remonte vers la carte sur mobile
                  }}
                />
                {region}
              </label>
            ))}
            <button
              type="button"
              className="ml-2 text-xs underline text-blue-600"
              onClick={() => {
                onRegionChange("");
                if (isMobile()) scrollToMap(); // <= idem au reset
              }}
            >
              Réinitialiser
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
