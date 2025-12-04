// src/pages/Especes.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Trans, useTranslation } from "react-i18next";

import speciesData from "../data/BDD_especes_marines.json";
import oceanImage from "../assets/images/bannière_blog2.jpg";

const KEY = "gsmNeDjg2V0pS8etxXtI";
const STYLE = `https://api.maptiler.com/maps/streets/style.json?key=${KEY}`;

const pinSvg = (color) => `
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill="${color}" d="M12 2C8.686 2 6 4.686 6 8c0 3.96 3.318 8.293 4.87 10.147a1 1 0 0 0 1.26 0C14.682 16.293 18 11.96 18 8c0-3.314-2.686-6-6-6z"/>
  <circle cx="12" cy="8" r="3" fill="white"/>
</svg>
`;

// pour afficher "Requin baleine" → "Requin Baleine"
const formatLabel = (str = "") =>
  str
    .toString()
    .toLowerCase()
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");

export default function Especes() {
  const { t } = useTranslation();

  const [selectedContinent, setSelectedContinent] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedSpecies, setSelectedSpecies] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mapRef = useRef(null);
  const mapObj = useRef(null);

  // ---------- listes de base ----------
  const continents = useMemo(
    () =>
      Array.from(new Set(speciesData.map((d) => d.continent))).filter(Boolean),
    []
  );

  const countries = useMemo(() => {
    let filtered = speciesData;
    if (selectedContinent !== "all") {
      filtered = filtered.filter((d) => d.continent === selectedContinent);
    }
    return Array.from(new Set(filtered.map((d) => d.country))).filter(Boolean);
  }, [selectedContinent]);

  const speciesList = useMemo(
    () =>
      Array.from(new Set(speciesData.map((d) => d.species))).filter(Boolean),
    []
  );

  // ---------- filtrage ----------
  const filteredData = useMemo(() => {
    return speciesData.filter((item) => {
      if (!item.lat || !item.lon) return false;

      if (selectedContinent !== "all" && item.continent !== selectedContinent)
        return false;
      if (selectedCountry !== "all" && item.country !== selectedCountry)
        return false;
      if (selectedSpecies !== "all" && item.species !== selectedSpecies)
        return false;
      if (selectedMonth !== "all") {
        if (!item.months?.includes(Number(selectedMonth))) return false;
      }
      return true;
    });
  }, [selectedContinent, selectedCountry, selectedSpecies, selectedMonth]);

  // ---------- index de recherche (sites + pays + continents + espèces) ----------
  const searchIndex = useMemo(() => {
    const items = [];

    speciesData.forEach((d) => {
      if (d.site) items.push({ type: "site", label: d.site, data: d });
    });

    Array.from(
      new Set(speciesData.map((d) => d.country).filter(Boolean))
    ).forEach((country) => items.push({ type: "country", label: country }));

    continents.forEach((cont) =>
      items.push({ type: "continent", label: cont })
    );

    speciesList.forEach((sp) => items.push({ type: "species", label: sp }));

    return items;
  }, [continents, speciesList]);

  const searchSuggestions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return searchIndex
      .filter((item) => item.label.toLowerCase().includes(term))
      .slice(0, 10);
  }, [searchTerm, searchIndex]);

  // ---------- init carte ----------
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
    map.on("load", () => map.resize());
    mapObj.current = map;

    return () => {
      map.remove();
      mapObj.current = null;
    };
  }, []);

  // ---------- markers ----------
  useEffect(() => {
    const map = mapObj.current;
    if (!map) return;

    if (map._gm_markers) map._gm_markers.forEach((m) => m.remove());
    map._gm_markers = [];

    const placeables = filteredData.filter(
      (p) => p.lat !== null && p.lon !== null
    );
    if (!placeables.length) return;

    const bounds = new maplibregl.LngLatBounds();

    placeables.forEach((p) => {
      const isUnethical = p.ethique === "X";
      const color = isUnethical ? "#dc2626" : "#1113a2";

      const el = document.createElement("div");
      el.innerHTML = pinSvg(color);
      el.style.width = "28px";
      el.style.height = "28px";
      el.style.cursor = "pointer";
      el.style.transform = "translateY(-4px)";

      const popupHtml = isUnethical
        ? `<div style="font-size:12px">
             <div style="font-weight:700;color:#b91c1c">${t(
               "especes.popup.unethicalTitle"
             )}</div>
             <div style="font-weight:600;margin-top:2px;">${p.site} – ${
            p.country
          }</div>
             <div style="margin-top:6px;">${p.explication || ""}</div>
           </div>`
        : `<div style="font-size:12px">
             <div style="font-weight:700;">${p.site}</div>
             <div>${p.country} – ${p.continent}</div>
             <div style="margin-top:4px;">${p.species || ""}</div>
           </div>`;

      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([p.lon, p.lat])
        .setPopup(new maplibregl.Popup({ offset: 8 }).setHTML(popupHtml))
        .addTo(map);

      if (!map._gm_markers) map._gm_markers = [];
      map._gm_markers.push(marker);

      bounds.extend([p.lon, p.lat]);
    });

    const fit = () => {
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 60, maxZoom: 5, duration: 700 });
      }
    };

    map.loaded() ? fit() : map.once("idle", fit);
  }, [filteredData, t]);

  // ---------- clic sur suggestion ----------
  const handleSuggestionClick = (item) => {
    const map = mapObj.current;
    setSearchTerm(item.label);
    setShowSuggestions(false);

    if (item.type === "site" && item.data) {
      const p = item.data;
      setSelectedContinent(p.continent || "all");
      setSelectedCountry(p.country || "all");
      setSelectedSpecies(p.species || "all");
      setSelectedMonth("all");

      if (map && p.lon && p.lat) {
        map.flyTo({ center: [p.lon, p.lat], zoom: 6, duration: 900 });
      }
      return;
    }

    if (item.type === "country") {
      setSelectedContinent("all");
      setSelectedCountry(item.label);
      setSelectedSpecies("all");
      setSelectedMonth("all");

      if (map) {
        const pts = speciesData.filter(
          (d) => d.country === item.label && d.lat && d.lon
        );
        if (pts.length) {
          const bounds = new maplibregl.LngLatBounds();
          pts.forEach((p) => bounds.extend([p.lon, p.lat]));
          !bounds.isEmpty() &&
            map.fitBounds(bounds, { padding: 60, maxZoom: 5, duration: 700 });
        }
      }
      return;
    }

    if (item.type === "continent") {
      setSelectedContinent(item.label);
      setSelectedCountry("all");
      setSelectedSpecies("all");
      setSelectedMonth("all");

      if (map) {
        const pts = speciesData.filter(
          (d) => d.continent === item.label && d.lat && d.lon
        );
        if (pts.length) {
          const bounds = new maplibregl.LngLatBounds();
          pts.forEach((p) => bounds.extend([p.lon, p.lat]));
          !bounds.isEmpty() &&
            map.fitBounds(bounds, { padding: 60, maxZoom: 5, duration: 700 });
        }
      }
      return;
    }

    if (item.type === "species") {
      setSelectedContinent("all");
      setSelectedCountry("all");
      setSelectedSpecies(item.label);
      setSelectedMonth("all");

      if (map) {
        const pts = speciesData.filter(
          (d) => d.species === item.label && d.lat && d.lon
        );
        if (pts.length) {
          const bounds = new maplibregl.LngLatBounds();
          pts.forEach((p) => bounds.extend([p.lon, p.lat]));
          !bounds.isEmpty() &&
            map.fitBounds(bounds, { padding: 60, maxZoom: 5, duration: 700 });
        }
      }
      return;
    }
  };

  // ---------- rendu ----------
  return (
    <div className="w-full">
      {/* TITRE + SOUS-TITRE */}
      <section className="py-10 px-6 text-center bg-gray-200">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
          {t("especes.title")}
        </h1>
        <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-700">
          {t("especes.subtitle")}
        </p>
      </section>

      <section className="w-full bg-white py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* CARTE dans un encadré avec fond océan */}
          <div className="relative rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Fond océan */}
            <img
              src={oceanImage}
              alt="Fond océan"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-black/20 z-0" />

            {/* Contenu au-dessus */}
            <div className="relative z-10 p-4 md:p-6">
              <div className="bg-white/95 rounded-2xl shadow-lg p-2">
                <div
                  ref={mapRef}
                  className="w-full h-[420px] md:h-[480px] rounded-xl overflow-hidden bg-white"
                />
              </div>
              <p className="px-2 md:px-4 pt-2 text-xs text-gray-100 text-right drop-shadow-md">
                <Trans
                  i18nKey="especes.legend"
                  components={{
                    blue: <span className="font-bold text-blue-200" />,
                    red: <span className="font-bold text-red-300" />,
                  }}
                />
              </p>
            </div>
          </div>

          {/* RECHERCHE + FILTRES, ENCADRÉ OMBRÉ */}
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-md space-y-4">
            {/* Barre de recherche */}
            <div className="relative">
              <label className="text-sm font-semibold text-gray-800">
                {t("especes.search.label")}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={t("especes.search.placeholder")}
                className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-auto text-sm">
                  {searchSuggestions.map((s, idx) => (
                    <button
                      key={`${s.type}-${idx}-${s.label}`}
                      type="button"
                      onClick={() => handleSuggestionClick(s)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800">
                          {formatLabel(s.label)}
                        </span>
                        <span className="text-[10px] uppercase tracking-wide text-gray-400">
                          {s.type === "site"
                            ? t("especes.search.type.site")
                            : s.type === "country"
                            ? t("especes.search.type.country")
                            : s.type === "continent"
                            ? t("especes.search.type.continent")
                            : t("especes.search.type.species")}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filtres */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              {/* Continent */}
              <div>
                <label className="text-sm font-semibold">
                  {t("especes.filters.continent")}
                </label>
                <select
                  value={selectedContinent}
                  onChange={(e) => {
                    setSelectedContinent(e.target.value);
                    setSelectedCountry("all");
                  }}
                  className="w-full border px-3 py-2 rounded-lg text-sm"
                >
                  <option value="all">
                    {t("especes.filters.allContinents")}
                  </option>
                  {continents.map((c) => (
                    <option key={c} value={c}>
                      {formatLabel(c)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pays */}
              <div>
                <label className="text-sm font-semibold">
                  {t("especes.filters.country")}
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg text-sm"
                >
                  <option value="all">
                    {t("especes.filters.allCountries")}
                  </option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {formatLabel(c)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Espèce */}
              <div>
                <label className="text-sm font-semibold">
                  {t("especes.filters.species")}
                </label>
                <select
                  value={selectedSpecies}
                  onChange={(e) => setSelectedSpecies(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg text-sm"
                >
                  <option value="all">
                    {t("especes.filters.allSpecies")}
                  </option>
                  {speciesList.map((s) => (
                    <option key={s} value={s}>
                      {formatLabel(s)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mois */}
              <div>
                <label className="text-sm font-semibold">
                  {t("especes.filters.month")}
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg text-sm"
                >
                  <option value="all">
                    {t("especes.filters.allMonths")}
                  </option>
                  {Array.from({ length: 12 }, (_, idx) => idx + 1).map((m) => (
                    <option key={m} value={m}>
                      {t(`months.${m}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
