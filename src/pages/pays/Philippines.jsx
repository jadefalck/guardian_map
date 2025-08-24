// src/pages/Philippines.jsx
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import CarteAvecDonnees from "../../components/CarteAvecDonnees";
import oceanImage from "../../assets/images/ocean.jpg";
import data from "../../data/Philippines_BDD_GF.json";

// ✅ images pour la section "Pourquoi GreenFins ?"
import imgTourisme from "../../assets/images/tourisme_durable.jpg";
import imgEcosystemes from "../../assets/images/protection_ecosystemes_marins.jpg";
import imgEncadree from "../../assets/images/plongee_encadree_responsable.jpg";

// ---- charge l'Excel, filtre "philippines" et REGROUPE par poisson ----
async function loadGroupedPhilippinesSpecies() {
  const XLSX = await import("xlsx");
  const url = new URL("../../data/BDD_poissons.xlsx", import.meta.url);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Impossible de charger BDD_poissons.xlsx");
  const buf = await res.arrayBuffer();

  const wb = XLSX.read(buf, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

  const phil = rows.filter(
    (r) => String(r.pays || "").toLowerCase().trim() === "philippines"
  );

  const byAnimal = new Map();
  phil.forEach((r) => {
    const rawName = String(r.animal || "").trim();
    if (!rawName) return;

    const key = rawName.toLowerCase();
    const entry = byAnimal.get(key) || {
      name: rawName,
      regionsSet: new Set(),
      photoBase: "",
      description: "",
    };

    String(r.regions || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((reg) => entry.regionsSet.add(reg));

    const np = String(r.nom_photo || "").trim();
    if (!entry.photoBase && np) entry.photoBase = np;

    const desc = String(r.description || "").trim();
    if (desc.length > entry.description.length) entry.description = desc;

    byAnimal.set(key, entry);
  });

  return Array.from(byAnimal.values())
    .map((e, i) => ({
      id: i + 1,
      name: e.name,
      regions: Array.from(e.regionsSet),
      photoBase: e.photoBase,
      description: e.description,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

// ---- mappe toutes les images du dossier type_poisson ----
const imageModules = import.meta.glob(
  "../../assets/images/type_poisson/*.{jpg,jpeg,png,webp}",
  { eager: true }
);
function buildImageMap() {
  const map = new Map();
  Object.entries(imageModules).forEach(([path, mod]) => {
    const file = path.split("/").pop();
    const base = file.replace(/\.[^.]+$/, "");
    map.set(base.toLowerCase(), mod.default);
  });
  return map;
}

/** 🏷️ Mappe dynamique des images de labels (GF_Gold.png, etc.) */
const labelImageModules = import.meta.glob(
  "../../assets/images/labels_greenfins/*.{png,jpg,jpeg,webp}",
  { eager: true }
);
function buildLabelImageMap() {
  const m = new Map();
  Object.entries(labelImageModules).forEach(([path, mod]) => {
    const file = path.split("/").pop() || "";
    const base = file.replace(/\.[^.]+$/, "").toLowerCase(); // ex: gf_gold
    m.set(base, mod.default);
  });
  return m;
}
const labelImgs = buildLabelImageMap();
const imgGold = labelImgs.get("gf_gold");
const imgSilver = labelImgs.get("gf_silver");
const imgBronze = labelImgs.get("gf_bronze");
const imgInactive = labelImgs.get("gf_inactive"); // optionnel

/** 🔎 Révélation progressive au scroll — rejouable & zoom optionnel */
function Reveal({
  children,
  delay = 0,
  className = "",
  replay = false,           // rejoue quand on remonte/redescend
  zoomOnVisible = false,    // ajoute un léger zoom quand visible
  y = 12,
  scaleFrom = 0.98,
  scaleTo = 1.01,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (replay) {
          setVisible(entry.isIntersecting);
        } else if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(entry.target); // ne rejoue pas si replay=false
        }
      },
      { threshold: 0.12 }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, [replay]);

  const transformHidden = zoomOnVisible
    ? `translateY(${y}px) scale(${scaleFrom})`
    : `translateY(${y}px)`;
  const transformVisible = zoomOnVisible
    ? `translateY(0) scale(${scaleTo})`
    : `translateY(0)`;

  const style = {
    transition: "opacity 600ms ease, transform 600ms ease",
    transitionDelay: `${delay}ms`,
    opacity: visible ? 1 : 0,
    transform: visible ? transformVisible : transformHidden,
    willChange: "opacity, transform",
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}

export default function Philippines() {
  // -- Carte + filtre région --
  const [regionFilter, setRegionFilter] = useState("");
  const uniqueRegions = Array.from(new Set(data.map((d) => d.region))).sort();

  // -- Espèces groupées --
  const [species, setSpecies] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [selected, setSelected] = useState(null);
  const imgMap = useMemo(() => buildImageMap(), []);

  // 🔦 Highlight temporaire d’un bloc (pourquoi / niveaux)
  const [highlightId, setHighlightId] = useState(null);
  const scrollAndHighlight = useCallback((toId) => {
    const el = document.getElementById(toId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightId(toId);
    setTimeout(() => setHighlightId((cur) => (cur === toId ? null : cur)), 1500);
  }, []);

  // ⬆️ Arriver en haut de page au montage
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rows = await loadGroupedPhilippinesSpecies();
        if (!mounted) return;
        const withImg = rows.map((r) => {
          const base = r.photoBase.replace(/\.[^.]+$/, "").toLowerCase();
          return { ...r, img: imgMap.get(base) || null };
        });
        setSpecies(withImg);
      } catch (e) {
        console.error(e);
        setSpecies([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [imgMap]);

  // ===== Panneau de détail — (déprécié par le carrousel 2-up, mais on garde l’état cliquable des vignettes) =====
  const detailRef = useRef(null);

  const selectedIndex = useMemo(() => {
    if (!selected) return -1;
    return species.findIndex((s) => s.id === selected.id);
  }, [species, selected]);

  const scrollToDetail = useCallback(() => {
    if (detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const toggleSelect = useCallback(
    (sp) => {
      setSelected((cur) => {
        const next = cur && cur.id === sp.id ? null : sp;
        if (next) setTimeout(scrollToDetail, 0);
        return next;
      });
    },
    [scrollToDetail]
  );

  const goNext = useCallback(() => {
    if (!species.length) return;
    const idx = selectedIndex === -1 ? 0 : (selectedIndex + 1) % species.length;
    const sp = species[idx];
    setSelected(sp);
    setTimeout(scrollToDetail, 0);
  }, [species, selectedIndex, scrollToDetail]);

  const goPrev = useCallback(() => {
    if (!species.length) return;
    const idx =
      selectedIndex === -1
        ? species.length - 1
        : (selectedIndex - 1 + species.length) % species.length;
    const sp = species[idx];
    setSelected(sp);
    setTimeout(scrollToDetail, 0);
  }, [species, selectedIndex, scrollToDetail]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, goNext, goPrev]);

  // Classes utilitaires pour le highlight
  const hi = (id, extra = "") =>
    `${extra} transition transform ${
      highlightId === id ? "ring-4 ring-[#1113a2] scale-[1.03]" : ""
    }`;

  // ====== Hook utilitaire pour mobile (carrousel espèces) ======
  function useIsMobile() {
    const query = "(max-width: 768px)";
    const getMatch = () => window.matchMedia(query).matches;
    const [isMobile, setIsMobile] = useState(getMatch);

    useEffect(() => {
      const mql = window.matchMedia(query);
      const handler = (e) => setIsMobile(e.matches);
      if (mql.addEventListener) mql.addEventListener("change", handler);
      else mql.addListener(handler);
      return () => {
        if (mql.removeEventListener) mql.removeEventListener("change", handler);
        else mql.removeListener(handler);
      };
    }, []);

    return isMobile;
  }

  return (
    <div className="w-full">
    {/* Bande bleue avec nom du pays — corrigé */}
    <header className="w-full bg-gray-100 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1
          className="uppercase text-4xl md:text-6xl font-extrabold leading-tight
                    bg-gradient-to-r from-[#1113a2] via-[#3f51b5] to-[#8ab4f8]
                    text-transparent bg-clip-text drop-shadow-md
                    text-center md:text-left md:ml-[6%]"
        >
          Philippines
        </h1>
      </div>
    </header>


      {/* Carte + panneau de droite */}
      <Reveal replay>
        <div
          className="py-16 px-4 bg-cover bg-center"
          style={{ backgroundImage: `url(${oceanImage})` }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl max-w-[1200px] mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Carte */}
            <div className="md:col-span-3 rounded-xl overflow-hidden">
              <CarteAvecDonnees country="philippines" regionFilter={regionFilter} />
            </div>

            {/* Panneau de droite */}
            <div className="bg-white/80 p-4 rounded-xl shadow-inner max-h-[600px] overflow-y-auto">
              {/* 1) Bouton "Pourquoi..." en premier */}
              <button
                className="w-full flex items-center justify-center gap-2 text-sm px-3 py-2 rounded-lg bg-gray-100 text-[#1113a2] border border-gray-300 hover:bg-gray-200 transition focus:ring-2 focus:ring-[#1113a2]"
                onClick={() => scrollAndHighlight("why-greenfins")}
                title="Clique pour en savoir plus"
              >
                <span className="text-base">👉</span>
                <span>Pourquoi aller dans des centres certifiés ?</span>
              </button>

              {/* 2) Titre Niveaux */}
              <h3 className="text-[#1113a2] text font-semibold mt-5 mb-2">
                Niveaux Greenfins
              </h3>

              {/* 3) Boutons niveaux */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  className="text-xs px-2.5 py-1.5 rounded-full border transition hover:opacity-90 focus:outline-none focus:ring-0 active:ring-1 active:ring-gray-400"
                  style={{ background: "#D4AF37", color: "#fff", borderColor: "#D4AF37" }}
                  onClick={() => scrollAndHighlight("level-gold")}
                >
                  Gold
                </button>
                <button
                  className="text-xs px-2.5 py-1.5 rounded-full border transition hover:opacity-90 focus:outline-none focus:ring-0 active:ring-1 active:ring-gray-400"
                  style={{ background: "#C0C0C0", color: "#fff", borderColor: "#C0C0C0" }}
                  onClick={() => scrollAndHighlight("level-silver")}
                >
                  Silver
                </button>
                <button
                  className="text-xs px-2.5 py-1.5 rounded-full border transition hover:opacity-90 focus:outline-none focus:ring-0 active:ring-1 active:ring-gray-400"
                  style={{ background: "#CD7F32", color: "#fff", borderColor: "#CD7F32" }}
                  onClick={() => scrollAndHighlight("level-bronze")}
                >
                  Bronze
                </button>
                <button
                  className="text-xs px-2.5 py-1.5 rounded-full border transition hover:opacity-90 text-white focus:outline-none focus:ring-0 active:ring-1 active:ring-gray-400"
                  style={{ background: "#6b7280", borderColor: "#6b7280" }}
                  onClick={() => scrollAndHighlight("level-inactive")}
                >
                  Inactive
                </button>
              </div>

              {/* 4) Titre Filtrer par région */}
              <h3 className="text-[#1113a2] text font-semibold mb-2">
                Filtrer par région
              </h3>

              {/* 5) Radios régions */}
              <div className="space-y-2 text-sm">
                {uniqueRegions.map((region, i) => (
                  <div key={i}>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="region"
                        value={region}
                        checked={regionFilter === region}
                        onChange={() => setRegionFilter(region)}
                      />
                      {region}
                    </label>
                  </div>
                ))}
                <button
                  className="mt-4 text-xs underline text-blue-600"
                  onClick={() => setRegionFilter("")}
                >
                  Réinitialiser le filtre
                </button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Pourquoi choisir un centre labellisé GreenFins (avec images) */}
      <Reveal replay>
        <div id="why-greenfins" className="bg-white py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div
              className={hi(
                "why-greenfins",
                "border border-[#1113a2] bg-white shadow-md rounded-lg px-6 py-1 inline-block mb-6 ml-[6%]"
              )}
            >
              <h2 className="text-2xl md:text-1xl font-bold text-[#1113a2]">
                Pourquoi aller dans un club qui a un label GreenFins ?
              </h2>
            </div>

            {/* Paragraphe principal (replay + zoom) */}
            <Reveal replay zoomOnVisible className="ml-[6%]">
              <p className="mb-8 text-sm md:text-base text-gray-700 max-w-4xl text-justify">
                Les clubs labellisés GreenFins s’engagent à{" "}
                <span className="text-[#1113a2] font-bold">respecter des normes strictes</span>{" "}
                de protection de l’environnement marin, de gestion responsable des déchets et de sensibilisation des plongeurs.
                <br />
                Choisir un centre GreenFins, c’est{" "}
                <span className="text-[#1113a2] font-bold">contribuer</span>{" "}
                directement à la{" "}
                <span className="text-[#1113a2] font-bold">préservation des récifs coralliens</span>{" "}
                et à un tourisme durable.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
              {/* Card 1 */}
              <Reveal delay={0} replay zoomOnVisible>
                <div className="group rounded-xl shadow-md border border-gray-200 overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
                  <img
                    src={imgTourisme}
                    alt="Tourisme durable"
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                  />
                  <div className="p-4 text-sm text-gray-700 transition-transform duration-300 group-hover:scale-[1.01]">
                    <h3 className="font-bold text-[#1113a2] mb-2">Tourisme durable</h3>
                    En allant dans des centres engagés,{" "}
                    <span className="text-[#1113a2]">
                      vous soutenez l’environnement et les communautés locales
                    </span>.
                  </div>
                </div>
              </Reveal>

              {/* Card 2 */}
              <Reveal delay={120} replay zoomOnVisible>
                <div className="group rounded-xl shadow-md border border-gray-200 overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
                  <img
                    src={imgEcosystemes}
                    alt="Protection des écosystèmes marins"
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                  />
                  <div className="p-4 text-sm text-gray-700 transition-transform duration-300 group-hover:scale-[1.01]">
                    <h3 className="font-bold text-[#1113a2] mb-2">Protection des écosystèmes marins</h3>
                    Ces centres appliquent des{" "}
                    <span className="text-[#1113a2]">pratiques limitant les impacts</span>{" "}
                    sur les coraux, poissons et autres espèces.
                  </div>
                </div>
              </Reveal>

              {/* Card 3 */}
              <Reveal delay={240} replay zoomOnVisible>
                <div className="group rounded-xl shadow-md border border-gray-200 overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
                  <img
                    src={imgEncadree}
                    alt="Plongée encadrée et responsable"
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                  />
                  <div className="p-4 text-sm text-gray-700 transition-transform duration-300 group-hover:scale-[1.01]">
                    <h3 className="font-bold text-[#1113a2] mb-2">Plongée encadrée et responsable</h3>
                    Des instructeurs formés assurent des{" "}
                    <span className="text-[#1113a2]">immersions sécurisées</span>{" "}
                    pour vous, et la biodiversité.
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Niveaux de membres GreenFins */}
      <Reveal replay>
        <div id="levels" className="bg-gray-100 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="border border-[#1113a2] bg-white shadow-md rounded-lg px-6 py-1 inline-block mb-6 ml-[6%]">
              <h2 className="text-2xl md:text-1xl font-bold text-[#1113a2]">Niveaux de membres GreenFins</h2>
            </div>

            {/* Paragraphe d'intro (replay + zoom) */}
            <Reveal replay zoomOnVisible className="ml-[6%]">
              <p className="mb-8 text-sm md:text-base text-gray-700 max-w-4xl text-justify">
                GreenFins attribue un{" "}
                <span className="text-[#1113a2] font-bold">niveau de performance environnementale</span>{" "}
                aux centres de plongée. Même un centre{" "}
                <span className="text-[#1113a2] font-bold">“Inactive”</span>{" "}
                reste généralement plus respectueux de l'environnement que la moyenne, car il a été{" "}
                <span className="text-[#1113a2] font-bold">formé aux bonnes pratiques</span>{" "}
                et conserve souvent une partie de ses engagements.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
              {/* GOLD */}
              <Reveal delay={0} replay zoomOnVisible>
                <div
                  id="level-gold"
                  className={hi(
                    "level-gold",
                    "group rounded-xl shadow-md border border-gray-200 bg-white overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
                  )}
                >
                  <div
                    className="text-white px-4 py-2 font-semibold text-lg flex items-center justify-between"
                    style={{ background: "#D4AF37" }}
                  >
                    <span>Gold</span>
                    {imgGold && (
                      <img
                        src={imgGold}
                        alt="Label Gold GreenFins"
                        className="w-9 h-9 object-contain rounded-full bg-white/80 p-1"
                      />
                    )}
                  </div>
                  <div className="p-6 text-sm text-gray-700 transition-transform duration-300 group-hover:scale-[1.01]">
                    <span className="text-[#1113a2]">Respect strict</span> des meilleures pratiques
                    environnementales et engagement exemplaire.
                  </div>
                </div>
              </Reveal>

              {/* SILVER */}
              <Reveal delay={120} replay zoomOnVisible>
                <div
                  id="level-silver"
                  className={hi(
                    "level-silver",
                    "group rounded-xl shadow-md border border-gray-200 bg-white overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
                  )}
                >
                  <div
                    className="text-white px-4 py-2 font-semibold text-lg flex items-center justify-between"
                    style={{ background: "#C0C0C0" }}
                  >
                    <span>Silver</span>
                    {imgSilver && (
                      <img
                        src={imgSilver}
                        alt="Label Silver GreenFins"
                        className="w-9 h-9 object-contain rounded-full bg-white/80 p-1"
                      />
                    )}
                  </div>
                  <div className="p-6 text-sm text-gray-700 transition-transform duration-300 group-hover:scale-[1.01]">
                    <span className="text-[#1113a2]">Fort engagement</span> environnemental avec quelques axes
                    d’amélioration.
                  </div>
                </div>
              </Reveal>

              {/* BRONZE */}
              <Reveal delay={240} replay zoomOnVisible>
                <div
                  id="level-bronze"
                  className={hi(
                    "level-bronze",
                    "group rounded-xl shadow-md border border-gray-200 bg-white overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
                  )}
                >
                  <div
                    className="text-white px-4 py-2 font-semibold text-lg flex items-center justify-between"
                    style={{ background: "#CD7F32" }}
                  >
                    <span>Bronze</span>
                    {imgBronze && (
                      <img
                        src={imgBronze}
                        alt="Label Bronze GreenFins"
                        className="w-9 h-9 object-contain rounded-full bg-white/80 p-1"
                      />
                    )}
                  </div>
                  <div className="p-6 text-sm text-gray-700 transition-transform duration-300 group-hover:scale-[1.01]">
                    <span className="text-[#1113a2]">Bon respect</span> des recommandations, des améliorations
                    restent possibles.
                  </div>
                </div>
              </Reveal>

              {/* INACTIVE */}
              <Reveal delay={360} replay zoomOnVisible>
                <div
                  id="level-inactive"
                  className={hi(
                    "level-inactive",
                    "group rounded-xl shadow-md border border-gray-200 bg-white overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
                  )}
                >
                  <div
                    className="text-white px-4 py-2 font-semibold text-lg flex items-center justify-between"
                    style={{ background: "#6b7280" }}
                  >
                    <span>Inactive</span>
                    {imgInactive && (
                      <img
                        src={imgInactive}
                        alt="Label Inactive GreenFins"
                        className="w-9 h-9 object-contain rounded-full bg-white/80 p-1"
                      />
                    )}
                  </div>
                  <div className="p-6 text-sm text-gray-700 transition-transform duration-300 group-hover:scale-[1.01]">
                    <span className="text-[#1113a2]">N'a pas renouvelé le programme</span>, mais a été formé et
                    garde souvent de bonnes pratiques.
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Visibilité des plongeurs au cours de l'année */}
      <Reveal replay>
        <div className="bg-gray-300 py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="border border-[#1113a2] bg-white shadow-md rounded-lg px-6 py-1 inline-block mb-2 ml-[1%]">
              <h2 className="text-2xl md:text-1xl font-bold text-[#1113a2]">
                Visibilité des plongeurs au cours de l'année
              </h2>
            </div>

            {/* phrase d’explication */}
            <p className="ml-[4%] mb-4 text-sm md:text-base text-gray-700 max-w-3xl">
              Voici la visibilité moyenne de l'eau pour les plongeurs au fil des mois
              dans ce pays.
            </p>

            {/* légende */}
            <div className="flex gap-6 mb-5 ml-[4%]">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-500 rounded-full"></span> Excellente
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-yellow-400 rounded-full"></span> Moyenne
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-orange-400 rounded-full"></span> Faible
              </div>
            </div>

            {/* mois (statique simple ici) */}
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "Jan","Fév","Mar","Avr","Mai","Juin",
                "Juil","Août","Sept","Oct","Nov","Déc"
              ].map((m, i) => {
                const colors = [
                  "bg-yellow-400","bg-green-500","bg-green-500","bg-green-500",
                  "bg-yellow-400","bg-orange-400","bg-orange-400","bg-orange-400",
                  "bg-yellow-400","bg-green-500","bg-green-500","bg-yellow-400"
                ];
                return (
                  <div
                    key={m}
                    className={`text-white ${colors[i]} px-4 py-2 rounded-full text-sm font-semibold shadow`}
                  >
                    {m}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Espèces observables */}
      <Reveal replay>
        <div className="bg-gray-100 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="border border-[#1113a2] bg-[#ffffff] shadow-md rounded-lg px-6 py-1 inline-block mb-4 ml-[10%]">
              <h2 className="text-2xl md:text-1xl font-bold text-[#1113a2]">Espèces observables</h2>
            </div>
          </div>

          <p className="ml-[10%] mb-6 text-sm md:text-base text-gray-700 max-w-4xl text-justify">
            Voici maintenant une sélection des espèces qui sont{" "}
            <span className="text-[#1113a2] font-semibold">endémiques, rares, peu visibles ailleurs</span>,{" "}
            ou particulièrement représentatives de la biodiversité exceptionnelle de l’archipel philippin.
          </p>

          {/* Carrousel permanent : 1 carte sur mobile, 2 cartes sur desktop */}
          {(() => {
            // ----- Carte -----
            function SpeciesCard({ sp, showPrev = false, showNext = false, onPrev, onNext }) {
              if (!sp) return null;
              return (
                <div className="relative bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* image — hauteur fixe */}
                    <div className="md:w-[48%] w-full h-[260px] bg-gray-200">
                      {sp.img ? (
                        <img src={sp.img} alt={sp.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          Image indisponible
                        </div>
                      )}
                    </div>

                    {/* texte — hauteur fixe */}
                    <div className="md:w-[52%] w-full p-4 md:p-5 min-h-[260px]">
                      <h3 className="text-xl font-extrabold text-[#1113a2] leading-tight">{sp.name}</h3>
                      {sp.regions?.length > 0 && (
                        <p className="mt-1 text-sm text-gray-600">
                          <span className="font-semibold text-gray-800">Régions :</span>{" "}
                          {sp.regions.join(" · ")}
                        </p>
                      )}
                      <p className="mt-3 text-[15px] text-gray-800 leading-relaxed">{sp.description}</p>
                    </div>
                  </div>

                  {/* flèches desktop */}
                  {showPrev && (
                    <button
                      aria-label="Précédent"
                      onClick={onPrev}
                      className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center rounded-full bg-[#1113a2] text-white shadow-lg hover:scale-105 transition"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                      </svg>
                    </button>
                  )}
                  {showNext && (
                    <button
                      aria-label="Suivant"
                      onClick={onNext}
                      className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center rounded-full bg-[#1113a2] text-white shadow-lg hover:scale-105 transition"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                      </svg>
                    </button>
                  )}

                  {/* boutons mobile */}
                  <div className="md:hidden flex justify-between px-4 py-2">
                    <button
                      onClick={onPrev}
                      className="px-3 py-1.5 rounded-lg bg-[#1113a2] text-white text-sm font-semibold shadow"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={onNext}
                      className="px-3 py-1.5 rounded-lg bg-[#1113a2] text-white text-sm font-semibold shadow"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              );
            }

            // ----- Hook mobile -----
            function useIsMobile() {
              const query = "(max-width: 768px)";
              const getMatch = () => window.matchMedia(query).matches;
              const [isMobile, setIsMobile] = React.useState(getMatch);

              React.useEffect(() => {
                const mql = window.matchMedia(query);
                const handler = (e) => setIsMobile(e.matches);
                if (mql.addEventListener) mql.addEventListener("change", handler);
                else mql.addListener(handler);
                return () => {
                  if (mql.removeEventListener) mql.removeEventListener("change", handler);
                  else mql.removeListener(handler);
                };
              }, []);

              return isMobile;
            }

            // ----- Carrousel 1-up mobile / 2-up desktop -----
            function TwoUpCarousel({ items }) {
              const isMobile = useIsMobile();
              const [idx, setIdx] = React.useState(0);
              const [paused, setPaused] = React.useState(false);
              const [inView, setInView] = React.useState(false);
              const [fading, setFading] = React.useState(false);
              const containerRef = React.useRef(null);

              const len = items.length || 0;
              const step = isMobile ? 1 : 2;
              const left = len ? items[idx % len] : null;
              const right = !isMobile && len ? items[(idx + 1) % len] : null;

              const userScrollRef = React.useRef(false);

              const doFadeTo = React.useCallback((computeNext) => {
                if (!len) return;
                setFading(true);
                setTimeout(() => {
                  setIdx((i) => computeNext(i));
                  setTimeout(() => setFading(false), 20);
                }, 160);
              }, [len]);

              const goNext = React.useCallback(() => {
                userScrollRef.current = true;
                doFadeTo((i) => (i + step) % len);
              }, [doFadeTo, len, step]);

              const goPrev = React.useCallback(() => {
                userScrollRef.current = true;
                doFadeTo((i) => (i - step + len) % len);
              }, [doFadeTo, len, step]);

              // Autoplay 3s seulement si visible & non survolé
              React.useEffect(() => {
                if (!inView || paused || len === 0) return;
                const id = setInterval(() => goNext(), 3000);
                return () => clearInterval(id);
              }, [inView, paused, len, goNext]);

              // Détection visibilité
              React.useEffect(() => {
                const el = containerRef.current;
                if (!el) return;
                const obs = new IntersectionObserver(
                  ([entry]) => setInView(entry.isIntersecting),
                  { threshold: 0.35 }
                );
                obs.observe(el);
                return () => obs.disconnect();
              }, []);

              // Scroll doux uniquement après action user
              React.useEffect(() => {
                if (userScrollRef.current) {
                  containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                  userScrollRef.current = false;
                }
              }, [idx]);

              // Gestes tactiles
              const startX = React.useRef(null);
              const handleTouchStart = (e) => (startX.current = e.touches[0].clientX);
              const handleTouchEnd = (e) => {
                if (startX.current == null) return;
                const dx = e.changedTouches[0].clientX - startX.current;
                if (Math.abs(dx) > 40) (dx < 0 ? goNext() : goPrev());
                startX.current = null;
              };

              return (
                <div
                  ref={containerRef}
                  className={`max-w-5xl mx-auto px-4 transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className={`grid grid-cols-1 ${!isMobile ? "md:grid-cols-2" : ""} gap-4`}>
                    <SpeciesCard sp={left} showPrev onPrev={goPrev} onNext={goNext} />
                    {!isMobile && <SpeciesCard sp={right} showNext onPrev={goPrev} onNext={goNext} />}
                  </div>

                  {/* points de pagination */}
                  <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                    {items.map((_, i) => {
                      const active = isMobile
                        ? i === idx
                        : i === idx || i === (idx + 1) % len;
                      return (
                        <button
                          key={i}
                          aria-label={`Aller à ${i + 1}`}
                          className={`rounded-full transition ${active ? "w-3.5 h-3.5 bg-[#1113a2]" : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"}`}
                          onClick={() => {
                            userScrollRef.current = true;
                            setIdx(isMobile ? i : (i % 2 === 0 ? i : (i - 1 + len) % len));
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            }

            return <TwoUpCarousel items={species} />;
          })()}
        </div>
      </Reveal>

      {/* Footer */}
      <div className="bg-[#1113a2] py-12 px-6 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12 md:gap-8">
          {/* Colonne gauche : Contact */}
          <div className="md:w-1/2">
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="mb-2">
              📧 Mail :{" "}
              <a href="mailto:gdm.guardianmap@gmail.com" className="underline hover:text-gray-300">
                gdm.guardianmap@gmail.com
              </a>
            </p>
            <p>
              📸 Instagram :{" "}
              <a
                href="https://instagram.com/guardianmap"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-300"
              >
                @guardianmap
              </a>
            </p>
          </div>

          {/* Trait vertical */}
          <div className="hidden md:block w-px h-28 bg-white/30" />

          {/* Colonne droite : Newsletter */}
          <div className="md:w-1/2">
            <h3 className="text-xl font-bold mb-4 text-white">Reste informé(e)</h3>
            <p className="mb-4">Inscris-toi pour suivre le développement de GuardianMap.</p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Ton adresse e-mail"
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-black focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-white text-[#1113a2] px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
