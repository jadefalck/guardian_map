// src/pages/pays2/CountryPage.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

import CarteAvecDonnees from "../../components/CarteAvecDonnees2";
import oceanImage from "../../assets/images/ocean.jpg";
import gfLogo from "../../assets/images/GF_Logo.png";
import bfLogo from "../../assets/images/BF_Logo.webp";

// fallback si jamais la clé i18n n'existe pas
const titleCase = (s = "") =>
  s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

// même toSlug que dans le reste du projet
const toSlug = (s = "") =>
  s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/**
 * Résout le "vrai" key de pays (celui utilisé dans les JSON + BDD)
 * à partir du slug de l'URL, en utilisant la liste `countries` FR.
 *
 * Exemple :
 *   slug = "cap-vert"
 *   fr.json : { "cabo-verde": "Cap-Vert" }
 * => renvoie "cabo-verde"
 */
function resolveCountryKey(slug, i18n) {
  const frBundle = i18n.getResourceBundle("fr", "translation") || {};
  const countries = frBundle.countries || {};

  // 1) si la clé existe déjà telle quelle, on la garde
  if (countries[slug]) return slug;

  // 2) sinon on compare le slug avec les noms FR slugifiés
  const norm = toSlug(slug);
  for (const [key, label] of Object.entries(countries)) {
    if (toSlug(String(label)) === norm) {
      return key; // clé canonique trouvée (ex: "cabo-verde")
    }
  }

  // 3) fallback : on renvoie le slug brut
  return slug;
}

