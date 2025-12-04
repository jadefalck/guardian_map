// src/pages/activites/Observation.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTranslation, Trans } from "react-i18next";

// Données JSON
import observationData from "../../data/BDD_observation.json";

// Images
import oceanImage from "../../assets/images/bannière_blog2.jpg";
import whaleFilterImg from "../../assets/images/baleine_filtre.jpg";
import dolphinFilterImg from "../../assets/images/dauphin_filtre.jpg";
import wcaLogo from "../../assets/images/WCA.webp";
import fotsLogo from "../../assets/images/FotS.png";

// Icônes menaces
import iconeBateau from "../../assets/images/icone_bateau.png";
import iconeVolume from "../../assets/images/icone_volume.png";
import iconeFoule from "../../assets/images/icone_foule.png";

const KEY = "gsmNeDjg2V0pS8etxXtI";
const STYLE = `https://api.maptiler.com/maps/streets/style.json?key=${KEY}`;

const pinSvg = (color = "#1113a2") => `
<svg viewBox="0 0 24 24">
  <path fill="${color}" d="M12 2C8.686 2 6 4.686 6 8c0 3.96 3.318 8.293 4.87 10.147a1 1 0 0 0 1.26 0C14.682 16.293 18 11.96 18 8c0-3.314-2.686-6-6-6z"/>
  <circle cx="12" cy="8" r="3" fill="white"/>
</svg>
`;

