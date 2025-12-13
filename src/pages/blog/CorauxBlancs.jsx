// src/pages/articles/CorauxBlancs.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

import corauxImg from "../../assets/images/articles_blog/coraux_blancs.jpg";
import coralGuardianLogo from "../../assets/images/articles_blog/logo_coral_guardian.png";

export default function CorauxBlancs() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-100 py-10 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1113a2]">
          {t("articles.coraux.title")}
        </h1>
        <p className="mt-3 text-gray-700 max-w-3xl mx-auto">
          {t("articles.coraux.subtitle")}
        </p>
      </header>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-6 py-10 text-gray-700">
        <img
          src={corauxImg}
          alt={t("articles.coraux.heroAlt")}
          className="rounded-2xl shadow mb-8 w-full max-h-[480px] object-cover"
          loading="lazy"
        />

        <h2 className="text-xl font-semibold text-[#1113a2] mb-3">
          {t("articles.coraux.h2_bleaching")}
        </h2>

        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.coraux.p1" components={{ b: <strong /> }} />
        </p>

        <p className="mb-6 text-justify">
          {t("articles.coraux.p2")}
        </p>

        <h2 className="text-xl font-semibold text-[#1113a2] mb-3">
          {t("articles.coraux.h2_when_die")}
        </h2>

        <p className="mb-4 text-justify">
          {t("articles.coraux.p3")}
        </p>

        <div className="bg-white rounded-2xl shadow p-5 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            {t("articles.coraux.box1.title")}
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>{t("articles.coraux.box1.b1")}</li>
            <li>{t("articles.coraux.box1.b2")}</li>
            <li>{t("articles.coraux.box1.b3")}</li>
          </ul>
        </div>

        <blockquote className="border-l-4 border-[#1113a2] pl-4 italic text-gray-800 mb-8">
          {t("articles.coraux.quote")}
        </blockquote>

        <h2 className="text-xl font-semibold text-[#1113a2] mb-3">
          {t("articles.coraux.h2_how_help")}
        </h2>

        <p className="mb-4 text-justify">
          <Trans
            i18nKey="articles.coraux.p4"
            components={{ b: <strong /> }}
          />
        </p>

        <div className="bg-white rounded-2xl shadow p-5 mb-8">
          <h3 className="font-semibold text-gray-900 mb-2">
            {t("articles.coraux.box2.title")}
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>{t("articles.coraux.box2.b1")}</li>
            <li>{t("articles.coraux.box2.b2")}</li>
            <li>{t("articles.coraux.box2.b3")}</li>
            <li>{t("articles.coraux.box2.b4")}</li>
            <li>{t("articles.coraux.box2.b5")}</li>
          </ul>
        </div>

        <h2 className="text-xl font-semibold text-[#1113a2] mb-3">
          {t("articles.coraux.h2_cg")}
        </h2>

        <div className="bg-white rounded-2xl shadow p-5 mb-6">
          <div className="flex items-start gap-4">
            <img
              src={coralGuardianLogo}
              alt={t("articles.coraux.cg.logoAlt")}
              className="h-12 w-auto object-contain"
              loading="lazy"
            />
            <div>
              <p className="text-justify mb-3">
                <Trans i18nKey="articles.coraux.cg.p1" components={{ b: <strong /> }} />
              </p>

              <h3 className="font-semibold text-gray-900 mb-2">
                {t("articles.coraux.cg.h3")}
              </h3>

              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-3">
                <li>
                  <Trans i18nKey="articles.coraux.cg.b1" components={{ b: <strong /> }} />
                </li>
                <li>
                  <Trans i18nKey="articles.coraux.cg.b2" components={{ b: <strong /> }} />
                </li>
                <li>
                  <Trans i18nKey="articles.coraux.cg.b3" components={{ b: <strong /> }} />
                </li>
              </ul>

              <p className="text-justify">
                {t("articles.coraux.cg.p2")}
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-[#1113a2] mb-3">
          {t("articles.coraux.h2_conclusion")}
        </h2>

        <p className="mb-8 text-justify">
          {t("articles.coraux.p5")}
        </p>

        <Link
          to="/blog"
          className="inline-block rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2"
        >
          {t("articles.common.backToBlog")}
        </Link>
      </article>
    </div>
  );
}
