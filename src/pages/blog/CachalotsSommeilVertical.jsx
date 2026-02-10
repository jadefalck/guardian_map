import React from "react";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";

import heroImg from "../../assets/images/articles_blog/cachalots_sommeil_vertical.jpg";

export default function CachalotsSommeilVertical() {
  const { t } = useTranslation();

  const sources = [
    `Miller, P.J.O., Aoki, K., Rendell, L.E., Amano, M. (2008) "Stereotypical resting behavior of the sperm whale" – Current Biology, 18(1), R21–R23. DOI: 10.1016/j.cub.2007.11.003`,
    `Research on uni-hemispheric sleep in captive cetaceans (dolphins, belugas)`,
    `Studies on sleep/rest in other marine mammals (e.g., harbour porpoises, northern elephant seals)`,
    `Business & Biodiversity Campaign (general awareness content)`,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-100 py-10 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-gray-600">
            {t("articles.cachalots_sleep.date")}
          </p>

          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[#1113a2]">
            {t("articles.cachalots_sleep.title")}
          </h1>

          <p className="mt-3 text-gray-700">{t("articles.cachalots_sleep.subtitle")}</p>
        </div>
      </header>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-6 py-10 text-gray-700">
        <img
          src={heroImg}
          alt={t("articles.cachalots_sleep.heroAlt")}
          className="rounded-2xl shadow mb-8 w-full max-h-[480px] object-cover"
          loading="lazy"
        />

        {/* Intro */}
        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.cachalots_sleep.intro1" components={{ b: <strong />, i: <em /> }} />
        </p>
        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.cachalots_sleep.intro2" components={{ b: <strong />, i: <em /> }} />
        </p>

        <blockquote className="mt-6 border-l-4 border-[#1113a2] pl-4 italic text-gray-800">
          <Trans i18nKey="articles.cachalots_sleep.quote_opening" components={{ i: <em /> }} />
        </blockquote>

        {/* 2008 discovery */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.cachalots_sleep.h2_2008")}
        </h2>
        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.cachalots_sleep.p_2008_1" components={{ b: <strong />, i: <em /> }} />
        </p>

        <div className="rounded-2xl bg-white border border-gray-200 p-5 mb-6">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <Trans i18nKey="articles.cachalots_sleep.li_2008_1" components={{ b: <strong />, i: <em /> }} />
            </li>
            <li>
              <Trans i18nKey="articles.cachalots_sleep.li_2008_2" components={{ b: <strong />, i: <em /> }} />
            </li>
            <li>
              <Trans i18nKey="articles.cachalots_sleep.li_2008_3" components={{ b: <strong />, i: <em /> }} />
            </li>
          </ul>
        </div>

        {/* Sleep duration */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.cachalots_sleep.h2_sleep_short")}
        </h2>
        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.cachalots_sleep.p_sleep_short_1" components={{ b: <strong />, i: <em /> }} />
        </p>

        <div className="rounded-2xl bg-white border border-gray-200 p-5 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            {t("articles.cachalots_sleep.box_numbers_title")}
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <Trans i18nKey="articles.cachalots_sleep.box_numbers_li1" components={{ b: <strong /> }} />
            </li>
            <li>
              <Trans i18nKey="articles.cachalots_sleep.box_numbers_li2" components={{ b: <strong /> }} />
            </li>
            <li>
              <Trans i18nKey="articles.cachalots_sleep.box_numbers_li3" components={{ b: <strong /> }} />
            </li>
          </ul>
        </div>

        {/* Why vertical */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.cachalots_sleep.h2_why_vertical")}
        </h2>
        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.cachalots_sleep.p_why_vertical_1" components={{ b: <strong />, i: <em /> }} />
        </p>

        <div className="rounded-2xl bg-white border border-gray-200 p-5 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            {t("articles.cachalots_sleep.h3_spermaceti")}
          </h3>
          <p className="text-justify">
            <Trans i18nKey="articles.cachalots_sleep.p_spermaceti" components={{ b: <strong />, i: <em /> }} />
          </p>
        </div>

        {/* Uni vs bi hemispheric */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.cachalots_sleep.h2_brain")}
        </h2>
        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.cachalots_sleep.p_brain_1" components={{ b: <strong />, i: <em /> }} />
        </p>

        <blockquote className="mt-4 border-l-4 border-gray-300 pl-4 italic text-gray-800">
          <Trans i18nKey="articles.cachalots_sleep.quote_brain" components={{ i: <em /> }} />
        </blockquote>

        {/* Collective choreography */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.cachalots_sleep.h2_choreo")}
        </h2>

        <div className="rounded-2xl bg-white border border-gray-200 p-5 mb-6">
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <Trans i18nKey="articles.cachalots_sleep.choreo_1" components={{ b: <strong /> }} />
            </li>
            <li>
              <Trans i18nKey="articles.cachalots_sleep.choreo_2" components={{ b: <strong /> }} />
            </li>
            <li>
              <Trans i18nKey="articles.cachalots_sleep.choreo_3" components={{ b: <strong /> }} />
            </li>
            <li>
              <Trans i18nKey="articles.cachalots_sleep.choreo_4" components={{ b: <strong /> }} />
            </li>
            <li>
              <Trans i18nKey="articles.cachalots_sleep.choreo_5" components={{ b: <strong /> }} />
            </li>
          </ol>
        </div>

        {/* Tourism */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.cachalots_sleep.h2_tourism")}
        </h2>
        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.cachalots_sleep.p_tourism_1" components={{ b: <strong />, i: <em /> }} />
        </p>

        <div className="rounded-2xl bg-white border border-gray-200 p-5 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            {t("articles.cachalots_sleep.h3_rules")}
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>{t("articles.cachalots_sleep.rules_li1")}</li>
            <li>{t("articles.cachalots_sleep.rules_li2")}</li>
            <li>{t("articles.cachalots_sleep.rules_li3")}</li>
            <li>{t("articles.cachalots_sleep.rules_li4")}</li>
          </ul>
        </div>

        {/* Conclusion */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.cachalots_sleep.h2_conclusion")}
        </h2>
        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.cachalots_sleep.concl_p1" components={{ b: <strong />, i: <em /> }} />
        </p>

        <blockquote className="mt-4 border-l-4 border-[#1113a2] pl-4 italic text-gray-800">
          <Trans i18nKey="articles.cachalots_sleep.quote_concl" components={{ i: <em /> }} />
        </blockquote>

        {/* Sources */}
        <div className="mt-10 rounded-2xl bg-white border border-gray-200 p-5">
          <p className="text-xs italic text-gray-600 mb-3">{t("articles.cachalots_sleep.sourcesTitle")}</p>
          <ul className="list-disc list-inside space-y-2 text-xs italic text-gray-600">
            {sources.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        {/* Back */}
        <div className="mt-8">
          <Link
            to="/blog"
            className="inline-block rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2"
          >
            {t("articles.common.backToBlog")}
          </Link>
        </div>
      </article>
    </div>
  );
}
