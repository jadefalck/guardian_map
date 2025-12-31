// src/pages/Voyages.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";

import videoEau from "../assets/videos/eau_titre.mp4";

// Images
import carteEspecesImg from "../assets/images/carte_especes.png";
import carteActiviteImg from "../assets/images/carte_activite.png";
import bannerCircuit from "../assets/images/bannière_circuit.jpg";
import guideCover from "../assets/images/Guide_voyage_couv.png";

// Excel destinations
import EXCEL_URL from "../data/BDD_centres_plongees.xlsx?url";

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

/** ✅ Carte “screen” (style Accueil) : image rectangle + hover zoom + bouton premium */
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

/** ✅ Wide CTA (style Accueil) */
function WideCTA({ title, desc, buttonLabel, onClick }) {
  return (
    <CardShell className="hover:-translate-y-0.5">
      <div className="p-7 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="min-w-0">
          <h3 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight">
            {title}
          </h3>
          {desc ? (
            <p className="mt-3 text-sm md:text-base text-gray-700 leading-relaxed">
              {desc}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onClick}
          className="inline-flex items-center justify-center rounded-2xl bg-[#1113a2] px-7 py-3 text-white font-bold shadow-sm hover:bg-[#0e128c] hover:shadow-md transition flex-none"
        >
          {buttonLabel}
        </button>
      </div>
    </CardShell>
  );
}

/* ================= Page ================= */

export default function Voyages() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [where, setWhere] = useState("");
  const [activityFilter, setActivityFilter] = useState("");
  const [animalFilter, setAnimalFilter] = useState("");

  // (Optionnel) si tu veux exploiter l’excel
  const [, setHasError] = useState(false);
  const [, setContinents] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(EXCEL_URL);
        if (!res.ok) throw new Error("Excel not found");
        const buf = await res.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
        setContinents(rows);
      } catch (e) {
        console.error(e);
        setHasError(true);
      }
    })();
  }, []);

  /* ================= DROPDOWNS ================= */

  const activityOptions = useMemo(
    () => [
      { value: "", label: "Sélectionner…" },
      { value: "dive", label: "Plongée" },
      { value: "observation", label: "Observation" },
      { value: "zones", label: "Zones protégées" },
    ],
    []
  );

  const animalOptions = useMemo(
    () => [
      { value: "", label: "Sélectionner…" },
      { value: "Baleine Bleue", label: "Baleine Bleue" },
      { value: "Baleine À Bosse", label: "Baleine À Bosse" },
      { value: "Dauphins", label: "Dauphins" },
      { value: "Raie Manta", label: "Raie Manta" },
      { value: "Requins", label: "Requins" },
      { value: "Requin-baleine", label: "Requin-baleine" },
      { value: "Tortue-marine", label: "Tortue-marine" },
    ],
    []
  );

  const handleActivitySelect = (val) => {
    setActivityFilter(val);
    if (!val) return;
    navigate(`/activites/plongée?category=${encodeURIComponent(val)}`);
  };

  const handleAnimalSelect = (val) => {
    setAnimalFilter(val);
    if (!val) return;
    navigate(`/especes/requin_baleine?species=${encodeURIComponent(val)}`);
  };

  /* ================= Cartes sous la vidéo ================= */

  const screenCards = useMemo(
    () => [
      {
        key: "marine-animals",
        title: "Carte des animaux marins",
        desc: (
          <>
            Trouvez où observer chaque espèce et découvrez les{" "}
            <NavyStrong>règles d’observation éthique</NavyStrong>. Repérez les{" "}
            <NavyStrong>meilleures saisons</NavyStrong> et les{" "}
            <NavyStrong>zones à éviter</NavyStrong>.
          </>
        ),
        buttonLabel: "Accéder à la carte",
        to: "/especes/requin_baleine",
        img: carteEspecesImg,
      },
      {
        key: "certified-activities",
        title: "Cartes des activités certifiées",
        desc: (
          <>
            Repérez les <NavyStrong>centres certifiés</NavyStrong> et comparez les{" "}
            <NavyStrong>labels</NavyStrong> +{" "}
            <NavyStrong>bonnes pratiques</NavyStrong>.
          </>
        ),
        buttonLabel: "Découvrir les activités",
        to: "/activites/plongée",
        img: carteActiviteImg,
      },
    ],
    []
  );

  return (
    <div className="w-full bg-white">
      {/* Bandeau (style Accueil) */}
      <section className="bg-gray-100 py-8 px-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-sm md:text-base font-semibold text-gray-900">
              {t("voyages.news.label")}{" "}
              <span className="text-[#1113a2]">{t("voyages.news.text")}</span>
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

      {/* Vidéo + 3 champs (style Accueil : plus premium) */}
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t("voyages.search.where.label")}
                  </label>
                  <input
                    value={where}
                    onChange={(e) => setWhere(e.target.value)}
                    type="search"
                    placeholder={t("voyages.search.where.placeholder")}
                    className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1113a2]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Quelle activité voulez-vous faire ?
                  </label>
                  <select
                    value={activityFilter}
                    onChange={(e) => handleActivitySelect(e.target.value)}
                    className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1113a2]/30"
                  >
                    {activityOptions.map((opt) => (
                      <option key={opt.value || "empty"} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Quels animaux voulez-vous voir ?
                  </label>
                  <select
                    value={animalFilter}
                    onChange={(e) => handleAnimalSelect(e.target.value)}
                    className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1113a2]/30"
                  >
                    {animalOptions.map((opt) => (
                      <option key={opt.value || "empty"} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-600 text-center">
                Sélectionne une activité ou un animal pour être redirigé vers la page déjà filtrée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2 cartes + Wide CTA */}
      <section className="w-full bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

          <div className="mt-8">
            <WideCTA
              title="Carte globale"
              desc="Explore les pays et accède rapidement aux points d’intérêt."
              buttonLabel="Explorer le monde"
              onClick={() => navigate("/continents/afrique")}
            />
          </div>
        </div>
      </section>

      {/* Bloc Guide (style Accueil : plus premium) */}
      <section className="w-full bg-white py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <CardShell className="rounded-[3rem]">
            <div className="relative h-[120px] md:h-[150px] overflow-hidden">
              <img
                src={bannerCircuit}
                alt="Bannière guide"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
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
                  <img
                    src={guideCover}
                    alt="Guide"
                    className="w-full max-w-[190px] rounded-2xl shadow-md"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg md:text-2xl font-black text-gray-900 uppercase tracking-tight">
                    Un guide clair, fait pour ton style de voyage
                  </h3>

                  <p className="text-3xl font-extrabold text-[#1a3936]">29€</p>

                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    On te prépare un guide sur-mesure : itinéraire, spots, saisons, déplacements, conseils concrets,
                    et bien d'autres.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/guide-voyage")}
                    className="inline-flex items-center justify-center rounded-2xl bg-[#1113a2] px-7 py-3 text-white font-bold shadow-sm hover:bg-[#0e128c] hover:shadow-md transition"
                  >
                    Je suis intéressé(e)
                  </button>

                  <p className="text-xs text-gray-500">
                    Tu arrives sur un questionnaire simple à envoyer. On te recontacte ensuite.
                  </p>
                </div>
              </div>
            </div>
          </CardShell>
        </div>
      </section>
    </div>
  );
}
