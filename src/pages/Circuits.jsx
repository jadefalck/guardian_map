// src/pages/Circuits.jsx
import React, { useState } from "react";
import { useTranslation, Trans } from "react-i18next";

import bannerCircuit from "../assets/images/bannière_circuit.jpg";
import itineraireImg from "../assets/images/accueil_circuit_éthique.jpg";
import guideCover from "../assets/images/Guide_voyage_couv.png";

export default function Circuits() {
  const { t } = useTranslation();
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizError, setQuizError] = useState("");
  const [isSending, setIsSending] = useState(false);

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

      if (!res.ok) {
        throw new Error("Réponse serveur non ok");
      }

      setQuizSubmitted(true);
    } catch (err) {
      console.error("Erreur envoi quiz circuits :", err);
      setQuizError(
        "Oups, une erreur est survenue pendant l’envoi. Tu peux réessayer dans quelques instants."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full">
      {/* ======= SECTION 1 — TITRE (même style que les autres pages) ======= */}
      <section className="py-10 px-6 text-center bg-gray-200">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
          {t("circuits.hero.title")}
        </h1>
        <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
          <Trans
            i18nKey="circuits.hero.subtitle"
            components={{ b: <span className="font-semibold" /> }}
          />
        </p>
      </section>

      {/* ======= SECTION 2 — FOND IMAGE + ENCADRÉ GUIDE PERSONNALISÉ ======= */}
      <section className="relative w-full py-16 px-6 md:px-10 overflow-hidden">
        <img
          src={bannerCircuit}
          alt={t("circuits.bannerAlt")}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/20" />

        {/* Carte guide + bouton "Intéressé ?" */}
        <div className="relative z-10 max-w-5xl mx-auto bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-200">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            {/* Image du guide */}
            <div className="flex justify-center">
              <img
                src={guideCover}
                alt="Guide de voyage personnalisé"
                className="w-full max-w-xs rounded-xl shadow-md object-contain"
                loading="lazy"
              />
            </div>

            {/* Texte + bouton */}
            <div className="space-y-5 text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                Guide de voyage personnalisé
              </h2>

              <p
                className="text-3xl font-extrabold"
                style={{ color: "#1a3936" }}
              >
                25 €
              </p>

              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                Nous créons <b>plusieurs propositions d’itinéraires sur mesure</b>,
                en fonction de tes habitudes de voyage, de ton rythme, de ton
                budget et de tes envies.
              </p>

              {!showQuiz && (
                <button
                  type="button"
                  onClick={() => {
                    setShowQuiz(true);
                    setQuizSubmitted(false);
                    setQuizError("");
                  }}
                  className="inline-block rounded-xl bg-[#1113a2] px-6 py-3 text-white font-semibold hover:bg-[#0e128c] transition shadow-md"
                >
                  Intéressé&nbsp;?
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===== DIV QUI APPARAÎT AVEC LE QUIZZ ===== */}
        {showQuiz && (
          <div className="relative z-10 max-w-5xl mx-auto mt-6 bg-gray-50 border border-gray-200 rounded-2xl shadow-xl p-6 md:p-8">
            {!quizSubmitted ? (
              <>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Quelques questions pour créer ton voyage
                </h3>

                <p className="text-sm md:text-base text-gray-700 mb-4">
                  Plus tu nous donnes de détails, plus l’itinéraire pourra coller
                  à tes envies.
                </p>

                {quizError && (
                  <p className="text-sm text-red-600 mb-3">{quizError}</p>
                )}

                <form className="space-y-4 text-sm" onSubmit={handleQuizSubmit}>
                  {/* IDENTITÉ */}
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">
                        Prénom / pseudo
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="w-full border px-3 py-2 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        E-mail de contact
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="w-full border px-3 py-2 rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  {/* PROFIL VOYAGEUR */}
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">
                        Tu voyages…
                      </label>
                      <select
                        name="groupType"
                        className="w-full border px-3 py-2 rounded-lg"
                      >
                        <option value="solo">Seul(e)</option>
                        <option value="couple">En couple</option>
                        <option value="friends">Entre ami(e)s</option>
                        <option value="family">En famille</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        Nombre de personnes
                      </label>
                      <input
                        type="number"
                        name="people"
                        min="1"
                        className="w-full border px-3 py-2 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* DESTINATION & DURÉE */}
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">
                        Destination souhaitée
                      </label>
                      <input
                        type="text"
                        name="destination"
                        className="w-full border px-3 py-2 rounded-lg"
                        placeholder="Ex : Philippines, Oman…"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        Durée du séjour (jours)
                      </label>
                      <input
                        type="number"
                        name="days"
                        min="1"
                        className="w-full border px-3 py-2 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* PÉRIODE */}
                  <div>
                    <label className="block font-semibold mb-1">
                      Période envisagée
                    </label>
                    <input
                      type="text"
                      name="period"
                      className="w-full border px-3 py-2 rounded-lg"
                      placeholder="Ex : février 2026, été, vacances de Pâques…"
                    />
                  </div>

                  {/* STYLE DE VOYAGE */}
                  <div>
                    <label className="block font-semibold mb-1">
                      Tu préfères un voyage…
                    </label>
                    <select
                      name="travelStyle"
                      className="w-full border px-3 py-2 rounded-lg"
                    >
                      <option value="move-a-lot">
                        Avec beaucoup de déplacements
                      </option>
                      <option value="stay-one-place">
                        Principalement au même endroit
                      </option>
                      <option value="balanced">Mix équilibré</option>
                    </select>
                  </div>

                  {/* TRANSFERTS */}
                  <div>
                    <label className="block font-semibold mb-1">
                      Ton niveau de tolérance aux longs trajets
                    </label>
                    <select
                      name="transfers"
                      className="w-full border px-3 py-2 rounded-lg"
                    >
                      <option value="short-only">
                        Plutôt courts trajets, je n’aime pas passer des heures sur
                        la route
                      </option>
                      <option value="ok-some">
                        Quelques longs transferts ne me dérangent pas
                      </option>
                      <option value="love-roadtrips">
                        J’adore les road-trips et les trajets un peu longs
                      </option>
                    </select>
                  </div>

                  {/* PRÉFÉRENCES ACTIVITÉS */}
                  <div>
                    <label className="block font-semibold mb-1">
                      Ce que tu aimes le plus
                    </label>
                    <div className="grid md:grid-cols-3 gap-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" name="likesWater" value="yes" />
                        <span>Mer / activités nautiques</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" name="likesNature" value="yes" />
                        <span>Nature / randos</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" name="likesCulture" value="yes" />
                        <span>Culture / gastronomie</span>
                      </label>
                    </div>
                  </div>

                  {/* BUDGET */}
                  <div>
                    <label className="block font-semibold mb-1">
                      Budget / personne (hors vol)
                    </label>
                    <select
                      name="budget"
                      className="w-full border px-3 py-2 rounded-lg"
                    >
                      <option value="<1000">Moins de 1000 €</option>
                      <option value="1000-2000">1000–2000 €</option>
                      <option value=">2000">Plus de 2000 €</option>
                    </select>
                  </div>

                  {/* HÉBERGEMENT */}
                  <div>
                    <label className="block font-semibold mb-1">
                      Style d’hébergement
                    </label>
                    <select
                      name="accommodation"
                      className="w-full border px-3 py-2 rounded-lg"
                    >
                      <option value="hostel">Petits budgets</option>
                      <option value="mid">Confort simple (2–3★)</option>
                      <option value="higher">Plus de confort (3–4★)</option>
                    </select>
                  </div>

                  {/* INFOS SUPPLÉMENTAIRES */}
                  <div>
                    <label className="block font-semibold mb-1">
                      Autres infos utiles
                    </label>
                    <textarea
                      name="extra"
                      rows="3"
                      className="w-full border px-3 py-2 rounded-lg"
                      placeholder="Dates précises, contraintes, envies très spécifiques…"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="mt-2 inline-block rounded-xl bg-[#1113a2] px-6 py-2.5 text-white font-semibold hover:bg-[#0e128c] transition shadow-md disabled:opacity-60"
                  >
                    {isSending ? "Envoi en cours..." : "Envoyer le quizz"}
                  </button>

                </form>
              </>
            ) : (
              <p className="text-sm md:text-base text-gray-800 font-semibold text-center">
                Merci ! Nous vous contacterons par mail avec une proposition
                personnalisée.
              </p>
            )}
          </div>
        )}
      </section>

      {/* ======= SECTION 3 — EN COURS + CONTENU ======= */}
      <section className="w-full py-20 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="w-full bg-gray-200 border border-gray-300 rounded-2xl shadow-sm p-6 md:p-8 mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-3">
              En cours <span className="text-3xl">🛠</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                {t("circuits.explain.title")}
              </h3>

              <p className="text-gray-700 leading-relaxed">
                <Trans
                  i18nKey="circuits.explain.intro"
                  components={{ b: <span className="font-semibold" /> }}
                />
              </p>

              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-[#1113a2] font-bold">•</span>
                  <Trans
                    i18nKey="circuits.explain.point1"
                    components={{ b: <span className="font-semibold" /> }}
                  />
                </li>
                <li className="flex gap-2">
                  <span className="text-[#1113a2] font-bold">•</span>
                  <Trans
                    i18nKey="circuits.explain.point2"
                    components={{ b: <span className="font-semibold" /> }}
                  />
                </li>
                <li className="flex gap-2">
                  <span className="text-[#1113a2] font-bold">•</span>
                  {t("circuits.explain.point3")}
                </li>
              </ul>
            </div>

            <div className="flex justify-center">
              <img
                src={itineraireImg}
                alt={t("circuits.illustrationAlt")}
                className="max-h-96 w-auto object-cover rounded-2xl shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
