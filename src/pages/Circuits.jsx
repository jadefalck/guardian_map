// src/pages/Circuits.jsx
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

import bannerCircuit from "../assets/images/bannière_circuit.jpg";
import itineraireImg from "../assets/images/accueil_circuit_éthique.jpg";

export default function Circuits() {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      {/* ======= SECTION 1 — TITRE SUR FOND GRIS ======= */}
      <section className="relative py-16 px-6 text-center overflow-hidden bg-gray-200">
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
            {t("circuits.hero.title")}
          </h1>
          <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
            <Trans
              i18nKey="circuits.hero.subtitle"
              components={{ b: <span className="font-semibold" /> }}
            />
          </p>
        </div>
      </section>

      {/* ======= SECTION 2 — IMAGE DE FOND + ENCADRÉ “EN COURS DE CRÉATION” ======= */}
      <section className="relative w-full py-20 px-6 md:px-10 overflow-hidden">
        <img
          src={bannerCircuit}
          alt={t("circuits.bannerAlt")}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 backdrop-blur-[1px]" />

        <div className="relative z-10 max-w-3xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg text-center border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            {t("circuits.coming.title")}
          </h2>
          <p className="text-gray-700 text-lg">
            {t("circuits.coming.text")}
          </p>
        </div>
      </section>

      {/* ======= SECTION 3 — ENCADRÉ BLANC : EXPLICATION DES CIRCUITS ======= */}
      <section className="relative w-full py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto bg-white border border-gray-200 p-6 md:p-8 rounded-2xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Texte explicatif */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                {t("circuits.explain.title")}
              </h2>

              <p className="text-gray-700 leading-relaxed mb-4">
                <Trans
                  i18nKey="circuits.explain.intro"
                  components={{ b: <span className="font-semibold" /> }}
                />
              </p>

              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>
                  <Trans
                    i18nKey="circuits.explain.point1"
                    components={{ b: <span className="font-semibold" /> }}
                  />
                </li>
                <li>
                  <Trans
                    i18nKey="circuits.explain.point2"
                    components={{ b: <span className="font-semibold" /> }}
                  />
                </li>
                <li>{t("circuits.explain.point3")}</li>
              </ul>
            </div>

            {/* Illustration droite */}
            <div className="flex justify-center">
              <img
                src={itineraireImg}
                alt={t("circuits.illustrationAlt")}
                className="max-h-80 w-auto object-contain rounded-xl shadow-md"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