export default function Observation() {
  const { t } = useTranslation();

  const [selectedAnimal, setSelectedAnimal] = useState("all");
  const mapRef = useRef(null);
  const mapObj = useRef(null);

  // --- Filtrage des points ---
  const filteredData = useMemo(() => {
    if (selectedAnimal === "all") {
      return observationData.filter((p) => p.lat && p.lon);
    }
    return observationData.filter(
      (p) =>
        p.lat &&
        p.lon &&
        p.animal &&
        p.animal.toLowerCase() === selectedAnimal.toLowerCase()
    );
  }, [selectedAnimal]);

  // --- Initialisation de la carte ---
  useEffect(() => {
    if (mapObj.current || !mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: STYLE,
      center: [0, 20],
      zoom: 2.3,
      attributionControl: true,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.on("load", () => {
      map.resize();
    });

    mapObj.current = map;

    return () => {
      map.remove();
      mapObj.current = null;
    };
  }, []);

  // --- Marqueurs ---
  useEffect(() => {
    const map = mapObj.current;
    if (!map) return;

    if (map._gm_obs_markers) {
      map._gm_obs_markers.forEach((m) => m.remove());
    }
    map._gm_obs_markers = [];

    const bounds = new maplibregl.LngLatBounds();

    filteredData.forEach((p) => {
      const el = document.createElement("div");
      el.innerHTML = pinSvg("#1113a2");
      el.style.width = "28px";
      el.style.height = "28px";
      el.style.cursor = "pointer";
      el.style.transform = "translateY(-4px)";

      const websiteHtml = p.website
        ? `<a href="${p.website}" target="_blank" rel="noopener noreferrer" style="color:#1113a2;text-decoration:underline;">${p.website}</a>`
        : "<span style='color:#6b7280;'>Site web indisponible</span>";

      const popupHtml = `
        <div style="font-size:12px; max-width:220px;">
          <div style="font-weight:700; margin-bottom:2px;">${p.name || ""}</div>
          <div style="margin-bottom:4px;">${p.site || ""}</div>
          <div>${websiteHtml}</div>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([p.lon, p.lat])
        .setPopup(new maplibregl.Popup({ offset: 8 }).setHTML(popupHtml))
        .addTo(map);

      map._gm_obs_markers.push(marker);
      bounds.extend([p.lon, p.lat]);
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 6, duration: 700 });
    }
  }, [filteredData]);

  // --- Filtre animal ---
  const handleAnimalClick = (animal) => {
    setSelectedAnimal((prev) => (prev === animal ? "all" : animal));
  };

  const isWhaleActive = selectedAnimal.toLowerCase() === "baleine";
  const isDolphinActive = selectedAnimal.toLowerCase() === "dauphin";

  return (
    <div className="w-full">
      {/* TITRE */}
      <section className="py-10 px-6 text-center bg-gray-200">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          {t("activities.observation.pageTitle")}
        </h1>
      </section>

      {/* GRAND ENCADRÉ : fond océan + carte + filtres */}
      <section className="w-full bg-white pt-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Fond océan */}
            <img
              src={oceanImage}
              alt="Fond océan"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-black/25 z-0" />

            {/* Contenu */}
            <div className="relative z-10 p-6 md:p-8 flex flex-col lg:flex-row gap-6">
              {/* Carte avec fond blanc */}
              <div className="flex-[3]">
                <div className="bg-white/95 rounded-2xl shadow-lg p-2 h-full">
                  <div
                    ref={mapRef}
                    className="w-full h-[420px] md:h-[480px] rounded-xl overflow-hidden bg-white"
                  />
                </div>
              </div>

              {/* Filtres animaux (colonne plus étroite) */}
              <div className="w-full lg:w-[210px] bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-md p-4 space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  {t("activities.observation.filters.title")}
                </h2>

                <div className="space-y-3">
                  {/* Baleine */}
                  <button
                    type="button"
                    onClick={() => handleAnimalClick("Baleine")}
                    className={`flex items-center gap-3 px-3 py-3 rounded-2xl border text-left text-sm transition
                      ${
                        isWhaleActive
                          ? "border-[#1113a2]"
                          : "border-gray-200 hover:border-[#1113a2]/70"
                      }`}
                  >
                    <img
                      src={whaleFilterImg}
                      alt={t("animals.whale")}
                      className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                    />
                    <p className="font-semibold text-gray-900 text-sm">
                      {t("animals.whale")}
                    </p>
                  </button>

                  {/* Dauphin */}
                  <button
                    type="button"
                    onClick={() => handleAnimalClick("Dauphin")}
                    className={`flex items-center gap-3 px-3 py-3 rounded-2xl border text-left text-sm transition
                      ${
                        isDolphinActive
                          ? "border-[#1113a2]"
                          : "border-gray-200 hover:border-[#1113a2]/70"
                      }`}
                  >
                    <img
                      src={dolphinFilterImg}
                      alt={t("animals.dolphin")}
                      className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                    />
                    <p className="font-semibold text-gray-900 text-sm">
                      {t("animals.dolphin")}
                    </p>
                  </button>
                </div>

                <p className="text-[11px] text-gray-500">
                  {t("activities.observation.filters.hint")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MENACES */}
      <section className="w-full bg-white py-12 px-6 mt-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {t("activities.observation.threatsTitle")}
          </h2>

          {/* Grand rectangle gris avec tout le contenu */}
          <div className="bg-gray-100 border border-gray-300 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              {t("activities.observation.threatsIntroLine1")}
              <br />
              {t("activities.observation.threatsIntroLine2")}
            </p>

            <div className="grid gap-5 md:grid-cols-3">
              {/* Proximité excessive */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-start gap-4">
                <img
                  src={iconeBateau}
                  alt=""
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <p className="font-semibold mb-1 text-[#1113a2]">
                    {t("activities.observation.threats.proximity.title")}
                  </p>
                  <p className="text-sm text-gray-700">
                    {t("activities.observation.threats.proximity.text")}
                  </p>
                </div>
              </div>

              {/* Bruit sous-marin */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-start gap-4">
                <img
                  src={iconeVolume}
                  alt=""
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <p className="font-semibold mb-1 text-[#1113a2]">
                    {t("activities.observation.threats.noise.title")}
                  </p>
                  <p className="text-sm text-gray-700">
                    {t("activities.observation.threats.noise.text")}
                  </p>
                </div>
              </div>

              {/* Nourrissage & sur-fréquentation */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-start gap-4">
                <img
                  src={iconeFoule}
                  alt=""
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <p className="font-semibold mb-1 text-[#1113a2]">
                    {t("activities.observation.threats.feeding.title")}
                  </p>
                  <p className="text-sm text-gray-700">
                    {t("activities.observation.threats.feeding.text")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Encadré mis en avant */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8 text-center">
            <p className="text-base md:text-lg text-gray-800 font-semibold leading-relaxed">
              <Trans
                i18nKey="activities.observation.highlight"
                components={{
                  blue: <span className="text-[#1113a2] font-bold" />,
                }}
              />
            </p>
          </div>
        </div>
      </section>

      {/* LABELS */}
      <section className="w-full bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {t("activities.observation.labelsTitle")}
          </h2>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* WCA */}
            <div className="flex-1 flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-4 shadow-sm">
              <img
                src={wcaLogo}
                alt={t("activities.labels.wca.alt")}
                className="w-12 h-12 object-contain shrink-0"
                loading="lazy"
              />
              <div>
                <p className="font-semibold text-gray-900 mb-1">
                  {t("activities.labels.wca.title")}
                </p>
                <p className="text-sm text-gray-700">
                  {t("activities.labels.wca.text")}
                </p>
              </div>
            </div>

            {/* Friend of the Sea */}
            <div className="flex-1 flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-4 shadow-sm">
              <img
                src={fotsLogo}
                alt={t("activities.labels.fots.alt")}
                className="w-12 h-12 object-contain shrink-0"
                loading="lazy"
              />
              <div>
                <p className="font-semibold text-gray-900 mb-1">
                  {t("activities.labels.fots.title")}
                </p>
                <p className="text-sm text-gray-700">
                  {t("activities.labels.fots.text")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
