import React from "react";
import NewsletterForm from "../components/NewsletterForm";

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1113a2]">
          Nos Services
        </h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          GuardianMap recense et valorise les activités marines qui respectent l’océan.
        </p>
      </section>

      {/* --- Services actuels --- */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <h3 className="text-xl md:text-2xl font-semibold text-[#1113a2] mb-4">
          Services actuels
        </h3>
        <div className="rounded-2xl bg-white border shadow-sm p-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1113a2]/10 px-4 py-1.5 mb-4">
            <span className="h-2 w-2 rounded-full bg-[#1113a2]" />
            <span className="text-[#1113a2] text-sm font-semibold">Disponible aujourd’hui</span>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-[#1113a2]">
            Cartographie des centres de plongée certifiés Green Fins (Asie)
          </h2>
          <p className="mt-3 text-gray-700">
            La première version du site recense <span className="font-semibold">uniquement</span> les
            centres de plongée labellisés <span className="text-[#1113a2] font-semibold">Green Fins</span> en Asie.
            Chaque centre est vérifié selon des critères officiels (protection des coraux, ancrage responsable,
            gestion des bateaux, sensibilisation des plongeurs).
          </p>
        </div>
      </section>

      {/* Service en cours de création */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="rounded-2xl border-2 border-dashed border-[#1113a2]/40 bg-white p-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 text-yellow-900 px-3 py-1 text-sm font-semibold">
            🛠️ Service en cours de création
          </div>
          <h3 className="mt-4 text-lg md:text-xl font-semibold text-[#1113a2]">
            Extension des labels & nouvelles activités marines
          </h3>
          <p className="mt-2 text-gray-700">
            Bientôt, GuardianMap intégrera d’autres labels de plongée :
            <span className="font-medium"> Blue Flag (Pavillon Bleu)</span> et{" "}
            <span className="font-medium">PADI Eco Center</span>. Nous ajouterons aussi des activités
            d’<span className="text-[#1113a2] font-semibold">observation des animaux marins</span>
            (requins-baleines, tortues, dauphins, raies, etc.) en nous appuyant sur le label{" "}
            <span className="font-medium">WCA – Responsible Whale/Dolphin Watching</span>, ainsi que le recensement
            des <span className="font-medium">sorties en bateau</span> respectant{" "}
            <span className="font-medium">Clean Marina / Programmes de marinas propres</span>.
          </p>
        </div>
      </section>

      {/* Services à venir : offres payantes */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <h3 className="text-xl md:text-2xl font-semibold text-[#1113a2] mb-4">
          Services à venir
        </h3>

        {/* Badge Version premium */}
        <div className="inline-flex items-center gap-2 rounded-full bg-[#1113a2]/10 px-3 py-1 text-sm font-semibold text-[#1113a2] mb-4">
          💎 Version premium
        </div>

        {/* Offres */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* L'impulsif (semaine) */}
          <div className="group rounded-2xl bg-white border shadow-sm p-6 flex flex-col transition-transform duration-200 hover:scale-[1.02] hover:border-[#1113a2]">
            <div className="text-sm font-semibold text-[#1113a2] mb-1">Accès Premium</div>
            <h4 className="text-lg font-bold">L’impulsif</h4>
            <p className="text-gray-500 text-sm mb-4">7 € • semaine</p>
            <ul className="text-gray-700 space-y-2 text-sm flex-1">
              <li>• Itinéraires personnalisés</li>
              <li>• Filtres avancés & favoris</li>
              <li>• Accès anticipé aux nouvelles zones</li>
            </ul>
            <button className="mt-5 w-full rounded-lg bg-[#1113a2] text-white py-2 font-medium hover:opacity-90">
              Bientôt disponible
            </button>
          </div>

          {/* L'organisé (mois) */}
          <div className="group rounded-2xl bg-white border-2 border-[#1113a2] shadow-md p-6 flex flex-col transition-transform duration-200 hover:scale-[1.03] hover:border-[#1113a2]">
            <div className="text-sm font-semibold text-[#1113a2] mb-1">Accès Premium</div>
            <h4 className="text-lg font-bold">L’organisé</h4>
            <p className="text-gray-500 text-sm mb-4">20 € • mois</p>
            <ul className="text-gray-700 space-y-2 text-sm flex-1">
              <li>• Itinéraires personnalisés</li>
              <li>• Filtres avancés & favoris</li>
              <li>• Alertes éthiques & saisonnalité</li>
            </ul>
            <button className="mt-5 w-full rounded-lg bg-[#1113a2] text-white py-2 font-medium hover:opacity-90">
              Bientôt disponible
            </button>
          </div>

          {/* Le voyageur (année) */}
          <div className="group rounded-2xl bg-white border shadow-sm p-6 flex flex-col transition-transform duration-200 hover:scale-[1.02] hover:border-[#1113a2]">
            <div className="text-sm font-semibold text-[#1113a2] mb-1">Accès Premium</div>
            <h4 className="text-lg font-bold">Le voyageur</h4>
            <p className="text-gray-500 text-sm mb-4">60 € • an</p>
            <ul className="text-gray-700 space-y-2 text-sm flex-1">
              <li>• Itinéraires personnalisés illimités</li>
              <li>• Priorité de support</li>
              <li>• Contenus exclusifs & guides</li>
            </ul>
            <button className="mt-5 w-full rounded-lg bg-[#1113a2] text-white py-2 font-medium hover:opacity-90">
              Bientôt disponible
            </button>
          </div>
        </div>
      </section>

      {/* Service à venir : circuits éthiques */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-2xl bg-white border shadow-sm p-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1113a2]/10 px-3 py-1 text-sm font-semibold text-[#1113a2]">
            🤝 Partenariats
          </div>
          <h3 className="mt-3 text-lg md:text-xl font-semibold text-[#1113a2]">
            Circuits éthiques en collaboration avec des agences de voyage
          </h3>
          <p className="mt-2 text-gray-700">
            Nous préparons des <span className="text-[#1113a2] font-semibold">circuits de voyage responsables</span>,
            co-construits avec des agences partenaires. L’objectif : relier des opérateurs engagés,
            limiter l’empreinte écologique et maximiser l’impact positif local.
          </p>
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
              <a href="mailto:gdm.guardianmap@gmail.com" className="underline hover:text-gray-300">
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
            <p className="mb-4">Inscris-toi pour suivre le développement de GuardianMap.</p>
            <NewsletterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
