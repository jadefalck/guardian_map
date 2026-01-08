// src/pages/Guide_Voyage.jsx
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import oceanImage from "../assets/images/bannière_blog2.jpg";

/* ========= Mini UI helpers ========= */
const Bubble = ({ text, tone = "blue", small = false }) => {
  const cls =
    tone === "pink"
      ? "bg-pink-50 border-pink-200 text-pink-800"
      : tone === "yellow"
      ? "bg-yellow-50 border-yellow-200 text-yellow-900"
      : tone === "green"
      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
      : tone === "purple"
      ? "bg-purple-50 border-purple-200 text-purple-800"
      : "bg-blue-50 border-blue-200 text-blue-800";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-black ${cls} ${
        small ? "px-3 py-1.5 text-xs md:text-sm" : "px-4 py-2 text-xs md:text-sm"
      }`}
    >
      {text}
    </span>
  );
};

const Pill = ({ text, kind = "blue" }) => {
  const cls =
    kind === "danger"
      ? "bg-red-50 text-red-700 border-red-200"
      : kind === "ok"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : kind === "warning"
      ? "bg-yellow-50 text-yellow-800 border-yellow-200"
      : kind === "purple"
      ? "bg-purple-50 text-purple-800 border-purple-200"
      : "bg-blue-50 text-blue-700 border-blue-200";

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full border text-[11px] font-black tracking-wide ${cls}`}>
      {text}
    </span>
  );
};

const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-[10px] font-black uppercase tracking-[0.22em] text-slate-500 mb-2">{label}</label>
    {children}
    {hint && <p className="mt-2 text-[11px] text-slate-500">{hint}</p>}
  </div>
);

const inputBase =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm " +
  "focus:outline-none focus:ring-2 focus:ring-[#1113a2]/25 focus:border-[#1113a2]";

const selectBase = inputBase;

