import React from "react";
import { useTranslation } from "react-i18next";

// Images
import JadeFront from "../assets/images/Jade2.jpg";
import JadeBack from "../assets/images/Jade.jpg";
import ThomasFront from "../assets/images/Thomas2.jpg";
import ThomasBack from "../assets/images/Thomas.jpg";

// Newsletter
import NewsletterForm from "../components/NewsletterForm";

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

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ===== Hero ===== */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1113a2]">
          {t("about.title")}
        </h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          {t("about.subtitle")}
        </p>
      </section>

      {/* ===== Founders ===== */}
      <section className="relative w-full bg-gradient-to-r from-[#1113a2]/90 via-[#1113a2]/70 to-[#1113a2]/40">
        <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          
          <FounderCard
            frontSrc={ThomasFront}
            backSrc={ThomasBack}
            name={t("about.thomas.name")}
            role={t("about.thomas.role")}
          >
            {t("about.thomas.bio")}
          </FounderCard>

          <FounderCard
            frontSrc={JadeFront}
            backSrc={JadeBack}
            name={t("about.jade.name")}
            role={t("about.jade.role")}
          >
            {t("about.jade.bio")}
          </FounderCard>
        </div>
      </section>

      {/* ===== Pourquoi GuardianMap ===== */}
      <section className="w-full bg-gray-100">
        <div className="px-6 py-10 md:py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1113a2]">
            {t("about.why.title")}
          </h2>
        </div>
      </section>

      <section className="w-full bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="rounded-xl border border-[#1113a2]/25 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-[#1113a2] mb-3">{t("about.why.problemTitle")}</h3>
              <p className="text-black" style={{ textAlign: "justify" }}>
                {t("about.why.problem")}
              </p>
            </div>

            <div className="rounded-xl border border-[#1113a2]/25 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-[#1113a2] mb-3">{t("about.why.solutionTitle")}</h3>
              <p className="text-black" style={{ textAlign: "justify" }}>
                {t("about.why.solution")}
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
