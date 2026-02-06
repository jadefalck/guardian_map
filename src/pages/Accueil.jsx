// src/pages/Accueil.jsx
import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import fondVideo from "../assets/videos/vidéo_accueil_fond.mp4";
import carteEspecesImg from "../assets/images/carte_especes.png";
import carteActiviteImg from "../assets/images/carte_activite.png";
import zonesProtegeesImg from "../assets/images/carte_zones.png"; // ✅ AJOUT

// ✅ image guide
import guideCover from "../assets/images/Guide_voyage_couv.png";

// Import images blog
import requinBaleineImg from "../assets/images/articles_blog/requin_baleine_tourisme.jpg";
import corauxBlancsImg from "../assets/images/articles_blog/coraux_blancs.jpg";
import wmdImg from "../assets/images/articles_blog/world_maritime_day.webp";

/* -------------------- UI COMPONENTS -------------------- */

function NavyStrong({ children }) {
  return <span className="font-semibold text-[#1113a2]">{children}</span>;
}

/** ✅ Ce que fait GuardianMap : style premium, sans emojis */
function MissionCard({ title, desc, accent = "blue" }) {
  const accentMap = {
    blue: { ring: "hover:ring-[#1113a2]/20", bar: "bg-[#1113a2]", soft: "bg-[#1113a2]/5" },
    white: { ring: "hover:ring-gray-300/40", bar: "bg-gray-200", soft: "bg-gray-100" },
    red: { ring: "hover:ring-rose-500/20", bar: "bg-rose-500", soft: "bg-rose-500/5" },
  };
  const a = accentMap[accent] || accentMap.blue;

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-[2.25rem] border border-gray-200 bg-white p-8",
        "shadow-sm hover:shadow-xl transition-all duration-300",
        "ring-0 hover:ring-4",
        a.ring,
      ].join(" ")}
    >
      <div className={`absolute top-0 left-0 h-[3px] w-16 ${a.bar}`} />
      <div
        className={`absolute -right-10 -top-10 h-32 w-32 rounded-full ${a.soft} blur-2xl opacity-0 group-hover:opacity-100 transition`}
        aria-hidden="true"
      />
      <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight leading-tight">{title}</h3>
      <p className="mt-4 text-sm md:text-base text-gray-800 leading-relaxed">{desc}</p>
    </div>
  );
}

/* ✅ Shell identique à Voyages */
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

/* ✅ ScreenCardLarge identique à Voyages (bouton en bas) */
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
        <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight leading-snug">{title}</h3>

        <div className="text-sm md:text-base text-gray-700 mt-3 leading-relaxed">{desc}</div>

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

