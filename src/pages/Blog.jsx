// src/pages/Blog.jsx
import React from "react";
import { Link } from "react-router-dom";
import requinBaleineImg from "../assets/images/articles_blog/requin_baleine_tourisme.jpg";
import wmdImg from "../assets/images/articles_blog/world_maritime_day.webp";
import omanImg from "../assets/images/articles_blog/oman.jpg"; // 🆕 image Oman
import blogBanner from "../assets/images/bannière_blog.jpg";

export default function Blog() {
  return (
    <div className="w-full">
      {/* ======= SECTION 1 — TITRE SUR FOND GRIS ======= */}
      <section className="relative py-16 px-6 text-center overflow-hidden bg-gray-200">
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
            Blog
          </h1>
          <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
            <strong>GuardianMap</strong>, la plateforme qui met en avant le{" "}
            <span className="font-semibold">tourisme marin responsable</span>.
          </p>
        </div>
      </section>

      {/* ======= SECTION 2 — FOND IMAGE + ENCADRÉ INTRO ======= */}
      <section className="relative w-full py-16 px-4 md:px-8 overflow-hidden">
        {/* Image de fond */}
        <img
          src={blogBanner}
          alt="Fond Blog"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="bg-white/85 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md p-6 md:p-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              On ne naît pas bon touriste, on le devient
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Ici, on informe, on sensibilise et on partage : les bonnes pratiques à suivre
              et les mauvaises habitudes à oublier. Le tourisme peut protéger… ou détruire.
            </p>
          </div>
        </div>
      </section>

      {/* ======= SECTION 3 — ARTICLES ======= */}
      <section className="w-full py-12 px-4 md:px-8">
        <div className="mx-auto max-w-6xl space-y-10">
          {/* Article 1 — Requins-baleines */}
          <article className="relative bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <Link to="/blog/requins-baleines" aria-label="Lire l’article Requins-baleines">
              <span className="absolute inset-0 z-10" />
            </Link>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <Link to="/blog/requins-baleines" className="block">
                  <img
                    src={requinBaleineImg}
                    alt="Tourisme autour des requins-baleines"
                    className="h-full w-full object-cover md:h-[320px]"
                  />
                </Link>
              </div>
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1113a2] mb-3">
                  <Link to="/blog/requins-baleines" className="hover:underline">
                    Requins-baleines : quand le rêve devient un danger
                  </Link>
                </h2>
                <p className="text-gray-700 mb-6 text-justify">
                  Qui n’a jamais rêvé de voir un requin-baleine ? Ce géant des océans fascine…
                </p>
                <div className="z-20">
                  <Link
                    to="/blog/requins-baleines"
                    className="inline-block rounded-xl bg-[#1113a2] px-5 py-2.5 text-white font-medium hover:opacity-90 transition"
                  >
                    Lire l’article
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Article 2 — World Maritime Day */}
          <article className="relative bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <Link to="/blog/world-maritime-day" aria-label="Lire l’article World Maritime Day">
              <span className="absolute inset-0 z-10" />
            </Link>
            <div className="flex flex-col md:flex-row-reverse">
              <div className="md:w-1/2">
                <Link to="/blog/world-maritime-day" className="block">
                  <img
                    src={wmdImg}
                    alt="World Maritime Day / Journée maritime mondiale"
                    className="h-full w-full object-cover md:h-[320px]"
                  />
                </Link>
              </div>
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1113a2] mb-3">
                  <Link to="/blog/world-maritime-day" className="hover:underline">
                    World Maritime Day : pourquoi le maritime nous concerne tous
                  </Link>
                </h2>
                <p className="text-gray-700 mb-6 text-justify">
                  Instaurée par l’OMI, la Journée maritime mondiale rappelle que 80–90 % des échanges transitent par la mer…
                </p>
                <div className="z-20">
                  <Link
                    to="/blog/world-maritime-day"
                    className="inline-block rounded-xl bg-[#1113a2] px-5 py-2.5 text-white font-medium hover:opacity-90 transition"
                  >
                    Lire l’article
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* 🆕 Article 3 — Oman */}
          <article className="relative bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <Link to="/blog/oman" aria-label="Lire l’article Oman (Daymaniyat, tortues, requins de récif)">
              <span className="absolute inset-0 z-10" />
            </Link>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <Link to="/blog/oman" className="block">
                  <img
                    src={omanImg}
                    alt="Oman : îles Daymaniyat, tortues et requins de récif"
                    className="h-full w-full object-cover md:h-[320px]"
                    loading="lazy"
                  />
                </Link>
              </div>
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1113a2] mb-3">
                  <Link to="/blog/oman" className="hover:underline">
                    Oman : protéger, patienter… et vivre des rencontres magiques
                  </Link>
                </h2>
                <p className="text-gray-700 mb-6 text-justify">
                  Un pays qui prend vraiment soin de sa faune marine : accès régulé aux tortues,
                  zones protégées aux Daymaniyat, requins de récif non nourris… Ici, on observe
                  en douceur et on accepte la part d’imprévu.
                </p>
                <div className="z-20">
                  <Link
                    to="/blog/oman"
                    className="inline-block rounded-xl bg-[#1113a2] px-5 py-2.5 text-white font-medium hover:opacity-90 transition"
                  >
                    Lire l’article
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
