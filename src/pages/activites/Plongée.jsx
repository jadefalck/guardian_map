// src/pages/activites/Plongée.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTranslation } from "react-i18next";

import EXCEL_URL from "../../data/BDD_centres_plongees.xlsx?url";
import oceanImage from "../../assets/images/bannière_blog2.jpg";

import userImg from "../../assets/images/utilisateur.png";

// images pourquoi centre labellisé
import safetyImg1 from "../../assets/images/plongee_securite_humain_1.png";
import safetyImg2 from "../../assets/images/plongee_securite_humain_2.png";
import safetyImg3 from "../../assets/images/plongee_securite_humain_3.png";
import safetyImg4 from "../../assets/images/plongee_securite_humain_4.png";

import faunaImg1 from "../../assets/images/plongee_securite_faune_1.png";
import faunaImg2 from "../../assets/images/plongee_securite_faune_2.png";
import faunaImg3 from "../../assets/images/plongee_securite_faune_3.png";
import faunaImg4 from "../../assets/images/plongee_securite_faune_4.png";

/* ✅ Logos labels (assets/images/logos) */
import gfLogo from "../../assets/images/logos/GF_Logo.png";
import hiraLogo from "../../assets/images/logos/HIRA.png";
import long181Logo from "../../assets/images/logos/longitude181.png";
import mantaTrustLogo from "../../assets/images/logos/manta_trust.png";
import padiEcoLogo from "../../assets/images/logos/PADI_ECO_Logo.webp";
import reefRenewalLogo from "../../assets/images/logos/reef_renewal.png";
import wcaLogo from "../../assets/images/logos/WCA.webp";

const KEY = "gsmNeDjg2V0pS8etxXtI";
const STYLE = `https://api.maptiler.com/maps/streets/style.json?key=${KEY}`;

/**
 * ✅ IMPORTANT :
 * - On affiche TOUJOURS des pins.
 * - Pour éviter la carte blanche avec 1000+ DOM markers :
 *   -> on affiche uniquement ceux DANS LE VIEWPORT (bounds)
 *   -> on limite MAX_PINS
 *   -> on rend les pins petits (14px)
 */
const MAX_PINS = 900;

