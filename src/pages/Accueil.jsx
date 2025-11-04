// src/pages/Accueil.jsx
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import fondVideo from "../assets/videos/vidéo_accueil_fond.mp4";

// 🖼️ Images des blocs d’action
import imgActivite from "../assets/images/accueil_activité_mer.jpg";
import imgCircuit from "../assets/images/accueil_circuit_éthique.jpg";
import imgBlog from "../assets/images/accueil_blog.jpg";

export default function Accueil() {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      {/* ======= SECTION 1 — INTRO AVEC TITRE ======= */}
      <section className="relative py-16 px-6 text-center overflow-hidden bg-gray-200">
        <div className="w-full text-center">
          <h1 className="w-full max-w-none text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 drop-shadow-sm">
            {t("home.hero.title")}
          </h1>

          <p className="text-base md:text-lg text-gray-700">
            <Trans
              i18nKey="home.hero.subtitle"
              components={{
                b: <span className="font-semibold" />
              }}
            />
          </p>
        </div>
      </section>

      {/* ======= SECTION 2 — VIDÉO DE FOND SUR TOUT LE RESTE ======= */}
      <section className="relative w-full py-16 px-4 md:px-8 overflow-hidden text-gray-800">
        {/* Vidéo de fond */}
        <video
          src={fondVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* ======= CONTENU ======= */}
        <div className="relative z-10 flex flex-col gap-16 max-w-6xl mx-auto">
          {/* === Bloc : Rôle du site === */}
          <div className="bg-white/85 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {t("home.about.title")}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              <Trans
                i18nKey="home.about.text"
                components={{
                  b: <span className="font-semibold text-gray-800" />
                }}
              />
            </p>
          </div>

          {/* === 3 BLOCS D’ACTION === */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bloc 1 — Activités */}
            <div className="bg-white/85 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md overflow-hidden flex flex-col">
              <div className="h-44 md:h-48 w-full overflow-hidden">
                <img
                  src={imgActivite}
                  alt={t("home.cards.activities.alt")}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col grow">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                  {t("home.cards.activities.title")}
                </h3>
                <p className="text-gray-700 mb-5">
                  <Trans
                    i18nKey="home.cards.activities.text"
                    components={{ b: <span className="font-semibold" /> }}
                  />
                </p>
                <div className="mt-auto">
                  <Link
                    to="/activites"
                    className="inline-block px-5 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
                  >
                    {t("home.cards.activities.cta")}
                  </Link>
                </div>
              </div>
            </div>

            {/* Bloc 2 — Circuits */}
            <div className="bg-white/85 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md overflow-hidden flex flex-col">
              <div className="h-44 md:h-48 w-full overflow-hidden">
                <img
                  src={imgCircuit}
                  alt={t("home.cards.circuits.alt")}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col grow">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                  {t("home.cards.circuits.title")}
                </h3>
                <p className="text-gray-700 mb-5">
                  {t("home.cards.circuits.text")}
                </p>
                <div className="mt-auto">
                  <Link
                    to="/circuits"
                    className="inline-block px-5 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
                  >
                    {t("home.cards.circuits.cta")}
                  </Link>
                </div>
              </div>
            </div>

            {/* Bloc 3 — Blog */}
            <div className="bg-white/85 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md overflow-hidden flex flex-col">
              <div className="h-44 md:h-48 w-full overflow-hidden">
                <img
                  src={imgBlog}
                  alt={t("home.cards.blog.alt")}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col grow">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                  {t("home.cards.blog.title")}
                </h3>
                <p className="text-gray-700 mb-5">
                  <Trans
                    i18nKey="home.cards.blog.text"
                    components={{ b: <span className="font-semibold" /> }}
                  />
                </p>
                <div className="mt-auto">
                  <Link
                    to="/blog"
                    className="inline-block px-5 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
                  >
                    {t("home.cards.blog.cta")}
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
