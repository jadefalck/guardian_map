// src/pages/APropos.jsx
import React, { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { Link } from "react-router-dom";

// Fondateurs
import JadeFront from "../assets/images/Jade2.jpg";
import JadeBack from "../assets/images/Jade.jpg";
import ThomasFront from "../assets/images/Thomas2.jpg";
import ThomasBack from "../assets/images/Thomas.jpg";

// Images tourisme de masse
import Tourism1 from "../assets/images/tourisme_masse1.png";
import Tourism2 from "../assets/images/tourisme_masse2.jpg";
import Tourism3 from "../assets/images/tourisme_masse3.avif";
import Tourism4 from "../assets/images/tourisme_masse4.jpg";

// Logos labels
import GreenFinsLogo from "../assets/images/GF_Logo.png";
import BlueFlagLogo from "../assets/images/BF_Logo.webp";
import WCALogo from "../assets/images/WCA.webp";
import FotsLogo from "../assets/images/FotS.png";

// FAQ avatars
import UserAvatar from "../assets/images/utilisateur.png";

function FounderCard({ frontSrc, backSrc, name, role, children }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="
          group relative h-44 w-44 md:h-56 md:w-56
          rounded-full border-4 border-white
          shadow-[0_18px_40px_-15px_rgba(0,0,0,0.45)]
          overflow-hidden transition-transform duration-500 ease-out
          hover:rotate-6 hover:scale-[1.04] bg-white
        "
      >
        <img
          src={backSrc}
          alt={`${name} - back`}
          className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
        />
        <img
          src={frontSrc}
          alt={`${name} - front`}
          className="absolute inset-0 h-full w-full object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-500 ease-out"
        />
      </div>

      <h3 className="mt-4 text-lg md:text-xl font-semibold text-white">{name}</h3>
      <p className="text-sm text-white/85 font-medium">{role}</p>

      <div className="mt-3 max-w-sm rounded-xl bg-white/95 p-4 shadow-md border border-[#1113a2]/30">
        <p className="text-black text-[15px]" style={{ textAlign: "justify" }}>
          {children}
        </p>
      </div>
    </div>
  );
}

