// src/pages/activites/Activites.jsx
import { Link } from "react-router-dom";

// Images
import bannerImg from "../../assets/images/bannière_activité.jpg";
import diveCardImg from "../../assets/images/Activité_plongée.jpg";
import gfLogo from "../../assets/images/GF_Logo.png";
import bfLogo from "../../assets/images/BF_Logo.webp";

export default function Activites() {
  return (
    <div className="w-full">
      {/* ======= SECTION 1 — TITRE SUR FOND GRIS ======= */}
      <section className="relative py-16 px-6 text-center overflow-hidden bg-gray-200">
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
            Activités
          </h1>
          <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
            <strong>GuardianMap</strong> met en avant le{" "}
            <span className="font-semibold">tourisme marin responsable</span> :
            activités exigeantes sur les bonnes pratiques et, quand c’est possible,
            portées par des labels reconnus.
          </p>
        </div>
      </section>

      {/* ======= SECTION 2 — ENCADRÉ LABELS ======= */}
      <section className="relative w-full py-12 px-4 md:px-8 overflow-hidden">
        {/* Fond bannière + léger voile */}
        <img
          src={bannerImg}
          alt="Fond Activités"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 backdrop-blur-[1px]" />

        {/* Encadré unique */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
              Des critères clairs et exigeants
            </h2>
            <p className="text-gray-800 leading-relaxed">
              Chaque centre, chaque sortie, chaque activité doit avoir un{" "}
              <span className="font-semibold text-[#1113a2]">
                label officiel
              </span>{" "}
              décerné par les gouvernements ou des ONG.
            </p>

            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3">
              <p className="text-sm md:text-base text-gray-900 text-center font-semibold">
                Si ce n’est pas <span className="text-[#1113a2]">certifié</span>, ce n’est pas sur <span className="text-[#1113a2]">GuardianMap</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======= SECTION 3 — PLONGÉE (IMAGE GAUCHE / TEXTE + LABELS DROITE) ======= */}
      <section className="w-full py-12 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-8 md:gap-12">
          {/* Image à gauche */}
          <div className="flex-1">
            <img
              src={diveCardImg}
              alt="Activités de plongée"
              className="w-full rounded-2xl shadow-md object-cover md:min-h-[420px]"
              loading="lazy"
            />
          </div>

          {/* Contenu à droite */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Titre */}
            <div>
              <h2 className="text-4xl md:text-3xl font-extrabold text-[#1113a2] mb-2">
                Plongée
              </h2>
              <div className="h-1 w-25 bg-gradient-to-r from-[#1113a2] via-indigo-600 to-indigo-300 rounded-full" />
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">
              Des centres qui appliquent des{" "}
              <span className="font-semibold">standards reconnus</span> :
              gestion des bateaux, ancrage responsable, protection des coraux
              et sensibilisation des plongeurs. Ces structures sont souvent{" "}
              <span className="font-semibold text-[#1113a2]">labellisées</span> afin
              de minimiser leur impact sur les écosystèmes marins.
            </p>

            {/* Bouton */}
            <div>
              <Link
                to="/plongée"
                className="inline-block rounded-xl bg-[#1113a2] px-6 py-3 text-white font-semibold hover:bg-[#0e128c] transition shadow-md"
              >
                Découvrir les activités de plongée
              </Link>
            </div>

            {/* Labels à la suite */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Les labels que nous utilisons :
              </h3>
              <div className="space-y-5">
                {/* Green Fins */}
                <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
                  <img
                    src={gfLogo}
                    alt="Logo Green Fins"
                    className="w-12 h-12 object-contain shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold leading-tight">Green Fins</p>
                    <p className="text-sm text-gray-700">
                      Référentiel international soutenu par l’ONU : gestion des bateaux,
                      ancrage responsable, protection des coraux.
                    </p>
                  </div>
                </div>

                {/* Blue Flag */}
                <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
                  <img
                    src={bfLogo}
                    alt="Logo Blue Flag (Pavillon Bleu)"
                    className="w-12 h-12 object-contain shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold leading-tight">Blue Flag (Pavillon Bleu)</p>
                    <p className="text-sm text-gray-700">
                      Label environnemental pour plages et marinas : qualité de l’eau,
                      gestion des déchets, éducation à l’environnement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
