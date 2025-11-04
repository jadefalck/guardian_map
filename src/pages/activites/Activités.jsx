// src/pages/activites/Activites.jsx
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

// Images
import bannerImg from "../../assets/images/bannière_activité.jpg";
import diveCardImg from "../../assets/images/Activité_plongée.jpg";
import gfLogo from "../../assets/images/GF_Logo.png";
import bfLogo from "../../assets/images/BF_Logo.webp";

export default function Activites() {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      {/* ======= SECTION 1 — TITRE SUR FOND GRIS ======= */}
      <section className="relative py-16 px-6 text-center overflow-hidden bg-gray-200">
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
            {t("activities.hero.title")}
          </h1>
          <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
            <Trans
              i18nKey="activities.hero.subtitle"
              components={{ b: <span className="font-semibold" /> }}
            />
          </p>
        </div>
      </section>

      {/* ======= SECTION 2 — ENCADRÉ CRITÈRES ======= */}
      <section className="relative w-full py-12 px-4 md:px-8 overflow-hidden">
        {/* Fond bannière + léger voile */}
        <img
          src={bannerImg}
          alt={t("activities.criteria.bannerAlt")}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 backdrop-blur-[1px]" />

        {/* Encadré unique */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
              {t("activities.criteria.title")}
            </h2>
            <p className="text-gray-800 leading-relaxed">
              <Trans
                i18nKey="activities.criteria.text"
                components={{ b: <span className="font-semibold text-[#1113a2]" /> }}
              />
            </p>

            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3">
              <p className="text-sm md:text-base text-gray-900 text-center font-semibold">
                <Trans
                  i18nKey="activities.criteria.badge"
                  components={{ c: <span className="text-[#1113a2]" /> }}
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======= SECTION 3 — PLONGÉE (IMAGE GAUCHE / TEXTE + LABELS DROITE) ======= */}
      <section className="w-full py-12 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-8 md:gap-12">
          {/* Image à gauche */}
          <div className="flex-1">
            <img
              src={diveCardImg}
              alt={t("activities.diving.imageAlt")}
              className="w-full rounded-2xl shadow-md object-cover md:min-h-[420px]"
              loading="lazy"
            />
          </div>

          {/* Contenu à droite */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Titre */}
            <div>
              <h2 className="text-4xl md:text-3xl font-extrabold text-[#1113a2] mb-2">
                {t("activities.diving.title")}
              </h2>
              <div className="h-1 w-25 bg-gradient-to-r from-[#1113a2] via-indigo-600 to-indigo-300 rounded-full" />
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">
              <Trans
                i18nKey="activities.diving.text"
                components={{
                  b: <span className="font-semibold" />,
                  c: <span className="font-semibold text-[#1113a2]" />
                }}
              />
            </p>

            {/* Bouton */}
            <div>
              <Link
                to="/plongée"
                className="inline-block rounded-xl bg-[#1113a2] px-6 py-3 text-white font-semibold hover:bg-[#0e128c] transition shadow-md"
              >
                {t("activities.diving.cta")}
              </Link>
            </div>

            {/* Labels à la suite */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("activities.diving.labelsTitle")}
              </h3>
              <div className="space-y-5">
                {/* Green Fins */}
                <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
                  <img
                    src={gfLogo}
                    alt={t("activities.labels.greenfins.alt")}
                    className="w-12 h-12 object-contain shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold leading-tight">
                      {t("activities.labels.greenfins.title")}
                    </p>
                    <p className="text-sm text-gray-700">
                      {t("activities.labels.greenfins.text")}
                    </p>
                  </div>
                </div>

                {/* Blue Flag */}
                <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
                  <img
                    src={bfLogo}
                    alt={t("activities.labels.blueflag.alt")}
                    className="w-12 h-12 object-contain shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold leading-tight">
                      {t("activities.labels.blueflag.title")}
                    </p>
                    <p className="text-sm text-gray-700">
                      {t("activities.labels.blueflag.text")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
