// src/pages/Especes.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";

import SPECIES_EXCEL_URL from "../data/BDD_especes_marines.xlsx?url";
import OBS_EXCEL_URL from "../data/BDD_observation.xlsx?url";
import oceanImage from "../assets/images/bannière_blog2.jpg";

// Photos espèces
import imgBaleineBleue from "../assets/images/especes_baleine_bleue.webp";
import imgBaleineABosses from "../assets/images/especes_baleine_a_bosses.avif";
import imgDauphin from "../assets/images/especes_dauphin.jpg";
import imgRaieManta from "../assets/images/especes_raie_manta.jpg";
import imgRequins from "../assets/images/especes_requins.jpg";
import imgRequinBaleine from "../assets/images/especes_requin_baleine.jpg";
import imgTortueMarine from "../assets/images/especes_tortue_marine.jpg";

// Images guide bon voyageur
import imgAFaire from "../assets/images/especes_a_faire.png";
import imgAEviter from "../assets/images/especes_a_eviter.png";

const KEY = "gsmNeDjg2V0pS8etxXtI";
const STYLE = `https://api.maptiler.com/maps/streets/style.json?key=${KEY}`;

// ✅ Seuil zoom demandé
const SPOTS_PINS_MIN_ZOOM = 3;

/* =======================
   Helpers string / data
======================= */
const normalize = (s) => (s ?? "").toString().trim();
const uniqSorted = (arr) => Array.from(new Set(arr.filter(Boolean))).sort();

