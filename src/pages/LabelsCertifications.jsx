import React from "react";

// Images
import GFLogo from "../assets/images/GF_Logo.png";
import BFLogo from "../assets/images/BF_Logo.webp";
import PADIlogo from "../assets/images/PADI_EC_Logo.webp";
import WCAlogo from "../assets/images/WCA_Logo.png";
import CMPlogo from "../assets/images/CMP_Logo.png";

// Si ton composant NewsletterForm est déjà créé ailleurs
import NewsletterForm from "../components/NewsletterForm";

export default function LabelsCertifications() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1113a2]">
          Labels &amp; Certifications
        </h1>

        <p className="mt-4 text-lg text-gray-700 max-w-3xl">
          GuardianMap, c’est la plateforme de réservation d’activités
          touristiques marines qui révolutionne la protection des océans.
        </p>

        <div className="mt-6 rounded-2xl border bg-white p-5 shadow-md hover:shadow-lg transition duration-300">
          <p className="text-gray-800">
            <span className="font-semibold text-[#1113a2]">
              Le concept ? Zéro compromis environnemental.
            </span>{" "}
            Chaque centre, chaque sortie, chaque activité doit avoir ses labels officiels
            validés par les gouvernements et les ONG.
            <span className="font-semibold"> Si ce n’est pas certifié, ce n’est pas sur GuardianMap.</span>
          </p>
          <p className="mt-3 text-gray-800 font-medium">
            GuardianMap, c’est simple : vous réservez, nous garantissons.
          </p>
        </div>
      </section>

      {/* Corps */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#1113a2]">
          Labels et certifications que nous prenons en compte
        </h2>
        <p className="mt-2 text-gray-600">Trois secteurs d’activités maritimes :</p>

        {/* Grille */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Plongée */}
          <article className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition duration-300">
            <h3 className="text-xl font-semibold text-[#1113a2]">Les plongées</h3>
            <p className="mt-1 text-sm text-gray-600">Centres de plongée et snorkeling certifiés.</p>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3">
                <img src={GFLogo} alt="Green Fins" className="h-12 w-12 object-contain" />
                <div>
                  <p className="font-medium">Green Fins</p>
                  <p className="text-sm text-gray-600">
                    Référentiel international soutenu par l’ONU pour les centres de plongée :
                    gestion des bateaux, ancrage responsable, protection des coraux.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <img src={BFLogo} alt="Blue Flag / Pavillon Bleu" className="h-12 w-12 object-contain" />
                <div>
                  <p className="font-medium">Blue Flag (Pavillon Bleu)</p>
                  <p className="text-sm text-gray-600">
                    Label environnemental pour plages et marinas : qualité de l’eau, gestion
                    des déchets, éducation à l’environnement.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <img src={PADIlogo} alt="PADI Eco Center" className="h-12 w-12 object-contain" />
                <div>
                  <p className="font-medium">PADI Eco Center</p>
                  <p className="text-sm text-gray-600">
                    Reconnaissance des centres PADI engagés : conservation marine,
                    réduction des impacts et implication des plongeurs.
                  </p>
                </div>
              </li>
            </ul>
          </article>

          {/* Observation */}
          <article className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition duration-300">
            <h3 className="text-xl font-semibold text-[#1113a2]">
              L’observation des animaux marins
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Dauphins, baleines, tortues, requins — observation responsable.
            </p>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3">
                <img src={WCAlogo} alt="World Cetacean Alliance" className="h-12 w-12 object-contain" />
                <div>
                  <p className="font-medium">WCA – Responsible Whale/Dolphin Watching</p>
                  <p className="text-sm text-gray-600">
                    Standards : distances respectées, vitesses réduites, zéro perturbation,
                    pas de nourrissage ni de nage forcée.
                  </p>
                </div>
              </li>
            </ul>
          </article>

          {/* Sorties bateau */}
          <article className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition duration-300">
            <h3 className="text-xl font-semibold text-[#1113a2]">Les sorties en bateau</h3>
            <p className="mt-1 text-sm text-gray-600">
              Balades, criques, coucher de soleil — navigation écoresponsable.
            </p>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3">
                <img src={CMPlogo} alt="Clean Marina Programs" className="h-12 w-12 object-contain" />
                <div>
                  <p className="font-medium">Clean Marina / Programmes de marinas propres</p>
                  <p className="text-sm text-gray-600">
                    Gestion des eaux usées, carburants, déchets, mouillages écologiques,
                    réduction du bruit et des émissions.
                  </p>
                </div>
              </li>
            </ul>
          </article>
        </div>
      </section>

      {/* Footer (Contact + Newsletter) */}
      <div className="bg-[#1113a2] py-12 px-6 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12 md:gap-8">
          {/* Contact */}
          <div className="md:w-1/2">
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="mb-2">
              📧 Mail :{" "}
              <a
                href="mailto:gdm.guardianmap@gmail.com"
                className="underline hover:text-gray-300"
              >
                contact@guardianmap.com
              </a>
            </p>
            <p>
              📸 Instagram :{" "}
              <a
                href="https://instagram.com/guardianmap"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-300"
              >
                @guardianmap
              </a>
            </p>
          </div>

          {/* Séparateur */}
          <div className="hidden md:block w-px h-28 bg-white/30" />

          {/* Newsletter */}
          <div className="md:w-1/2">
            <h3 className="text-xl font-bold mb-4 text-white">Reste informé(e)</h3>
            <p className="mb-4">
              Inscris-toi pour suivre le développement de GuardianMap.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
