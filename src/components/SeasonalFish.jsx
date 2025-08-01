import { useState } from "react";

// Import dynamique des images
const fishImages = import.meta.glob("../assets/images/poissons/*.png", {
  eager: true,
  import: "default",
});

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
  const getFishImage = (fishName) => {
    const normalized = fishName.toLowerCase().replace(/ /g, "_").replace(/-/g, "_");
    const key = Object.keys(fishImages).find((path) =>
      path.includes(`${normalized}.png`)
    );
    return key ? fishImages[key] : null;
  };

  return (
    <div className="mt-10 w-full px-4">
      <h2 className="text-xl font-bold text-[#1113a2] mb-4">
        Poissons à voir selon les mois de l'année
      </h2>

      {/* Boîte pleine largeur avec bord bleu */}
      <div className="w-full border-2 border-[#1113a2] rounded-xl p-6 bg-white shadow-sm">
        <div className="grid grid-cols-6 sm:grid-cols-7 gap-4 justify-center">
          {allFish.map((fish) => {
            const isVisible = monthVisibility[selectedMonth].includes(fish);
            const imageSrc = getFishImage(fish);

            return (
              <span
                key={fish}
                className={`flex flex-col items-center transition-all duration-300 text-center font-semibold px-3 py-2 rounded-xl ${
                  isVisible
                    ? "bg-gray-100 text-[#1113a2] text-lg scale-105 shadow-sm"
                    : "text-gray-400 text-sm opacity-60"
                }`}
              >
                {imageSrc && (
                  <img src={imageSrc} alt={fish} className="h-12 w-auto mb-1" />
                )}
                {fish}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
