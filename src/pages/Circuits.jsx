// src/pages/Circuits.jsx
import { Link } from "react-router-dom";
import bannerCircuit from "../assets/images/bannière_circuit.jpg";
import itineraireImg from "../assets/images/accueil_circuit_éthique.jpg";

export default function Circuits() {
  return (
    <div className="w-full">

      {/* ======= SECTION 1 — TITRE SUR FOND GRIS ======= */}
      <section className="relative py-16 px-6 text-center overflow-hidden bg-gray-200">
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
            Circuits
          </h1>
          <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
            Des itinéraires <span className="font-semibold">éthiques et responsables</span>,
            imaginés avec des <span className="font-semibold">agences locales engagées</span>.
          </p>
        </div>
      </section>

      {/* ======= SECTION 2 — IMAGE DE FOND + ENCADRÉ “EN COURS DE CRÉATION” ======= */}
      <section className="relative w-full py-20 px-6 md:px-10 overflow-hidden">
        {/* Image de fond */}
        <img
          src={bannerCircuit}
          alt="Fond Circuits"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        {/* Filtre translucide */}
        <div className="absolute inset-0 backdrop-blur-[1px]" />

        {/* Encadré "*en cours de création*" */}
        <div className="relative z-10 max-w-3xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg text-center border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Les circuits arrivent bientôt 
          </h2>
          <p className="text-gray-700 text-lg">
            Nous travaillons actuellement à la création de circuits immersifs et 
            responsables avec des partenaires locaux certifiés.
          </p>
        </div>
      </section>

      {/* ======= SECTION 3 — ENCADRÉ BLANC : EXPLICATION DES CIRCUITS ======= */}
      <section className="relative w-full py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto bg-white border border-gray-200 p-6 md:p-8 rounded-2xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Texte explicatif */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Des circuits éthiques en collaboration avec des agences locales
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                GuardianMap collabore avec des{" "}
                <span className="font-semibold">agences locales engagées</span> pour créer
                des itinéraires immersifs, respectueux de l’environnement et des communautés.
              </p>

              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>
                  Soutient à des <span className="font-semibold">acteurs locaux écoresponsables</span>
                </li>
                <li>
                  <span className="font-semibold">Activités durables</span> & écotourisme marin
                </li>
                <li>
                  Expériences authentiques & loin du tourisme de masse
                </li>
              </ul>
            </div>

            {/* Illustration droite */}
            <div className="flex justify-center">
              <img
                src={itineraireImg}
                alt="Illustration circuit"
                className="max-h-80 w-auto object-contain rounded-xl shadow-md"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
