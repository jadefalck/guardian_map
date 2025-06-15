import { useState } from "react";

const weatherData = {
  janvier: {
    air: "26–29°C",
    mer: "27°C",
    pluie: "Saison sèche",
    vent: "Mer calme",
  },
  février: {
    air: "26–30°C",
    mer: "27°C",
    pluie: "Saison sèche",
    vent: "Mer calme",
  },
  mars: {
    air: "27–31°C",
    mer: "28°C",
    pluie: "Saison sèche",
    vent: "Calme à modéré",
  },
  avril: {
    air: "28–32°C",
    mer: "29°C",
    pluie: "Saison sèche",
    vent: "Très calme",
  },
  mai: {
    air: "28–33°C",
    mer: "30°C",
    pluie: "Début saison des pluies",
    vent: "Modéré",
  },
  juin: {
    air: "27–31°C",
    mer: "29°C",
    pluie: "Saison des pluies",
    vent: "Mer agitée",
  },
  juillet: {
    air: "26–30°C",
    mer: "28°C",
    pluie: "Saison des pluies",
    vent: "Houle",
  },
  août: {
    air: "26–30°C",
    mer: "28°C",
    pluie: "Saison des pluies",
    vent: "Houle fréquente",
  },
  septembre: {
    air: "26–30°C",
    mer: "28°C",
    pluie: "Saison des pluies",
    vent: "Modéré à fort",
  },
  octobre: {
    air: "26–30°C",
    mer: "28°C",
    pluie: "Saison des pluies",
    vent: "Variable",
  },
  novembre: {
    air: "26–29°C",
    mer: "27°C",
    pluie: "Fin saison des pluies",
    vent: "Calme",
  },
  décembre: {
    air: "26–29°C",
    mer: "27°C",
    pluie: "Saison sèche",
    vent: "Calme",
  },
};

export default function ConditionsMeteo({ selectedMonth }) {
  const data = weatherData[selectedMonth?.toLowerCase()] || null;

  return (
    <div className="mt-10 px-6 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold text-[#1113a2] mb-4 text-center">
        Conditions météorologiques
      </h2>

      <div className="bg-white border-2 border-[#1113a2] rounded-xl p-4 shadow-md">
        {data ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-gray-700 font-medium">
            <div>
              <p className="text-sm text-gray-500">Température</p>
              <p>Air : {data.air}<br />Mer : {data.mer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Précipitations</p>
              <p>{data.pluie}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vent / Mer</p>
              <p>{data.vent}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 italic text-center">
            Sélectionnez un mois pour afficher les conditions.
          </p>
        )}
      </div>
    </div>
  );
}