export default function GuideVoyage() {
  const { t } = useTranslation();

  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizError, setQuizError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const bubbles = useMemo(
    () => [
      { text: "J’ai la flemme de préparer mon voyage", tone: "blue" },
      { text: "Je ne sais pas par où commencer", tone: "yellow" },
      { text: "Et si je manquais d’infos importantes ?", tone: "pink" },
      { text: "Je veux un itinéraire clair (sans perdre 20h sur Google)", tone: "green" },
      { text: "Je veux éviter les pièges à touristes", tone: "purple" },
      { text: "Je veux des spots éthiques pour voir les animaux", tone: "blue" },
      { text: "Je veux optimiser mon budget", tone: "yellow" },
      { text: "Je veux savoir où aller selon la saison", tone: "green" },
      { text: "Je veux un plan simple : transport, étapes, timing", tone: "purple" },
      { text: "Je veux des conseils concrets (pas des généralités)", tone: "pink" },
    ],
    []
  );

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setQuizError("");
    setIsSending(true);

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/send-circuit-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Server response not ok");
      setQuizSubmitted(true);
    } catch (err) {
      console.error("Erreur envoi quiz guide voyage :", err);
      setQuizError("Impossible d’envoyer le questionnaire pour le moment. Réessaie plus tard.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* ✅ TITRE sur div grise (style Especes.jsx) */}
      <section className="py-12 px-6 text-center bg-gray-200">
        <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-[#1113a2]">
          {t("guide.kicker", { defaultValue: "Guide de voyage" })}
        </div>

        <h1 className="mt-3 text-xl md:text-5xl font-extrabold uppercase tracking-tight text-gray-900">
          {t("guide.title", { defaultValue: "Guide personnalisé" })}
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-gray-700">
          {t("guide.subtitle", {
            defaultValue: "Tu réponds à quelques questions → on fait les recherches → tu reçois un guide clair et utile.",
          })}
        </p>
      </section>

      {/* ✅ DIV image fond + phrases + conclusion */}
      <section className="relative w-full overflow-hidden">
        <img src={oceanImage} alt="Fond océan" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-6 py-10 md:py-12">
          <div className="bg-white/90 backdrop-blur-md rounded-[3rem] border border-white/40 shadow-2xl p-6 md:p-8">
            <p className="text-[11px] md:text-xs font-black uppercase tracking-[0.22em] text-slate-700">
              Si tu t&apos;es déjà dit ça :
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {bubbles.map((b, i) => (
                <Bubble key={`${b.text}-${i}`} text={b.text} tone={b.tone} small />
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <p className="text-sm md:text-base font-black text-slate-900">Alors le guide est fait pour toi.</p>
              <p className="mt-1 text-[12px] text-slate-600">
                Tu gagnes du temps, tu évites les mauvais plans, et tu pars avec une vraie stratégie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ FORM + COLONNE DROITE (3 rectangles) */}
      <section className="w-full py-12 px-4 md:px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
            {/* Form card */}
            <div className="bg-white border border-slate-100 rounded-[3rem] shadow-sm p-7 md:p-10">
              {!quizSubmitted ? (
                <>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Questionnaire</p>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">Dis-nous comment tu voyages</h2>
                      <p className="mt-2 text-sm text-slate-600">Plus tu es précis(e), plus le guide sera efficace.</p>
                    </div>
                  </div>

                  {quizError && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                      <p className="text-sm font-semibold text-red-700">{quizError}</p>
                    </div>
                  )}

                  <form className="mt-8 space-y-6" onSubmit={handleQuizSubmit}>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Field label="Prénom / Nom">
                        <input type="text" name="name" className={inputBase} required placeholder="Ex : Agathe Guerry" />
                      </Field>
                      <Field label="Email">
                        <input type="email" name="email" className={inputBase} required placeholder="Ex : agathe@email.com" />
                      </Field>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Field label="Destination" hint="Un pays, une région, ou même une liste (ex : Philippines + Indonésie).">
                        <input type="text" name="destination" className={inputBase} placeholder="Ex : Philippines" />
                      </Field>
                      <Field label="Nombre de jours">
                        <input type="number" name="days" min="1" className={inputBase} placeholder="Ex : 15" />
                      </Field>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Field label="Période" hint="Mois + année, ou dates exactes si tu les as.">
                        <input type="text" name="period" className={inputBase} placeholder="Ex : avril 2026" />
                      </Field>
                      <Field label="Budget (approx.)">
                        <select name="budget" className={selectBase} defaultValue="1000-2000">
                          <option value="<1000">&lt; 1000€</option>
                          <option value="1000-2000">1000–2000€</option>
                          <option value=">2000">&gt; 2000€</option>
                        </select>
                      </Field>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Field label="Style de voyage">
                        <select name="travelStyle" className={selectBase} defaultValue="balanced">
                          <option value="move-a-lot">Je bouge souvent (roadtrip)</option>
                          <option value="balanced">Équilibré</option>
                          <option value="stay-one-place">Je préfère rester posé(e)</option>
                        </select>
                      </Field>
                      <Field label="Vous partez…">
                        <select name="groupType" className={selectBase} defaultValue="couple">
                          <option value="solo">Solo</option>
                          <option value="couple">En couple</option>
                          <option value="friends">Entre amis</option>
                          <option value="family">En famille</option>
                        </select>
                      </Field>
                    </div>

                    <Field label="Vos priorités">
                      <div className="grid md:grid-cols-3 gap-3">
                        <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer hover:bg-slate-100 transition">
                          <input type="checkbox" name="likesWater" value="yes" className="accent-[#1113a2]" />
                          <span className="text-sm text-slate-800 font-medium">Activités mer</span>
                        </label>
                        <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer hover:bg-slate-100 transition">
                          <input type="checkbox" name="likesNature" value="yes" className="accent-[#1113a2]" />
                          <span className="text-sm text-slate-800 font-medium">Nature / rando</span>
                        </label>
                        <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer hover:bg-slate-100 transition">
                          <input type="checkbox" name="likesCulture" value="yes" className="accent-[#1113a2]" />
                          <span className="text-sm text-slate-800 font-medium">Culture / villes</span>
                        </label>
                      </div>
                    </Field>

                    <Field label="Infos importantes / contraintes" hint="Ex : éviter trajets longs, voir tortues, île calme, intolérances, etc.">
                      <textarea
                        name="extra"
                        rows="5"
                        className={`${inputBase} resize-none`}
                        placeholder="Ex : je veux éviter les trajets longs, je veux absolument voir des tortues, je veux une île calme…"
                      />
                    </Field>

                    <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
                      <button
                        type="submit"
                        disabled={isSending}
                        className="inline-flex items-center justify-center rounded-2xl bg-[#1113a2] px-7 py-4 text-white font-black text-sm hover:opacity-95 transition shadow-lg disabled:opacity-60"
                      >
                        {isSending ? "Envoi…" : "Envoyer"}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-14">
                  <p className="text-2xl font-black text-slate-900">Merci !</p>
                  <p className="mt-3 text-sm text-slate-600">Ton questionnaire a bien été envoyé. On revient vers toi rapidement.</p>
                  <div className="mt-6 flex justify-center gap-2">
                    <Pill text="Reçu" kind="ok" />
                    <Pill text="En cours" kind="warning" />
                  </div>
                </div>
              )}
            </div>

            {/* ✅ Colonne droite : 3 rectangles (Prix / Ce que tu reçois / À savoir) */}
            <aside className="space-y-4">
              {/* PRIX */}
              <div className="bg-[#1113a2] text-white p-7 rounded-[3rem] shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/70">Tarif</p>
                <h3 className="text-3xl font-black mt-2">19€</h3>
                <p className="mt-1 text-sm text-white/90">
                  Paiement via <b>Wero</b> (pour le moment)
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Pill text="Rapide" kind="ok" />
                  <Pill text="Utile" kind="ok" />
                  <Pill text="Sur-mesure" kind="purple" />
                </div>
              </div>

              {/* CE QUE TU REÇOIS */}
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-7">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1113a2]">Contenu</p>
                <h3 className="text-xl font-black text-slate-900 mt-2">Ce que tu reçois</h3>

                <ul className="mt-5 space-y-3 text-sm text-slate-700">
                  <li className="flex gap-2">✅ Plusieurs <b>propositions d’itinéraires</b></li>
                  <li className="flex gap-2">✅ Sélection de <b>logements</b> (selon ton budget)</li>
                  <li className="flex gap-2">✅ Suggestions de <b>restaurants</b> (bons & fiables)</li>
                  <li className="flex gap-2">✅ Conseils <b>budget & déplacements</b></li>
                  <li className="flex gap-2">✅ <b>Liens directs</b> + sources fiables</li>
                </ul>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[12px] text-slate-600">
                    Objectif : te donner un plan clair + des options concrètes, sans passer 20h à comparer.
                  </p>
                </div>
              </div>

              {/* À SAVOIR */}
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-7">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-500">Transparence</p>
                <h3 className="text-xl font-black text-slate-900 mt-2">À savoir avant de commander</h3>
                <p className="text-sm text-slate-600 mt-2">Pour éviter les malentendus : on est carré dès le départ.</p>

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-slate-800">
                    ❌ Nous ne sommes <b>pas</b> une agence de voyage.
                  </div>
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-slate-800">
                    ❌ Nous ne pouvons <b>pas réserver</b> à ta place (vols / hôtels / activités).
                  </div>
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-slate-800">
                    ✅ En revanche, on <b>mâche le travail</b> : recherches, tri, itinéraire, conseils, sources.
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-800">
                    <b>Paiement :</b> uniquement <span className="font-black text-[#1113a2]">Wero</span> pour le moment.
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Pill text="Pas d'agence" kind="danger" />
                  <Pill text="Pas de booking" kind="danger" />
                  <Pill text="Recherche & tri" kind="ok" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

