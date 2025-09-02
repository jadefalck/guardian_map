
// Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import videoEau from "../assets/videos/eau_titre.mp4";
import CountryCard from "../components/CountryCard";

import prezIndonesie from "../assets/images/prez_indonesie.jpg";
import prezThailande from "../assets/images/prez_thailande.jpg";
import prezPhilippines from "../assets/images/prez_philippines.jpg";
import prezMalaisie from "../assets/images/prez_malaisie.jpg";
import prezJapon from "../assets/images/prez_japon.jpg";
import prezVietnam from "../assets/images/prez_vietnam.jpg";
import prezMaldives from "../assets/images/prez_maldives.jpg";

export default function Home() {
  const navigate = useNavigate();

  const countries = [
    { name: "Philippines", image: prezPhilippines, path: "/philippines" },
    { name: "Indonésie", image: prezIndonesie, path: "/indonesie" },
    { name: "Thaïlande", image: prezThailande, path: "/thailande" },
    { name: "Malaisie", image: prezMalaisie, path: "/malaisie" },
    { name: "Japon", image: prezJapon, path: "/japon" },
    //{ name: "Vietnam", image: prezVietnam, path: "/vietnam" },
    { name: "Maldives", image: prezMaldives, path: "/maldives" },
  ];

  // ✅ Génération des cartes pays
  const countryCards = countries.map((country) => (
    <div
      key={country.name}
      onClick={() => navigate(country.path)}
      className="cursor-pointer w-full md:w-1/3 rounded-xl overflow-hidden shadow-md transition-transform transform hover:scale-105"
    >
      <img
        src={country.image}
        alt={country.name}
        className="w-full h-48 object-cover"
      />
      <div className="bg-white text-[#1113a2] font-semibold text-lg py-4">
        {country.name}
      </div>
    </div>
  ));

  return (
    <div className="w-full">
      {/* Texte d’introduction sur fond gris clair */}
      <div className="bg-gray-100 py-10 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-lg md:text-xl font-semibold text-[#3b3c42] mb-2">
            Ensemble, découvrons les centres de plongée qui{" "}
            <span className="text-[#1113a2] font-semibold">respectent</span> la nature et{" "}
            <span className="text-[#1113a2] font-semibold">s'engagent</span> pour l’
            <span className="text-[#1113a2] font-semibold">océan</span>.
          </h1>
        </div>
      </div>

      {/* Vidéo avec zone de recherche superposée */}
      <div className="relative w-full h-[180px] md:h-[220px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover top-0 left-0"
        >
          <source src={videoEau} type="video/mp4" />
        </video>

        <div className="absolute inset-0 flex items-center justify-center px-4 z-10">
          <div className="bg-white bg-opacity-90 p-6 rounded-xl shadow-lg text-center w-full max-w-2xl">
            <h2 className="text-2xl md:text-4xl font-bold text-[#1113a2] mb-1">
              Où voulez-vous partir ?
            </h2>
            {/*<input
              type="text"
              placeholder="Rechercher une destination..."
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg shadow-sm"
            />*/}
          </div>
        </div>
      </div>

      {/* Section cartes pays */}
      <div className="bg-gray-100 py-12 px-4 text-center">
        <div className="flex flex-wrap justify-center gap-4">
          {countries.map((country) => (
            <CountryCard
              key={country.name}
              name={country.name}
              image={country.image}
              path={country.path}
            />
          ))}
        </div>
      </div>

      {/* Footer avec contact + inscription séparés */}
      <div className="bg-[#1113a2] py-12 px-6 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12 md:gap-8">
          
          {/* Colonne gauche : Contact */}
          <div className="md:w-1/2">
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="mb-2">
              📧 Mail :{" "}
              <a href="mailto:gdm.guardianmap@gmail.com" className="underline hover:text-gray-300">
                gdm.guardianmap@gmail.com
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

          {/* Trait vertical */}
          <div className="hidden md:block w-px h-28 bg-white/30" />

          {/* Colonne droite : Newsletter */}
          <div className="md:w-1/2">
            <h3 className="text-xl font-bold mb-4 text-white">Reste informé(e)</h3>
            <p className="mb-4">Inscris-toi pour suivre le développement de GuardianMap.</p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Ton adresse e-mail"
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-black focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-white text-[#1113a2] px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>




    </div>




  );
}