const normKey = (s) =>
  normalize(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const formatLabel = (str = "") =>
  normalize(str)
    .toLowerCase()
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");

const toNum = (v) => {
  if (v === null || v === undefined) return null;
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

const fixUrl = (u = "") => {
  if (!u) return "";
  const t = String(u).trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  if (/^www\./i.test(t)) return "https://" + t;
  return `https://${t}`;
};

/* =======================
   UI
======================= */
function CardShell({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-b-[3rem] border border-gray-200 bg-white shadow-sm overflow-hidden",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

/* =======================
   GeoJSON
======================= */
function toFeature(p, props = {}) {
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [p.lon, p.lat] },
    properties: props,
  };
}
function toFeatureCollection(features) {
  return { type: "FeatureCollection", features };
}

/* =======================
   Highlight (facts)
======================= */
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

/* =======================
   Spots ethics
======================= */
function ethicsMeta(ethiqueRaw) {
  const e = normalize(ethiqueRaw);
  if (e === "✗" || e.toLowerCase() === "x") return { key: "bad", color: "#dc2626", label: "À éviter" };
  if (e === "—" || e === "-" || e === "–") return { key: "warn", color: "#f59e0b", label: "À surveiller" };
  return { key: "ok", color: "#1113a2", label: "Info / OK" };
}

/* =======================
   Observation labels colors + badges
======================= */
const OBS_LABEL_PRETTY = {
  wca: "WCA",
  "dolphin space programme": "Dolphin Space Programme",
  "friend of the sea": "Friend of the Sea",
  "high quality whale watching": "High Quality Whale-Watching",
};

function prettyObsLabel(raw) {
  const k = normKey(raw);
  return OBS_LABEL_PRETTY[k] || raw || "Label";
}

function obsLabelColor(labelRaw = "") {
  const k = normKey(labelRaw);
  if (k === "wca") return "#1113a2";
  if (k === "friend of the sea") return "#34d399";
  if (k === "high quality whale watching") return "#fb923c";
  if (k === "dolphin space programme") return "#a78bfa";
  return "#1113a2";
}

const OBS_LABEL_ANIMAL_BADGE = {
  "dolphin space programme": "Dauphins",
  wca: "Baleines",
  "friend of the sea": "Dauphins",
  "high quality whale watching": "Baleines",
};
function obsAnimalBadge(labelKeyOrRaw) {
  const k = normKey(labelKeyOrRaw);
  return OBS_LABEL_ANIMAL_BADGE[k] || "";
}

/* =======================
   Species cards content
======================= */
function getSpeciesFacts(speciesName) {
  const s = normKey(speciesName);

  const rich = {
    "requin baleine": [
      "C'est le plus grand poisson du monde, et pourtant il se nourrit surtout de plancton.",
      "Une rencontre dépend de lui : jamais garanti.",
      "Distance + calme : ce sont les meilleurs alliés d'une observation réussie.",
    ],
    "tortue marine": [
      "Elle remonte respirer : la gêner, c'est lui faire perdre de l'énergie.",
      "Les zones de repos et d'alimentation sont sensibles : on garde distance et douceur.",
      "Le meilleur souvenir : une observation sans interaction forcée.",
    ],
    "raie manta": [
      "Les mantas fréquentent des stations de nettoyage : ces spots sont sensibles au dérangement.",
      "Un animal qui s'éloigne n'est pas 'timide' : il évite un stress.",
      "Répéter les interactions peut pousser l'animal à abandonner un site.",
    ],
    dauphins: [
      "Les poursuivre perturbe leurs phases de repos : pression invisible, mais réelle.",
      "Un 'sourire' n'est pas un consentement : c'est leur morphologie.",
      "On observe : on ne cherche pas à obtenir une interaction.",
    ],
    "baleine bleue": [
      "C'est le plus grand animal connu, mais elle reste vulnérable au dérangement.",
      "En mer, la distance est une protection pour elle (et pour toi).",
      "Privilégie les opérateurs qui respectent vitesse, trajectoire et distance.",
    ],
    "baleine a bosse": [
      "Elle peut être curieuse… mais ça ne veut pas dire qu'il faut s'approcher.",
      "Les mises à l'eau 'pour la photo' sont souvent une mauvaise idée.",
      "Un bon opérateur sait renoncer plutôt que de forcer la rencontre.",
    ],
    requins: [
      "Les requins ne sont pas des attractions : on ne les nourrit pas et on ne les touche pas.",
      "Un encadrement sérieux est non négociable.",
      "Distance, calme, pas de flash : la règle d'or.",
    ],
  };

  return (
    rich[s] || [
      "Les observations varient selon la saison, la météo et le hasard.",
      "Distance, calme, pas d'interaction forcée : c'est la base.",
      "Choisir un opérateur responsable vaut mieux qu'une photo.",
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

/* =======================
   Excel parsing helpers (ROBUST)
======================= */
function findColumnKey(row, patterns = []) {
  const keys = Object.keys(row || {});
  const keyed = keys.map((k) => ({ raw: k, nk: normKey(k) }));

  for (const p of patterns) {
    const want = typeof p === "string" ? normKey(p) : null;
    const re = p instanceof RegExp ? p : null;

    const hit = keyed.find(({ nk }) => {
      if (re) return re.test(nk);
      if (want) return nk === want || nk.includes(want);
      return false;
    });

    if (hit) return hit.raw;
  }
  return null;
}

function parseMonths(v) {
  if (Array.isArray(v)) {
    return v.map((x) => Number(x)).filter((n) => Number.isFinite(n) && n >= 1 && n <= 12);
  }
  const s = normalize(v);
  if (!s) return [];
  const nums = s
    .replace(/[^0-9]+/g, " ")
    .trim()
    .split(" ")
    .map((x) => Number(x))
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= 12);
  return Array.from(new Set(nums));
}

function pickBestSheet(wb, prefers = []) {
  const names = wb.SheetNames || [];
  if (!names.length) return null;
  const preferred = names.find((n) => prefers.some((p) => normKey(n).includes(normKey(p))));
  return wb.Sheets[preferred || names[0]];
}

/* =======================
   Pins SVG (FIX decode)
======================= */
function pinSvg(color) {
  return `
  <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0C9.38 0 4 5.38 4 12c0 8 12 28 12 28s12-20 12-28c0-6.62-5.38-12-12-12z"
      fill="${color}" stroke="white" stroke-width="1.5"/>
    <circle cx="16" cy="12" r="3" fill="white"/>
  </svg>`;
}

function svgToDataUrl(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

function addImageFromDataUrl(map, id, dataUrl) {
  return new Promise((resolve) => {
    if (map.hasImage(id)) return resolve(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        if (!map.hasImage(id)) map.addImage(id, img, { pixelRatio: 2 });
        resolve(true);
      } catch (e) {
        console.warn("addImage failed", id, e);
        resolve(false);
      }
    };
    img.onerror = (e) => {
      console.warn("Image load error", id, e);
      resolve(false);
    };
    img.src = dataUrl;
  });
}

async function ensurePinImages(map) {
  await addImageFromDataUrl(map, "pin-ok", svgToDataUrl(pinSvg(ethicsMeta("ok").color)));
  await addImageFromDataUrl(map, "pin-warn", svgToDataUrl(pinSvg(ethicsMeta("—").color)));
  await addImageFromDataUrl(map, "pin-bad", svgToDataUrl(pinSvg(ethicsMeta("✗").color)));
}

/* =======================
   Component
======================= */
export default function Especes() {
  const { t } = useTranslation();

  const [mapReady, setMapReady] = useState(false);

  const [selectedContinent, setSelectedContinent] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedSpecies, setSelectedSpecies] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Excel observation
  const [obsRows, setObsRows] = useState([]);
  const [obsError, setObsError] = useState(false);
  const [obsLoading, setObsLoading] = useState(true);

  // Excel espèces
  const [speciesRows, setSpeciesRows] = useState([]);
  const [speciesError, setSpeciesError] = useState(false);
  const [speciesLoading, setSpeciesLoading] = useState(true);

  // filtres labels observation
  const [selectedObsLabels, setSelectedObsLabels] = useState({});
  const obsCarouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const mapRef = useRef(null);
  const mapObj = useRef(null);

  /* =======================
     Load Excel observation
  ======================= */
  useEffect(() => {
    (async () => {
      setObsLoading(true);
      setObsError(false);
      try {
        const res = await fetch(OBS_EXCEL_URL);
        if (!res.ok) throw new Error("BDD_observation.xlsx introuvable");
        const buf = await res.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const ws = pickBestSheet(wb, ["observation", "observations", "labels", "bdd"]);
        if (!ws) throw new Error("Aucune feuille trouvée dans BDD_observation.xlsx");
        const data = XLSX.utils.sheet_to_json(ws, { defval: "", raw: false });
        setObsRows(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setObsError(true);
        setObsRows([]);
      } finally {
        setObsLoading(false);
      }
    })();
  }, []);

  /* =======================
     Load Excel espèces
  ======================= */
  useEffect(() => {
    (async () => {
      setSpeciesLoading(true);
      setSpeciesError(false);
      try {
        const res = await fetch(SPECIES_EXCEL_URL);
        if (!res.ok) throw new Error("BDD_especes_marines.xlsx introuvable");
        const buf = await res.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const ws = pickBestSheet(wb, ["espece", "especes", "species", "spots", "bdd"]);
        if (!ws) throw new Error("Aucune feuille trouvée dans BDD_especes_marines.xlsx");
        const data = XLSX.utils.sheet_to_json(ws, { defval: "", raw: false });
        setSpeciesRows(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setSpeciesError(true);
        setSpeciesRows([]);
      } finally {
        setSpeciesLoading(false);
      }
    })();
  }, []);

  /* =======================
     Normalize espèces rows -> cleanData
  ======================= */
  const cleanData = useMemo(() => {
    if (!speciesRows.length) return [];

    const first = speciesRows[0] || {};

    const kLat =
      findColumnKey(first, [/^lat(itude)?$/, "latitude", "lat"]) || findColumnKey(first, [/^y$/]);
    const kLon =
      findColumnKey(first, [/^(lon|lng)(gitude)?$/, "longitude", "lon", "lng"]) || findColumnKey(first, [/^x$/]);

    if (!kLat || !kLon) {
      console.warn("⚠️ Colonnes lat/lon non détectées (species):", Object.keys(first));
      return [];
    }

    const kSite = findColumnKey(first, ["site", "spot", "lieu", "location", "nom", "name"]);
    const kCountry = findColumnKey(first, ["pays", "country"]);
    const kContinent = findColumnKey(first, ["continent"]);
    const kSpecies = findColumnKey(first, ["espece", "espèce", "especes", "species", "animal"]);
    const kFreq = findColumnKey(first, ["frequence", "fréquence", "frequency"]);
    const kExpl = findColumnKey(first, ["explication", "description", "details", "détails", "detail"]);
    const kEth = findColumnKey(first, ["ethique", "éthique", "ethics"]);
    const kMonths = findColumnKey(first, ["mois", "months", "saison", "season"]);

    const out = [];
    for (const r of speciesRows) {
      const lat = toNum(r[kLat]);
      const lon = toNum(r[kLon]);
      if (lat == null || lon == null) continue;
      if (Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;

      out.push({
        lat,
        lon,
        site: kSite ? normalize(r[kSite]) : "",
        country: kCountry ? normalize(r[kCountry]) : "",
        continent: kContinent ? normalize(r[kContinent]) : "",
        species: kSpecies ? normalize(r[kSpecies]) : "",
        frequence: kFreq ? normalize(r[kFreq]) : "",
        explication: kExpl ? normalize(r[kExpl]) : "",
        ethique: kEth ? normalize(r[kEth]) : "",
        months: kMonths ? parseMonths(r[kMonths]) : [],
      });
    }

    return out;
  }, [speciesRows]);

  /* =======================
     Normalize observation centers
  ======================= */
  const obsCenters = useMemo(() => {
    if (!obsRows.length) return [];
    const first = obsRows[0] || {};

    const kLat =
      findColumnKey(first, [/^lat(itude)?$/, "latitude", "lat"]) || findColumnKey(first, [/^y$/]);
    const kLon =
      findColumnKey(first, [/^(lon|lng)(gitude)?$/, "longitude", "lon", "lng"]) || findColumnKey(first, [/^x$/]);

    if (!kLat || !kLon) {
      console.warn("⚠️ Colonnes lat/lon non détectées (obs):", Object.keys(first));
      return [];
    }

    const kAnimal = findColumnKey(first, ["animal", "species", "espece", "espèce"]);
    const kLabel = findColumnKey(first, ["label", "certification", "programme", "program"]);
    const kName = findColumnKey(first, ["name", "nom", "operator", "centre"]);
    const kPartner = findColumnKey(first, ["partner_page", "partner page", "partner", "url", "website", "site"]);

    const out = [];
    for (const r of obsRows) {
      const lat = toNum(r[kLat]);
      const lon = toNum(r[kLon]);
      if (lat == null || lon == null) continue;
      if (Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;

      const animal = kAnimal ? normalize(r[kAnimal]) : "";
      const label = kLabel ? normalize(r[kLabel]) : "";
      const name = kName ? normalize(r[kName]) : "";
      const partnerPage = kPartner ? fixUrl(r[kPartner]) : "";

      out.push({
        animal,
        animalKey: normKey(animal),
        label,
        labelKey: normKey(label) || "label",
        labelPretty: prettyObsLabel(label),
        name,
        partnerPage,
        lat,
        lon,
      });
    }
    return out;
  }, [obsRows]);

  const obsLabelOptions = useMemo(() => {
    const acc = new Map();
    obsCenters.forEach((c) => {
      if (!c.labelKey) return;
      if (!acc.has(c.labelKey))
        acc.set(c.labelKey, { key: c.labelKey, label: c.labelPretty || c.label || "Label", count: 0 });
      acc.get(c.labelKey).count += 1;
    });

    const arr = Array.from(acc.values());
    const priority = ["dolphin space programme", "friend of the sea", "high quality whale watching", "wca"];
    arr.sort((a, b) => {
      const ai = priority.indexOf(a.key);
      const bi = priority.indexOf(b.key);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      return a.label.localeCompare(b.label, "fr");
    });
    return arr;
  }, [obsCenters]);

  useEffect(() => {
    if (!obsLabelOptions.length) return;
    setSelectedObsLabels((prev) => {
      const hasAny = Object.keys(prev || {}).length > 0;
      if (hasAny) {
        const next = { ...prev };
        obsLabelOptions.forEach((o) => {
          if (next[o.key] === undefined) next[o.key] = true;
        });
        return next;
      }
      const next = {};
      obsLabelOptions.forEach((o) => (next[o.key] = true));
      return next;
    });
  }, [obsLabelOptions]);

  const obsAllSelected = useMemo(() => {
    if (!obsLabelOptions.length) return true;
    return obsLabelOptions.every((o) => selectedObsLabels[o.key]);
  }, [obsLabelOptions, selectedObsLabels]);

  const toggleAllObsLabels = () => {
    const next = {};
    obsLabelOptions.forEach((o) => (next[o.key] = !obsAllSelected));
    setSelectedObsLabels(next);
  };
  const toggleOneObsLabel = (key) => setSelectedObsLabels((p) => ({ ...p, [key]: !p[key] }));

  // Carousel scroll
  const scrollCarousel = (direction) => {
    if (!obsCarouselRef.current) return;
    const scroll = direction === "left" ? -300 : 300;
    obsCarouselRef.current.scrollBy({ left: scroll, behavior: "smooth" });
  };

  const checkScroll = () => {
    if (!obsCarouselRef.current) return;
    setCanScrollLeft(obsCarouselRef.current.scrollLeft > 0);
    setCanScrollRight(
      obsCarouselRef.current.scrollLeft <
        obsCarouselRef.current.scrollWidth - obsCarouselRef.current.clientWidth - 10
    );
  };

  useEffect(() => {
    const ref = obsCarouselRef.current;
    if (!ref) return;
    checkScroll();
    ref.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      ref.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  // lists
  const continents = useMemo(() => uniqSorted(cleanData.map((d) => normalize(d.continent))), [cleanData]);
  const countries = useMemo(() => uniqSorted(cleanData.map((d) => normalize(d.country))), [cleanData]);

  const speciesList = useMemo(() => {
    let filtered = cleanData;
    if (selectedContinent !== "all") filtered = filtered.filter((d) => normalize(d.continent) === selectedContinent);
    if (selectedCountry !== "all") filtered = filtered.filter((d) => normalize(d.country) === selectedCountry);
    return uniqSorted(filtered.map((d) => normalize(d.species)));
  }, [cleanData, selectedContinent, selectedCountry]);

  // filtered spots
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

  // filtered observation centers
  const filteredObsCenters = useMemo(() => {
    return obsCenters.filter((c) => {
      const anyChecked = Object.values(selectedObsLabels).some(Boolean);
      if (anyChecked && !selectedObsLabels[c.labelKey]) return false;

      if (selectedSpecies !== "all") {
        const sKey = normKey(selectedSpecies);
        if (c.animalKey && c.animalKey !== sKey) return false;
      }
      return true;
    });
  }, [obsCenters, selectedObsLabels, selectedSpecies]);

  // search index
  const searchIndex = useMemo(() => {
    const items = [];

    cleanData.forEach((d) => {
      if (normalize(d.site)) items.push({ type: "site", label: d.site, data: d });
    });

    countries.forEach((country) => items.push({ type: "country", label: country }));
    continents.forEach((cont) => items.push({ type: "continent", label: cont }));
    uniqSorted(cleanData.map((d) => normalize(d.species))).forEach((sp) => items.push({ type: "species", label: sp }));

    obsCenters.forEach((c) => {
      if (normalize(c.name)) items.push({ type: "obsCenter", label: c.name, data: c });
    });

    const seen = new Set();
    return items.filter((it) => {
      const k = `${it.type}__${it.label}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [cleanData, continents, countries, obsCenters]);

  const searchSuggestions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return searchIndex.filter((item) => (item.label || "").toLowerCase().includes(term)).slice(0, 10);
  }, [searchTerm, searchIndex]);

  /* =======================
     init map + layers
     ✅ Spots = clusters + pins après zoom 3
     ✅ Obs = clusters + ronds
======================= */
  useEffect(() => {
    if (mapObj.current || !mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: STYLE,
      center: [0, 20],
      zoom: 1.8,
      attributionControl: true,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", async () => {
      map.resize();

      // ✅ Pins icons (ok/warn/bad)
      await ensurePinImages(map);

      map.on("styleimagemissing", async (e) => {
        if (!e?.id) return;
        if (e.id === "pin-ok" || e.id === "pin-warn" || e.id === "pin-bad") {
          await ensurePinImages(map);
        }
      });

      /* ============ SPOTS (BDD espèces) ============ */
      map.addSource("spots", {
        type: "geojson",
        data: toFeatureCollection([]),
        cluster: true,
        clusterRadius: 60,
        clusterMaxZoom: SPOTS_PINS_MIN_ZOOM, // ✅ clusters jusqu'à zoom 3
      });

      // ✅ Bulles (clusters) — visibles avant zoom 3
      map.addLayer({
        id: "spots-clusters",
        type: "circle",
        source: "spots",
        filter: ["has", "point_count"],
        maxzoom: SPOTS_PINS_MIN_ZOOM, // ✅ bulles jusqu'à 3
        paint: {
          "circle-color": "#1113a2",
          "circle-opacity": 0.75,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
          "circle-radius": ["step", ["get", "point_count"], 18, 20, 24, 50, 30, 100, 38],
        },
      });

      map.addLayer({
        id: "spots-cluster-count",
        type: "symbol",
        source: "spots",
        filter: ["has", "point_count"],
        maxzoom: SPOTS_PINS_MIN_ZOOM,
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 13,
        },
        paint: { "text-color": "#ffffff" },
      });

      // ✅ Pins (unclustered) — visibles à partir du zoom 3
      map.addLayer({
        id: "spots-unclustered-pins",
        type: "symbol",
        source: "spots",
        filter: ["!", ["has", "point_count"]],
        minzoom: SPOTS_PINS_MIN_ZOOM, // ✅ pins dès zoom 3
        layout: {
          "icon-image": ["get", "pinIcon"],
          "icon-size": 1.2,
          "icon-allow-overlap": true,
        },
      });

      /* ============ OBS (BDD observation) ============ */
      map.addSource("obs", {
        type: "geojson",
        data: toFeatureCollection([]),
        cluster: true,
        clusterRadius: 55,
        clusterMaxZoom: 6,
      });

      map.addLayer({
        id: "obs-clusters",
        type: "circle",
        source: "obs",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#1113a2",
          "circle-opacity": 0.75,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
          "circle-radius": ["step", ["get", "point_count"], 18, 20, 24, 50, 30, 100, 38],
        },
      });

      map.addLayer({
        id: "obs-cluster-count",
        type: "symbol",
        source: "obs",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 13,
        },
        paint: { "text-color": "#ffffff" },
      });

      map.addLayer({
        id: "obs-unclustered",
        type: "circle",
        source: "obs",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": ["get", "color"],
          "circle-radius": 7,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
          "circle-opacity": 0.95,
        },
      });

      // ✅ cluster click -> zoom (spots + obs)
      const expandCluster = (sourceId, layerId) => (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
        if (!features?.length) return;
        const clusterId = features[0].properties.cluster_id;
        const source = map.getSource(sourceId);
        if (!source?.getClusterExpansionZoom) return;

        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          map.easeTo({ center: features[0].geometry.coordinates, zoom });
        });
      };

      map.on("click", "spots-clusters", expandCluster("spots", "spots-clusters"));
      map.on("click", "obs-clusters", expandCluster("obs", "obs-clusters"));

      // cursors
      map.on("mouseenter", "spots-clusters", () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", "spots-clusters", () => (map.getCanvas().style.cursor = ""));
      map.on("mouseenter", "obs-clusters", () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", "obs-clusters", () => (map.getCanvas().style.cursor = ""));
      map.on("mouseenter", "spots-unclustered-pins", () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", "spots-unclustered-pins", () => (map.getCanvas().style.cursor = ""));
      map.on("mouseenter", "obs-unclustered", () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", "obs-unclustered", () => (map.getCanvas().style.cursor = ""));

      // popups
      map.on("click", "spots-unclustered-pins", (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const html = f.properties.popupHtml;
        new maplibregl.Popup({ offset: 10 }).setLngLat(f.geometry.coordinates).setHTML(html).addTo(map);
      });

      map.on("click", "obs-unclustered", (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const html = f.properties.popupHtml;
        new maplibregl.Popup({ offset: 10 }).setLngLat(f.geometry.coordinates).setHTML(html).addTo(map);
      });

      setMapReady(true);
    });

    mapObj.current = map;

    return () => {
      map.remove();
      mapObj.current = null;
    };
  }, []);

  /* =======================
     push data to sources
======================= */
  useEffect(() => {
    const map = mapObj.current;
    if (!map || !mapReady) return;

    const spotsSource = map.getSource("spots");
    const obsSource = map.getSource("obs");
    if (!spotsSource || !obsSource) return;

    const esc = (x) => String(x || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const spotFeatures = filteredData.map((p) => {
      const ethics = ethicsMeta(p.ethique);

      const site = normalize(p.site);
      const country = normalize(p.country);
      const continent = normalize(p.continent);
      const species = normalize(p.species);
      const frequence = normalize(p.frequence);
      const explication = normalize(p.explication);

      const popupHtml = `
        <div style="font-size:12px;line-height:1.25;max-width:280px">
          <div style="font-weight:900;color:#111827;">${esc(site || "Spot")}</div>
          <div style="margin-top:2px;color:#111827;">
            ${esc(country)}
            ${country && continent ? " – " : ""}
            ${esc(continent)}
          </div>
          ${species ? `<div style="margin-top:6px;"><b>Espèce :</b> ${esc(species)}</div>` : ""}
          ${frequence ? `<div style="margin-top:6px;color:#374151;"><b>Fréquence :</b> ${esc(frequence)}</div>` : ""}
          ${explication ? `<div style="margin-top:8px;color:#111827;">${esc(explication)}</div>` : ""}
        </div>
      `;

      return toFeature(p, {
        pinIcon: `pin-${ethics.key}`,
        popupHtml,
      });
    });

    const obsFeatures = filteredObsCenters.map((c) => {
      const safeName = esc(c.name);
      const safeLabel = esc(c.labelPretty || c.label);
      const safeAnimal = esc(c.animal);

      const partnerHtml = c.partnerPage
        ? `<a href="${c.partnerPage}" target="_blank" rel="noopener noreferrer" style="color:#1113a2;text-decoration:underline;word-break:break-word;">Page partenaire</a>`
        : `<span style="color:#6b7280;">Lien indisponible</span>`;

      const popupHtml = `
        <div style="font-size:12px;line-height:1.25;max-width:270px;">
          <div style="font-weight:900;color:#111827;">${safeName || "Centre d'observation"}</div>
          <div style="margin-top:6px;"><b>Observation règlementée</b></div>
          <div style="margin-top:6px;"><b>Label :</b> <span style="font-weight:800;">${safeLabel}</span></div>
          ${safeAnimal ? `<div style="margin-top:6px;"><b>Animal :</b> ${safeAnimal}</div>` : ""}
          <div style="margin-top:8px;"><b>Infos :</b> ${partnerHtml}</div>
        </div>
      `;

      return toFeature(c, { color: obsLabelColor(c.label), popupHtml });
    });

    spotsSource.setData(toFeatureCollection(spotFeatures));
    obsSource.setData(toFeatureCollection(obsFeatures));
  }, [mapReady, filteredData, filteredObsCenters]);

  // click suggestion
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
      if (map && p.lon != null && p.lat != null) map.flyTo({ center: [p.lon, p.lat], zoom: 6, duration: 0 });
      return;
    }

    if (item.type === "obsCenter" && item.data) {
      const p = item.data;
      if (p.animal) setSelectedSpecies(p.animal);
      resetMonth();
      if (map && p.lon != null && p.lat != null) map.flyTo({ center: [p.lon, p.lat], zoom: 6, duration: 0 });
      return;
    }

    if (item.type === "country") {
      setSelectedCountry(item.label);
      setSelectedContinent("all");
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

  // species slides
  const speciesSlides = useMemo(() => {
    const allSpecies = uniqSorted(cleanData.map((d) => normalize(d.species)));
    const effectiveList =
      selectedSpecies !== "all" ? allSpecies.filter((sp) => normalize(sp) === normalize(selectedSpecies)) : allSpecies;

    return effectiveList.map((sp) => {
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
  }, [cleanData, selectedSpecies]);

  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => setActiveSlide(0), [selectedSpecies]);

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
      "imprévisible",
      "promesse",
      "mauvaises pratiques",
      "protection",
    ],
    []
  );

  const infoLines = useMemo(
    () => [
      "Les couleurs et les saisons sont des indices de présence, pas une promesse de rencontre.",
      "Choisir un mois 'favorable' augmente tes chances, mais la nature reste imprévisible.",
      "Les animaux sont sauvages : il ne faut pas provoquer leur rencontre. Nous sommes uniquement des observateurs dans leur monde.",
      "Si un spot est rouge, c'est qu'il ne faut pas y aller : mauvaises pratiques. Choisis la protection plutôt qu'une photo.",
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
          {t("especes.title", { defaultValue: "Où voir les espèces marines ?" })}
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-gray-700">
          {t("especes.subtitle", {
            defaultValue:
              "Filtre par continent, espèce et mois. Les bulles indiquent le nombre de spots. À partir du zoom 3, les pins apparaissent. Les ronds colorés représentent des centres d'observation règlementée (issus de BDD_observation.xlsx).",
          })}
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
                <label className="block text-base md:text-lg font-semibold text-gray-900 mb-3">
                  Rechercher un site, un pays, un continent, une espèce… ou un centre d'observation
                </label>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Ex : Maldives, Asie, Requin-baleine…"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                              : s.type === "obsCenter"
                              ? "CENTRE"
                              : "ESPÈCE"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filtres */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        {t(`months.${m}`, { defaultValue: `Mois ${m}` })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Carousel de labels observation */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      const next = {};
                      obsLabelOptions.forEach((o) => (next[o.key] = !obsAllSelected));
                      setSelectedObsLabels(next);
                    }}
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold hover:bg-gray-100 whitespace-nowrap"
                  >
                    {obsAllSelected ? "Tout désélectionner" : "Tout sélectionner"}
                  </button>
                </div>

                <div className="relative">
                  {canScrollLeft && (
                    <button
                      type="button"
                      onClick={() => scrollCarousel("left")}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-r-lg shadow-md"
                      aria-label="Défiler vers la gauche"
                    >
                      ←
                    </button>
                  )}

                  <div
                    ref={obsCarouselRef}
                    className="flex gap-2 overflow-x-auto scroll-smooth pb-2 px-1"
                    style={{ scrollBehavior: "smooth" }}
                  >
                    {obsLabelOptions.map((o) => (
                      <label
                        key={o.key}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs cursor-pointer select-none flex-shrink-0 transition-colors ${
                          selectedObsLabels[o.key]
                            ? "border-[#1113a2] bg-[#1113a2]/5 font-semibold"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="accent-[#1113a2]"
                          checked={Boolean(selectedObsLabels[o.key])}
                          onChange={() => setSelectedObsLabels((p) => ({ ...p, [o.key]: !p[o.key] }))}
                        />
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: obsLabelColor(o.key) }}
                        />
                        <span className="whitespace-nowrap font-semibold">{o.label}</span>

                        {obsAnimalBadge(o.key) ? (
                          <span className="ml-1 inline-flex items-center rounded-full bg-gray-100 border border-gray-200 px-2 py-[2px] text-[10px] font-bold text-gray-700 flex-shrink-0">
                            {obsAnimalBadge(o.key)}
                          </span>
                        ) : null}

                        <span className="ml-1 inline-flex items-center justify-center min-w-[22px] h-[18px] px-1.5 rounded-full bg-gray-100 text-gray-700 font-bold text-[10px] flex-shrink-0">
                          {o.count}
                        </span>
                      </label>
                    ))}
                  </div>

                  {canScrollRight && (
                    <button
                      type="button"
                      onClick={() => scrollCarousel("right")}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-l-lg shadow-md"
                      aria-label="Défiler vers la droite"
                    >
                      →
                    </button>
                  )}
                </div>
              </div>

              {/* Légende compacte */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3">
                  <div className="flex items-center gap-1.5 font-bold text-blue-700 mb-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#1113a2]" />
                    Bleu
                  </div>
                  <div className="text-sm text-gray-800 font-semibold">Spot éthique / OK</div>
                  <div className="text-xs text-gray-700 mt-1">Reste discret et garde tes distances.</div>
                </div>

                <div className="rounded-2xl border border-orange-200 bg-orange-50 p-3">
                  <div className="flex items-center gap-1.5 font-bold text-orange-700 mb-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#f59e0b]" />
                    Orange
                  </div>
                  <div className="text-sm text-gray-800 font-semibold">Spot sensible</div>
                  <div className="text-xs text-gray-700 mt-1">Ça peut vite basculer. Fais attention.</div>
                </div>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-3">
                  <div className="flex items-center gap-1.5 font-bold text-red-700 mb-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#dc2626]" />
                    Rouge
                  </div>
                  <div className="text-sm text-gray-800 font-semibold">À éviter</div>
                  <div className="text-xs text-gray-700 mt-1">Mauvaises pratiques. Choisis ailleurs.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARTE + INFOS */}
      <section className="w-full bg-white py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-2 md:p-3">
            <div ref={mapRef} className="w-full h-[420px] md:h-[520px] rounded-xl overflow-hidden bg-white" />
          </div>

          <CardShell className="p-6 md:p-8 bg-white">
            <div className="flex items-start gap-3">
              <div className="mt-[2px] w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-sm font-black text-gray-800">
                i
              </div>
              <div className="w-full">
                <div className="text-sm font-black uppercase tracking-widest text-gray-900">Informations</div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {infoLines.map((txt, i) => (
                    <div
                      key={`info-${i}`}
                      className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800"
                    >
                      {highlightFacts(txt, [
                        "indices",
                        "pas une promesse",
                        "imprévisible",
                        "animaux",
                        "sauvages",
                        "observateurs",
                        "rouge",
                        "mauvaises pratiques",
                        "protection",
                      ])}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardShell>
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
                className="h-11 w-11 rounded-2xl bg-white/80 border border-white/60 shadow-sm hover:bg-white transition text-sm font-black disabled:opacity-50"
                aria-label="Précédent"
                disabled={speciesSlides.length <= 1}
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => setActiveSlide((s) => (s === speciesSlides.length - 1 ? 0 : s + 1))}
                className="h-11 w-11 rounded-2xl bg-white/80 border border-white/60 shadow-sm hover:bg-white transition text-sm font-black disabled:opacity-50"
                aria-label="Suivant"
                disabled={speciesSlides.length <= 1}
              >
                →
              </button>
            </div>
          </div>

          <div className="mt-8 overflow-hidden">
            <div className="flex" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
              {speciesSlides.map((slide, idx) => (
                <div key={`${slide.key}-${idx}`} className="min-w-full">
                  <CardShell className="bg-white shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="p-6 md:p-8">
                        <div className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden border border-gray-200 bg-gray-100">
                          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-3">
                          {[
                            { label: "Spots", val: slide.meta.spotsCount, border: "border-blue-100", bg: "bg-blue-50", text1: "text-blue-700", text2: "text-blue-900" },
                            { label: "Pays", val: slide.meta.countriesCount, border: "border-emerald-100", bg: "bg-emerald-50", text1: "text-emerald-700", text2: "text-emerald-900" },
                            { label: "Continents", val: slide.meta.continentsCount, border: "border-violet-100", bg: "bg-violet-50", text1: "text-violet-700", text2: "text-violet-900" },
                          ].map((k, i) => (
                            <div key={`meta-${i}`} className={`rounded-[2rem] border ${k.border} ${k.bg} p-4 text-xs`}>
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

                        <ul className="mt-5 space-y-3 text-sm md:text-base text-gray-800 list-disc pl-5">
                          {slide.facts.map((f, i) => (
                            <li key={`${slide.key}-fact-${i}`}>{highlightFacts(f, blueKeywords)}</li>
                          ))}
                        </ul>

                        <div className="mt-4 text-xs text-gray-600">
                          Astuce : clique sur une bulle pour zoomer, puis clique sur un point pour voir le détail.
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

      {/* GUIDE */}
      <section className="w-full bg-gray-100 py-14 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-4">
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-gray-900">
              Le guide d'un bon voyageur
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
