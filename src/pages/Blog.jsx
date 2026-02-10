// src/pages/Blog.jsx
import { usePageSeo } from "../seo/usePageSeo";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import requinBaleineImg from "../assets/images/articles_blog/requin_baleine_tourisme.jpg";
import corauxBlancsImg from "../assets/images/articles_blog/coraux_blancs.jpg";
import wmdImg from "../assets/images/articles_blog/world_maritime_day.webp";
import tortueImg from "../assets/images/articles_blog/tortue_marine.jpg";
import omanImg from "../assets/images/articles_blog/oman.jpg";
import blogBanner from "../assets/images/bannière_blog.jpg";
import aileronsAdnImg from "../assets/images/articles_blog/ailerons_requins_adn.jpg";
import cachalotsSleepImg from "../assets/images/articles_blog/cachalots_sommeil_vertical.jpg"
/* ================= UI helpers (style Accueil) ================= */

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

function ArticleCardPremium({ a, ctaLabel }) {
  return (
    <CardShell className="hover:-translate-y-0.5">
      <Link to={a.to} aria-label={a.aria} className="absolute inset-0 z-10" />

      <div className="flex gap-5 p-5 md:p-6">
        <div className="w-28 h-20 md:w-36 md:h-24 flex-shrink-0 rounded-2xl overflow-hidden border border-gray-100 bg-gray-100">
          <img
            src={a.img}
            alt={a.alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#1113a2]">
            Blog
          </p>

          <h3 className="mt-2 text-base md:text-lg font-black text-gray-900 uppercase tracking-tight leading-snug line-clamp-2">
            <span className="relative z-20">{a.title}</span>
          </h3>

          <p className="mt-2 text-sm md:text-base text-gray-700 leading-relaxed line-clamp-2">
            {a.excerpt}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-900">
            {ctaLabel} <span className="text-base">→</span>
          </div>
        </div>
      </div>
    </CardShell>
  );
}

export default function Blog() {
  const { t } = useTranslation();
  usePageSeo({
    title: "Blog | GuardianMap",
    description:
      "Articles et guides pour un tourisme plus respectueux des océans : espèces marines, coraux, tortues, plongée, pollution et bonnes pratiques d’observation.",
    canonical: "https://guardianmap.com/blog",
    ogImage: "https://guardianmap.com/og/og-blog.jpg",
  });

  const [q, setQ] = useState("");

  const articles = useMemo(
    () => [
      {
        id: "ws",
        section: "sensibilisation",
        to: "/blog/requins-baleines",
        img: requinBaleineImg,
        title: t("blog.articles.ws.title"),
        excerpt: t("blog.articles.ws.excerpt"),
        alt: t("blog.articles.ws.alt"),
        aria: t("blog.articles.ws.aria"),
        keywords: ["requin", "requins", "baleine", "baleines", "whale shark", "tourisme", "éthique"],
      },
      {
        id: "coraux",
        section: "sensibilisation",
        to: "/blog/coraux-blancs",
        img: corauxBlancsImg,
        title: "Les coraux blancs ne sont pas forcément morts : comprendre, agir, protéger",
        excerpt:
          "Un corail blanchi est en détresse, pas forcément mort. Comprendre le phénomène, savoir reconnaître un récif récupérable et agir pour réduire les pressions locales.",
        alt: "Coraux blanchis",
        aria: "Lire l’article sur les coraux blanchis",
        keywords: ["corail", "coraux", "blanchissement", "zooxanthelles", "climat", "récifs", "coral guardian"],
      },
      {
        id: "wmd",
        section: "infos",
        to: "/blog/world-maritime-day",
        img: wmdImg,
        title: t("blog.articles.wmd.title"),
        excerpt: t("blog.articles.wmd.excerpt"),
        alt: t("blog.articles.wmd.alt"),
        aria: t("blog.articles.wmd.aria"),
        keywords: ["maritime", "imo", "world maritime day", "transport", "océan"],
      },
      {
        id: "turtles",
        section: "infos",
        to: "/blog/tortues-vertes",
        img: tortueImg,
        title: "Les tortues vertes ne sont plus considérées comme en danger : une victoire… mais fragile",
        excerpt:
          "Bonne nouvelle : la tortue verte recule d’un cran sur la liste des menaces. Mais le climat, le tourisme et les prises accidentelles restent des risques majeurs.",
        alt: "Tortue marine",
        aria: "Lire l’article sur les tortues vertes",
        keywords: ["tortue", "tortues", "verte", "UICN", "vulnérable", "conservation"],
      },
      {
        id: "oman",
        section: "partage",
        to: "/blog/oman",
        img: omanImg,
        title: t("blog.articles.oman.title"),
        excerpt: t("blog.articles.oman.excerpt"),
        alt: t("blog.articles.oman.alt"),
        aria: t("blog.articles.oman.aria"),
        keywords: ["oman", "voyage", "plongée", "itinéraire", "mer"],
      },
      {
        id: "ailerons_adn",
        section: "sensibilisation",
        to: "/blog/ailerons-requins-adn",
        img: aileronsAdnImg,
        title: "Ailerons de requins : l’ADN révèle un trafic invisible",
        excerpt:
          "Une enquête ADN sur plus de 16 000 ailerons révèle un commerce mondial illégal, incluant des espèces protégées. Quand l’ADN parle, la fraude devient indéniable.",
        alt: "Ailerons de requins séchés sur un marché",
        aria: "Lire l’article sur le trafic d’ailerons révélé par l’ADN",
        keywords: [
          "ailerons",
          "requin",
          "requins",
          "finning",
          "trafic",
          "cites",
          "adn",
          "barcoding",
          "science advances",
          "longimane",
          "commerce",
          "illégal"
        ],
      },

      {
        id: "cachalots_sleep",
        section: "infos",
        to: "/blog/cachalots-sommeil-vertical",
        img: cachalotsSleepImg,
        title: t("blog.articles.cachalots_sleep.title"),
        excerpt: t("blog.articles.cachalots_sleep.excerpt"),
        alt: t("blog.articles.cachalots_sleep.alt"),
        aria: t("blog.articles.cachalots_sleep.aria"),
        keywords: [
          "cachalot",
          "cachalots",
          "sperm whale",
          "sommeil",
          "dormir",
          "vertical",
          "sieste",
          "mediterranee",
          "cétacés",
          "unihemispherique",
          "bihémisphérique",
          "resting behavior",
        ],
      },


    ],
    [t]
  );

  // --- Recherche (titre + excerpt + keywords)
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return articles;
    return articles.filter((a) => {
      const hay = `${a.title} ${a.excerpt} ${(a.keywords || []).join(" ")}`.toLowerCase();
      return hay.includes(s);
    });
  }, [q, articles]);

  const section = (name) => filtered.filter((a) => a.section === name);

  return (
    <div className="w-full bg-white">
      {/* ======= HERO (style Accueil) ======= */}
      <section className="py-12 px-6 text-center bg-gray-200 border-b border-gray-200">
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tight mb-3">
          Blog
        </h1>
        <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
          Ici, on informe, on sensibilise et on partage les infos de la mer.
        </p>
      </section>

      {/* ======= SEARCH (premium) ======= */}
      <section className="w-full bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight">
              Tu cherches un sujet ?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Tape un mot-clé : coraux, tortues, plongée, pollution…
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-md transition p-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="search"
                placeholder="Ex : coraux, tortues, plongée, pollution…"
                className="w-full rounded-[1.5rem] border border-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1113a2]/30"
              />
            </div>

            <p className="mt-3 text-center text-xs text-gray-500">
              {filtered.length} article(s) trouvé(s)
            </p>
          </div>
        </div>
      </section>

      {/* ======= CONTENT (banner + sections, style Accueil) ======= */}
      <section className="relative w-full py-14 px-4 md:px-8 overflow-hidden">
        <img
          src={blogBanner}
          alt={t("blog.bannerAlt")}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-white" />

        <div className="relative z-10 max-w-6xl mx-auto space-y-10">
          {/* --- Sensibilisation --- */}
          <CardShell className="bg-white/90 backdrop-blur-md">
            <div className="p-7 md:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
                  Sensibilisation
                </h2>
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#1113a2]">
                  {section("sensibilisation").length} article(s)
                </span>
              </div>

              <div className="mt-6 grid gap-5">
                {section("sensibilisation").map((a) => (
                  <ArticleCardPremium key={a.id} a={a} ctaLabel={t("blog.read")} />
                ))}
              </div>
            </div>
          </CardShell>

          {/* --- Infos --- */}
          <CardShell className="bg-white/90 backdrop-blur-md">
            <div className="p-7 md:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
                  Infos
                </h2>
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#1113a2]">
                  {section("infos").length} article(s)
                </span>
              </div>

              <div className="mt-6 grid gap-5">
                {section("infos").map((a) => (
                  <ArticleCardPremium key={a.id} a={a} ctaLabel={t("blog.read")} />
                ))}
              </div>
            </div>
          </CardShell>

          {/* --- Partage --- */}
          <CardShell className="bg-white/90 backdrop-blur-md">
            <div className="p-7 md:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
                  Partage
                </h2>
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#1113a2]">
                  {section("partage").length} article(s)
                </span>
              </div>

              <div className="mt-6 grid gap-5">
                {section("partage").map((a) => (
                  <ArticleCardPremium key={a.id} a={a} ctaLabel={t("blog.read")} />
                ))}
              </div>
            </div>
          </CardShell>
        </div>
      </section>
    </div>
  );
}
