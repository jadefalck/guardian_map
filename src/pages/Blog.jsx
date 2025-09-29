import React from "react";
import { Link } from "react-router-dom";
import requinBaleineImg from "../assets/images/articles_blog/requin_baleine_tourisme.jpg";
import wmdImg from "../assets/images/articles_blog/world_maritime_day.webp";
import NewsletterForm from "../components/NewsletterForm";

export default function Blog() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gray-100 py-12 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1113a2]">
          On ne naît pas bon touriste, on le devient
        </h1>
        <p className="mt-3 text-gray-700 max-w-2xl mx-auto">
          Ici, on informe, on sensibilise et on partage : les bonnes pratiques à suivre
          et les mauvaises habitudes à oublier. Le tourisme peut protéger… ou détruire.
        </p>
      </section>

      {/* Liste d’articles */}
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-10">
        {/* Article 1 — Requins-baleines */}
        <article className="relative bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {/* Lien plein bloc (clic partout) */}
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
              <p className="text-gray-700 mb-6" style={{ textAlign: "justify" }}>
                Qui n’a jamais rêvé de voir un requin-baleine ? Ce géant des océans fascine. 
                Avec ses 10 à 12 mètres de long, il est l’un des animaux marins les plus majestueux. 
                Mais derrière l’image de carte postale, une question dérangeante se cache :
                <span className="font-semibold text-[#1113a2]"> que sacrifie-t-on pour garantir aux touristes ce spectacle à 100&nbsp;% ?</span>
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
        <article className="relative bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {/* Lien plein bloc */}
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
              <p className="text-gray-700 mb-6" style={{ textAlign: "justify" }}>
                Instaurée par l’Organisation Maritime Internationale (OMI), agence des Nations Unies, 
                la Journée maritime mondiale rappelle chaque année (dernier jeudi de septembre) que 80–90&nbsp;% des échanges mondiaux transitent par la mer. 
                Sécurité, environnement, innovation, rôle des marins : autant d’enjeux majeurs pour un océan vivant et une économie durable.
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
      </div>

      {/* Footer (Contact + Newsletter) */}
      <div className="bg-[#1113a2] py-12 px-6 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12 md:gap-8">
          {/* Contact */}
          <div className="md:w-1/2">
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="mb-2">
              📧 Mail :{" "}
              <a href="mailto:contact@guardianmap.com" className="underline hover:text-gray-300">
                contact@guardianmap.com
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

          {/* Séparateur */}
          <div className="hidden md:block w-px h-28 bg-white/30" />

          {/* Newsletter */}
          <div className="md:w-1/2">
            <h3 className="text-xl font-bold mb-4 text-white">Reste informé(e)</h3>
            <p className="mb-4">Inscris-toi pour suivre le développement de GuardianMap.</p>
            <NewsletterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
