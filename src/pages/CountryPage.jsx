// src/pages/CountryPage.jsx
import React, { useState } from "react";
import CarteAvecEffet from "../components/CarteAvecEffet";
import SeasonalFish from "../components/SeasonalFish";
import ConditionsMeteo from "../components/ConditionsMeteo";
import bandeauImage from "../assets/images/bandeau.jpg";
import CarteAvecEffetLibre from "../components/CarteAvecEffetLibre";

export default function CountryPage({ dataFile, mapCenter }) {
  const [selectedMonth, setSelectedMonth] = useState("Janvier");
   // image fixe bandeau.jpg

  return (
    <div className="w-full">
      {/* Bandeau image */}
      <div className="relative w-full h-[180px] overflow-hidden">
        <img
          src={bandeauImage}
          alt="Bandeau"
          className="absolute w-full h-full object-cover object-bottom top-0 left-0"
        />

        <div className="relative z-10 h-full flex flex-col items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white bg-opacity-80 px-6 py-4 rounded-xl shadow-md text-center max-w-2xl">
            <h1 className="text-xl md:text-2xl font-bold text-[#1113a2] mb-2">
              Découvrez les spots écoresponsables
            </h1>
          </div>
        </div>
      </div>

      {/* Carte interactive */}
      <CarteAvecEffetLibre csvFilePath={dataFile} center={mapCenter} />

      {/* Section poissons et météo */}
      <div className="bg-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1113a2] mb-4">Que peut-on observer ?</h2>
            <div className="h-1 w-24 mx-auto bg-[#1113a2] rounded-full" />
          </div>

          <SeasonalFish selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
          <ConditionsMeteo selectedMonth={selectedMonth} />
        </div>
      </div>
    </div>
  );
}
