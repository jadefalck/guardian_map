// src/pages/Blog.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

import requinBaleineImg from "../assets/images/articles_blog/requin_baleine_tourisme.jpg";
import corauxBlancsImg from "../assets/images/articles_blog/coraux_blancs.jpg";
import wmdImg from "../assets/images/articles_blog/world_maritime_day.webp";
import tortueImg from "../assets/images/articles_blog/tortue_marine.jpg";
import omanImg from "../assets/images/articles_blog/oman.jpg";
import blogBanner from "../assets/images/bannière_blog.jpg";

export default function Blog() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");

  // --- Définition des articles (pour recherche + affichage) ---
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
    ],
    [t]
  );

  // --- Recherche (titre + excerpt + keywords) ---
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return articles;
    return articles.filter((a) => {
      const hay = `${a.title} ${a.excerpt} ${(a.keywords || []).join(" ")}`.toLowerCase();
      return hay.includes(s);
    });
  }, [q, articles]);

  const section = (name) => filtered.filter((a) => a.section === name);

  // --- Carte compacte réutilisable ---
  const ArticleCardSmall = ({ a }) => (
    <article className="relative bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition">
      <Link to={a.to} aria-label={a.aria}>
        <span className="absolute inset-0 z-10" />
      </Link>

      <div className="flex gap-4 p-4 md:p-5">
        <div className="w-28 h-20 md:w-32 md:h-24 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100">
          <img
            src={a.img}
            alt={a.alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-bold text-[#1113a2] leading-snug line-clamp-2">
            <Link to={a.to} className="hover:underline relative z-20">
              {a.title}
            </Link>
          </h3>

          <p className="mt-1 text-sm text-gray-700 line-clamp-2">
            {a.excerpt}
          </p>

          <div className="mt-3 relative z-20">
            <Link
              to={a.to}
              className="inline-block rounded-xl bg-[#1113a2] px-4 py-2 text-white text-sm font-medium hover:opacity-90 transition"
            >
              {t("blog.read")}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <div className="w-full">
      {/* ======= SECTION 1 — TITRE (style Activities) ======= */}
      <section className="py-10 px-6 text-center bg-gray-200">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
          Blog
        </h1>
        <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
          Ici, on informe, on sensibilise et on partage les infos de la mer.
        </p>
      </section>

      {/* ======= SECTION 1bis — Recherche ======= */}
      <section className="w-full bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center mb-4">
            Tu cherches un sujet ?
          </h2>

          <div className="max-w-2xl mx-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="search"
              placeholder="Ex : coraux, tortues, plongée, pollution…"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1113a2]/30"
            />
            <p className="mt-2 text-center text-xs text-gray-500">
              {filtered.length} article(s) trouvé(s)
            </p>
          </div>
        </div>
      </section>

      {/* ======= SECTION 2 — Fond image bleu (sans gros rectangle) ======= */}
      <section className="relative w-full py-12 px-4 md:px-8 overflow-hidden">
        <img
          src={blogBanner}
          alt={t("blog.bannerAlt")}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />

        <div className="relative z-10 max-w-6xl mx-auto space-y-10">
          {/* --- Sensibilisation --- */}
          <div className="bg-white/85 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm p-5 md:p-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Sensibilisation
            </h2>

            <div className="grid gap-4">
              {section("sensibilisation").map((a) => (
                <ArticleCardSmall key={a.id} a={a} />
              ))}
            </div>
          </div>

          {/* --- Infos --- */}
          <div className="bg-white/85 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm p-5 md:p-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Infos
            </h2>

            <div className="grid gap-4">
              {section("infos").map((a) => (
                <ArticleCardSmall key={a.id} a={a} />
              ))}
            </div>
          </div>

          {/* --- Partage --- */}
          <div className="bg-white/85 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm p-5 md:p-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Partage
            </h2>

            <div className="grid gap-4">
              {section("partage").map((a) => (
                <ArticleCardSmall key={a.id} a={a} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