/* ========= UI Shell ========= */
function CardShell({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-[3rem] border border-gray-200 bg-white shadow-sm overflow-hidden",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

/* ========= Utils ========= */
const toSlug = (s = "") =>
  s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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

const COLS = {
  label: ["label", "Label"],
  continent: ["continent", "Continent", "zone", "Zone"],
  country: ["pays", "Pays", "country", "Country"],
  name: ["nom", "Nom", "name", "Name", "zone_name", "Zone_name"],
  website: ["site_du_centre", "site", "Site", "website", "Website", "url", "URL"],
  lat: ["lat", "Lat", "LAT", "latitude", "Latitude", "LATITUDE", "y", "Y"],
  lon: [
    "long",
    "Long",
    "LONG",
    "lon",
    "Lon",
    "LON",
    "lng",
    "Lng",
    "LNG",
    "longitude",
    "Longitude",
    "x",
    "X",
  ],
};

/** ✅ Couleurs ULTRA distinctes (jaune/vert/bleu/violet + palette variée) */
const LABEL_COLORS_BY_SLUG = {
  "green-fins": "#22c55e", // vert
  hira: "#f59e0b", // jaune/ambre
  "longitude-181": "#3b82f6", // bleu
  "manta-trust": "#8b5cf6", // violet
  "reef-renewal": "#06b6d4", // cyan
};
const FALLBACK_PALETTE = [
  "#ef4444", // rouge
  "#f97316", // orange
  "#eab308", // jaune
  "#22c55e", // vert
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#3b82f6", // bleu
  "#8b5cf6", // violet
  "#ec4899", // rose
  "#a855f7", // purple alt
];

function labelColor(slug) {
  if (LABEL_COLORS_BY_SLUG[slug]) return LABEL_COLORS_BY_SLUG[slug];
  const s = slug || "label";
  let hash = 0;
  for (let i = 0; i < s.length; i += 1) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return FALLBACK_PALETTE[hash % FALLBACK_PALETTE.length];
}

/** ✅ Pin DOM ultra safe */
function makeSmallPin(color) {
  const el = document.createElement("div");
  el.style.width = "14px";
  el.style.height = "14px";
  el.style.borderRadius = "9999px";
  el.style.background = color;
  el.style.border = "2px solid white";
  el.style.boxShadow = "0 6px 12px rgba(0,0,0,.22)";
  el.style.cursor = "pointer";
  return el;
}

/** Logos */
function logoForLabel(labelSlug) {
  const slug = (labelSlug || "").toLowerCase();
  if (slug === "green-fins") return gfLogo;
  if (slug === "hira") return hiraLogo;
  if (slug === "longitude-181") return long181Logo;
  if (slug === "manta-trust") return mantaTrustLogo;
  if (slug.includes("padi") && slug.includes("eco")) return padiEcoLogo;
  if (slug === "reef-renewal") return reefRenewalLogo;
  if (slug.includes("wca")) return wcaLogo;
  return null;
}

/** Descriptions (✅ plus détaillées) */
function labelDescriptions(labelName, labelSlug) {
  const slug = (labelSlug || "").toLowerCase();
  const name = labelName || "Label";

  let oneLiner = "Label présent dans la base.";
  let long = `Description à compléter pour ${name}.`;

  if (slug === "green-fins") {
    oneLiner = "Programme international anti-impacts : briefings, règles récif, déchets, pratiques responsables.";
    long =
      "Green Fins est un programme international (plongée & snorkeling) qui aide les opérateurs à réduire leur impact sur les récifs et la faune. " +
      "Concrètement, un centre Green Fins est évalué (checklist), formé et accompagné : briefings écologiques, gestion des déchets, limitation du contact avec le récif, " +
      "bonne flottabilité, consignes sur les crèmes solaires, ancrage/amarres, et amélioration continue. " +
      "L’idée : transformer les “bonnes intentions” en procédures et habitudes mesurables sur le terrain.";
  } else if (slug === "hira") {
    oneLiner = "Référence sécurité & gestion des risques : procédures, analyse de danger, préparation aux urgences.";
    long =
      "HIRA (Hazard Identification & Risk Assessment) n’est pas juste un “label marketing” : c’est une approche structurée de sécurité. " +
      "On identifie les dangers (météo, courants, profondeur, matériel, encadrement), on évalue les risques, puis on met en place des mesures : " +
      "briefings standardisés, check matériel, ratios encadrants, plans d’urgence, oxygène, protocoles de remontée/assistance, et retours d’expérience après incident. " +
      "Un centre qui suit une logique HIRA est généralement plus “carré” en organisation et en prévention.";
  } else if (slug === "longitude-181") {
    oneLiner = "Charte éthique : plongée respectueuse du vivant, pédagogie, cohérence avec la protection des aires marines.";
    long =
      "Longitude 181 est une référence éthique francophone (charte) : “plonger en respectant le vivant”. " +
      "Cela couvre notamment : pas de contact/collecte, pas de nourrissage, pas de poursuite, respect des distances, " +
      "sensibilisation des plongeurs, choix de sites et d’amarrages adaptés, et cohérence avec la protection locale (aires marines, règles des parcs). " +
      "L’intérêt : une boussole éthique claire, facile à comprendre pour les voyageurs, et un cadre pour les professionnels.";
  } else if (slug === "manta-trust") {
    oneLiner = "Référence scientifique sur les mantas : observation responsable + sensibilisation / conservation.";
    long =
      "Manta Trust est une organisation reconnue centrée sur la recherche et la conservation des raies mantas. " +
      "Les opérateurs associés suivent généralement des consignes d’observation strictes : distance, angle d’approche, " +
      "gestion du nombre de plongeurs/snorkelers, pas de blocage de trajectoire, pas de flash agressif, et briefing comportemental. " +
      "Souvent, il y a aussi une dimension “science” : collecte d’observations, photo-ID, partage de données, et éducation des clients.";
  } else if (slug === "reef-renewal") {
    oneLiner = "Restauration de récifs : pépinières, transplantation, suivi, actions locales encadrées + éducation.";
    long =
      "Reef Renewal renvoie à des initiatives de restauration (nurseries/pépinières, bouturage, transplantation, suivi). " +
      "Un centre impliqué dans ce type de programme montre généralement un engagement concret : participation à des projets locaux, " +
      "formations, suivi écologique, parfois partenariats scientifiques, et sensibilisation des plongeurs. " +
      "Attention : la restauration n’est pas une excuse pour impacter le récif — un bon programme est encadré, transparent et complémentaire à la protection.";
  }

  return { oneLiner, long };
}

/** ========= Zoom helpers ========= */
const DEFAULT_VIEW = { center: [0, 15], zoom: 1.6 };

function getFilteredCenters(centers, passesFilters) {
  return centers.filter(passesFilters);
}

function shouldSkipZoomForGlobalSpread(boundsInfo) {
  if (!boundsInfo) return true;
  const { lonSpan, latSpan } = boundsInfo;
  // “points partout” => pas de zoom (quasi-monde)
  return lonSpan >= 240 || latSpan >= 120;
}

function computeBoundsInfo(list) {
  if (!list?.length) return null;
  let minLat = 90,
    maxLat = -90,
    minLon = 180,
    maxLon = -180;

  for (const p of list) {
    minLat = Math.min(minLat, p.lat);
    maxLat = Math.max(maxLat, p.lat);
    minLon = Math.min(minLon, p.lon);
    maxLon = Math.max(maxLon, p.lon);
  }

  return {
    minLat,
    maxLat,
    minLon,
    maxLon,
    latSpan: Math.abs(maxLat - minLat),
    lonSpan: Math.abs(maxLon - minLon),
  };
}

function fitMapToCenters(map, list) {
  if (!map || !list?.length) return;

  if (list.length === 1) {
    map.easeTo({
      center: [list[0].lon, list[0].lat],
      zoom: 8,
      duration: 750,
    });
    return;
  }

  const b = new maplibregl.LngLatBounds();
  list.forEach((p) => b.extend([p.lon, p.lat]));

  map.fitBounds(b, {
    padding: 90,
    duration: 800,
    maxZoom: 6.5,
  });
}

export default function Plongee() {
  const { t } = useTranslation();

  const mapRef = useRef(null);
  const mapObj = useRef(null);
  const markersRef = useRef([]);
  const lastAutoFitKeyRef = useRef("");

  const [rows, setRows] = useState([]);
  const [hasError, setHasError] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryQuery, setCountryQuery] = useState("");

  const [selectedLabels, setSelectedLabels] = useState({});
  const [openLabel, setOpenLabel] = useState(null);

  // ✅ Avis (modal) -> envoi mail via endpoint
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSending, setReviewSending] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    centerName: "",
    country: "",
    userName: "",
    rating: 5,
    comment: "",
  });

  // ✅ Signalements (2 formulaires) -> envoi mail via endpoints
  const [openReport, setOpenReport] = useState(null); // "suggest" | "abuse" | null

  const [suggestSent, setSuggestSent] = useState(false);
  const [suggestError, setSuggestError] = useState("");
  const [suggestSending, setSuggestSending] = useState(false);
  const [suggestForm, setSuggestForm] = useState({
    operator: "",
    country: "",
    website: "",
    why: "",
  });

  const [abuseSent, setAbuseSent] = useState(false);
  const [abuseError, setAbuseError] = useState("");
  const [abuseSending, setAbuseSending] = useState(false);
  const [abuseForm, setAbuseForm] = useState({
    operator: "",
    country: "",
    animal: "",
    abuses: { feeding: false, touch: false, chase: false, overcrowded: false, distance: false },
    details: "",
  });

  const updateAbuse = (key) =>
    setAbuseForm((p) => ({ ...p, abuses: { ...p.abuses, [key]: !p.abuses[key] } }));

  // ========= Load Excel =========
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(EXCEL_URL);
        if (!res.ok) throw new Error("Excel not found");
        const buf = await res.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws, { defval: "" });
        setRows(data);
      } catch (e) {
        console.error(e);
        setHasError(true);
      }
    })();
  }, []);

  // ========= Detect schema =========
  const schema = useMemo(() => {
    if (!rows.length) return null;
    const rawKeys = Object.keys(rows[0] || {});
    const keyMap = new Map(rawKeys.map((k) => [k.trim(), k]));

    const pick = (cands) => {
      const trimmedSet = new Set(rawKeys.map((k) => k.trim()));
      const found = cands.find((c) => trimmedSet.has(c));
      return found ? keyMap.get(found) : null;
    };

    return {
      kLabel: pick(COLS.label),
      kContinent: pick(COLS.continent),
      kCountry: pick(COLS.country),
      kName: pick(COLS.name),
      kWeb: pick(COLS.website),
      kLat: pick(COLS.lat),
      kLon: pick(COLS.lon),
    };
  }, [rows]);

  // ========= Normalize centers =========
  const centers = useMemo(() => {
    if (!rows.length || !schema?.kLat || !schema?.kLon) return [];
    const { kLabel, kContinent, kCountry, kName, kWeb, kLat, kLon } = schema;

    const out = [];
    for (const r of rows) {
      let lat = toNum(r[kLat]);
      let lon = toNum(r[kLon]);

      // parfois inversé
      if (lat != null && lon != null && Math.abs(lat) > 90 && Math.abs(lon) <= 90) [lat, lon] = [lon, lat];
      if (lat == null || lon == null) continue;
      if (Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;

      const country = kCountry ? String(r[kCountry] || "").trim() : "";
      if (!country || country === "0") continue;

      const continent = kContinent ? String(r[kContinent] || "").trim() : "";
      const name = kName ? String(r[kName] || "").trim() : "";
      const website = kWeb ? fixUrl(r[kWeb]) : "";

      const labelRaw = kLabel ? String(r[kLabel] || "").trim() : "";
      const label = labelRaw || "Sans label";
      const labelSlug = toSlug(label) || "sans-label";

      out.push({
        continent,
        continentSlug: toSlug(continent) || "unknown",
        country,
        countrySlug: toSlug(country),
        name,
        website,
        lat,
        lon,
        label,
        labelSlug,
      });
    }
    return out;
  }, [rows, schema]);

  // ========= Labels list =========
  const labelOptions = useMemo(() => {
    const acc = new Map();
    centers.forEach((c) => {
      if (!c.labelSlug) return;
      if (!acc.has(c.labelSlug)) acc.set(c.labelSlug, { slug: c.labelSlug, label: c.label, count: 0 });
      acc.get(c.labelSlug).count += 1;
    });

    const arr = Array.from(acc.values());
    const priority = ["green-fins", "hira", "longitude-181", "manta-trust", "reef-renewal"];
    arr.sort((a, b) => {
      const ai = priority.indexOf(a.slug);
      const bi = priority.indexOf(b.slug);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      return a.label.localeCompare(b.label, "fr");
    });

    return arr;
  }, [centers]);

  // init selection = all
  useEffect(() => {
    if (!labelOptions.length) return;
    setSelectedLabels((prev) => {
      const hasAny = Object.keys(prev || {}).length > 0;
      if (hasAny) {
        const next = { ...prev };
        labelOptions.forEach((o) => {
          if (next[o.slug] === undefined) next[o.slug] = true;
        });
        return next;
      }
      const next = {};
      labelOptions.forEach((o) => (next[o.slug] = true));
      return next;
    });
  }, [labelOptions]);

  const allSelected = useMemo(() => {
    if (!labelOptions.length) return true;
    return labelOptions.every((o) => selectedLabels[o.slug]);
  }, [labelOptions, selectedLabels]);

  const selectedLabelSlugs = useMemo(
    () => labelOptions.filter((o) => selectedLabels[o.slug]).map((o) => o.slug),
    [labelOptions, selectedLabels]
  );

  const toggleAllLabels = () => {
    const next = {};
    labelOptions.forEach((o) => (next[o.slug] = !allSelected));
    setSelectedLabels(next);
  };

  const toggleOneLabel = (slug) => setSelectedLabels((p) => ({ ...p, [slug]: !p[slug] }));

  const totalsByLabel = useMemo(() => {
    const out = {};
    centers.forEach((c) => (out[c.labelSlug] = (out[c.labelSlug] || 0) + 1));
    return out;
  }, [centers]);

  // ========= Countries =========
  const countryStats = useMemo(() => {
    const acc = new Map();
    centers.forEach((c) => {
      const slug = c.countrySlug || "";
      const name = c.country || "";
      if (!slug || !name) return;
      if (!acc.has(slug)) acc.set(slug, { country: name, slug, count: 0 });
      acc.get(slug).count += 1;
    });

    const arr = Array.from(acc.values());
    arr.sort((a, b) => {
      const la = t(`countries.${a.slug}`, { defaultValue: a.country });
      const lb = t(`countries.${b.slug}`, { defaultValue: b.country });
      return la.localeCompare(lb, "fr");
    });
    return arr;
  }, [centers, t]);

  const selectedCountrySlug = useMemo(() => (selectedCountry ? toSlug(selectedCountry) : ""), [selectedCountry]);

  // ========= Filter =========
  const passesFilters = (c) => {
    const anyChecked = Object.values(selectedLabels).some(Boolean);
    if (anyChecked && !selectedLabels[c.labelSlug]) return false;

    if (selectedCountry) {
      const sel = toSlug(selectedCountry);
      if (c.countrySlug !== sel) return false;
    }
    return true;
  };

  // ✅ only pins in viewport
  const getPinsInViewport = (map) => {
    if (!map) return [];
    const b = map.getBounds();
    const south = b.getSouth();
    const north = b.getNorth();
    const west = b.getWest();
    const east = b.getEast();
    const crossesAnti = west > east;

    const filtered = getFilteredCenters(centers, passesFilters);
    const visible = filtered.filter((c) => {
      if (c.lat < south || c.lat > north) return false;
      if (!crossesAnti) return c.lon >= west && c.lon <= east;
      return c.lon >= west || c.lon <= east;
    });

    return visible.length > MAX_PINS ? visible.slice(0, MAX_PINS) : visible;
  };

  // ========= Map init =========
  useEffect(() => {
    if (mapObj.current || !mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: STYLE,
      center: DEFAULT_VIEW.center,
      zoom: DEFAULT_VIEW.zoom,
      attributionControl: true,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      map.resize();
      map.jumpTo(DEFAULT_VIEW);
    });

    const ro = new ResizeObserver(() => map.resize());
    if (mapRef.current) ro.observe(mapRef.current);

    mapObj.current = map;

    return () => {
      ro.disconnect();
      map.remove();
      mapObj.current = null;
    };
  }, []);

  // ========= Auto-zoom on filters =========
  useEffect(() => {
    const map = mapObj.current;
    if (!map) return;
    if (!centers.length) return;

    const onlyOneLabelSelected = selectedLabelSlugs.length === 1 && !selectedCountry;
    const shouldZoom =
      Boolean(selectedCountry) || onlyOneLabelSelected;

    if (!shouldZoom) return;

    // Build a stable key so we don't refit 20 times while user clicks around
    const key = `c:${selectedCountrySlug || "all"}|l:${selectedLabelSlugs.sort().join(",") || "all"}`;
    if (lastAutoFitKeyRef.current === key) return;
    lastAutoFitKeyRef.current = key;

    const filtered = getFilteredCenters(centers, passesFilters);
    if (!filtered.length) return;

    const info = computeBoundsInfo(filtered);
    if (shouldSkipZoomForGlobalSpread(info)) {
      // points partout -> pas de zoom
      map.easeTo({ ...DEFAULT_VIEW, duration: 650 });
      return;
    }

    // petite latence pour laisser le UI se mettre à jour
    const id = window.setTimeout(() => {
      fitMapToCenters(map, filtered);
    }, 120);

    return () => window.clearTimeout(id);
  }, [centers, selectedCountry, selectedCountrySlug, selectedLabelSlugs, selectedLabels]);

  // ========= Render pins =========
  useEffect(() => {
    const map = mapObj.current;
    if (!map) return;

    const clearMarkers = () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };

    const render = () => {
      clearMarkers();

      const pins = getPinsInViewport(map);
      if (!pins.length) return;

      pins.forEach((p) => {
        const color = labelColor(p.labelSlug);
        const el = makeSmallPin(color);

        const titleCountry = p.countrySlug
          ? t(`countries.${p.countrySlug}`, { defaultValue: p.country })
          : p.country || "";

        const safeName = (p.name || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const safeLabel = (p.label || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const websiteHtml = p.website
          ? `<a href="${p.website}" target="_blank" rel="noopener noreferrer" style="color:#1113a2;text-decoration:underline;word-break:break-word;">${p.website}</a>`
          : "<span style='color:#6b7280;'>Site web indisponible</span>";

        const popupHtml = `
          <div style="font-size:12px; max-width:270px;">
            <div style="font-weight:900; color:#1113a2; margin-bottom:3px;">${safeName || "Centre"}</div>
            <div style="margin-bottom:6px;">${titleCountry}${p.continent ? ` • ${p.continent}` : ""}</div>
            <div style="color:#111827; margin-bottom:8px;">Label : <strong>${safeLabel}</strong></div>
            <div style="margin-bottom:6px;color:#111827;">Infos / réservation :</div>
            <div>${websiteHtml}</div>
          </div>
        `;

        const marker = new maplibregl.Marker({ element: el, anchor: "center" })
          .setLngLat([p.lon, p.lat])
          .setPopup(new maplibregl.Popup({ offset: 10 }).setHTML(popupHtml))
          .addTo(map);

        markersRef.current.push(marker);
      });
    };

    render();
    map.on("move", render);
    map.on("zoom", render);

    return () => {
      map.off("move", render);
      map.off("zoom", render);
      clearMarkers();
    };
  }, [centers, selectedLabels, selectedCountry, t]);

  // ========= Label cards right =========
  const labelCards = useMemo(() => {
    return labelOptions.map((o) => {
      const desc = labelDescriptions(o.label, o.slug);
      return { key: o.slug, title: o.label, short: desc.oneLiner, long: desc.long, logo: logoForLabel(o.slug) };
    });
  }, [labelOptions]);

  const currentLabel = useMemo(() => {
    if (!openLabel) return null;
    return labelCards.find((c) => c.key === openLabel) || null;
  }, [openLabel, labelCards]);

  // ========= Avis: center index (autocomplete) =========
  const centerNameIndex = useMemo(
    () =>
      Array.from(new Set(centers.map((c) => c.name).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b, "fr")
      ),
    [centers]
  );

  const reviewSuggestions = useMemo(() => {
    const q = (reviewForm.centerName || "").trim().toLowerCase();
    if (!q) return [];
    return centerNameIndex.filter((n) => n.toLowerCase().includes(q)).slice(0, 8);
  }, [reviewForm.centerName, centerNameIndex]);

  const pickCenterForReview = (name) => {
    const found = centers.find((c) => c.name === name);
    setReviewForm((p) => ({ ...p, centerName: name, country: found?.country || p.country }));
  };

  // ===== Avis clients (carrousel) =====
  const reviews = useMemo(
    () => [
      { name: "Camille", rating: 5, text: "Super expérience : briefing clair, et respect des règles." },
      { name: "Nicolas", rating: 4, text: "On se sent en confiance. Équipe pro et vraie sensibilisation." },
      { name: "Leïla", rating: 5, text: "Très carré : consignes, distance, zéro forcing." },
      { name: "Thomas", rating: 5, text: "Choisi via les labels : aucun regret." },
      { name: "Julie", rating: 4, text: "Bonne pédagogie et respect du milieu." },
    ],
    []
  );

  const reviewsViewportRef = useRef(null);

  const scrollReviews = (dir) => {
    const el = reviewsViewportRef.current;
    if (!el) return;

    const card = el.querySelector(".snap-start");
    const step = card ? card.getBoundingClientRect().width + 16 : Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  // ========= Submit handlers (✅ envoi mail comme GuideVoyage) =========
  const submitReview = async (e) => {
    e.preventDefault();
    setReviewSent(false);
    setReviewError("");
    setReviewSending(true);

    try {
      const res = await fetch("/api/send-dive-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reviewForm,
          page: "plongee",
          createdAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Server response not ok");

      setReviewSent(true);
      setReviewForm({ centerName: "", country: "", userName: "", rating: 5, comment: "" });
    } catch (err) {
      console.error("Erreur envoi avis plongée :", err);
      setReviewError("Impossible d’envoyer l’avis pour le moment. Réessaie plus tard.");
    } finally {
      setReviewSending(false);
    }
  };

  const submitSuggest = async (e) => {
    e.preventDefault();
    setSuggestSent(false);
    setSuggestError("");
    setSuggestSending(true);

    try {
      const res = await fetch("/api/send-dive-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...suggestForm,
          page: "plongee",
          createdAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Server response not ok");

      setSuggestSent(true);
      setSuggestForm({ operator: "", country: "", website: "", why: "" });
    } catch (err) {
      console.error("Erreur envoi recommandation :", err);
      setSuggestError("Impossible d’envoyer la recommandation pour le moment. Réessaie plus tard.");
    } finally {
      setSuggestSending(false);
    }
  };

  const submitAbuse = async (e) => {
    e.preventDefault();
    setAbuseSent(false);
    setAbuseError("");
    setAbuseSending(true);

    try {
      const res = await fetch("/api/send-dive-abuse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...abuseForm,
          page: "plongee",
          createdAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Server response not ok");

      setAbuseSent(true);
      setAbuseForm({
        operator: "",
        country: "",
        animal: "",
        abuses: { feeding: false, touch: false, chase: false, overcrowded: false, distance: false },
        details: "",
      });
    } catch (err) {
      console.error("Erreur envoi signalement :", err);
      setAbuseError("Impossible d’envoyer le signalement pour le moment. Réessaie plus tard.");
    } finally {
      setAbuseSending(false);
    }
  };

  const Stars = ({ rating = 5, onChange }) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const star = i + 1;
        const active = star <= rating;
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange && onChange(star)}
            className={`text-2xl leading-none ${
              active ? "text-yellow-400" : "text-gray-300"
            } hover:scale-[1.03] transition`}
            aria-label={`${star} étoiles`}
            title={`${star} étoiles`}
          >
            ★
          </button>
        );
      })}
    </div>
  );

  const clearAll = () => {
    setSelectedCountry("");
    setCountryQuery("");
    const next = {};
    labelOptions.forEach((o) => (next[o.slug] = true));
    setSelectedLabels(next);

    // reset fit key so future selections zoom again
    lastAutoFitKeyRef.current = "";

    const map = mapObj.current;
    if (map) map.easeTo({ ...DEFAULT_VIEW, duration: 650 });
  };

  return (
    <div className="w-full">
      {/* TITRE */}
      <section className="py-12 px-6 text-center bg-gray-200">
        <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#1113a2]">
          Plongée
        </div>
        <h1 className="mt-3 text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-gray-900">
          Où veux-tu plonger ?
        </h1>
      </section>

      {/* HERO / RECHERCHE */}
      <section className="w-full relative overflow-hidden">
        <img src={oceanImage} alt="Fond océan" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 w-full py-10 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <CardShell className="bg-white/95 backdrop-blur shadow-xl border border-white/40 p-5 md:p-7">
              <div className="flex items-end gap-3 flex-wrap">
                <div className="flex-1 min-w-[260px]">
                  <div className="text-center">
                    <label className="text-base md:text-lg font-semibold text-gray-900">
                      {t("activities.diving.countrySearchLabel", { defaultValue: "Rechercher un pays" })}
                    </label>
                  </div>

                  <input
                    value={countryQuery}
                    onChange={(e) => setCountryQuery(e.target.value)}
                    placeholder={t("activities.diving.countrySearchPh", {
                      defaultValue: "Ex : Philippines, France, Indonésie…",
                    })}
                    className="mt-3 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                  <div className="mt-4 flex gap-2 overflow-x-auto whitespace-nowrap pb-2 pr-2">
                    {countryStats
                      .filter((c) => {
                        const q = countryQuery.trim().toLowerCase();
                        if (!q) return true;
                        const label = t(`countries.${c.slug}`, { defaultValue: c.country }).toLowerCase();
                        return label.includes(q);
                      })
                      .map((c) => {
                        const label = t(`countries.${c.slug}`, { defaultValue: c.country });
                        const active = selectedCountrySlug && c.slug === selectedCountrySlug;

                        return (
                          <button
                            key={c.slug}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(c.country);
                              // reset fit key so clicking same country twice can still re-fit if needed
                              lastAutoFitKeyRef.current = "";
                            }}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition flex-none
                              ${
                                active
                                  ? "border-[#1113a2] bg-[#1113a2]/10 text-[#1113a2] font-semibold"
                                  : "border-gray-200 bg-white hover:border-[#1113a2]/60"
                              }`}
                          >
                            <span>{label}</span>
                            <span className="ml-1 inline-flex items-center justify-center min-w-[26px] h-[20px] px-2 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                              {c.count}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>

                <div className="pb-1 flex gap-2">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50 transition"
                  >
                    Tout réinitialiser
                  </button>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-700">
                ✅ Les pins s’affichent toujours, mais uniquement ceux visibles à l’écran (performance).
              </div>
            </CardShell>
          </div>
        </div>
      </section>

      {/* LAYOUT: Carte + Labels à droite */}
      <section className="w-full bg-white py-10 px-2 md:px-3">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-3">
            {/* Carte */}
            <CardShell className="p-3">
              <div className="relative">
                <div className="absolute top-3 left-3 z-20">
                  <div className="rounded-[1.75rem] border border-gray-200 bg-white/95 backdrop-blur-sm shadow-md px-4 py-3 w-[260px]">
                    <p className="text-[10px] font-black text-gray-800 uppercase tracking-[0.35em]">CENTRES LABELLISÉS</p>

                    <div className="mt-3">
                      <p className="text-xs font-semibold text-[#1113a2] mb-2">Label</p>

                      <label className="flex items-center gap-2 rounded-[1.25rem] px-3 py-2 border border-gray-200 bg-white text-xs mb-2">
                        <input type="checkbox" className="accent-[#1113a2]" checked={allSelected} onChange={toggleAllLabels} />
                        <span>(Sélectionner tout)</span>
                      </label>

                      <div className="space-y-1.5 text-xs">
                        {labelOptions.map((o) => (
                          <label
                            key={o.slug}
                            className={`flex items-center gap-2 rounded-[1.25rem] px-3 py-2 border transition ${
                              selectedLabels[o.slug]
                                ? "border-[#1113a2] bg-[#1113a2]/5 font-semibold"
                                : "border-gray-200 bg-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="accent-[#1113a2]"
                              checked={Boolean(selectedLabels[o.slug])}
                              onChange={() => {
                                toggleOneLabel(o.slug);
                                // pour que l'auto-fit puisse se relancer correctement
                                lastAutoFitKeyRef.current = "";
                              }}
                            />
                            <span
                              className="inline-block w-3 h-3 rounded-full border border-white shadow"
                              style={{ background: labelColor(o.slug) }}
                            />
                            <span className="flex-1 min-w-0 truncate">{o.label}</span>
                            <span className="ml-auto inline-flex items-center justify-center min-w-[30px] h-[20px] px-2 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                              {totalsByLabel[o.slug] || 0}
                            </span>
                          </label>
                        ))}
                      </div>

                      {hasError && (
                        <p className="mt-2 text-xs text-orange-600">
                          {t("activities.diving.error", { defaultValue: "Impossible de charger l’Excel pour l’instant." })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div ref={mapRef} className="w-full h-[700px] rounded-[2rem] overflow-hidden bg-white" />
              </div>
            </CardShell>

            {/* Labels à droite */}
            <CardShell className="p-3">
              <div className="px-2 pt-2">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-500">Labels</p>
                <h3 className="mt-2 text-lg md:text-xl font-black uppercase tracking-tight text-gray-900">
                  Quels sont ces labels ?
                </h3>
              </div>

              <div className="mt-3 max-h-[700px] overflow-y-auto pr-1 space-y-2 px-2 pb-3">
                {labelCards.map((card) => (
                  <button
                    key={card.key}
                    type="button"
                    onClick={() => setOpenLabel(card.key)}
                    className="w-full text-left bg-gray-50 hover:bg-gray-100 transition rounded-[2rem] p-3 border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden">
                        {card.logo ? (
                          <img src={card.logo} alt={card.title} className="h-8 w-auto object-contain" loading="lazy" />
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400">LOGO</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block w-3 h-3 rounded-full border border-white shadow"
                            style={{ background: labelColor(card.key) }}
                          />
                          <p className="font-semibold text-gray-900 text-sm truncate">{card.title}</p>
                        </div>
                        <p className="mt-1 text-xs text-gray-700 leading-snug">{card.short}</p>
                      </div>

                      <span className="text-xs font-bold bg-white border border-gray-200 px-2 py-1 rounded-full text-gray-700">
                        {totalsByLabel[card.key] || 0}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardShell>
          </div>
        </div>
      </section>

      {/* AVIS */}
      <section className="w-full bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Avis (2/3) */}
            <div className="lg:col-span-2">
              <div className="flex items-end justify-between gap-4 mb-4">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-gray-900">
                  Avis clients
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    setReviewOpen(true);
                    setReviewSent(false);
                    setReviewError("");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#1113a2] text-white text-sm font-semibold shadow hover:opacity-95 transition"
                >
                  ✍️ Laisser un commentaire
                </button>
              </div>

              <div className="relative">
                {/* Flèches */}
                <button
                  type="button"
                  onClick={() => scrollReviews(-1)}
                  className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center hover:bg-gray-50"
                  aria-label="Précédent"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => scrollReviews(1)}
                  className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center hover:bg-gray-50"
                  aria-label="Suivant"
                >
                  ›
                </button>

                {/* Carrousel */}
                <div
                  ref={reviewsViewportRef}
                  className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pr-2"
                  style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "thin" }}
                >
                  {reviews.map((r, idx) => (
                    <div key={`${r.name}-${idx}`} className="snap-start flex-none w-[85%] sm:w-[420px] md:w-[520px]">
                      <div className="bg-white border border-gray-200 shadow-sm rounded-[2rem] p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full border border-gray-300 overflow-hidden shrink-0 bg-white">
                            <img src={userImg} alt="Utilisateur" className="w-full h-full object-cover" loading="lazy" />
                          </div>

                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{r.name}</p>
                            <div className="flex items-center gap-1" aria-label={`${r.rating} étoiles`}>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-lg ${i < r.rating ? "text-yellow-400" : "text-gray-300"}`}
                                  aria-hidden="true"
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 text-sm text-gray-700 leading-relaxed">“{r.text}”</p>

                        <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#1113a2]">
                          Vérifié
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1113a2]" />
                          Expérience labellisée
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-500">Ton avis sera publié après vérification.</p>
            </div>

            {/* Codes promos (1/3) */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-[2rem] shadow-sm p-6">
                {/* ✅ bubble en bleu + suppression “Comment ça marchera” */}
                <div className="rounded-[1.75rem] border border-blue-200 bg-blue-50 text-gray-900 p-5">
                  <p className="text-sm font-bold">Réductions & offres partenaires</p>
                  <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                    Des codes promos pour réserver des <b>activités labellisées</b> (plongée, snorkeling, sorties encadrées…).
                  </p>

                  <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white border border-blue-200 px-3 py-2 text-xs font-semibold">
                    ✨ Bientôt disponible
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi aller dans un centre certifié ? */}
      <section id="why-certified-dive" className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
          <CardShell className="p-6 md:p-10">
            <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#1113a2]">Bonnes pratiques</div>
            <h2 className="mt-2 text-xl md:text-2xl font-black uppercase tracking-tight text-gray-900">
              Pourquoi aller dans un centre certifié ?
            </h2>

            <h3 className="mt-6 text-base md:text-lg font-black uppercase tracking-tight text-gray-900 mb-2">
              Pour ta sécurité
            </h3>

            {/* ✅ bulles images plus petites */}
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {[safetyImg1, safetyImg2, safetyImg3, safetyImg4].map((img, index) => (
                  <div
                    key={`safety-img-${index}`}
                    className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100"

                  >
                    <img src={img} alt={`Sécurité plongée ${index + 1}`} className="w-full h-full object-contain" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-gray-900 mb-2">
              Pour la faune et les récifs
            </h3>

            {/* ✅ bulles images plus petites */}
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {[faunaImg1, faunaImg2, faunaImg3, faunaImg4].map((img, index) => (
                  <div
                    key={`fauna-img-${index}`}
                    className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100"
                  >
                    <img src={img} alt={`Protection de la faune ${index + 1}`} className="w-full h-full object-contain" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-gray-900 font-semibold text-lg">Un centre labellisé protège le plongeur… et l’océan.</p>
          </CardShell>
        </div>
      </section>

      {/* SIGNALMENTS */}
      <section className="w-full bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
          <CardShell className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#1113a2]">Communauté</div>
                <h2 className="mt-2 text-xl md:text-2xl font-black uppercase tracking-tight text-gray-900">
                  Aide-nous à améliorer la carte
                </h2>
                <p className="mt-2 text-sm text-gray-700">
                  Tu peux recommander une structure responsable (même sans label) ou signaler une mauvaise pratique.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setOpenReport(openReport === "suggest" ? null : "suggest");
                    setSuggestSent(false);
                    setSuggestError("");
                    setAbuseSent(false);
                    setAbuseError("");
                  }}
                  className={`w-full sm:w-auto px-5 py-3 rounded-2xl border text-sm font-semibold transition ${
                    openReport === "suggest"
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  🌿 Recommander un centre responsable
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOpenReport(openReport === "abuse" ? null : "abuse");
                    setAbuseSent(false);
                    setAbuseError("");
                    setSuggestSent(false);
                    setSuggestError("");
                  }}
                  className={`w-full sm:w-auto px-5 py-3 rounded-2xl border text-sm font-semibold transition ${
                    openReport === "abuse"
                      ? "bg-[#1113a2] text-white border-[#1113a2]"
                      : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  🚩 Signaler un comportement non éthique
                </button>
              </div>
            </div>

            {openReport === "suggest" && (
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
                <div className="rounded-[2rem] bg-white border border-gray-200 p-6">
                  <h3 className="text-lg font-black uppercase tracking-tight text-gray-900 mb-1">Recommander un centre responsable</h3>

                  {suggestError && (
                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                      <p className="text-sm font-semibold text-red-700">{suggestError}</p>
                    </div>
                  )}

                  <form onSubmit={submitSuggest} className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-700">Nom du centre</label>
                        <input
                          value={suggestForm.operator}
                          onChange={(e) => setSuggestForm((p) => ({ ...p, operator: e.target.value }))}
                          className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700">Pays</label>
                        <input
                          value={suggestForm.country}
                          onChange={(e) => setSuggestForm((p) => ({ ...p, country: e.target.value }))}
                          className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700">Site web (optionnel)</label>
                        <input
                          value={suggestForm.website}
                          onChange={(e) => setSuggestForm((p) => ({ ...p, website: e.target.value }))}
                          className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700">Pourquoi tu le recommandes ?</label>
                      <textarea
                        value={suggestForm.why}
                        onChange={(e) => setSuggestForm((p) => ({ ...p, why: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <button
                        type="submit"
                        disabled={suggestSending}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow disabled:opacity-60"
                      >
                        {suggestSending ? "Envoi…" : "Envoyer recommandation"}
                      </button>

                      {suggestSent && <p className="text-xs text-emerald-700 font-semibold">Merci ! En cours de vérification.</p>}
                    </div>
                  </form>
                </div>

                <div className="rounded-[2rem] bg-emerald-50 border border-emerald-200 p-6">
                  <p className="text-sm font-black uppercase tracking-tight text-gray-900 mb-2">Ce qu’on vérifie</p>
                  <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                    <li>Encadrement et sécurité</li>
                    <li>Respect du milieu</li>
                    <li>Transparence des pratiques</li>
                  </ul>
                </div>
              </div>
            )}

            {openReport === "abuse" && (
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
                <div className="rounded-[2rem] bg-white border border-gray-200 p-6">
                  <h3 className="text-lg font-black uppercase tracking-tight text-gray-900 mb-1">Signaler un comportement non éthique</h3>

                  {abuseError && (
                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                      <p className="text-sm font-semibold text-red-700">{abuseError}</p>
                    </div>
                  )}

                  <form onSubmit={submitAbuse} className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-700">Nom du centre</label>
                        <input
                          value={abuseForm.operator}
                          onChange={(e) => setAbuseForm((p) => ({ ...p, operator: e.target.value }))}
                          className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700">Pays</label>
                        <input
                          value={abuseForm.country}
                          onChange={(e) => setAbuseForm((p) => ({ ...p, country: e.target.value }))}
                          className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700">Espèce (optionnel)</label>
                        <input
                          value={abuseForm.animal}
                          onChange={(e) => setAbuseForm((p) => ({ ...p, animal: e.target.value }))}
                          className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                          placeholder="dauphin, requin-baleine…"
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">Nature de l’abus</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                        {[
                          ["feeding", "Nourrissage"],
                          ["touch", "Toucher l’animal"],
                          ["chase", "Poursuite/harcèlement"],
                          ["overcrowded", "Trop de bateaux"],
                          ["distance", "Non-respect distances"],
                        ].map(([k, label]) => (
                          <label
                            key={k}
                            className={`flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer select-none transition ${
                              abuseForm.abuses[k] ? "border-[#1113a2] bg-[#1113a2]/5" : "border-gray-200 bg-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="accent-[#1113a2]"
                              checked={Boolean(abuseForm.abuses[k])}
                              onChange={() => updateAbuse(k)}
                            />
                            <span className="text-sm text-gray-800">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700">Détails / lien preuve</label>
                      <input
                        value={abuseForm.details}
                        onChange={(e) => setAbuseForm((p) => ({ ...p, details: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                        placeholder="Décris + lien photo/vidéo"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <button
                        type="submit"
                        disabled={abuseSending}
                        className="px-5 py-2.5 rounded-xl bg-[#1113a2] text-white text-sm font-semibold shadow disabled:opacity-60"
                      >
                        {abuseSending ? "Envoi…" : "Envoyer signalement"}
                      </button>

                      {abuseSent && <p className="text-xs text-[#1113a2] font-semibold">Merci ! En cours de vérification.</p>}
                    </div>
                  </form>
                </div>

                <div className="rounded-[2rem] bg-slate-900 text-white p-6">
                  <p className="text-sm font-semibold">Sécurité & confidentialité</p>
                  <p className="text-xs opacity-90 mt-1">
                    Nous ne publions jamais tes données personnelles. Les infos servent uniquement à l’analyse et au tri.
                  </p>
                </div>
              </div>
            )}
          </CardShell>
        </div>
      </section>

      {/* MODALE : détails label */}
      {currentLabel && (
        <div className="fixed inset-0 z-[9999]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenLabel(null)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-start justify-between gap-4 p-5 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden">
                    {currentLabel.logo ? (
                      <img src={currentLabel.logo} alt={currentLabel.title} className="h-8 w-auto object-contain" loading="lazy" />
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400">LOGO</span>
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{currentLabel.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{currentLabel.short}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenLabel(null)}
                  className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition flex items-center justify-center text-gray-700"
                  aria-label="Fermer"
                  title="Fermer"
                >
                  ✕
                </button>
              </div>

              <div className="p-5">
                <p className="text-sm text-gray-800 leading-relaxed">{currentLabel.long}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE : laisser un avis */}
      {reviewOpen && (
        <div className="fixed inset-0 z-[9999]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setReviewOpen(false);
              setReviewSent(false);
              setReviewError("");
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-start justify-between gap-4 p-5 border-b border-gray-200">
                <div>
                  <p className="text-lg font-bold text-gray-900">Laisser un avis</p>
                  <p className="text-xs text-gray-600 mt-1">Ton avis sera publié après vérification.</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setReviewOpen(false);
                    setReviewSent(false);
                    setReviewError("");
                  }}
                  className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition flex items-center justify-center text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="p-5">
                {reviewSent ? (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
                    <p className="font-semibold text-emerald-800">Merci !</p>
                    <p className="text-sm text-emerald-800 mt-1">Votre avis a bien été envoyé.</p>
                  </div>
                ) : (
                  <>
                    {reviewError && (
                      <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                        <p className="text-sm font-semibold text-red-700">{reviewError}</p>
                      </div>
                    )}

                    <form onSubmit={submitReview} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="relative">
                          <label className="text-xs font-semibold text-gray-700">Centre (recherche dans la base)</label>
                          <input
                            value={reviewForm.centerName}
                            onChange={(e) => setReviewForm((p) => ({ ...p, centerName: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                            placeholder="Tape le nom…"
                            required
                          />

                          {reviewSuggestions.length > 0 && (
                            <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                              {reviewSuggestions.map((name) => (
                                <button
                                  key={name}
                                  type="button"
                                  onClick={() => pickCenterForReview(name)}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                                >
                                  {name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-700">Pays</label>
                          <input
                            value={reviewForm.country}
                            onChange={(e) => setReviewForm((p) => ({ ...p, country: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                        <div>
                          <label className="text-xs font-semibold text-gray-700">Ton prénom / pseudo</label>
                          <input
                            value={reviewForm.userName}
                            onChange={(e) => setReviewForm((p) => ({ ...p, userName: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-700">Note</label>
                          <div className="mt-1">
                            <Stars rating={reviewForm.rating} onChange={(r) => setReviewForm((p) => ({ ...p, rating: r }))} />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-700">Commentaire</label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                          className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                          rows={4}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={reviewSending}
                        className="px-5 py-2.5 rounded-xl bg-[#1113a2] text-white text-sm font-semibold shadow disabled:opacity-60"
                      >
                        {reviewSending ? "Envoi…" : "Envoyer mon avis"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
