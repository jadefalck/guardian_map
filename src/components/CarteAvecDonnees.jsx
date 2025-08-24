import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// 📁 Import des données pour chaque pays
import dataPhilippines from "../data/Philippines_BDD_GF.json";
import dataVietnam from "../data/Vietnam_BDD_GF.json";
import dataIndonesie from "../data/Indonesie_BDD_GF.json";
import dataJapon from "../data/Japon_BDD_GF.json";
import dataMalaisie from "../data/Malaisie_BDD_GF.json";
import dataThailande from "../data/Thailande_BDD_GF.json";

const MAPTILER_KEY = "gsmNeDjg2V0pS8etxXtI";

// Coordonnées centrées pour chaque pays
const countrySettings = {
  philippines: { center: [121.774, 12.8797], zoom: 5 },
  vietnam: { center: [108.2772, 14.0583], zoom: 5.2 },
  indonesie: { center: [113.9213, -0.7893], zoom: 4.5 },
  japon: { center: [138.2529, 36.2048], zoom: 4.5 },
  malaisie: { center: [101.9758, 4.2105], zoom: 5.2 },
  thailande: { center: [100.9925, 15.87], zoom: 5.2 },
};

// 🧠 Sélection des données par pays
const getDataByCountry = (country) => {
  switch ((country || "").toLowerCase()) {
    case "philippines":
      return dataPhilippines;
    case "vietnam":
      return dataVietnam;
    case "indonesie":
      return dataIndonesie;
    case "japon":
      return dataJapon;
    case "malaisie":
      return dataMalaisie;
    case "thailande":
      return dataThailande;
    default:
      return [];
  }
};



// 🎖️ Style badge selon le niveau (toujours texte blanc)
function levelStyle(levelRaw) {
  const l = String(levelRaw || "").toLowerCase();
  if (l.includes("gold"))   
    return { bg: "#D4AF37", color: "#fff", label: "Gold" };   // or
  if (l.includes("silver")) 
    return { bg: "#C0C0C0", color: "#1f2937", label: "Silver" }; // argent
  if (l.includes("bronze")) 
    return { bg: "#CD7F32", color: "#fff", label: "Bronze" }; // bronze
  if (l.includes("inactive")) 
    return { bg: "#e5e7eb", color: "#374151", label: "Inactive" }; // gris foncé
  return { bg: "#374151", color: "#fff", label: levelRaw || "N/A" }; // fallback gris foncé
}


// ✅ Site réellement disponible
function hasValidWebsite(website) {
  if (!website || typeof website !== "string") return false;
  const w = website.trim();
  if (!w) return false;
  if (/^pas\s*de\s*lien$/i.test(w)) return false;
  if (w === "#" || w.toLowerCase().startsWith("mailto:")) return false;
  return true;
}

