import React, { useState } from "react";
import CarteAvecEffet from "../components/CarteAvecEffet";
import SeasonalFish from "../components/SeasonalFish";
import ConditionsMeteo from "../components/ConditionsMeteo";
import videoEau from "../assets/videos/eau_titre.mp4";

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState("Janvier");

  return (
    <>
      <div className="w-full">
        {/* Bandeau vidéo avec titre */}
        <div className="relative w-full h-[150px] overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute w-full h-full object-cover top-0 left-0"
          >
            <source src={videoEau} type="video/mp4" />
          </video>
          <div className="relative z-10 h-full flex flex-col items-center justify-center">
            <div className="bg-white bg-opacity-80 px-6 py-4 rounded-xl shadow-md text-center max-w-2xl">
              <h1 className="text-2xl md:text-2xl font-bold text-[#1113a2] mb-2">
                Plongez pour protéger
              </h1>
              <p className="text-sm md:text-base text-gray-800">
                Ensemble, découvrons les <strong>centres de plongée qui respectent la nature</strong> et s'engagent pour l’océan.
              </p>
            </div>
          </div>
        </div>

        <CarteAvecEffet />

        {/* Section regroupée avec fond gris clair */}
        <div className="bg-gray-100 py-10 px-4">
          <div className="max-w-6xl mx-auto flex flex-col space-y-10">
            {/* Titre */}
            <div className="text-center">
              <h2 className="text-3xl md:text-2xl font-extrabold text-[#1113a2] mb-4 tracking-wide uppercase">
                À quelle période partez-vous ?
              </h2>
              <div className="h-1 w-24 mx-auto bg-[#1113a2] rounded-full"></div>
            </div>

            {/* Mois de l'année – bandeau bleu pleine largeur sans bord */}
            <div className="w-full bg-[#1113a2] py-4 overflow-x-auto">
              <div className="flex flex-nowrap justify-center gap-2 px-4 max-w-none">
                {[
                  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
                ].map((month) => (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                    className={`min-w-[80px] h-8 flex items-center justify-center text-xs px-3 rounded-full border whitespace-nowrap transition ${
                      selectedMonth === month
                        ? "bg-white text-[#1113a2]"
                        : "bg-[#1113a2] text-white border-white"
                    } hover:bg-white hover:text-[#1113a2]`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>





            {/* Liste des poissons */}
            <SeasonalFish selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />

            {/* Conditions météo */}
            <ConditionsMeteo selectedMonth={selectedMonth} />
          </div>
        </div>
      </div>
    </>
  );
}













// Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import videoEau from "../assets/videos/eau_titre.mp4";
import prez_indonesie from "../assets/images/prez_indonesie.jpg";
import prez_philippines from "../assets/images/prez_philippines.jpg";
import prez_thailande from "../assets/images/prez_thailande.jpg";

export default function Home() {
  const navigate = useNavigate();

  const countries = [
    { name: "Philippines", image: prez_philippines, path: "/philippines" },
    { name: "Thaïlande", image: prez_thailande, path: "/thailande" },
    { name: "Indonésie", image: prez_indonesie, path: "/indonesie" },
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
          <h1 className="text-lg md:text-xl font-semibold text-[#1113a2] mb-2">
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
        <div className="flex flex-col md:flex-row justify-center gap-6">
          {countryCards}
        </div>
      </div>
    </div>
  );
}
