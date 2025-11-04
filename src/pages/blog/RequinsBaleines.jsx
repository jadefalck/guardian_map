import React from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import requinBaleineImg from "../../assets/images/articles_blog/requin_baleine_tourisme.jpg";

export default function RequinsBaleines() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-100 py-10 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1113a2]">
          {t("articles.ws.title")}
        </h1>
        <p className="mt-3 text-gray-700 max-w-3xl mx-auto">
          {t("articles.ws.subtitle")}
        </p>
      </header>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-6 py-10 text-gray-700">
        <img
          src={requinBaleineImg}
          alt={t("articles.ws.heroAlt")}
          className="rounded-2xl shadow mb-8 w-full max-h-[480px] object-cover"
        />

        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.ws.p1" components={{ b: <strong /> }} />
        </p>
        <p className="mb-4 text-justify">
          {t("articles.ws.p2")}
        </p>
        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.ws.p3" components={{ b: <strong /> }} />
        </p>

        <h2 className="text-xl font-semibold text-[#1113a2] mt-6 mb-3">
          {t("articles.ws.h2_responsible")}
        </h2>
        <ul className="list-disc list-inside mb-6">
          <li><Trans i18nKey="articles.ws.li1" components={{ b: <strong /> }} /></li>
          <li><Trans i18nKey="articles.ws.li2" components={{ b: <strong /> }} /></li>
          <li><Trans i18nKey="articles.ws.li3" components={{ b: <strong /> }} /></li>
        </ul>

        <blockquote className="border-l-4 border-[#1113a2] pl-4 italic text-gray-800 mb-6">
          {t("articles.ws.quote")}
        </blockquote>

        <Link to="/blog" className="inline-block rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2">
          {t("articles.common.backToBlog")}
        </Link>
      </article>
    </div>
  );
}
