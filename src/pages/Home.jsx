
// Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import videoEau from "../assets/videos/eau_titre.mp4";
import CountryCard from "../components/CountryCard";

import prezIndonesie from "../assets/images/prez_indonesie.jpg";
import prezThailande from "../assets/images/prez_thailande.jpg";
import prezPhilippines from "../assets/images/prez_philippines.jpg";
import prezMalaisie from "../assets/images/prez_malaisie.jpg";
import prezSriLanka from "../assets/images/prez_sri_lanka.jpg";
import prezJapon from "../assets/images/prez_japon.jpg";
import prezInde from "../assets/images/prez_inde.jpg";
import prezVietnam from "../assets/images/prez_vietnam.jpg";
import prezCoree from "../assets/images/prez_coree_du_sud.jpg";

export default function Home() {
  const navigate = useNavigate();

  const countries = [
    { name: "Philippines", image: prezPhilippines, path: "/philippines" },
    { name: "Indonésie", image: prezIndonesie, path: "/indonesie" },
    { name: "Thaïlande", image: prezThailande, path: "/thailande" },
    { name: "Malaisie", image: prezMalaisie, path: "/malaisie" },
    { name: "Sri Lanka", image: prezSriLanka, path: "/sri-lanka" },
    { name: "Japon", image: prezJapon, path: "/japon" },
    { name: "Inde", image: prezInde, path: "/inde" },
    { name: "Vietnam", image: prezVietnam, path: "/vietnam" },
    { name: "Corée du Sud", image: prezCoree, path: "/coree-du-sud" },
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
            Ensemble, découvrons les centres de plongée qui respectent la nature et s'engagent pour l’océan.
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
          <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-lg text-center w-full max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1113a2] mb-6">
              Où voulez-vous partir ?
            </h2>
            <input
              type="text"
              placeholder="Rechercher une destination..."
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg shadow-sm"
            />
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
    </div>
  );
}