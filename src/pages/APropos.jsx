// src/pages/APropos.jsx
import React, { useState } from "react";
import { useTranslation, Trans } from "react-i18next";

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

/* ✅ même “card shell” que tes autres pages */
function CardShell({ children, className = "" }) {
  return (
    <div className={["rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden", className].join(" ")}>
      {children}
    </div>
  );
}

function FounderCard({ frontSrc, backSrc, name, role, children }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="
          group relative h-40 w-40 md:h-56 md:w-56
          rounded-full border-4 border-white
          shadow-[0_18px_40px_-15px_rgba(0,0,0,0.45)]
          overflow-hidden transition-transform duration-500 ease-out
          hover:rotate-3 hover:scale-[1.03] bg-white
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

      <h3 className="mt-4 text-lg md:text-2xl font-black text-slate-900">{name}</h3>
      <p className="text-sm md:text-base text-slate-600 font-semibold">{role}</p>

      <div className="mt-4 w-full max-w-sm">
        <CardShell className="p-5 border border-[#1113a2]/15">
          <p className="text-slate-800 text-sm md:text-[15px] leading-relaxed" style={{ textAlign: "justify" }}>
            {children}
          </p>
        </CardShell>
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
    el.scrollIntoView({ behavior: "smooth", block: "start" });
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
    <div className="w-full bg-slate-50 min-h-screen pb-16">
      {/* ✅ TITRE fond gris (même vibe que les autres pages) */}
      <section className="py-12 px-6 text-center bg-gray-200">
        <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#1113a2]">
          GuardianMap
        </div>
        <h1 className="mt-3 text-2xl md:text-5xl font-extrabold uppercase tracking-tight text-gray-900">
          {t("about.about.title")}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-gray-700">
          {t("about.about.subtitle")}
        </p>
      </section>

      {/* ✅ Navbar interne (pill) */}
      <section className="w-full -mt-5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-md border border-white/60 px-3 py-3">
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => scrollToSection("presentation")}
                className="px-4 py-2 rounded-full border border-slate-200 bg-white text-xs md:text-sm font-black text-slate-700 hover:bg-slate-50 hover:text-[#1113a2] transition uppercase tracking-wider"
              >
                {t("about.nav.presentation")}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="px-4 py-2 rounded-full border border-slate-200 bg-white text-xs md:text-sm font-black text-slate-700 hover:bg-slate-50 hover:text-[#1113a2] transition uppercase tracking-wider"
              >
                {t("about.nav.contact")}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("history")}
                className="px-4 py-2 rounded-full border border-slate-200 bg-white text-xs md:text-sm font-black text-slate-700 hover:bg-slate-50 hover:text-[#1113a2] transition uppercase tracking-wider"
              >
                {t("about.nav.history")}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("faq")}
                className="px-4 py-2 rounded-full border border-slate-200 bg-white text-xs md:text-sm font-black text-slate-700 hover:bg-slate-50 hover:text-[#1113a2] transition uppercase tracking-wider"
              >
                {t("about.nav.faq")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Présentation / Fondateurs (fond clair + cards) */}
      <section id="presentation" className="py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
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
              <Trans i18nKey="about.jade.bio" components={{ b: <span className="text-[#1113a2] font-semibold" /> }} />
            </FounderCard>
          </div>
        </div>
      </section>

      {/* ✅ Contact (card shell) */}
      <section id="contact" className="py-12 px-4 md:px-8 bg-slate-100 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#1113a2]">
              Contact
            </div>
            <h2 className="mt-2 text-2xl md:text-4xl font-black text-slate-900">{t("about.contact.title")}</h2>
            <p className="mt-3 text-slate-700 max-w-2xl mx-auto">{t("about.contact.subtitle")}</p>
          </div>

          {contactError && (
            <div className="max-w-2xl mx-auto mb-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {contactError}
            </div>
          )}
          {contactSent && (
            <div className="max-w-2xl mx-auto mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
              {t("about.contact.success")}
            </div>
          )}

          <CardShell className="max-w-2xl mx-auto p-6 md:p-8">
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-slate-600 mb-2">
                    {t("about.contact.form.nameLabel")}
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1113a2]/25"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-slate-600 mb-2">
                    {t("about.contact.form.emailLabel")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1113a2]/25"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-600 mb-2">
                  {t("about.contact.form.messageLabel")}
                </label>
                <textarea
                  name="message"
                  rows="4"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1113a2]/25"
                  placeholder={t("about.contact.form.messagePlaceholder")}
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full md:w-auto inline-flex items-center justify-center rounded-2xl bg-[#1113a2] px-7 py-3 text-white text-sm font-black shadow hover:opacity-95 transition disabled:opacity-60"
                >
                  {isSending ? t("about.contact.form.sending") : t("about.contact.form.submit")}
                </button>
              </div>
            </form>
          </CardShell>
        </div>
      </section>

      {/* ✅ Histoire / Mission / Engagement */}
      <section id="history" className="py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <CardShell className="p-6 md:p-8">
            <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#1113a2]">
              Histoire
            </div>
            <h2 className="mt-2 text-2xl md:text-4xl font-black text-slate-900">{t("about.history.title")}</h2>

            <p className="mt-4 text-slate-700 text-sm md:text-base leading-relaxed" style={{ textAlign: "justify" }}>
              {t("about.history.intro")}
            </p>

            {/* Timeline (style “guide”) */}
            <div className="relative mt-7">
              <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-[#1113a2]/25" />
              <div className="space-y-6">
                {[
                  {
                    title: t("about.history.timeline.storyTitle"),
                    text: t("about.history.timeline.storyText"),
                  },
                  {
                    title: t("about.history.timeline.missionTitle"),
                    text: t("about.history.timeline.missionText"),
                  },
                  {
                    title: t("about.history.timeline.commitTitle"),
                    text: t("about.history.timeline.commitText"),
                  },
                ].map((item) => (
                  <div key={item.title} className="relative pl-10">
                    <span className="absolute left-0 top-2 h-3.5 w-3.5 rounded-full bg-[#1113a2]" />
                    <h3 className="text-base md:text-xl font-black text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-slate-700 text-sm md:text-base leading-relaxed" style={{ textAlign: "justify" }}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardShell>

          {/* Carrousel images tourisme de masse (mêmes cards) */}
          <CardShell className="p-6 md:p-8">
            <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#1113a2]">
              Constat
            </div>
            <h3 className="mt-2 text-xl md:text-2xl font-black text-slate-900">{t("about.massTourism.title")}</h3>

            <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
              {tourismImages.map((src, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                >
                  <img
                    src={src}
                    alt={t("about.massTourism.alt", { index: idx + 1 })}
                    className="h-36 md:h-44 w-[240px] md:w-[280px] object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </CardShell>

          {/* Labels (mêmes chips/cards) */}
          <CardShell className="p-6 md:p-8">
            <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#1113a2]">
              Labels
            </div>
            <h3 className="mt-2 text-xl md:text-2xl font-black text-slate-900">{t("about.labels.title")}</h3>

            <p className="mt-3 text-slate-700 text-sm md:text-base" style={{ textAlign: "justify" }}>
              {t("about.labels.text")}
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { img: GreenFinsLogo, alt: t("about.labels.greenFinsAlt"), name: t("about.labels.greenFins") },
                { img: BlueFlagLogo, alt: t("about.labels.blueFlagAlt"), name: t("about.labels.blueFlag") },
                { img: WCALogo, alt: t("about.labels.wcaAlt"), name: t("about.labels.wca") },
                { img: FotsLogo, alt: t("about.labels.fotsAlt"), name: t("about.labels.fots") },
              ].map((x) => (
                <div key={x.name} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                    <img src={x.img} alt={x.alt} className="h-9 w-auto object-contain" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{x.name}</p>
                    <p className="text-xs text-slate-600">Certification / programme</p>
                  </div>
                </div>
              ))}
            </div>
          </CardShell>
        </div>
      </section>

      {/* ✅ FAQ (bubbles style) */}
      <section id="faq" className="py-12 px-4 md:px-8 bg-slate-100 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#1113a2]">
              FAQ
            </div>
            <h2 className="mt-2 text-2xl md:text-4xl font-black text-slate-900">{t("about.faq.title")}</h2>
          </div>

          <div className="space-y-7">
            {[1, 2, 3].map((n) => (
              <div key={n} className="space-y-3">
                {/* Question */}
                <div className="flex items-start gap-3">
                  <img
                    src={UserAvatar}
                    alt={t("about.faq.userAlt")}
                    className="h-10 w-10 rounded-full object-cover border border-slate-200 bg-white"
                  />
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-200 max-w-xl">
                    <p className="text-sm md:text-[15px] text-slate-900">{t(`about.faq.q${n}.q`)}</p>
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
                    className="h-10 w-10 rounded-full object-cover border border-white shadow-md"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-white text-[#1113a2] border border-[#1113a2]/30 text-sm font-black shadow hover:bg-slate-50 transition"
            >
              {t("about.faq.cta")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
