import React from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

import heroImg from "../../assets/images/articles_blog/requin_baleine_tourisme.jpg";

// Carrousel d’images (assure-toi que ces fichiers existent)
import ws1 from "../../assets/images/articles_blog/requin_baleine1.jpg";
import ws2 from "../../assets/images/articles_blog/requin_baleine2.jpeg";
import ws3 from "../../assets/images/articles_blog/requin_baleine3.jpg";
import ws4 from "../../assets/images/articles_blog/requin_baleine4.jpeg";
import ws5 from "../../assets/images/articles_blog/requin_baleine5.jpg";
import ws6 from "../../assets/images/articles_blog/requin_baleine6.jpg";

export default function RequinsBaleines() {
  const { t } = useTranslation();

  const gallery = [ws1, ws2, ws3, ws4, ws5, ws6];

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
          src={heroImg}
          alt={t("articles.ws.heroAlt")}
          className="rounded-2xl shadow mb-8 w-full max-h-[480px] object-cover"
        />

        {/* Intro */}
        <p className="mb-4 text-justify">
          {t("articles.ws.intro_p1")}
        </p>
        <p className="mb-4 text-justify">
          {t("articles.ws.intro_p2")}
        </p>
        <p className="mb-6 text-justify">
          {t("articles.ws.intro_p3")}
        </p>

        {/* Attraction touristique */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-8 mb-3">
          {t("articles.ws.attraction_title")}
        </h2>
        <p className="mb-4 text-justify">{t("articles.ws.attraction_p1")}</p>
        <p className="mb-4 text-justify">{t("articles.ws.attraction_p2")}</p>
        <p className="mb-6 text-justify">
          <Trans
            i18nKey="articles.ws.attraction_p3"
            components={{ b: <strong /> }}
          />
        </p>

        {/* Carrousel d’images : “liste déroulante” */}
        <div className="mb-8">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
            {gallery.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={t("articles.ws.carouselAlt", { index: i + 1 })}
                className="h-48 w-auto rounded-xl shadow snap-start object-cover"
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {t("articles.ws.carouselCaption")}
          </p>
        </div>

        {/* Dérives */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-8 mb-3">
          {t("articles.ws.derives_title")}
        </h2>
        <p className="mb-4 text-justify">{t("articles.ws.derives_intro")}</p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>{t("articles.ws.derives_li1")}</li>
          <li>{t("articles.ws.derives_li2")}</li>
          <li>{t("articles.ws.derives_li3")}</li>
          <li>{t("articles.ws.derives_li4")}</li>
        </ul>
        <p className="mb-6 text-justify">{t("articles.ws.derives_outro")}</p>

        {/* Bonnes pratiques */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-8 mb-3">
          {t("articles.ws.practices_title")}
        </h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>
            <Trans
              i18nKey="articles.ws.practices_li1"
              components={{ b: <strong /> }}
            />
          </li>
          <li>{t("articles.ws.practices_li2")}</li>
          <li>{t("articles.ws.practices_li3")}</li>
          <li>{t("articles.ws.practices_li4")}</li>
          <li>{t("articles.ws.practices_li5")}</li>
          <li>{t("articles.ws.practices_li6")}</li>
        </ul>
        <p className="mb-6 text-justify">{t("articles.ws.practices_outro")}</p>

        {/* Associations */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-8 mb-3">
          {t("articles.ws.orgs_title")}
        </h2>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            <Trans
              i18nKey="articles.ws.orgs_mmf"
              components={{
                a: (
                  <a
                    href="https://marinemegafauna.org/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  />
                ),
                b: <strong />,
              }}
            />
          </li>
          <li>
            <Trans
              i18nKey="articles.ws.orgs_sos"
              components={{
                a: (
                  <a
                    href="https://saveourseas.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  />
                ),
                b: <strong />,
              }}
            />
          </li>
          <li>
            <Trans
              i18nKey="articles.ws.orgs_wildbook"
              components={{ b: <strong /> }}
            />
          </li>
        </ul>

        {/* Conclusion + CTA */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-8 mb-3">
          {t("articles.ws.conclusion_title")}
        </h2>
        <p className="mb-4 text-justify">{t("articles.ws.conclusion_p1")}</p>
        <p className="mb-6 text-justify">{t("articles.ws.conclusion_p2")}</p>

        <blockquote className="border-l-4 border-[#1113a2] pl-4 italic text-gray-800 mb-6">
          {t("articles.ws.quote")}
        </blockquote>

        <p className="mb-6">
          <Trans
            i18nKey="articles.ws.cta"
            components={{
              a: (
                <a
                  href="https://guardianmap.com/plong%C3%A9e"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#1113a2] underline font-semibold"
                />
              ),
            }}
          />
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
