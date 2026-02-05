import React from "react";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";

import heroImg from "../../assets/images/articles_blog/ailerons_requins_adn.jpg";

export default function AileronsRequinsADN() {
  const { t } = useTranslation();

  const orgLinks = [
    { name: "Shark Trust", href: "https://www.sharktrust.org/" },
    { name: "Oceana", href: "https://oceana.org/" },
    { name: "Pew Charitable Trusts", href: "https://www.pew.org/en/" },
    { name: "WildAid", href: "https://wildaid.org/" },
    { name: "Shark Savers", href: "https://www.shark-savers.com/" },
    { name: "Wildlife Conservation Society (WCS)", href: "https://www.wcs.org/" },
    { name: "Shark Conservation Society", href: "https://www.sharkconservationsociety.com/aboutus/" },
    { name: "Project AWARE (PADI)", href: "https://www.padi.com/fr/aware" },
    { name: "Fondation Probium (Facebook)", href: "https://www.facebook.com/Probiomfondation/?locale=fr_FR" },
    { name: "Paul G. Allen Philanthropies", href: "https://pgaf.org/" },
    { name: "Gallifrey Foundation", href: "https://gallifrey.foundation/" },
    { name: "National Science Foundation (NSF)", href: "https://www.nsf.gov/" },
  ];

  const sources = [
    `Cardeñosa, D. et al. (2025) "International trade regulations take a limited bite out of the shark fin trade" – Science Advances. DOI: 10.1126/sciadv.adz2821`,
    `Cardeñosa, D. et al. (2024) "Small sharks, big problems: DNA analysis of small fins reveals trade regulation gaps and burgeoning trade in juvenile sharks" – Science Advances. DOI: 10.1126/sciadv.adq6214`,
    `Cardeñosa, D. et al. (2018) "CITES-listed sharks remain among the top species in the contemporary fin trade" – Conservation Letters`,
    `Hakai Magazine (2018) "A Faster Way to Find Illicit Fins"`,
    `Oceanographic Magazine (2025) "Rampant shark trade violations exposed"`,
    `Newswise (2025) "Persistent Illegal Trade in Protected Sharks"`,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-100 py-10 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-gray-600">
            {t("articles.ailerons_adn.date")}
          </p>

          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[#1113a2]">
            {t("articles.ailerons_adn.title")}
          </h1>

          <p className="mt-3 text-gray-700">
            {t("articles.ailerons_adn.subtitle")}
          </p>
        </div>
      </header>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-6 py-10 text-gray-700">
        <img
          src={heroImg}
          alt={t("articles.ailerons_adn.heroAlt")}
          className="rounded-2xl shadow mb-8 w-full max-h-[480px] object-cover"
          loading="lazy"
        />

        {/* Intro */}
        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.ailerons_adn.intro1" components={{ b: <strong />, i: <em /> }} />
        </p>

        {/* Le chiffre qui change tout */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-8 mb-3">
          {t("articles.ailerons_adn.h2_number")}
        </h2>
        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.ailerons_adn.number_p1" components={{ b: <strong />, i: <em /> }} />
        </p>

        <div className="rounded-2xl bg-white border border-gray-200 p-5 mb-6">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <Trans i18nKey="articles.ailerons_adn.number_li1" components={{ b: <strong /> }} />
            </li>
            <li>
              <Trans i18nKey="articles.ailerons_adn.number_li2" components={{ b: <strong />, i: <em /> }} />
            </li>
            <li>
              <Trans i18nKey="articles.ailerons_adn.number_li3" components={{ b: <strong />, i: <em /> }} />
            </li>
          </ul>
        </div>

        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.ailerons_adn.paper_p1" components={{ b: <strong />, i: <em /> }} />
        </p>

        <blockquote className="mt-6 border-l-4 border-[#1113a2] pl-4 italic text-gray-800">
          <Trans i18nKey="articles.ailerons_adn.quote_cardenosa" components={{ i: <em /> }} />
        </blockquote>

        {/* Pourquoi ce commerce persiste */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.ailerons_adn.h2_why")}
        </h2>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900">
              {t("articles.ailerons_adn.why_gold.title")}
            </h3>
            <p className="mt-2 text-justify">
              <Trans i18nKey="articles.ailerons_adn.why_gold.text" components={{ b: <strong />, i: <em /> }} />
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900">
              {t("articles.ailerons_adn.why_bonus.title")}
            </h3>
            <p className="mt-2 text-justify">
              <Trans i18nKey="articles.ailerons_adn.why_bonus.text" components={{ b: <strong />, i: <em /> }} />
            </p>
            <blockquote className="mt-4 border-l-4 border-gray-300 pl-4 italic text-gray-800">
              <Trans i18nKey="articles.ailerons_adn.quote_chapman_1" components={{ i: <em /> }} />
            </blockquote>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900">
              {t("articles.ailerons_adn.why_hk.title")}
            </h3>
            <p className="mt-2 text-justify">
              <Trans i18nKey="articles.ailerons_adn.why_hk.text" components={{ b: <strong />, i: <em /> }} />
            </p>
          </div>
        </div>

        {/* Contexte */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.ailerons_adn.h2_context")}
        </h2>
        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.ailerons_adn.context_p1" components={{ b: <strong />, i: <em /> }} />
        </p>

        {/* ADN */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.ailerons_adn.h2_dna")}
        </h2>
        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.ailerons_adn.dna_p1" components={{ b: <strong />, i: <em /> }} />
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
          {t("articles.ailerons_adn.h3_method")}
        </h3>
        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.ailerons_adn.method_p1" components={{ b: <strong />, i: <em /> }} />
        </p>

        <div className="rounded-2xl bg-white border border-gray-200 p-5 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">
            {t("articles.ailerons_adn.h4_scope")}
          </h4>
          <ul className="list-disc list-inside space-y-2">
            <li>{t("articles.ailerons_adn.scope_li1")}</li>
            <li>{t("articles.ailerons_adn.scope_li2")}</li>
            <li>{t("articles.ailerons_adn.scope_li3")}</li>
            <li>{t("articles.ailerons_adn.scope_li4")}</li>
          </ul>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">
          {t("articles.ailerons_adn.h3_results")}
        </h3>
        <div className="rounded-2xl bg-white border border-gray-200 p-5 mb-6">
          <ul className="list-disc list-inside space-y-2">
            <li><Trans i18nKey="articles.ailerons_adn.results_li1" components={{ b: <strong />, i: <em /> }} /></li>
            <li><Trans i18nKey="articles.ailerons_adn.results_li2" components={{ b: <strong />, i: <em /> }} /></li>
            <li><Trans i18nKey="articles.ailerons_adn.results_li3" components={{ b: <strong />, i: <em /> }} /></li>
            <li><Trans i18nKey="articles.ailerons_adn.results_li4" components={{ b: <strong />, i: <em /> }} /></li>
          </ul>
        </div>

        <blockquote className="mt-4 border-l-4 border-gray-300 pl-4 italic text-gray-800">
          <Trans i18nKey="articles.ailerons_adn.quote_chapman_2" components={{ i: <em /> }} />
        </blockquote>

        <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">
          {t("articles.ailerons_adn.h3_verdict")}
        </h3>
        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.ailerons_adn.verdict_p1" components={{ b: <strong />, i: <em /> }} />
        </p>

        <blockquote className="mt-4 border-l-4 border-[#1113a2] pl-4 italic text-gray-800">
          <Trans i18nKey="articles.ailerons_adn.quote_tipping" components={{ i: <em /> }} />
        </blockquote>

        {/*Pays impliqués 
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.ailerons_adn.h2_countries")}
        </h2>
        <p className="mb-4 text-justify">{t("articles.ailerons_adn.countries_p1")}</p>

        <div className="rounded-2xl bg-white border border-gray-200 p-5 mb-6">
          <ul className="grid grid-cols-2 gap-2 text-sm">
            <li>{t("articles.ailerons_adn.country_es")}</li>
            <li>{t("articles.ailerons_adn.country_tw")}</li>
            <li>{t("articles.ailerons_adn.country_ae")}</li>
            <li>{t("articles.ailerons_adn.country_cn")}</li>
            <li>{t("articles.ailerons_adn.country_ph")}</li>
            <li>{t("articles.ailerons_adn.country_gh")}</li>
            <li>{t("articles.ailerons_adn.country_br")}</li>
          </ul>
        </div>*/}

        {/* CITES */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.ailerons_adn.h2_cites")}
        </h2>
        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.ailerons_adn.cites_p1" components={{ b: <strong />, i: <em /> }} />
        </p>

        <div className="rounded-2xl bg-white border border-gray-200 p-5 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">{t("articles.ailerons_adn.cites_annexes_title")}</h4>
          <p className="mb-3 text-justify">
            <Trans i18nKey="articles.ailerons_adn.cites_annexe1" components={{ b: <strong />, i: <em /> }} />
          </p>
          <p className="text-justify">
            <Trans i18nKey="articles.ailerons_adn.cites_annexe2" components={{ b: <strong />, i: <em /> }} />
          </p>
        </div>

        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.ailerons_adn.cites_growth" components={{ b: <strong />, i: <em /> }} />
        </p>

        {/* ADN portable */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.ailerons_adn.h2_portable")}
        </h2>
        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.ailerons_adn.portable_p1" components={{ b: <strong />, i: <em /> }} />
        </p>

        <div className="rounded-2xl bg-white border border-gray-200 p-5 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">{t("articles.ailerons_adn.portable_24h_title")}</h4>
          <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-800">
            <Trans i18nKey="articles.ailerons_adn.quote_24h" components={{ i: <em /> }} />
          </blockquote>

          <h4 className="mt-4 font-semibold text-gray-900 mb-2">{t("articles.ailerons_adn.portable_cap_title")}</h4>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>{t("articles.ailerons_adn.portable_li1")}</li>
            <li>{t("articles.ailerons_adn.portable_li2")}</li>
            <li>{t("articles.ailerons_adn.portable_li3")}</li>
            <li>{t("articles.ailerons_adn.portable_li4")}</li>
          </ul>
        </div>

        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.ailerons_adn.portable_deploy" components={{ i: <em /> }} />
        </p>

        {/* Qui a le droit */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.ailerons_adn.h2_rights")}
        </h2>
        <div className="rounded-2xl bg-white border border-gray-200 p-5 mb-6">
          <p className="mb-2">{t("articles.ailerons_adn.rights_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>{t("articles.ailerons_adn.rights_li1")}</li>
            <li>{t("articles.ailerons_adn.rights_li2")}</li>
            <li>{t("articles.ailerons_adn.rights_li3")}</li>
          </ul>
          <p className="mt-3 text-justify">
            <Trans i18nKey="articles.ailerons_adn.rights_outro" components={{ b: <strong />, i: <em /> }} />
          </p>
        </div>

        {/* Interdictions */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.ailerons_adn.h2_bans")}
        </h2>

        <div className="rounded-2xl bg-white border border-gray-200 p-5 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">{t("articles.ailerons_adn.bans_a_title")}</h4>
          <p className="text-justify">
            <Trans i18nKey="articles.ailerons_adn.bans_a_text" components={{ b: <strong />, i: <em /> }} />
          </p>

          <h4 className="mt-4 font-semibold text-gray-900 mb-2">{t("articles.ailerons_adn.bans_b_title")}</h4>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>{t("articles.ailerons_adn.bans_b_uk")}</li>
            <li>{t("articles.ailerons_adn.bans_b_ca")}</li>
            <li>{t("articles.ailerons_adn.bans_b_us")}</li>
          </ul>

          <h4 className="mt-4 font-semibold text-gray-900 mb-2">{t("articles.ailerons_adn.bans_apply_title")}</h4>
          <p className="text-justify">{t("articles.ailerons_adn.bans_apply_text")}</p>
        </div>

        {/* Petits requins */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.ailerons_adn.h2_small")}
        </h2>
        <p className="mb-4 text-justify">{t("articles.ailerons_adn.small_p1")}</p>

        <div className="rounded-2xl bg-white border border-gray-200 p-5 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">{t("articles.ailerons_adn.small_numbers_title")}</h4>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>{t("articles.ailerons_adn.small_li1")}</li>
            <li>{t("articles.ailerons_adn.small_li2")}</li>
            <li>{t("articles.ailerons_adn.small_li3")}</li>
          </ul>

          <h4 className="mt-4 font-semibold text-gray-900 mb-2">{t("articles.ailerons_adn.small_gap_title")}</h4>
          <p className="text-justify">{t("articles.ailerons_adn.small_gap_text")}</p>

          <h4 className="mt-4 font-semibold text-gray-900 mb-2">{t("articles.ailerons_adn.small_examples_title")}</h4>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>{t("articles.ailerons_adn.small_ex1")}</li>
            <li>{t("articles.ailerons_adn.small_ex2")}</li>
            <li>{t("articles.ailerons_adn.small_ex3")}</li>
          </ul>

          <h4 className="mt-4 font-semibold text-gray-900 mb-2">{t("articles.ailerons_adn.small_juveniles_title")}</h4>
          <p className="text-justify">{t("articles.ailerons_adn.small_juveniles_text")}</p>
        </div>

        {/* Solutions */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.ailerons_adn.h2_solutions")}
        </h2>

        <div className="rounded-2xl bg-white border border-gray-200 p-5 mb-6">
          <ol className="list-decimal list-inside space-y-3">
            <li>
              <b>{t("articles.ailerons_adn.sol1_title")}</b> — {t("articles.ailerons_adn.sol1_text")}
            </li>
            <li>
              <b>{t("articles.ailerons_adn.sol2_title")}</b> —{" "}
              <Trans i18nKey="articles.ailerons_adn.sol2_text" components={{ i: <em /> }} />
            </li>
            <li>
              <b>{t("articles.ailerons_adn.sol3_title")}</b> — {t("articles.ailerons_adn.sol3_text")}
            </li>
            <li>
              <b>{t("articles.ailerons_adn.sol4_title")}</b> — {t("articles.ailerons_adn.sol4_text")}
            </li>
            <li>
              <b>{t("articles.ailerons_adn.sol5_title")}</b> — {t("articles.ailerons_adn.sol5_text")}
            </li>
          </ol>
        </div>

        {/* Conclusion */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.ailerons_adn.h2_conclusion")}
        </h2>

        <p className="mb-4 text-justify">
          <Trans i18nKey="articles.ailerons_adn.concl_p1" components={{ b: <strong />, i: <em /> }} />
        </p>

        <blockquote className="mt-4 border-l-4 border-gray-300 pl-4 italic text-gray-800">
          <Trans i18nKey="articles.ailerons_adn.quote_concl" components={{ i: <em /> }} />
        </blockquote>

        <p className="mt-6 mb-4 text-justify">
          <Trans i18nKey="articles.ailerons_adn.concl_p2" components={{ i: <em /> }} />
        </p>

        {/* Organisations */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.ailerons_adn.h2_orgs")}
        </h2>

        <p className="mb-4 text-justify">{t("articles.ailerons_adn.orgs_intro")}</p>

        <div className="rounded-2xl bg-white border border-gray-200 p-5">
          <ul className="list-disc list-inside space-y-2">
            {orgLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#1113a2] hover:underline"
                >
                  {l.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* GuardianMap note */}
        <h2 className="text-xl font-semibold text-[#1113a2] mt-10 mb-3">
          {t("articles.ailerons_adn.h2_guardianmap")}
        </h2>
        <p className="mb-8 text-justify">
          <Trans i18nKey="articles.ailerons_adn.guardianmap_p1" components={{ b: <strong />, i: <em /> }} />
        </p>

        {/* Sources & refs */}
        <div className="mt-10 rounded-2xl bg-white border border-gray-200 p-5">
          <p className="text-xs italic text-gray-600 mb-3">
            {t("articles.ailerons_adn.sourcesTitle")}
          </p>
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
