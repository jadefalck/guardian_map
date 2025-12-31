// src/pages/Especes.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTranslation } from "react-i18next";

import speciesData from "../../data/BDD_especes_marines.json";
import oceanImage from "../../assets/images/bannière_blog2.jpg";

// Photos espèces
import imgBaleineBleue from "../../assets/images/especes_baleine_bleue.webp";
import imgBaleineABosses from "../../assets/images/especes_baleine_a_bosses.avif";
import imgDauphin from "../../assets/images/especes_dauphin.jpg";
import imgRaieManta from "../../assets/images/especes_raie_manta.jpg";
import imgRequins from "../../assets/images/especes_requins.jpg";
import imgRequinBaleine from "../../assets/images/especes_requin_baleine.jpg";
import imgTortueMarine from "../../assets/images/especes_tortue_marine.jpg";

// Images guide bon voyageur
import imgAFaire from "../../assets/images/especes_a_faire.png";
import imgAEviter from "../../assets/images/especes_a_eviter.png";

const KEY = "gsmNeDjg2V0pS8etxXtI";
const STYLE = `https://api.maptiler.com/maps/streets/style.json?key=${KEY}`;

const pinSvg = (color) => `
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill="${color}" d="M12 2C8.686 2 6 4.686 6 8c0 3.96 3.318 8.293 4.87 10.147a1 1 0 0 0 1.26 0C14.682 16.293 18 11.96 18 8c0-3.314-2.686-6-6-6z"/>
  <circle cx="12" cy="8" r="3" fill="white"/>
</svg>
`;

const normalize = (s) => (s ?? "").toString().trim();

const formatLabel = (str = "") =>
  normalize(str)
    .toLowerCase()
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");

const uniqSorted = (arr) => Array.from(new Set(arr.filter(Boolean))).sort();