export default function APropos() {
  const { t } = useTranslation();
  const [isSending, setIsSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState("");

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const targetTop =
      window.scrollY + rect.top - (window.innerHeight / 2 - rect.height / 2);
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setContactError("");
    setContactSent(false);

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/send-about-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Réponse serveur non ok");
      setContactSent(true);
      e.target.reset();
    } catch (err) {
      console.error("Erreur envoi contact A propos :", err);
      setContactError(t("about.contact.error"));
    } finally {
      setIsSending(false);
    }
  };

  const tourismImages = [Tourism1, Tourism2, Tourism3, Tourism4];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== Hero ===== */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1113a2]">
          {t("about.about.title")}
        </h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          {t("about.about.subtitle")}
        </p>
      </section>

      {/* ===== Petite bannière nav interne ===== */}
      <section className="w-full pb-4">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-center gap-2 md:gap-4 rounded-full bg-white shadow-md border border-gray-200 px-3 py-2 text-sm md:text-base">
            <button
              type="button"
              onClick={() => scrollToSection("presentation")}
              className="px-3 py-1 rounded-full hover:bg-[#1113a2]/10 font-medium text-gray-700"
            >
              {t("about.nav.presentation")}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="px-3 py-1 rounded-full hover:bg-[#1113a2]/10 font-medium text-gray-700"
            >
              {t("about.nav.contact")}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("history")}
              className="px-3 py-1 rounded-full hover:bg-[#1113a2]/10 font-medium text-gray-700"
            >
              {t("about.nav.history")}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("faq")}
              className="px-3 py-1 rounded-full hover:bg-[#1113a2]/10 font-medium text-gray-700"
            >
              {t("about.nav.faq")}
            </button>
          </div>
        </div>
      </section>

      {/* ===== Présentation / Fondateurs ===== */}
      <section
        id="presentation"
        className="relative w-full bg-gradient-to-r from-[#1113a2]/90 via-[#1113a2]/70 to-[#1113a2]/40"
      >
        <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <FounderCard
            frontSrc={ThomasFront}
            backSrc={ThomasBack}
            name={t("about.thomas.name")}
            role={t("about.thomas.role")}
          >
            <Trans
              i18nKey="about.thomas.bio"
              components={{ b: <span className="text-[#1113a2] font-semibold" /> }}
            />
          </FounderCard>

          <FounderCard
            frontSrc={JadeFront}
            backSrc={JadeBack}
            name={t("about.jade.name")}
            role={t("about.jade.role")}
          >
            <Trans
              i18nKey="about.jade.bio"
              components={{ b: <span className="text-[#1113a2] font-semibold" /> }}
            />
          </FounderCard>
        </div>
      </section>

      {/* ===== Contact ===== */}
      <section id="contact" className="w-full bg-gray-100 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-10 md:py-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1113a2] text-center mb-4">
            {t("about.contact.title")}
          </h2>
          <p className="text-center text-gray-600 mb-6">
            {t("about.contact.subtitle")}
          </p>

          {contactError && (
            <p className="text-center text-sm text-red-600 mb-3">{contactError}</p>
          )}
          {contactSent && (
            <p className="text-center text-sm text-green-700 mb-3">
              {t("about.contact.success")}
            </p>
          )}

          <form
            onSubmit={handleContactSubmit}
            className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  {t("about.contact.form.nameLabel")}
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  {t("about.contact.form.emailLabel")}
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                {t("about.contact.form.messageLabel")}
              </label>
              <textarea
                name="message"
                rows="4"
                className="w-full border px-3 py-2 rounded-lg"
                placeholder={t("about.contact.form.messagePlaceholder")}
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSending}
                className="inline-block rounded-xl bg-[#1113a2] px-6 py-2.5 text-white font-semibold hover:bg-[#0e128c] transition shadow-md disabled:opacity-60"
              >
                {isSending ? t("about.contact.form.sending") : t("about.contact.form.submit")}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ===== Histoire / Mission / Engagement ===== */}
      <section id="history" className="w-full bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-10 md:py-12 space-y-8">
          <div className="rounded-2xl border border-[#1113a2]/25 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1113a2] mb-4">
              {t("about.history.title")}
            </h2>
            <p className="text-black mb-6" style={{ textAlign: "justify" }}>
              {t("about.history.intro")}
            </p>

            {/* Timeline */}
            <div className="relative mt-4">
              <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-[#1113a2]/50" />
              <div className="space-y-6">
                <div className="relative pl-10">
                  <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full bg-[#1113a2]" />
                  <h3 className="text-lg md:text-xl font-semibold text-[#1113a2] mb-1">
                    {t("about.history.timeline.storyTitle")}
                  </h3>
                  <p className="text-gray-800 text-sm md:text-[15px]" style={{ textAlign: "justify" }}>
                    {t("about.history.timeline.storyText")}
                  </p>
                </div>

                <div className="relative pl-10">
                  <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full bg-[#1113a2]" />
                  <h3 className="text-lg md:text-xl font-semibold text-[#1113a2] mb-1">
                    {t("about.history.timeline.missionTitle")}
                  </h3>
                  <p className="text-gray-800 text-sm md:text-[15px]" style={{ textAlign: "justify" }}>
                    {t("about.history.timeline.missionText")}
                  </p>
                </div>

                <div className="relative pl-10">
                  <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full bg-[#1113a2]" />
                  <h3 className="text-lg md:text-xl font-semibold text-[#1113a2] mb-1">
                    {t("about.history.timeline.commitTitle")}
                  </h3>
                  <p className="text-gray-800 text-sm md:text-[15px]" style={{ textAlign: "justify" }}>
                    {t("about.history.timeline.commitText")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Carrousel images tourisme de masse */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
            <h3 className="text-lg md:text-xl font-semibold text-[#1113a2] mb-3">
              {t("about.massTourism.title")}
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {tourismImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={t("about.massTourism.alt", { index: idx + 1 })}
                  className="h-36 md:h-40 w-auto rounded-lg object-cover flex-shrink-0 border border-gray-200"
                  loading="lazy"
                />
              ))}
            </div>
          </div>

          {/* Labels */}
          <div className="rounded-2xl border border-[#1113a2]/25 bg-white p-6 md:p-8 shadow-sm">
            <h3 className="text-lg md:text-xl font-semibold text-[#1113a2] mb-4">
              {t("about.labels.title")}
            </h3>
            <p className="text-gray-800 text-sm md:text-[15px] mb-4" style={{ textAlign: "justify" }}>
              {t("about.labels.text")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2">
                <img src={GreenFinsLogo} alt={t("about.labels.greenFinsAlt")} className="h-8 w-auto object-contain" />
                <span className="font-medium text-gray-800">{t("about.labels.greenFins")}</span>
              </div>

              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2">
                <img src={BlueFlagLogo} alt={t("about.labels.blueFlagAlt")} className="h-8 w-auto object-contain" />
                <span className="font-medium text-gray-800">{t("about.labels.blueFlag")}</span>
              </div>

              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2">
                <img src={WCALogo} alt={t("about.labels.wcaAlt")} className="h-8 w-auto object-contain" />
                <span className="font-medium text-gray-800">{t("about.labels.wca")}</span>
              </div>

              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2">
                <img src={FotsLogo} alt={t("about.labels.fotsAlt")} className="h-8 w-auto object-contain" />
                <span className="font-medium text-gray-800">{t("about.labels.fots")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="w-full bg-gray-100 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1113a2] text-center mb-6">
            {t("about.faq.title")}
          </h2>

          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="space-y-3">
                {/* Question */}
                <div className="flex items-start gap-3">
                  <img
                    src={UserAvatar}
                    alt={t("about.faq.userAlt")}
                    className="h-9 w-9 rounded-full object-cover border border-gray-300"
                  />
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200 max-w-xl">
                    <p className="text-sm md:text-[15px] text-gray-900">
                      {t(`about.faq.q${n}.q`)}
                    </p>
                  </div>
                </div>

                {/* Réponse */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-[#1113a2] text-white rounded-2xl px-4 py-3 shadow-sm max-w-xl">
                    <p className="text-sm md:text-[15px]">{t(`about.faq.q${n}.a`)}</p>
                  </div>
                  <img
                    src={n === 2 ? ThomasFront : JadeFront}
                    alt={n === 2 ? t("about.faq.thomasAlt") : t("about.faq.jadeAlt")}
                    className="h-9 w-9 rounded-full object-cover border border-white shadow-md"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="inline-block rounded-xl bg-white text-[#1113a2] border border-[#1113a2]/40 px-6 py-2.5 font-semibold hover:bg-[#1113a2]/10 transition shadow-sm"
            >
              {t("about.faq.cta")}
            </button>
          </div>
        </div>
      </section>

      {/* ===== Dernière div : navigation vers les pages ===== */}
      <section className="w-full bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1113a2] mb-6">
            {t("about.explore.title")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/activities"
              className="rounded-2xl border border-[#1113a2]/30 bg-white text-[#1113a2] font-semibold py-4 shadow-md hover:bg-[#1113a2]/10 transition flex items-center justify-center"
            >
              {t("about.explore.activities")}
            </Link>

            <Link
              to="/species"
              className="rounded-2xl border border-[#1113a2]/30 bg-white text-[#1113a2] font-semibold py-4 shadow-md hover:bg-[#1113a2]/10 transition flex items-center justify-center"
            >
              {t("about.explore.species")}
            </Link>

            <Link
              to="/circuits"
              className="rounded-2xl border border-[#1113a2]/30 bg-white text-[#1113a2] font-semibold py-4 shadow-md hover:bg-[#1113a2]/10 transition flex items-center justify-center"
            >
              {t("about.explore.circuits")}
            </Link>

            <Link
              to="/blog"
              className="rounded-2xl border border-[#1113a2]/30 bg-white text-[#1113a2] font-semibold py-4 shadow-md hover:bg-[#1113a2]/10 transition flex items-center justify-center"
            >
              {t("about.explore.blog")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
