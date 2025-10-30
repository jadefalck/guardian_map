// src/pages/pays2/CountryPage.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import CarteAvecDonnees from "../../components/CarteAvecDonnees2";
import oceanImage from "../../assets/images/ocean.jpg";
import gfLogo from "../../assets/images/GF_Logo.png";
import bfLogo from "../../assets/images/BF_Logo.webp";

const titleCase = (s = "") => s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

export default function CountryPage() {
  const { slug } = useParams();
  const countryTitle = useMemo(() => titleCase(slug), [slug]);

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
    // petit tick pour laisser le DOM se peindre puis forcer resize
    const t = setTimeout(() => window.dispatchEvent(new Event("resize")), 0);
    return () => clearTimeout(t);
  }, [slug]);

  // Smooth scroll
  const scrollToId = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Sélection EXCLUSIVE d’un niveau GF + cacher Blue Flag
  const selectOnlyLevel = (level) => {
    setLabelFilter("greenfins"); // masque BF
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
    setGfLevels({ gold: true, silver: true, bronze: true, inactive: true, digital: true });
    // forcer un resize (utile si le layout a bougé)
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
      <div className="py-16 px-4 bg-cover bg-center" style={{ backgroundImage: `url(${oceanImage})` }}>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl max-w-[1200px] mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* CARTE */}
          <div className="md:col-span-3 rounded-xl overflow-hidden">
            <CarteAvecDonnees
              countrySlug={slug}
              labelFilter={labelFilter}
              gfLevels={gfLevels}
              mapId={`map-${slug}`}
              heightClass="h-[560px]"
              onCountsChange={setCounts}
            />
          </div>

          {/* PANNEAU DROIT */}
          <aside className="bg-white/80 p-4 rounded-xl shadow-inner max-h-[600px] overflow-y-auto">
            <div className="space-y-5">
              {/* Légende & compteurs pays */}
              <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                <p className="text-sm font-semibold text-gray-700 mb-2">Légende & compteurs</p>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <img src={gfLogo} alt="Green Fins" className="h-6 w-auto" />
                    <span className="text-sm text-gray-800">
                      <strong>GF : {counts.gfTotal}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src={bfLogo} alt="Blue Flag" className="h-6 w-auto" />
                    <span className="text-sm text-gray-800">
                      <strong>BF : {counts.bfTotal}</strong>
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
                  Pourquoi aller dans un centre certifié ?
                </button>
                <button
                  onClick={() => scrollToId("what-gf")}
                  className="w-full text-center px-3 py-2 rounded-lg bg-gray-100 text-[#1113a2] border border-gray-300 hover:bg-gray-200 transition"
                >
                  C’est quoi Green Fins ?
                </button>
                <button
                  onClick={() => scrollToId("what-bf")}
                  className="w-full text-center px-3 py-2 rounded-lg bg-gray-100 text-[#1113a2] border border-gray-300 hover:bg-gray-200 transition"
                >
                  C’est quoi Blue Flag ?
                </button>
              </div>

              {/* Filtrer par label */}
              <div>
                <h3 className="text-[#1113a2] font-semibold mb-2">Filtrer par label</h3>
                <div className="space-y-2 text-sm">
                  {[
                    ["all", "Tous les centres"],
                    ["greenfins", "Green Fins uniquement"],
                    ["blueflag", "Blue Flag uniquement"],
                  ].map(([val, label]) => (
                    <label key={val} className="flex items-center gap-2">
                      <input
                        type="radio"
                        className="accent-[#1113a2]"
                        name="labelFilter"
                        value={val}
                        checked={labelFilter === val}
                        onChange={() => setLabelFilter(val)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Niveaux GF — exclusif + compteur visible + reset */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#1113a2] font-semibold">Niveaux Green Fins</h3>
                  <button
                    onClick={resetFilters}
                    className="text-xs px-2 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition"
                    title="Réinitialiser niveaux + labels"
                  >
                    Réinitialiser le filtre
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`text-xs px-2.5 py-1.5 rounded-full border transition ${
                      gfLevels.gold ? "bg-[#D4AF37] text-white border-[#D4AF37]" : "bg-white text-[#D4AF37] border-[#D4AF37]"
                    }`}
                    onClick={() => selectOnlyLevel("gold")}
                  >
                    Gold ({shown.gold ?? 0})
                  </button>
                  <button
                    className={`text-xs px-2.5 py-1.5 rounded-full border transition ${
                      gfLevels.silver ? "bg-[#C0C0C0] text-white border-[#C0C0C0]" : "bg-white text-[#C0C0C0] border-[#C0C0C0]"
                    }`}
                    onClick={() => selectOnlyLevel("silver")}
                  >
                    Silver ({shown.silver ?? 0})
                  </button>
                  <button
                    className={`text-xs px-2.5 py-1.5 rounded-full border transition ${
                      gfLevels.bronze ? "bg-[#CD7F32] text-white border-[#CD7F32]" : "bg-white text-[#CD7F32] border-[#CD7F32]"
                    }`}
                    onClick={() => selectOnlyLevel("bronze")}
                  >
                    Bronze ({shown.bronze ?? 0})
                  </button>
                  <button
                    className={`text-xs px-2.5 py-1.5 rounded-full border transition ${
                      gfLevels.inactive ? "bg-[#6b7280] text-white border-[#6b7280]" : "bg-white text-[#6b7280] border-[#6b7280]"
                    }`}
                    onClick={() => selectOnlyLevel("inactive")}
                  >
                    Inactive ({shown.inactive ?? 0})
                  </button>
                  <button
                    className={`text-xs px-2.5 py-1.5 rounded-full border transition ${
                      gfLevels.digital ? "bg-[#0ea5e9] text-white border-[#0ea5e9]" : "bg-white text-[#0ea5e9] border-[#0ea5e9]"
                    }`}
                    onClick={() => selectOnlyLevel("digital")}
                  >
                    Digital ({shown.digital ?? 0})
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  PS : ces niveaux filtrent uniquement les centres Green Fins.
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
              Pourquoi aller dans un centre certifié ?
            </h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              Choisir un opérateur certifié réduit l’impact environnemental de vos sorties
              et soutient des pratiques qui préservent les écosystèmes marins.
            </p>
            <div className="grid md:grid-cols-2 gap-5 text-gray-800">
              <ul className="list-disc pl-6 space-y-2">
                <li>Réduction des impacts (ancrage, déchets, perturbation des habitats).</li>
                <li>Briefings clairs sur les distances d’observation et les bons gestes.</li>
                <li>Suivi et amélioration continue des pratiques environnementales.</li>
                <li>Sites plus préservés, expérience plus riche.</li>
              </ul>
              <div className="bg-gray-100/60 border border-gray-200 rounded-xl p-4">
                <p className="font-medium text-gray-900 mb-2">En bref</p>
                <p className="text-sm text-gray-700">
                  Vous votez avec votre portefeuille pour des acteurs engagés, tout en maximisant
                  vos chances d’observer une vie marine riche et en bonne santé.
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
              <img src={gfLogo} alt="Logo Green Fins" className="h-12 w-auto object-contain" />
              <h2 className="text-2xl md:text-3xl font-bold text-[#1113a2]">C’est quoi Green Fins ?</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-gray-800">
              <div className="md:col-span-2">
                <p className="leading-relaxed mb-4">
                  Green Fins (Reef-World Foundation & PNUE) accompagne les opérateurs de
                  plongée/snorkeling vers des pratiques responsables : gestion des déchets,
                  ancrage, tailles de groupes, sensibilisation, etc.
                </p>
                <p className="leading-relaxed">
                  Les niveaux <strong>Gold / Silver / Bronze</strong> et <strong>Inactive / Digital</strong> reflètent
                  l’engagement et la conformité aux bonnes pratiques.
                </p>
              </div>
              <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-4">
                <p className="font-medium text-gray-900 mb-2">À retenir</p>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  <li>Référentiel international reconnu</li>
                  <li>Audit et accompagnement continus</li>
                  <li>Focalisé “mer & récifs”</li>
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
              <img src={bfLogo} alt="Logo Blue Flag" className="h-12 w-auto object-contain" />
              <h2 className="text-2xl md:text-3xl font-bold text-[#1113a2]">C’est quoi Blue Flag ?</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-gray-800">
              <div className="md:col-span-2">
                <p className="leading-relaxed mb-4">
                  Blue Flag (Pavillon Bleu) distingue les <strong>plages</strong>,{" "}
                  <strong>marinas</strong> et <strong>bateaux</strong> qui respectent des
                  critères exigeants : qualité de l’eau, gestion des déchets, sécurité,
                  information du public, éducation à l’environnement.
                </p>
                <p className="leading-relaxed">
                  Le label est renouvelé annuellement sur la base de contrôles réguliers.
                </p>
              </div>
              <div className="bg-stone-100/70 border border-stone-200 rounded-xl p-4">
                <p className="font-medium text-gray-900 mb-2">Points clés</p>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  <li>Qualité de l’eau mesurée</li>
                  <li>Gestion & sécurité sur site</li>
                  <li>Pédagogie & information au public</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