export default function CountryPage() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();

  // clé "canonique" du pays (celle utilisée dans les JSON + Excel)
  const countryKey = useMemo(
    () => resolveCountryKey(slug, i18n),
    [slug, i18n]
  );

  // Titre du pays (i18n, avec fallback titleCase)
  const countryTitle = useMemo(
    () => t(`countries.${countryKey}`, titleCase(countryKey)),
    [countryKey, t]
  );

  // Filtres
  const [labelFilter, setLabelFilter] = useState("all"); // 'all' | 'greenfins' | 'blueflag'
  const [gfLevels, setGfLevels] = useState({
    gold: true,
    silver: true,
    bronze: true,
    inactive: true,
    digital: true,
  });

  // Compteurs (total pays + visibles par niveau)
  const [counts, setCounts] = useState({
    gfTotal: 0,
    bfTotal: 0,
    gfByLevel: { gold: 0, silver: 0, bronze: 0, inactive: 0, digital: 0 },
    gfShownByLevel: { gold: 0, silver: 0, bronze: 0, inactive: 0, digital: 0 },
  });

  // Remonter en haut et forcer un resize (corrige la map parfois blanche)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const tId = setTimeout(() => window.dispatchEvent(new Event("resize")), 0);
    return () => clearTimeout(tId);
  }, [countryKey]);

  // Smooth scroll
  const scrollToId = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Sélection EXCLUSIVE d’un niveau GF + cacher Blue Flag
  const selectOnlyLevel = (level) => {
    setLabelFilter("greenfins");
    setGfLevels({
      gold: level === "gold",
      silver: level === "silver",
      bronze: level === "bronze",
      inactive: level === "inactive",
      digital: level === "digital",
    });
  };

  // Réinitialiser les filtres (réaffiche BF et tous les niveaux)
  const resetFilters = () => {
    setLabelFilter("all");
    setGfLevels({
      gold: true,
      silver: true,
      bronze: true,
      inactive: true,
      digital: true,
    });
    setTimeout(() => window.dispatchEvent(new Event("resize")), 0);
  };

  const shown = counts.gfShownByLevel;

  return (
    <div className="w-full">
      {/* ===== HEADER ===== */}
      <header className="w-full bg-gray-100 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="uppercase text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-[#1113a2] via-[#3f51b5] to-[#8ab4f8] text-transparent bg-clip-text drop-shadow-md text-center md:text-left md:ml-[6%]">
            {countryTitle}
          </h1>
        </div>
      </header>

      {/* ===== MAP + PANNEAU ===== */}
      <div
        className="py-16 px-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${oceanImage})` }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl max-w-[1200px] mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* CARTE */}
          <div className="md:col-span-3 rounded-xl overflow-hidden">
            <CarteAvecDonnees
              countrySlug={countryKey}          
              labelFilter={labelFilter}
              gfLevels={gfLevels}
              mapId={`map-${countryKey}`}
              heightClass="h-[560px]"
              onCountsChange={setCounts}
            />
          </div>

          {/* PANNEAU DROIT */}
          <aside className="bg-white/80 p-4 rounded-xl shadow-inner max-h-[600px] overflow-y-auto">
            <div className="space-y-5">
              {/* Légende & compteurs pays */}
              <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  {t("countryPage.panel.legendTitle")}
                </p>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <img src={gfLogo} alt="Green Fins" className="h-6 w-auto" />
                    <span className="text-sm text-gray-800">
                      <strong>
                        {t("countryPage.panel.gfShort")} : {counts.gfTotal}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={bfLogo} alt="Blue Flag" className="h-6 w-auto" />
                    <span className="text-sm text-gray-800">
                      <strong>
                        {t("countryPage.panel.bfShort")} : {counts.bfTotal}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Boutons infos (scroll) */}
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => scrollToId("why-certified")}
                  className="w-full text-center px-3 py-2 rounded-lg bg-gray-100 text-[#1113a2] border border-gray-300 hover:bg-gray-200 transition"
                >
                  {t("countryPage.panel.buttons.whyCertified")}
                </button>
                <button
                  onClick={() => scrollToId("what-gf")}
                  className="w-full text-center px-3 py-2 rounded-lg bg-gray-100 text-[#1113a2] border border-gray-300 hover:bg-gray-200 transition"
                >
                  {t("countryPage.panel.buttons.whatGF")}
                </button>
                <button
                  onClick={() => scrollToId("what-bf")}
                  className="w-full text-center px-3 py-2 rounded-lg bg-gray-100 text-[#1113a2] border border-gray-300 hover:bg-gray-200 transition"
                >
                  {t("countryPage.panel.buttons.whatBF")}
                </button>
              </div>

              {/* Filtrer par label */}
              <div>
                <h3 className="text-[#1113a2] font-semibold mb-2">
                  {t("countryPage.panel.filterByLabel")}
                </h3>
                <div className="space-y-2 text-sm">
                  {[
                    ["all", t("countryPage.panel.filterOptions.all")],
                    ["greenfins", t("countryPage.panel.filterOptions.greenfins")],
                    ["blueflag", t("countryPage.panel.filterOptions.blueflag")],
                  ].map(([val, label]) => {
                    const isActive = labelFilter === val;
                    return (
                      <label
                        key={val}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 border transition
                          ${isActive
                            ? "border-[#1113a2] bg-[#1113a2]/5 font-semibold"
                            : "border-gray-300 bg-white"
                          }`}
                      >
                        <input
                          type="radio"
                          className="accent-[#1113a2]"
                          name="labelFilter"
                          value={val}
                          checked={labelFilter === val}
                          onChange={() => setLabelFilter(val)}
                        />
                        <span>{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>


              {/* Niveaux GF — exclusif + compteur visible + reset */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#1113a2] font-semibold">
                    {t("countryPage.panel.gfLevelsTitle")}
                  </h3>
                  <button
                    onClick={resetFilters}
                    className="text-xs px-2 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition"
                    title={t("countryPage.panel.resetTitle")}
                  >
                    {t("countryPage.panel.reset")}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`text-xs px-2.5 py-1.5 rounded-full border transition ${
                      gfLevels.gold
                        ? "bg-[#D4AF37] text-white border-[#D4AF37]"
                        : "bg-white text-[#D4AF37] border-[#D4AF37]"
                    }`}
                    onClick={() => selectOnlyLevel("gold")}
                  >
                    {t("countryPage.panel.levels.gold")} ({shown.gold ?? 0})
                  </button>
                  <button
                    className={`text-xs px-2.5 py-1.5 rounded-full border transition ${
                      gfLevels.silver
                        ? "bg-[#C0C0C0] text-white border-[#C0C0C0]"
                        : "bg-white text-[#C0C0C0] border-[#C0C0C0]"
                    }`}
                    onClick={() => selectOnlyLevel("silver")}
                  >
                    {t("countryPage.panel.levels.silver")} ({shown.silver ?? 0})
                  </button>
                  <button
                    className={`text-xs px-2.5 py-1.5 rounded-full border transition ${
                      gfLevels.bronze
                        ? "bg-[#CD7F32] text-white border-[#CD7F32]"
                        : "bg-white text-[#CD7F32] border-[#CD7F32]"
                    }`}
                    onClick={() => selectOnlyLevel("bronze")}
                  >
                    {t("countryPage.panel.levels.bronze")} ({shown.bronze ?? 0})
                  </button>
                  <button
                    className={`text-xs px-2.5 py-1.5 rounded-full border transition ${
                      gfLevels.inactive
                        ? "bg-[#6b7280] text-white border-[#6b7280]"
                        : "bg-white text-[#6b7280] border-[#6b7280]"
                    }`}
                    onClick={() => selectOnlyLevel("inactive")}
                  >
                    {t("countryPage.panel.levels.inactive")} ({shown.inactive ?? 0})
                  </button>
                  <button
                    className={`text-xs px-2.5 py-1.5 rounded-full border transition ${
                      gfLevels.digital
                        ? "bg-[#0ea5e9] text-white border-[#0ea5e9]"
                        : "bg-white text-[#0ea5e9] border-[#0ea5e9]"
                    }`}
                    onClick={() => selectOnlyLevel("digital")}
                  >
                    {t("countryPage.panel.levels.digital")} ({shown.digital ?? 0})
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {t("countryPage.panel.gfNote")}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ===== SECTIONS D’EXPLICATION APRÈS LA CARTE ===== */}

      {/* 1) Pourquoi aller dans un centre certifié ? */}
      <section id="why-certified" className="w-full bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1113a2] mb-4">
              {t("countryPage.why.title")}
            </h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              <Trans i18nKey="countryPage.why.text1" />
            </p>
            <div className="grid md:grid-cols-2 gap-5 text-gray-800">
              <ul className="list-disc pl-6 space-y-2">
                <li>{t("countryPage.why.list.impact")}</li>
                <li>{t("countryPage.why.list.briefings")}</li>
                <li>{t("countryPage.why.list.followup")}</li>
                <li>{t("countryPage.why.list.sites")}</li>
              </ul>
              <div className="bg-gray-100/60 border border-gray-200 rounded-xl p-4">
                <p className="font-medium text-gray-900 mb-2">
                  {t("countryPage.why.boxTitle")}
                </p>
                <p className="text-sm text-gray-700">
                  <Trans i18nKey="countryPage.why.boxText" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2) C’est quoi Green Fins ? */}
      <section id="what-gf" className="w-full bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-slate-200">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={gfLogo}
                alt="Logo Green Fins"
                className="h-12 w-auto object-contain"
              />
              <h2 className="text-2xl md:text-3xl font-bold text-[#1113a2]">
                {t("countryPage.gf.title")}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-gray-800">
              <div className="md:col-span-2">
                <p className="leading-relaxed mb-4">
                  <Trans i18nKey="countryPage.gf.text1" />
                </p>
                <p className="leading-relaxed">
                  <Trans i18nKey="countryPage.gf.text2" />
                </p>
              </div>
              <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-4">
                <p className="font-medium text-gray-900 mb-2">
                  {t("countryPage.gf.boxTitle")}
                </p>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  <li>{t("countryPage.gf.box.point1")}</li>
                  <li>{t("countryPage.gf.box.point2")}</li>
                  <li>{t("countryPage.gf.box.point3")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3) C’est quoi Blue Flag ? */}
      <section id="what-bf" className="w-full bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-stone-200">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={bfLogo}
                alt="Logo Blue Flag"
                className="h-12 w-auto object-contain"
              />
              <h2 className="text-2xl md:text-3xl font-bold text-[#1113a2]">
                {t("countryPage.bf.title")}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-gray-800">
              <div className="md:col-span-2">
                <p className="leading-relaxed mb-4">
                  <Trans i18nKey="countryPage.bf.text1" />
                </p>
                <p className="leading-relaxed">
                  <Trans i18nKey="countryPage.bf.text2" />
                </p>
              </div>
              <div className="bg-stone-100/70 border border-stone-200 rounded-xl p-4">
                <p className="font-medium text-gray-900 mb-2">
                  {t("countryPage.bf.boxTitle")}
                </p>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  <li>{t("countryPage.bf.box.point1")}</li>
                  <li>{t("countryPage.bf.box.point2")}</li>
                  <li>{t("countryPage.bf.box.point3")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