const normKey = (s) =>
  normalize(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

function ethicsMeta(ethiqueRaw) {
  const e = normalize(ethiqueRaw);
  if (e === "✗" || e.toLowerCase() === "x") return { key: "bad", color: "#dc2626", label: "À éviter" };
  if (e === "—" || e === "-" || e === "–") return { key: "warn", color: "#f59e0b", label: "À surveiller" };
  return { key: "ok", color: "#1113a2", label: "Info / OK" };
}

function getSpeciesFacts(speciesName) {
  const s = normKey(speciesName);

  const rich = {
    "requin baleine": [
      "C’est le plus grand poisson du monde, et pourtant il se nourrit surtout de plancton.",
      "Une rencontre dépend de lui : jamais garanti.",
      "Distance + calme : ce sont les meilleurs alliés d’une observation réussie.",
    ],
    "tortue marine": [
      "Elle remonte respirer : la gêner, c’est lui faire perdre de l’énergie.",
      "Les zones de repos et d’alimentation sont sensibles : on garde distance et douceur.",
      "Le meilleur souvenir : une observation sans interaction forcée.",
    ],
    "raie manta": [
      "Les mantas fréquentent des stations de nettoyage : ces spots sont sensibles au dérangement.",
      "Un animal qui s’éloigne n’est pas “timide” : il évite un stress.",
      "Répéter les interactions peut pousser l’animal à abandonner un site.",
    ],
    dauphins: [
      "Les poursuivre perturbe leurs phases de repos : pression invisible, mais réelle.",
      "Un “sourire” n’est pas un consentement : c’est leur morphologie.",
      "On observe : on ne cherche pas à obtenir une interaction.",
    ],
    "baleine bleue": [
      "C’est le plus grand animal connu, mais elle reste vulnérable au dérangement.",
      "En mer, la distance est une protection pour elle (et pour toi).",
      "Privilégie les opérateurs qui respectent vitesse, trajectoire et distance.",
    ],
    "baleine a bosse": [
      "Elle peut être curieuse… mais ça ne veut pas dire qu’il faut s’approcher.",
      "Les mises à l’eau “pour la photo” sont souvent une mauvaise idée.",
      "Un bon opérateur sait renoncer plutôt que de forcer la rencontre.",
    ],
    requins: [
      "Les requins ne sont pas des attractions : on ne les nourrit pas et on ne les touche pas.",
      "Un encadrement sérieux est non négociable.",
      "Distance, calme, pas de flash : la règle d’or.",
    ],
  };

  return (
    rich[s] || [
      "Les observations varient selon la saison, la météo et le hasard.",
      "Distance, calme, pas d’interaction forcée : c’est la base.",
      "Choisir un opérateur responsable vaut mieux qu’une photo.",
    ]
  );
}

function getSpeciesImage(speciesName) {
  const s = normKey(speciesName);

  if (s.includes("requin baleine")) return imgRequinBaleine;
  if (s.includes("tortue")) return imgTortueMarine;
  if (s.includes("raie") && s.includes("manta")) return imgRaieManta;
  if (s.includes("dauphin")) return imgDauphin;
  if (s.includes("baleine") && s.includes("bleue")) return imgBaleineBleue;
  if (s.includes("baleine") && (s.includes("bosse") || s.includes("a bosse"))) return imgBaleineABosses;
  if (s.includes("requin")) return imgRequins;

  return imgRequins;
}

/* ✅ CardShell — SANS effets de mouvement */
function CardShell({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-[3rem] border border-gray-200 bg-white shadow-sm overflow-hidden",
        // ❌ plus de hover translate / parallax / will-change
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

/* ✅ Petit helper pour mettre des mots en gras + bleu dans “Le saviez-vous” */
function highlightFacts(text, keywords = []) {
  if (!text) return text;
  if (!Array.isArray(keywords) || keywords.length === 0) return text;

  const escaped = keywords
    .filter(Boolean)
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (escaped.length === 0) return text;

  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(re);

  return parts.map((part, i) => {
    const isHit = keywords.some((k) => k && part.toLowerCase() === k.toLowerCase());
    return isHit ? (
      <span key={`${part}-${i}`} className="font-bold text-[#1113a2]">
        {part}
      </span>
    ) : (
      <React.Fragment key={`${part}-${i}`}>{part}</React.Fragment>
    );
  });
}

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

  const markersRef = useRef([]);

  // --- data propre ---
  const cleanData = useMemo(() => (speciesData || []).filter((d) => d.lat != null && d.lon != null), []);

  // --- listes dynamiques ---
  const continents = useMemo(() => uniqSorted(cleanData.map((d) => normalize(d.continent))), [cleanData]);

  const countries = useMemo(() => {
    let filtered = cleanData;
    if (selectedContinent !== "all") filtered = filtered.filter((d) => normalize(d.continent) === selectedContinent);
    return uniqSorted(filtered.map((d) => normalize(d.country)));
  }, [cleanData, selectedContinent]);

  const speciesList = useMemo(() => {
    let filtered = cleanData;
    if (selectedContinent !== "all") filtered = filtered.filter((d) => normalize(d.continent) === selectedContinent);
    if (selectedCountry !== "all") filtered = filtered.filter((d) => normalize(d.country) === selectedCountry);
    return uniqSorted(filtered.map((d) => normalize(d.species)));
  }, [cleanData, selectedContinent, selectedCountry]);

  // --- filtrage ---
  const filteredData = useMemo(() => {
    return cleanData.filter((item) => {
      if (selectedContinent !== "all" && normalize(item.continent) !== selectedContinent) return false;
      if (selectedCountry !== "all" && normalize(item.country) !== selectedCountry) return false;
      if (selectedSpecies !== "all" && normalize(item.species) !== selectedSpecies) return false;

      if (selectedMonth !== "all") {
        const m = Number(selectedMonth);
        const months = Array.isArray(item.months) ? item.months : [];
        if (!months.includes(m)) return false;
      }
      return true;
    });
  }, [cleanData, selectedContinent, selectedCountry, selectedSpecies, selectedMonth]);

  // --- index recherche ---
  const searchIndex = useMemo(() => {
    const items = [];
    cleanData.forEach((d) => {
      if (normalize(d.site)) items.push({ type: "site", label: d.site, data: d });
    });
    uniqSorted(cleanData.map((d) => normalize(d.country))).forEach((country) =>
      items.push({ type: "country", label: country })
    );
    continents.forEach((cont) => items.push({ type: "continent", label: cont }));
    uniqSorted(cleanData.map((d) => normalize(d.species))).forEach((sp) =>
      items.push({ type: "species", label: sp })
    );

    const seen = new Set();
    return items.filter((it) => {
      const k = `${it.type}__${it.label}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [cleanData, continents]);

  const searchSuggestions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return searchIndex.filter((item) => (item.label || "").toLowerCase().includes(term)).slice(0, 10);
  }, [searchTerm, searchIndex]);

  // --- init carte ---
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
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapObj.current = null;
    };
  }, []);

  // --- markers ---
  useEffect(() => {
    const map = mapObj.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (!filteredData.length) return;

    const bounds = new maplibregl.LngLatBounds();

    filteredData.forEach((p) => {
      const ethics = ethicsMeta(p.ethique);

      const el = document.createElement("div");
      el.innerHTML = pinSvg(ethics.color);
      el.style.width = "28px";
      el.style.height = "28px";
      el.style.cursor = "pointer";
      el.style.transform = "translateY(-4px)";

      const site = normalize(p.site);
      const country = normalize(p.country);
      const continent = normalize(p.continent);
      const species = normalize(p.species);
      const frequence = normalize(p.frequence);
      const explication = normalize(p.explication);

      const titleColor = ethics.key === "bad" ? "#b91c1c" : ethics.key === "warn" ? "#b45309" : "#111827";

      const popupHtml =
        ethics.key === "bad" || ethics.key === "warn"
          ? `<div style="font-size:12px;line-height:1.25">
              <div style="font-weight:800;color:${titleColor}">${ethics.label}</div>
              <div style="font-weight:800;margin-top:4px;">${site || "Spot"}</div>
              <div style="margin-top:2px;color:#111827;">
                ${country ? country : ""}${country && continent ? " – " : ""}${continent ? continent : ""}
              </div>
              ${
                explication
                  ? `<div style="margin-top:8px;color:#111827;">${explication}</div>`
                  : `<div style="margin-top:8px;color:#6b7280;">Explication non renseignée.</div>`
              }
            </div>`
          : `<div style="font-size:12px;line-height:1.25">
              <div style="font-weight:800;">${site || "Spot"}</div>
              <div style="margin-top:2px;color:#111827;">
                ${country ? country : ""}${country && continent ? " – " : ""}${continent ? continent : ""}
              </div>
              ${species ? `<div style="margin-top:6px;">${species}</div>` : ""}
              ${frequence ? `<div style="margin-top:6px;color:#374151;"><b>Fréquence :</b> ${frequence}</div>` : ""}
              ${explication ? `<div style="margin-top:8px;color:#111827;">${explication}</div>` : ""}
            </div>`;

      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([p.lon, p.lat])
        .setPopup(new maplibregl.Popup({ offset: 8 }).setHTML(popupHtml))
        .addTo(map);

      markersRef.current.push(marker);
      bounds.extend([p.lon, p.lat]);
    });

    const fit = () => {
      if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 60, maxZoom: 5, duration: 0 }); // ✅ pas d'animation
    };

    map.loaded() ? fit() : map.once("idle", fit);
  }, [filteredData]);

  // --- clic suggestion ---
  const handleSuggestionClick = (item) => {
    const map = mapObj.current;
    setSearchTerm(item.label);
    setShowSuggestions(false);

    const resetMonth = () => setSelectedMonth("all");

    if (item.type === "site" && item.data) {
      const p = item.data;
      setSelectedContinent(normalize(p.continent) || "all");
      setSelectedCountry(normalize(p.country) || "all");
      setSelectedSpecies(normalize(p.species) || "all");
      resetMonth();
      if (map && p.lon != null && p.lat != null) map.flyTo({ center: [p.lon, p.lat], zoom: 6, duration: 0 }); // ✅ pas d'animation
      return;
    }

    if (item.type === "country") {
      setSelectedContinent("all");
      setSelectedCountry(item.label);
      setSelectedSpecies("all");
      resetMonth();
      return;
    }

    if (item.type === "continent") {
      setSelectedContinent(item.label);
      setSelectedCountry("all");
      setSelectedSpecies("all");
      resetMonth();
      return;
    }

    if (item.type === "species") {
      setSelectedContinent("all");
      setSelectedCountry("all");
      setSelectedSpecies(item.label);
      resetMonth();
    }
  };

  // =======================
  //  FICHE ESPÈCE
  // =======================
  const speciesSlides = useMemo(() => {
    const allSpecies = uniqSorted(cleanData.map((d) => normalize(d.species)));

    return allSpecies.map((sp) => {
      const rows = cleanData.filter((d) => normalize(d.species) === sp);
      const countries2 = uniqSorted(rows.map((r) => normalize(r.country)));
      const continents2 = uniqSorted(rows.map((r) => normalize(r.continent)));

      return {
        key: sp || "unknown",
        title: sp || "Espèce",
        image: getSpeciesImage(sp),
        facts: getSpeciesFacts(sp),
        meta: {
          spotsCount: rows.length,
          countriesCount: countries2.length,
          continentsCount: continents2.length,
        },
      };
    });
  }, [cleanData]);

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (activeSlide > speciesSlides.length - 1) setActiveSlide(0);
  }, [speciesSlides.length]); // eslint-disable-line

  // ✅ mots à mettre en gras/bleu (tu peux en ajouter facilement)
  const blueKeywords = useMemo(
    () => [
      "plancton",
      "Distance",
      "calme",
      "stations de nettoyage",
      "stress",
      "opérateurs",
      "vitesse",
      "trajectoire",
      "distance",
      "nourrit",
      "flash",
      "interaction",
      "observation",
    ],
    []
  );

  return (
    <div className="w-full">
      {/* TITRE + SOUS-TITRE */}
      <section className="py-12 px-6 text-center bg-gray-200">
        <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#1113a2]">
          {t("especes.kicker", { defaultValue: "Espèces marines" })}
        </div>

        <h1 className="mt-3 text-xl md:text-5xl font-extrabold uppercase tracking-tight text-gray-900">
          {t("especes.title")}
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-gray-700">
          {t("especes.subtitle")}
        </p>
      </section>

      {/* FILTRES */}
      <section className="w-full relative overflow-hidden">
        <img src={oceanImage} alt="Fond océan" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 w-full py-10 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/95 backdrop-blur rounded-3xl shadow-xl border border-white/40 p-5 md:p-7 space-y-5">
              {/* Recherche */}
              <div className="relative">
                <div className="text-center">
                  <label className="text-base md:text-lg font-semibold text-gray-900">
                    Rechercher un site, un pays, un continent ou une espèce
                  </label>
                </div>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Ex : Maldives, Asie, Requin-baleine…"
                  className="mt-3 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          <span className="font-semibold text-gray-800">{formatLabel(s.label)}</span>
                          <span className="text-[10px] uppercase tracking-wide text-gray-400">
                            {s.type === "site"
                              ? "SITE"
                              : s.type === "country"
                              ? "PAYS"
                              : s.type === "continent"
                              ? "CONTINENT"
                              : "ESPÈCE"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filtres */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-900">Continent</label>
                  <select
                    value={selectedContinent}
                    onChange={(e) => {
                      setSelectedContinent(e.target.value);
                      setSelectedCountry("all");
                      setSelectedSpecies("all");
                    }}
                    className="mt-2 w-full border px-3 py-2 rounded-lg text-sm bg-white"
                  >
                    <option value="all">Tous les continents</option>
                    {continents.map((c) => (
                      <option key={c} value={c}>
                        {formatLabel(c)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-900">Pays</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setSelectedSpecies("all");
                    }}
                    className="mt-2 w-full border px-3 py-2 rounded-lg text-sm bg-white"
                  >
                    <option value="all">Tous les pays</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {formatLabel(c)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-900">Espèce</label>
                  <select
                    value={selectedSpecies}
                    onChange={(e) => setSelectedSpecies(e.target.value)}
                    className="mt-2 w-full border px-3 py-2 rounded-lg text-sm bg-white"
                  >
                    <option value="all">Toutes les espèces</option>
                    {speciesList.map((s) => (
                      <option key={s} value={s}>
                        {formatLabel(s)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-900">Mois</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="mt-2 w-full border px-3 py-2 rounded-lg text-sm bg-white"
                  >
                    <option value="all">Tous les mois</option>
                    {Array.from({ length: 12 }, (_, idx) => idx + 1).map((m) => (
                      <option key={m} value={m}>
                        {t(`months.${m}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Légende */}
              <div className="pt-1 text-xs text-gray-700 flex flex-wrap items-center justify-center gap-4">
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#1113a2]" />
                  <span>Bleu = info / spot ok</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                  <span>Orange = à surveiller (explication)</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#dc2626]" />
                  <span>Rouge = à éviter (explication)</span>
                </span>
              </div>
            </div>

            {/* INFORMATIONS — sans hover mouvement */}
            <div className="mt-4 bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-2">
                <div className="mt-[2px] w-7 h-7 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-800">
                  i
                </div>
                <div className="w-full">
                  <div className="font-bold text-gray-900">Informations</div>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-2">
                    {[
                      "Les couleurs et les saisons sont des indices de présence, pas une promesse de rencontre.",
                      "Choisir un mois “favorable” augmente tes chances, mais la nature reste imprévisible.",
                      "Les animaux sont sauvages, il ne faut pas provoquer leur rencontre. Nous sommes uniquement des observateurs dans leur monde.",
                      "Si un spot est rouge, c’est qu’il ne faut pas y aller : mauvaises pratiques. Choisis la protection plutôt qu’une photo.",
                    ].map((txt, i) => (
                      <div
                        key={`info-${i}`}
                        className="rounded-xl bg-white/80 border border-gray-200 p-3 text-xs text-gray-700"
                      >
                        {txt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CARTE */}
      <section className="w-full bg-white py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-2 md:p-3">
            <div ref={mapRef} className="w-full h-[420px] md:h-[520px] rounded-xl overflow-hidden bg-white" />
          </div>
        </div>
      </section>

      {/* FICHE ESPÈCE */}
      <section className="w-full bg-slate-200 py-14">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#1113a2]">
                Fiche espèce
              </div>

              <h2 className="mt-2 text-xl md:text-3xl font-black uppercase tracking-tight text-gray-900">
                Le saviez-vous ?
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSlide((s) => (s === 0 ? speciesSlides.length - 1 : s - 1))}
                className="h-11 w-11 rounded-2xl bg-white/80 border border-white/60 shadow-sm hover:bg-white transition text-sm font-black"
                aria-label="Précédent"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => setActiveSlide((s) => (s === speciesSlides.length - 1 ? 0 : s + 1))}
                className="h-11 w-11 rounded-2xl bg-white/80 border border-white/60 shadow-sm hover:bg-white transition text-sm font-black"
                aria-label="Suivant"
              >
                →
              </button>
            </div>
          </div>

          {/* ✅ carrousel : on garde, mais sans animation (pas de transition-transform) */}
          <div className="mt-8 overflow-hidden">
            <div className="flex" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
              {speciesSlides.map((slide, idx) => (
                <div key={`${slide.key}-${idx}`} className="min-w-full">
                  <CardShell className="bg-white shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="p-6 md:p-8">
                        {/* ❌ plus de hover scale */}
                        <div className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden border border-gray-200 bg-gray-100">
                          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-3">
                          {[
                            { label: "Spots", val: slide.meta.spotsCount, border: "border-blue-100", bg: "bg-blue-50", text1: "text-blue-700", text2: "text-blue-900" },
                            { label: "Pays", val: slide.meta.countriesCount, border: "border-emerald-100", bg: "bg-emerald-50", text1: "text-emerald-700", text2: "text-emerald-900" },
                            { label: "Continents", val: slide.meta.continentsCount, border: "border-violet-100", bg: "bg-violet-50", text1: "text-violet-700", text2: "text-violet-900" },
                          ].map((k, i) => (
                            <div
                              key={`meta-${i}`}
                              className={`rounded-[2rem] border ${k.border} ${k.bg} p-4 text-xs`}
                            >
                              <div className={`${k.text1} font-black uppercase tracking-widest`}>{k.label}</div>
                              <div className={`${k.text2} font-black text-2xl leading-tight`}>{k.val}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-6 md:p-8 flex flex-col justify-center">
                        <div className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-500">
                          Le saviez-vous ?
                        </div>

                        <div className="mt-2 text-xl md:text-3xl font-black uppercase tracking-tight text-gray-900">
                          {slide.title}
                        </div>

                        {/* ✅ mots en gras + bleu dans les facts */}
                        <ul className="mt-5 space-y-3 text-sm md:text-base text-gray-800 list-disc pl-5">
                          {slide.facts.map((f, i) => (
                            <li key={`${slide.key}-fact-${i}`}>
                              {highlightFacts(f, blueKeywords)}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-6 flex items-center gap-2 flex-wrap">
                          {speciesSlides.map((_, dotIdx) => (
                            <button
                              key={`dot-${dotIdx}`}
                              type="button"
                              onClick={() => setActiveSlide(dotIdx)}
                              className={`h-2.5 rounded-full ${
                                dotIdx === activeSlide ? "w-10 bg-gray-900" : "w-2.5 bg-gray-400 hover:bg-gray-500"
                              }`}
                              aria-label={`Aller au slide ${dotIdx + 1}`}
                            />
                          ))}
                        </div>

                        <div className="mt-4 text-xs text-gray-600">
                          Astuce : clique sur un pin sur la carte pour voir le détail du spot.
                        </div>
                      </div>
                    </div>
                  </CardShell>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* POURQUOI + RED FLAGS + GUIDE */}
      <section className="w-full bg-gray-100 py-14 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Pourquoi */}
          <div className="space-y-5">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-gray-900">
                Pourquoi il faut faire attention
              </h2>
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-500">
                Bonnes pratiques
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "⚠️ 1. Les animaux sauvages ne sont pas des attractions",
                  items: ["Ils n’ont pas choisi d’être observés", "Le stress n’est pas toujours visible", "Un calme apparent peut cacher une détresse"],
                },
                {
                  title: "⚠️ 2. Le tourisme peut modifier leur comportement",
                  items: ["Approche répétée → fuite ou agressivité", "Nourrissage → dépendance", "Présence humaine → zones de reproduction perturbées"],
                },
                {
                  title: "⚠️ 3. Certaines pratiques sont normalisées… mais nocives",
                  items: ["Trop de bateaux autour d’un animal", "Flashs photo sous l’eau", "Contact / toucher", "Forcer l’interaction pour la photo"],
                  note: "Ce n’est pas toujours illégal, mais ça reste problématique.",
                },
                {
                  title: "⚠️ 4. L’impact est cumulatif",
                  items: [],
                  quote: "Ce n’est pas un nageur, c’est des centaines de nageurs, chaque jour, toute l’année.",
                },
              ].map((b, idx) => (
                <CardShell key={`why-${idx}`} className="p-5 md:p-6 border border-yellow-300/70">
                  <div className="text-sm md:text-[15px] font-semibold text-gray-900">{b.title}</div>

                  {b.note ? <div className="mt-3 text-xs text-gray-700 italic">{b.note}</div> : null}

                  {b.quote ? (
                    <div className="mt-4 rounded-[1.75rem] bg-gray-50 border border-gray-200 p-4 text-sm font-semibold text-gray-900">
                      {b.quote}
                    </div>
                  ) : (
                    <ul className="mt-4 text-sm text-gray-800 space-y-2 list-disc pl-5">
                      {b.items.map((it, i) => (
                        <li key={`why-${idx}-it-${i}`}>{it}</li>
                      ))}
                    </ul>
                  )}
                </CardShell>
              ))}
            </div>
          </div>

          {/* Red flags */}
          <CardShell className="p-6 md:p-8 border border-red-200">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-gray-900">
                Le “Red Flag” des opérateurs
              </h3>
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-red-600">
                Checklist
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-3">
              Une checklist rapide pour reconnaître un mauvais prestataire.
            </p>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
              {["Trop de monde sur le bateau", "Pas de briefing sécurité / comportement", "“Garantie à 100% de toucher l’animal”"].map((txt, i) => (
                <div
                  key={`rf-${i}`}
                  className="rounded-[2rem] border border-red-100 bg-red-50 p-4 text-sm text-gray-900 shadow-sm"
                >
                  <span className="font-black text-red-600">✕</span> {txt}
                </div>
              ))}
            </div>
          </CardShell>

          {/* Guide bon voyageur */}
          <div className="space-y-4">
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-gray-900">
              Le guide d’un bon voyageur
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CardShell className="p-0">
                <img src={imgAFaire} alt="À faire" className="w-full h-auto object-cover" loading="lazy" />
              </CardShell>
              <CardShell className="p-0">
                <img src={imgAEviter} alt="À éviter" className="w-full h-auto object-cover" loading="lazy" />
              </CardShell>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
