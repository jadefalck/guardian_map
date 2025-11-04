import React from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import wmdImg from "../../assets/images/articles_blog/world_maritime_day.webp";

export default function WorldMaritimeDay() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-100 py-10 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1113a2]">
          {t("articles.wmd.title")}
        </h1>
        <p className="mt-3 text-gray-700 max-w-3xl mx-auto">
          {t("articles.wmd.subtitle")}
        </p>
      </header>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-6 py-10 text-gray-700">
        <img
          src={wmdImg}
          alt={t("articles.wmd.heroAlt")}
          className="rounded-2xl shadow mb-8 w-full max-h-[480px] object-cover"
        />

        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.wmd.p1" components={{ b: <strong /> }} />
        </p>

        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.wmd.p2" components={{ b: <strong />, i: <em /> }} />
        </p>

        <h2 className="text-xl font-semibold text-[#1113a2] mt-6 mb-3">
          {t("articles.wmd.h2_theme")}
        </h2>
        <p className="mb-6 text-justify">
          <Trans i18nKey="articles.wmd.p3" components={{ b: <strong /> }} />
        </p>

        <h2 className="text-xl font-semibold text-[#1113a2] mt-2 mb-3">
          {t("articles.wmd.h2_projects")}
        </h2>

        <div className="space-y-5 mb-8">
          {/* 1 */}
          <section className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-semibold text-gray-900">
              {t("articles.wmd.pj1.title")}
            </h3>
            <p className="mt-2 text-justify">
              <Trans i18nKey="articles.wmd.pj1.text" components={{ i: <em />, b: <strong /> }} />
            </p>
            <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
              <li>{t("articles.wmd.pj1.b1")}</li>
              <li>{t("articles.wmd.pj1.b2")}</li>
              <li>{t("articles.wmd.pj1.b3")}</li>
            </ul>
          </section>

          {/* 2 */}
          <section className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-semibold text-gray-900">
              {t("articles.wmd.pj2.title")}
            </h3>
            <p className="mt-2 text-justify">
              <Trans i18nKey="articles.wmd.pj2.text" components={{ b: <strong />, i: <em /> }} />
            </p>
            <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
              <li>{t("articles.wmd.pj2.b1")}</li>
              <li>{t("articles.wmd.pj2.b2")}</li>
              <li>{t("articles.wmd.pj2.b3")}</li>
            </ul>
          </section>

          {/* 3 */}
          <section className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-semibold text-gray-900">
              {t("articles.wmd.pj3.title")}
            </h3>
            <p className="mt-2 text-justify">
              <Trans i18nKey="articles.wmd.pj3.text" components={{ b: <strong /> }} />
            </p>
            <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
              <li>{t("articles.wmd.pj3.b1")}</li>
              <li>{t("articles.wmd.pj3.b2")}</li>
              <li>{t("articles.wmd.pj3.b3")}</li>
            </ul>
          </section>
        </div>

        <h2 className="text-xl font-semibold text-[#1113a2] mt-6 mb-3">
          {t("articles.wmd.h2_why")}
        </h2>
        <ul className="list-disc list-inside mb-6">
          <li><Trans i18nKey="articles.wmd.why1" components={{ b: <strong /> }} /></li>
          <li><Trans i18nKey="articles.wmd.why2" components={{ b: <strong /> }} /></li>
          <li>{t("articles.wmd.why3")}</li>
        </ul>

        <blockquote className="border-l-4 border-[#1113a2] pl-4 italic text-gray-800 mb-6">
          {t("articles.wmd.quote")}
        </blockquote>

        <Link to="/blog" className="inline-block rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2">
          {t("articles.common.backToBlog")}
        </Link>
      </article>
    </div>
  );
}
