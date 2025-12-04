// src/pages/activites/Activites.jsx
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

// Images
import diveCardImg from "../../assets/images/Activité_plongée.jpg";
import observeCardImg from "../../assets/images/Activité_observation.jpg"; // ← NOUVEAU
import gfLogo from "../../assets/images/GF_Logo.png";
import bfLogo from "../../assets/images/BF_Logo.webp";
import wcaLogo from "../../assets/images/WCA.webp"; // ← NOUVEAU
import fotsLogo from "../../assets/images/FotS.png"; // ← NOUVEAU

export default function Activites() {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      {/* ======= TITRE (déjà existant) ======= */}
      <section className="py-10 px-6 text-center bg-gray-200">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
          {t("activities.hero.title")}
        </h1>

        <p className="text-base md:text-lg text-gray-700 mx-auto md:max-w-none md:whitespace-nowrap">
          {t("activities.hero.line1")}
        </p>

        <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto mt-1">
          <Trans
            i18nKey="activities.hero.line2"
            components={{ b: <b className="font-semibold text-[#1113a2]" /> }}
          />
        </p>
      </section>

      {/* ===================================================================================== */}
      {/* ============================ ACTIVITÉ : PLONGÉE ==================================== */}
      {/* ===================================================================================== */}

      <section className="w-full py-12 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-8 md:gap-12">
          <div className="flex-1">
            <img
              src={diveCardImg}
              alt={t("activities.diving.imageAlt")}
              className="w-full rounded-2xl shadow-md object-cover md:min-h-[420px]"
              loading="lazy"
            />
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div>
              <h2 className="text-4xl md:text-3xl font-extrabold text-[#1113a2] mb-2">
                {t("activities.diving.title")}
              </h2>
              <div className="h-1 w-25 bg-gradient-to-r from-[#1113a2] via-indigo-600 to-indigo-300 rounded-full" />
            </div>

            <p className="text-gray-700 leading-relaxed">
              <Trans
                i18nKey="activities.diving.text"
                components={{
                  b: <span className="font-semibold" />,
                  c: <span className="font-semibold text-[#1113a2]" />
                }}
              />
            </p>

            <div>
              <Link
                to="/plongée"
                className="inline-block rounded-xl bg-[#1113a2] px-6 py-3 text-white font-semibold hover:bg-[#0e128c] transition shadow-md"
              >
                {t("activities.diving.cta")}
              </Link>
            </div>

            {/* LABELS PLONGÉE */}
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

      {/* ===================================================================================== */}
      {/* ====================== ACTIVITÉ : OBSERVATION DE LA FAUNE ========================== */}
      {/* ===================================================================================== */}

      <section className="w-full py-12 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-start gap-8 md:gap-12">

          {/* Image à droite */}
          <div className="flex-1">
            <img
              src={observeCardImg}
              alt={t("activities.observation.imageAlt")}
              className="w-full rounded-2xl shadow-md object-cover md:min-h-[420px]"
              loading="lazy"
            />
          </div>

          {/* Contenu à gauche */}
          <div className="flex-1 flex flex-col gap-6">
            <div>
              <h2 className="text-4xl md:text-3xl font-extrabold text-[#1113a2] mb-2">
                {t("activities.observation.title")}
              </h2>
              <div className="h-1 w-25 bg-gradient-to-r from-[#1113a2] via-indigo-600 to-indigo-300 rounded-full" />
            </div>

            <p className="text-gray-700 leading-relaxed">
              <Trans
                i18nKey="activities.observation.text"
                components={{
                  b: <span className="font-semibold" />,
                  c: <span className="font-semibold text-[#1113a2]" />
                }}
              />
            </p>

            {/* Bouton → page "observation" */}
            <div>
              <Link
                to="/observation"
                className="inline-block rounded-xl bg-[#1113a2] px-6 py-3 text-white font-semibold hover:bg-[#0e128c] transition shadow-md"
              >
                {t("activities.observation.cta")}
              </Link>
            </div>

            {/* Labels */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("activities.observation.labelsTitle")}
              </h3>

              <div className="space-y-5">
                {/* WCA */}
                <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <img
                    src={wcaLogo}
                    alt={t("activities.labels.wca.alt")}
                    className="w-12 h-12 object-contain shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold leading-tight">
                      {t("activities.labels.wca.title")}
                    </p>
                    <p className="text-sm text-gray-700">
                      {t("activities.labels.wca.text")}
                    </p>
                  </div>
                </div>

                {/* Friends of the Sea */}
                <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <img
                    src={fotsLogo}
                    alt={t("activities.labels.fots.alt")}
                    className="w-12 h-12 object-contain shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold leading-tight">
                      {t("activities.labels.fots.title")}
                    </p>
                    <p className="text-sm text-gray-700">
                      {t("activities.labels.fots.text")}
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
