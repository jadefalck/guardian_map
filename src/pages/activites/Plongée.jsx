// src/pages/activites/Plongée.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useTranslation, Trans } from "react-i18next";

import videoEau from "../../assets/videos/eau_titre.mp4";

import imgAsie from "../../assets/images/images_continents_pays/asie.jpg";
import imgEurope from "../../assets/images/images_continents_pays/europe.jpg";
import imgAfrique from "../../assets/images/images_continents_pays/afrique.jpg";
import imgANord from "../../assets/images/images_continents_pays/amerique_nord.jpg";
import imgASud from "../../assets/images/images_continents_pays/amerique_sud.jpg";
import imgOceanie from "../../assets/images/images_continents_pays/oceanie.jpg";

import EXCEL_URL from "../../data/BDD_centres_plongees.xlsx?url";

// slug util
const toSlug = (s = "") =>
  s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/* ===== Canonique continents =====
   → tout est rangé sous 6 clés: africa, north-america, south-america, asia, europe, oceania
*/
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

// Métadonnées par continent (slug FR + image)
const CONTINENTS_META = {
  africa: {
    slug: "afrique",
    image: imgAfrique,
  },
  "north-america": {
    slug: "amerique-du-nord",
    image: imgANord,
  },
  "south-america": {
    slug: "amerique-du-sud",
    image: imgASud,
  },
  asia: {
    slug: "asie",
    image: imgAsie,
  },
  europe: {
    slug: "europe",
    image: imgEurope,
  },
  oceania: {
    slug: "oceanie",
    image: imgOceanie,
  },
};

function pickContinentKey(row) {
  if (!row) return null;
  const keys = Object.keys(row);
  const candidates = [
    "continent",
    "Continent",
    "CONTINENT",
    "continent_en",
    "Continent_en",
    "continentEN",
    "continent (en)",
  ];
  return candidates.find((k) => keys.includes(k)) || null;
}

export default function Plongée() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [items, setItems] = useState([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(EXCEL_URL);
        if (!res.ok) throw new Error("Excel introuvable");
        const buf = await res.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
        if (!rows.length) throw new Error("Excel vide");

        const k = pickContinentKey(rows[0]);
        if (!k) throw new Error("Colonne 'continent' manquante");

        // dédup par CONTINENT_ALIAS
        const byCanon = new Map();
        for (const r of rows) {
          const raw = String(r[k] || "").trim();
          if (!raw || raw === "0") continue;
          const slug = toSlug(raw);
          const canon = CONTINENT_ALIAS[slug];
          if (!canon) continue;
          if (!byCanon.has(canon)) byCanon.set(canon, true);
        }

        const cards = Array.from(byCanon.keys())
          .map((canon) => {
            const meta = CONTINENTS_META[canon];
            if (!meta) return null;
            return {
              canon, // ex: "north-america"
              slug: meta.slug, // slug FR pour l'URL
              image: meta.image,
            };
          })
          .filter(Boolean)
          .sort((a, b) =>
            t(`divingPage.continents.${a.canon}`).localeCompare(
              t(`divingPage.continents.${b.canon}`),
              "fr"
            )
          );

        setItems(cards);
      } catch (e) {
        console.error(e);
        setHasError(true);

        // fallback: on affiche tous les continents définis
        const fallback = Object.entries(CONTINENTS_META).map(
          ([canon, meta]) => ({
            canon,
            slug: meta.slug,
            image: meta.image,
          })
        );
        setItems(fallback);
      }
    })();
  }, [t]);

  const cards = useMemo(
    () =>
      items.map((c) => {
        const label = t(`divingPage.continents.${c.canon}`);
        return (
          <div
            key={c.canon}
            onClick={() => navigate(`/continents/${c.slug}`)}
            className="cursor-pointer w-full rounded-xl overflow-hidden shadow-md transition-transform hover:scale-105 bg-white"
          >
            {c.image ? (
              <img
                src={c.image}
                alt={label}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600">
                  {t("divingPage.photoPlaceholder", { name: label })}
                </span>
              </div>
            )}
            <div className="bg-white text-[#1113a2] font-semibold text-lg py-4 text-center">
              {label}
            </div>
          </div>
        );
      }),
    [items, navigate, t]
  );

  return (
    <div className="w-full">
      {/* Bandeau texte haut */}
      <div className="bg-gray-100 py-10 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-lg md:text-xl font-semibold text-[#3b3c42] mb-2">
            <Trans
              i18nKey="divingPage.intro"
              components={{
                b: (
                  <span className="text-[#1113a2] font-semibold" />
                ),
              }}
            />
          </h1>
        </div>
      </div>

      {/* Vidéo + titre */}
      <div className="relative w-full h-[180px] md:h-[220px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover top-0 left-0"
        >
          <source src={videoEau} type="video/mp4" />
        </video>
        <div className="absolute inset-0 flex items-center justify-center px-4 z-10">
          <div className="bg-white bg-opacity-90 p-6 rounded-xl shadow-lg text-center w-full max-w-2xl">
            <h2 className="text-2xl md:text-4xl font-bold text-[#1113a2] mb-1">
              {t("divingPage.heroTitle")}
            </h2>
          </div>
        </div>
      </div>

      {/* Message d'erreur éventuel */}
      {hasError && (
        <div className="max-w-4xl mx-auto mt-4 text-center text-sm text-orange-600">
          {t("divingPage.error")}
        </div>
      )}

      {/* Cartes continents */}
      <div className="max-w-6xl mx-auto px-4 md:px-0 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards}
        </div>
      </div>
    </div>
  );
}
