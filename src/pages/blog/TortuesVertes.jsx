// src/pages/articles/TortuesVertes.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import tortueImg from "../../assets/images/articles_blog/tortue_marine.jpg";

export default function TortuesVertes() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-100 py-10 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1113a2]">
          {t("articles.turtles.title")}
        </h1>
        <p className="mt-3 text-gray-700 max-w-3xl mx-auto">
          {t("articles.turtles.subtitle")}
        </p>
      </header>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-6 py-10 text-gray-700">
        <img
          src={tortueImg}
          alt={t("articles.turtles.heroAlt")}
          className="rounded-2xl shadow mb-8 w-full max-h-[480px] object-cover"
          loading="lazy"
        />

        <h2 className="text-xl font-semibold text-[#1113a2] mt-2 mb-3">
          {t("articles.turtles.h2_threatened")}
        </h2>
        <p className="mb-4 text-justify">
          <Trans
            i18nKey="articles.turtles.p1"
            components={{ em: <em /> }}
          />
        </p>
        <p className="mb-6 text-justify">
          <Trans i18nKey="articles.turtles.p2" components={{ b: <strong /> }} />
        </p>

        <h2 className="text-xl font-semibold text-[#1113a2] mt-6 mb-3">
          {t("articles.turtles.h2_recovery")}
        </h2>
        <p className="mb-4 text-justify">
          <Trans
            i18nKey="articles.turtles.p3"
            components={{ b: <strong /> }}
          />
        </p>
        <p className="mb-6 text-justify">
          {t("articles.turtles.p4")}
        </p>

        <h2 className="text-xl font-semibold text-[#1113a2] mt-6 mb-3">
          {t("articles.turtles.h2_caution")}
        </h2>

        <div className="bg-white rounded-2xl shadow p-5 mb-6">
          <p className="text-justify">
            {t("articles.turtles.threats.intro")}
          </p>

          <ul className="list-disc list-inside mt-3 text-sm text-gray-700 space-y-1">
            <li>
              <Trans
                i18nKey="articles.turtles.threats.li1"
                components={{ b: <strong /> }}
              />
            </li>
            <li>
              <Trans
                i18nKey="articles.turtles.threats.li2"
                components={{ b: <strong /> }}
              />
            </li>
            <li>
              <Trans
                i18nKey="articles.turtles.threats.li3"
                components={{ b: <strong /> }}
              />
            </li>
            <li>
              <Trans
                i18nKey="articles.turtles.threats.li4"
                components={{ b: <strong /> }}
              />
            </li>
          </ul>
        </div>

        <h2 className="text-xl font-semibold text-[#1113a2] mt-6 mb-3">
          {t("articles.turtles.h2_proof")}
        </h2>
        <p className="mb-6 text-justify">
          {t("articles.turtles.p5")}
        </p>

        <h2 className="text-xl font-semibold text-[#1113a2] mt-6 mb-3">
          {t("articles.turtles.h2_role")}
        </h2>
        <p className="mb-4 text-justify">
          {t("articles.turtles.p6")}
        </p>

        <blockquote className="border-l-4 border-[#1113a2] pl-4 italic text-gray-800 mb-6">
          {t("articles.turtles.quote")}
        </blockquote>

        <h2 className="text-xl font-semibold text-[#1113a2] mt-6 mb-3">
          {t("articles.turtles.h2_conclusion")}
        </h2>
        <p className="mb-6 text-justify">
          {t("articles.turtles.p7")}
        </p>

        <div className="bg-white rounded-2xl shadow p-5 mb-8">
          <p className="font-semibold text-gray-900 mb-2">
            {t("articles.turtles.ps.title")}
          </p>
          <p className="text-justify mb-2">
            {t("articles.turtles.ps.text")}
          </p>
          <a
            href={t("articles.turtles.ps.href")}
            target="_blank"
            rel="noreferrer"
            className="text-[#1113a2] font-semibold hover:underline break-words"
          >
            {t("articles.turtles.ps.linkLabel")}
          </a>
        </div>

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
