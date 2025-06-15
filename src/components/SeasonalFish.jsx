import { useState } from "react";

const monthVisibility = {
  Janvier: ["Requin baleine", "Tortue", "Poisson-papillon", "Poisson-perroquet"],
  Février: ["Tortue", "Poisson-ange", "Poisson-lime"],
  Mars: ["Requin renard", "Tortue", "Poisson-papillon"],
  Avril: ["Manta", "Tortue", "Gobies"],
  Mai: ["Requin baleine", "Poisson-grenouille", "Nudibranche"],
  Juin: ["Poisson-lime", "Poisson-coffre", "Poisson-papillon"],
  Juillet: ["Poisson-papillon", "Poisson-ange", "Requin de récif"],
  Août: ["Tortue", "Poisson-perroquet", "Poisson-papillon"],
  Septembre: ["Gobies", "Requin de récif", "Poisson-papillon"],
  Octobre: ["Poisson-papillon", "Poisson-lime", "Tortue"],
  Novembre: ["Poisson-papillon", "Requin renard", "Nudibranche"],
  Décembre: ["Requin baleine", "Tortue", "Poisson-papillon"],
};

const allFish = Array.from(new Set(Object.values(monthVisibility).flat()));

export default function SeasonalFish({ selectedMonth, setSelectedMonth }) {

  return (
    <section className="w-full py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0 md:space-x-10">
        
        {/* Liste des poissons */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {allFish.map((fish) => {
            const isVisible = monthVisibility[selectedMonth].includes(fish);
            return (
              <span
                key={fish}
                className={`transition-all duration-300 text-center font-semibold px-3 py-1 rounded-xl ${
                  isVisible
                    ? "bg-gray-100 text-[#1113a2] text-lg scale-105 shadow-sm"
                    : "text-gray-400 text-sm opacity-60"
                }`}
              >
                {fish}
              </span>
            );
          })}
        </div>

        {/* Titre + boutons mois */}
        <div className="flex-1">
            <h2 className="text-xl font-bold text-[#1113a2] text-center mb-6">
                Mois de l'année
            </h2>

            <div className="grid grid-cols-3 gap-2">
                {Object.keys(monthVisibility).map((month) => (
                <button
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                    className={`py-2 px-3 rounded-full text-sm border ${
                    selectedMonth === month
                        ? "bg-[#1113a2] text-white"
                        : "bg-white text-[#1113a2] border-[#1113a2]"
                    } hover:bg-[#1113a2] hover:text-white transition`}
                >
                    {month}
                </button>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
}