// 🔗 Normalise l’URL du site pour l’attribut href
function normalizeWebsite(website) {
  if (!website) return "";
  const w = website.trim();
  if (/^https?:\/\//i.test(w)) return w;
  return `https://${w}`;
}

export default function CarteAvecDonnees({ country, regionFilter }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]); // pour gérer/vider les marqueurs entre filtres

  // ⛳️ Initialise la carte une seule fois par pays (pas à chaque filtre)
  useEffect(() => {
    if (!country || !mapContainer.current) return;

    const settings = countrySettings[country.toLowerCase()];
    if (!settings) {
      console.warn(`Aucune coordonnée définie pour le pays : ${country}`);
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`,
      center: settings.center,
      zoom: settings.zoom,
    });

    mapRef.current = map;

    return () => {
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [country]);

  // 📍 Ajoute/rafraîchit les marqueurs + ajuste la vue quand regionFilter change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const data = getDataByCountry(country);
    const validData = data.filter(
      (d) =>
        d.latitude &&
        d.longitude &&
        !isNaN(d.latitude) &&
        !isNaN(d.longitude) &&
        (d.geocoding_status === undefined || d.geocoding_status === "OK")
    );

    // Nettoie les anciens marqueurs
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Filtre par région si sélectionnée
    const filtered = regionFilter
      ? validData.filter(
          (d) => d.region && d.region.toLowerCase() === regionFilter.toLowerCase()
        )
      : validData;

    // Ajoute marqueurs pour les données filtrées
    filtered.forEach((d) => {
      const { bg, color, label } = levelStyle(d.certification_level);
      const emailLink = d.email
        ? `<a href="mailto:${d.email}" style="
              text-decoration: underline;
              color: #1f2937;
              border: 0; outline: 0; box-shadow: none;
              -webkit-tap-highlight-color: transparent;
            ">${d.email}</a>`
        : `<span style="color:#9ca3af;">Contact non renseigné</span>`;

      const websiteOk = hasValidWebsite(d.website);
      const websiteHref = websiteOk ? normalizeWebsite(d.website) : "";

      const bottomBlock = websiteOk
        ? `<div style="margin:0 18px 16px;display:flex;gap:10px;">
             <a class="gm-btn" href="${websiteHref}" target="_blank" rel="noopener noreferrer">
               Accéder au site
             </a>
           </div>`
        : `<div style="margin:0 18px 16px;font-size:13px;color:#6b7280;">Pas de site</div>`;

      const popupHTML = `
        <div class="gm-popup-content" style="
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, 'Helvetica Neue', Arial, 'Noto Sans';
          color:#1f2937;
          max-width: 340px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 14px 32px rgba(17,19,162,.18);
          overflow: hidden;
          font-size: 13.5px;
        ">
          <!-- 🟦 Bandeau titre -->
          <div style="background:#1113a2;color:#fff;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;">
            <div style="font-weight:800;font-size:15px;line-height:1.2;">
              ${d.name || "Centre de plongée"}
            </div>
            <span style="display:inline-block;padding:4px 10px;border-radius:9999px;background:${bg};color:${color};font-size:12px;font-weight:800;">
              ${label}
            </span>
          </div>

          <!-- Corps -->
          <div style="padding: 12px 18px; line-height:1.55;">
            <div style="margin:4px 0;">
              <strong style="color:#1113a2;">Région :</strong> ${d.region || "—"}
            </div>
            <div style="margin:6px 0;">
              <strong style="color:#1113a2;">Contact :</strong> ${emailLink}
            </div>
          </div>

          ${bottomBlock}

          <style>
            .maplibregl-popup.gm-popup .maplibregl-popup-close-button {
              font-size: 22px !important;
              line-height: 22px !important;
              width: 26px !important;
              height: 26px !important;
              color: #1113a2 !important;
            }
            .maplibregl-popup.gm-popup .maplibregl-popup-close-button:hover {
              color: #0d0f8f !important;
            }
            .maplibregl-popup.gm-popup .gm-btn {
              display: inline-block;
              padding: 10px 12px;
              border-radius: 12px;
              background: #1113a2;
              color: #fff !important;
              text-decoration: none !important;
              font-size: 13px;
              font-weight: 700;
              border: 0;
              outline: 0;
              box-shadow: none;
              -webkit-tap-highlight-color: transparent;
            }
            .maplibregl-popup.gm-popup .gm-btn:hover {
              filter: brightness(0.95);
            }
          </style>
        </div>
      `;

      const popup = new maplibregl.Popup({
        offset: 28,
        closeButton: true,
        className: "gm-popup",
      }).setHTML(popupHTML);

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

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([d.longitude, d.latitude])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });

    // 🎯 Ajuste la vue : si une région est sélectionnée, zoom sur ses points; sinon vue pays.
    const settings = countrySettings[country.toLowerCase()];
    try {
      if (filtered.length > 0) {
        const bounds = new maplibregl.LngLatBounds();
        filtered.forEach((d) => bounds.extend([Number(d.longitude), Number(d.latitude)]));
        map.fitBounds(bounds, {
          padding: { top: 60, bottom: 60, left: 60, right: 60 },
          maxZoom: 9,
          duration: 800,
          essential: true,
        });
      } else if (settings) {
        map.easeTo({
          center: settings.center,
          zoom: settings.zoom,
          duration: 600,
          essential: true,
        });
      }
    } catch (e) {
      if (settings) map.jumpTo({ center: settings.center, zoom: settings.zoom });
    }
  }, [country, regionFilter]);

  return (
    <div
      ref={mapContainer}
      className="shadow-xl"
      style={{
        height: "600px",
        width: "100%",
        borderRadius: "1rem",
        overflow: "hidden",
      }}
    />
  );
}
