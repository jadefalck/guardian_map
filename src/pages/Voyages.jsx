// src/pages/Voyages.jsx
import { usePageSeo } from "../seo/usePageSeo";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";

import videoEau from "../assets/videos/eau_titre.mp4";

// Images
import carteEspecesImg from "../assets/images/carte_especes.png";
import carteActiviteImg from "../assets/images/carte_activite.png";
import zonesProtegeesImg from "../assets/images/carte_zones.png";
import bannerCircuit from "../assets/images/bannière_circuit.jpg";
import guideCover from "../assets/images/Guide_voyage_couv.png";

// Excel destinations
import EXCEL_URL from "../data/BDD_centres_plongees.xlsx?url";

// JSON (mêmes sources que la carte globale)
import observationData from "../data/BDD_observation.json";
import speciesData from "../data/BDD_especes_marines.json";

/* ================= UI helpers (style Accueil) ================= */

function NavyStrong({ children }) {
  return <span className="font-semibold text-[#1113a2]">{children}</span>;
}

function CardShell({ children, className = "" }) {
  return (
    <div
      className={[
        "group relative overflow-hidden rounded-[3rem] border border-gray-200 bg-white",
        "shadow-sm hover:shadow-xl transition-all duration-300",
        "ring-0 hover:ring-4 hover:ring-[#1113a2]/10",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function ScreenCardLarge({ title, desc, buttonLabel, onClick, img }) {
  return (
    <CardShell className="hover:-translate-y-0.5">
      {img ? (
        <div className="w-full h-40 md:h-48 bg-gray-100 overflow-hidden">
          <img
            src={img}
            alt=""
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-full h-40 md:h-48 bg-gray-100" />
      )}

      <div className="p-7 md:p-8">
        <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight leading-snug">
          {title}
        </h3>

        <div className="text-sm md:text-base text-gray-700 mt-3 leading-relaxed">
          {desc}
        </div>

        <button
          type="button"
          onClick={onClick}
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#1113a2] px-6 py-3 text-white font-bold shadow-sm hover:bg-[#0e128c] hover:shadow-md transition"
        >
          {buttonLabel}
        </button>
      </div>
    </CardShell>
  );
}

/* ================= Utils ================= */

const normalize = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

/** essaie de trouver une valeur "pays" probable dans une ligne Excel */
function extractCountryFromRow(row) {
  if (!row || typeof row !== "object") return "";
  const keys = Object.keys(row);
  if (!keys.length) return "";

  const candidates = [
    "pays",
    "country",
    "nation",
    "pays/etat",
    "pays - country",
    "pays (country)",
    "country_name",
    "nom_pays",
    "pays / country",
  ];

  for (const k of keys) {
    const nk = normalize(k);
    if (candidates.includes(nk)) {
      const v = row[k];
      return v ? String(v).trim() : "";
    }
  }

  for (const k of keys) {
    const nk = normalize(k);
    if (nk.includes("pays") || nk.includes("country")) {
      const v = row[k];
      return v ? String(v).trim() : "";
    }
  }

  return "";
}

/* ================= Page ================= */

export default function Voyages() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  usePageSeo({
    title: "Exploration globale | Où voyages-tu ? | GuardianMap",
    description:
      "Carte mondiale pour explorer centres de plongée, zones maritimes protégées, centres d’observation et spots d’espèces marines. Recherche par pays et filtres éthiques.",
    canonical: "https://guardianmap.com/exploration",
    ogImage: "https://guardianmap.com/og/og-exploration.jpg",
  });


  // ✅ TA ROUTE VOULUE
  const MAP_ROUTE = "/exploration";

  const [where, setWhere] = useState("");
  const [countries, setCountries] = useState([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [hasError, setHasError] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const set = new Set();

        // Excel
        const res = await fetch(EXCEL_URL);
        if (!res.ok) throw new Error("Excel not found");
        const buf = await res.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

        rows.forEach((r) => {
          const c = extractCountryFromRow(r);
          if (c) set.add(c.trim());
        });

        // Observation
        (observationData || []).forEach((p) => {
          const c = String(p.country || p.pays || "").trim();
          if (c) set.add(c);
        });

        // Espèces
        (speciesData || []).forEach((p) => {
          const c = String(p.country || p.pays || "").trim();
          if (c) set.add(c);
        });

        const list = Array.from(set)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));

        setCountries(list);
        setHasError(false);
      } catch (e) {
        console.error(e);
        setHasError(true);
      }
    })();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) {
        setSuggestionsOpen(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const goToMap = (countryMaybe = "") => {
    const country = String(countryMaybe || where || "").trim();
    const qs = country ? `?country=${encodeURIComponent(country)}` : "";
    navigate(`${MAP_ROUTE}${qs}`);
  };

  const filteredSuggestions = useMemo(() => {
    const q = normalize(where);
    if (!q) return [];
    return countries.filter((c) => normalize(c).includes(q)).slice(0, 10);
  }, [where, countries]);

  const handleSelectCountry = (country) => {
    setWhere(country);
    setSuggestionsOpen(false);
    setHighlightIndex(-1);
    goToMap(country);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestionsOpen && filteredSuggestions.length > 0 && highlightIndex >= 0) {
        handleSelectCountry(filteredSuggestions[highlightIndex]);
        return;
      }
      goToMap(where);
    }

    if (!suggestionsOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => {
        const next = prev + 1;
        return next >= filteredSuggestions.length ? 0 : next;
      });
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => {
        const next = prev - 1;
        return next < 0 ? filteredSuggestions.length - 1 : next;
      });
    }

    if (e.key === "Escape") {
      setSuggestionsOpen(false);
      setHighlightIndex(-1);
    }
  };


  const screenCards = useMemo(
    () => [
      {
        key: "marine-animals",
        title: "Carte des animaux marins",
        desc: (
          <>
            Repérez où observer chaque espèce, les <NavyStrong>meilleures saisons</NavyStrong> et les{" "}
            <NavyStrong>règles d’observation éthique</NavyStrong>. Identifiez aussi les zones plus sensibles à éviter.
          </>
        ),
        buttonLabel: "Voir la carte",
        to: "/especes",
        img: carteEspecesImg,
      },
      {
        key: "certified-diving",
        title: "Carte des plongées certifiées",
        desc: (
          <>
            Trouvez des <NavyStrong>centres certifiés</NavyStrong>, comparez les <NavyStrong>labels</NavyStrong> et
            découvrez des <NavyStrong>bonnes pratiques</NavyStrong> pour plonger plus responsable.
          </>
        ),
        buttonLabel: "Voir la carte",
        to: "/plongee",
        img: carteActiviteImg,
      },
      {
        key: "protected-areas",
        title: "Carte des zones maritimes protégées",
        desc: (
          <>
            Visualisez les <NavyStrong>aires marines protégées</NavyStrong>, comprenez les{" "}
            <NavyStrong>règles locales</NavyStrong> et repérez des spots plus <NavyStrong>durables</NavyStrong> pour
            voyager en minimisant l’impact.
          </>
        ),
        buttonLabel: "Voir la carte",
        to: "/zones",
        img: zonesProtegeesImg,
      },
    ],
    []
  );

  return (
    <div className="w-full bg-white">
      {/* Bandeau */}
      <section className="bg-gray-100 py-8 px-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-sm md:text-base font-semibold text-gray-900">
              {t("voyages.news.label")} <span className="text-[#1113a2]">{t("voyages.news.text")}</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">{t("voyages.news.hint")}</p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/guide-voyage")}
            className="inline-flex items-center justify-center rounded-xl border border-[#1113a2]/30 bg-white text-[#1113a2] font-bold px-5 py-2 shadow-sm hover:bg-[#1113a2]/10 transition"
          >
            Voir le guide personnalisé
          </button>
        </div>
      </section>

      {/* Vidéo + recherche + bouton */}
      <section className="relative w-full h-[300px] md:h-[360px] overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute w-full h-full object-cover top-0 left-0">
          <source src={videoEau} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white" />

        <div className="absolute inset-0 flex items-center justify-center px-4 z-10">
          <div className="w-full max-w-5xl">
            <div className="bg-white/90 backdrop-blur-md rounded-[2.25rem] shadow-2xl border border-white/60 p-5 md:p-7">
              <h2 className="text-xl md:text-3xl font-black text-[#1113a2] text-center mb-5 uppercase tracking-tight">
                {t("voyages.heroTitle")}
              </h2>

              <div ref={wrapperRef} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
                <div className="relative">
                  <label className="block text-base md:text-lg font-extrabold text-gray-900 mb-2">
                    {t("voyages.search.where.label")}
                  </label>

                  <input
                    value={where}
                    onChange={(e) => {
                      setWhere(e.target.value);
                      setSuggestionsOpen(true);
                      setHighlightIndex(-1);
                    }}
                    onFocus={() => {
                      if (where.trim()) setSuggestionsOpen(true);
                    }}
                    onKeyDown={handleInputKeyDown}
                    type="search"
                    placeholder={t("voyages.search.where.placeholder")}
                    className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1113a2]/30"
                  />

                  {suggestionsOpen && filteredSuggestions.length > 0 && (
                    <div className="absolute z-20 mt-2 w-full rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                      <ul className="max-h-64 overflow-auto py-1">
                        {filteredSuggestions.map((c, idx) => {
                          const active = idx === highlightIndex;
                          return (
                            <li key={c}>
                              <button
                                type="button"
                                onClick={() => handleSelectCountry(c)}
                                onMouseEnter={() => setHighlightIndex(idx)}
                                className={[
                                  "w-full text-left px-4 py-3 text-sm",
                                  "transition",
                                  active
                                    ? "bg-[#1113a2]/10 text-[#1113a2] font-semibold"
                                    : "hover:bg-gray-50",
                                ].join(" ")}
                              >
                                {c}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {hasError && (
                    <p className="mt-2 text-xs text-orange-600">
                      Impossible de charger la liste des pays pour l’instant.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => goToMap(where)}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#1113a2] px-6 py-3 text-white font-bold shadow-sm hover:bg-[#0e128c] hover:shadow-md transition md:w-auto w-full"
                >
                  Voir la carte du monde
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 cartes */}
      <section className="w-full bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {screenCards.map((c) => (
              <ScreenCardLarge
                key={c.key}
                title={c.title}
                desc={c.desc}
                img={c.img}
                buttonLabel={c.buttonLabel}
                onClick={() => navigate(c.to)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bloc Guide */}
      <section className="w-full bg-white py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <CardShell className="rounded-[3rem]">
            <div className="relative h-[120px] md:h-[150px] overflow-hidden">
              <img src={bannerCircuit} alt="Bannière guide" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/35" />

              <div className="relative z-10 h-full flex items-center justify-center px-4">
                <div className="bg-white/85 backdrop-blur-sm rounded-[2rem] border border-white/60 shadow-md px-6 py-3 md:px-8 md:py-4 text-center">
                  <h2 className="text-xl md:text-3xl font-black text-black uppercase tracking-tight">
                    Guide de voyage personnalisé
                  </h2>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-200 p-6 md:p-9">
              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 md:gap-10 items-center">
                <div className="flex justify-center md:justify-start">
                  <img src={guideCover} alt="Guide" className="w-full max-w-[190px] rounded-2xl shadow-md" loading="lazy" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg md:text-2xl font-black text-gray-900 uppercase tracking-tight">
                    Un guide clair, fait pour ton style de voyage
                  </h3>

                  <p className="text-3xl font-extrabold text-[#1a3936]">19€</p>

                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    On te prépare un guide sur-mesure : itinéraire, spots, saisons, déplacements, conseils concrets,
                    et bien d&apos;autres.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/guide-voyage")}
                    className="inline-flex items-center justify-center rounded-2xl bg-[#1113a2] px-7 py-3 text-white font-bold shadow-sm hover:bg-[#0e128c] hover:shadow-md transition"
                  >
                    Je suis intéressé(e)
                  </button>

                  <p className="text-xs text-gray-500">Tu arrives sur un questionnaire simple à envoyer. On te recontacte ensuite.</p>
                </div>
              </div>
            </div>
          </CardShell>
        </div>
      </section>
    </div>
  );
}