/* ✅ Blog card */
function BlogStripCard({ a }) {
  return (
    <Link
      to={a.to}
      className="group w-[280px] sm:w-[320px] bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition overflow-hidden"
    >
      <div className="h-44 bg-gray-100 overflow-hidden">
        <img
          src={a.img}
          alt={a.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="p-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#1113a2]">{a.tag}</p>

        <h3 className="mt-2 text-sm md:text-base font-black text-gray-900 uppercase tracking-tight line-clamp-2">
          {a.title}
        </h3>
        <p className="mt-2 text-sm text-gray-700 leading-relaxed line-clamp-3">{a.excerpt}</p>

        <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-900 inline-flex items-center gap-2">
          Lire <span className="text-base">→</span>
        </div>
      </div>
    </Link>
  );
}

export default function Accueil() {
  const navigate = useNavigate();

  // ✅ bleu hover proche de ta capture
  const HOVER_BLUE = "#001a53";

  const articles = useMemo(
    () => [
      {
        id: "ws",
        to: "/blog/requins-baleines",
        img: requinBaleineImg,
        tag: "Sensibilisation",
        title: "Requins baleines : les règles d’or pour les observer sans les déranger",
        excerpt: "Distances, comportements à éviter, et conseils pour une observation responsable.",
      },
      {
        id: "coraux",
        to: "/blog/coraux-blancs",
        img: corauxBlancsImg,
        tag: "Sensibilisation",
        title: "Les coraux blancs ne sont pas morts",
        excerpt: "Un corail blanchi est en détresse, pas forcément mort. Apprenez à le protéger.",
      },
      {
        id: "wmd",
        to: "/blog/world-maritime-day",
        img: wmdImg,
        tag: "Infos",
        title: "World Maritime Day : pourquoi cette journée existe ?",
        excerpt: "Origines, objectifs et enjeux autour de la journée maritime mondiale.",
      },
    ],
    []
  );

  // ✅ 3 cartes comme dans Voyages.jsx
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
        to: "/especes/requin_baleine",
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
        to: "/activites/plongée",
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
    <div className="w-full bg-white font-sans text-gray-900 antialiased">
      {/* 1) BANDEAU NOUVEAUTÉ */}
      <section className="bg-gray-100 py-8 px-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-sm md:text-base font-semibold text-gray-900">
              Nouveau : <span className="text-[#1113a2]">Guide de voyage personnalisé</span>
            </p>
          </div>

          <button
            onClick={() => navigate("/guide-voyage")}
            className="rounded-xl border border-[#1113a2]/30 bg-white text-[#1113a2] font-bold px-5 py-2 shadow-sm hover:bg-[#1113a2]/10 transition"
          >
            Découvre le guide
          </button>
        </div>
      </section>

      {/* 2) HERO VIDEO */}
      <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
        <video src={fondVideo} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-gray-300" />

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-2xl tracking-tight">
            Un tourisme <span className="text-blue-200 font-black">respectueux</span> des océans
          </h1>

          <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            <span className="font-black text-white">Notre mission :</span>
            <br />
            <span className="text-white">Aider chaque voyageur à faire des choix qui </span>
            <br />
            <span className="font-black text-white">
              protègent l’océan, ses habitants et les communautés locales.
            </span>
          </p>

          <div className="mt-10 flex flex-wrap justify-center">
            <button
              onClick={() => navigate("/continents/afrique")}
              style={{ ["--hoverBlue"]: HOVER_BLUE }}
              className="px-10 py-4 bg-white text-[#1113a2] rounded-full font-bold shadow-xl transition hover:scale-105 hover:text-white"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = HOVER_BLUE)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
            >
              Où pars-tu ?
            </button>
          </div>
        </div>
      </section>

      {/* 3) CE QUE FAIT GuardianMap */}
      <section className="py-24 px-6 bg-gray-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Ce que fait GuardianMap</h2>
            <p className="mt-5 text-base md:text-lg text-gray-800 max-w-3xl mx-auto leading-relaxed">
              Des repères clairs pour voyager, observer et plonger de façon plus respectueuse du vivant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MissionCard
              accent="blue"
              title="Activités éthiques"
              desc={
                <>
                  <span className="font-semibold">Labels certifiés et bons réflexes :</span>
                  <br />
                  on trie le vrai du faux pour des sorties en mer plus responsables.
                </>
              }
            />
            <MissionCard
              accent="white"
              title="Itinéraires sur mesure"
              desc={
                <>
                  <span className="font-semibold">Des itinéraires pensés pour les voyageurs :</span>
                  <br />
                  selon vos envies, votre rythme, et votre façon de voyager.
                </>
              }
            />
            <MissionCard
              accent="red"
              title="Sensibilisation"
              desc={
                <>
                  <span className="font-semibold">Comprendre pour mieux protéger :</span>
                  <br />
                  nous expliquons les enjeux marins pour que vous observiez mieux et avec plus de conscience.
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* 4) ✅ 3 CARTES CÔTE À CÔTE (comme Voyages) */}
      <section className="bg-gray-50 py-24 px-6 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
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

      {/* 5) BLOG */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Blog</h2>
              <p className="mt-4 text-gray-700 max-w-2xl">
                Espèces, enjeux et bons réflexes, tout pour un tourisme responsable.
              </p>
            </div>

            <Link
              to="/blog"
              className="inline-flex items-center justify-center rounded-xl bg-[#1113a2] px-6 py-3 text-white font-bold shadow-sm hover:bg-[#0e128c] transition"
            >
              Voir tout
            </Link>
          </div>

          <div className="w-full flex justify-center">
            <div className="flex flex-wrap justify-center gap-6">
              {articles.map((a) => (
                <BlogStripCard key={a.id} a={a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6) FINAL GUIDE SECTION */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto bg-[#004455] rounded-[3.5rem] p-10 md:p-16 text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />

          <div className="w-full md:w-1/4 flex justify-center">
            <div className="w-44 md:w-48 aspect-[3/4] bg-white rounded-2xl shadow-2xl rotate-[-4deg] overflow-hidden">
              <img src={guideCover} alt="Guide Voyage GuardianMap" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>

          <div className="w-full md:w-3/4 space-y-6">
            <h2 className="text-2xl md:text-4xl font-black leading-tight tracking-tighter uppercase">
              Le voyage, <br /> sans l&apos;effort de la préparation
            </h2>

            <p className="text-lg text-blue-100 font-light max-w-xl leading-relaxed">
              Un itinéraire pensé pour vous : itinéraires, activités responsables et conseils de voyages personnalisés.
            </p>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Pack Complet</span>
                <span className="text-4xl font-black">19€</span>
              </div>

              <Link
                to="/guide-voyage"
                className="
                  px-10 py-5
                  bg-white text-[#004455]
                  rounded-[1.5rem]
                  font-black uppercase text-xs tracking-widest
                  shadow-xl
                  transition-all duration-300
                  hover:bg-[#00586e] hover:text-white
                  hover:-translate-y-1
                "
              >
                Créer mon itinéraire
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
