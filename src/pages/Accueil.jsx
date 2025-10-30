// src/pages/Accueil.jsx
import { Link } from "react-router-dom";
import fondVideo from "../assets/videos/vidéo_accueil_fond.mp4";

// 🖼️ Images des blocs d’action
import imgActivite from "../assets/images/accueil_activité_mer.jpg";
import imgCircuit from "../assets/images/accueil_circuit_éthique.jpg";
import imgBlog from "../assets/images/accueil_blog.jpg";

export default function Accueil() {
  return (
    <div className="w-full">
      {/* ======= SECTION 1 — INTRO AVEC TITRE ======= */}
      <section className="relative py-16 px-6 text-center overflow-hidden bg-gray-200">
        <div className="w-full text-center">
          <h1 className="w-full max-w-none text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 drop-shadow-sm">
            Pour un tourisme respectueux des océans
          </h1>

          <p className="text-base md:text-lg text-gray-700">
            Notre mission : aider chaque voyageur à faire des choix qui{" "}
            <span className="font-semibold">
              protègent l’océan, ses habitants et les communautés locales
            </span>.
          </p>
        </div>
      </section>

      {/* ======= SECTION 2 — VIDÉO DE FOND SUR TOUT LE RESTE ======= */}
      <section className="relative w-full py-16 px-4 md:px-8 overflow-hidden text-gray-800">
        {/* Vidéo de fond */}
        <video
          src={fondVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* ======= CONTENU ======= */}
        <div className="relative z-10 flex flex-col gap-16 max-w-6xl mx-auto">
          {/* === Bloc : Rôle du site === */}
          <div className="bg-white/85 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Ce que fait GuardianMap
            </h2>
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-800">GuardianMap</span> met en avant les{" "}
              <span className="font-semibold text-gray-800">activités marines réellement responsables</span>,
              en valorisant celles qui disposent de{" "}
              <span className="font-semibold text-gray-800">labels officiels</span> et co-crée des{" "}
              <span className="font-semibold text-gray-800">circuits éthiques</span> avec des{" "}
              <span className="font-semibold text-gray-800">agences locales engagées</span>. 
              La <span className="font-semibold text-gray-800">sensibilisation</span> est également au cœur de notre travail,
              à travers des <span className="font-semibold text-gray-800">articles dédiés à l’océan</span>,
              pour renforcer la <span className="font-semibold text-gray-800">conscience collective</span> autour d’un{" "}
              <span className="font-semibold text-gray-800">tourisme respectueux du vivant</span>.
            </p>

          </div>

          {/* === 3 BLOCS D’ACTION === */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bloc 1 — Activités */}
            <div className="bg-white/85 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md overflow-hidden flex flex-col">
              <div className="h-44 md:h-48 w-full overflow-hidden">
                <img
                  src={imgActivite}
                  alt="Activités marines responsables"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col grow">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                  Activités responsables
                </h3>
                <p className="text-gray-700 mb-5">
                  Centres de plongée, sorties bateau et expériences{" "}
                  <span className="font-semibold">à faible impact</span> : briefings éco, distances d’observation,
                  respect de la faune, partenaires{" "}
                  <span className="font-semibold">labellisés</span> quand c’est possible.
                </p>
                <div className="mt-auto">
                  <Link
                    to="/activites"
                    className="inline-block px-5 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
                  >
                    Voir les activités
                  </Link>
                </div>
              </div>
            </div>

            {/* Bloc 2 — Circuits */}
            <div className="bg-white/85 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md overflow-hidden flex flex-col">
              <div className="h-44 md:h-48 w-full overflow-hidden">
                <img
                  src={imgCircuit}
                  alt="Circuits éthiques co-construits avec des agences locales"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col grow">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                  Circuits éthiques
                </h3>
                <p className="text-gray-700 mb-5">
                  Itinéraires co-construits avec des{" "}
                  <span className="font-semibold">agences locales</span> :
                  hébergements responsables, petites tailles de groupes, et activités alignées avec la protection des écosystèmes.
                </p>
                <div className="mt-auto">
                  <Link
                    to="/circuits"
                    className="inline-block px-5 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
                  >
                    Découvrir les circuits
                  </Link>
                </div>
              </div>
            </div>

            {/* Bloc 3 — Blog */}
            <div className="bg-white/85 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md overflow-hidden flex flex-col">
              <div className="h-44 md:h-48 w-full overflow-hidden">
                <img
                  src={imgBlog}
                  alt="Sensibilisation et informations sur l’océan"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col grow">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                  Sensibilisation & Blog
                </h3>
                <p className="text-gray-700 mb-5">
                  Bons réflexes, labels, espèces sensibles… Notre blog aide à{" "}
                  <span className="font-semibold">comprendre l’impact réel</span> de nos choix et à adopter des pratiques qui protègent l’océan.
                </p>
                <div className="mt-auto">
                  <Link
                    to="/blog"
                    className="inline-block px-5 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
                  >
                    Lire le blog
                  </Link>
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>
    </div>
  );
}
