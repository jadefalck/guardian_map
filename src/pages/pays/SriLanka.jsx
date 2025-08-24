// src/pages/SriLanka.jsx
import React from "react";
import CarteAvecEffetLibre from "../../components/CarteAvecEffetLibre";
import oceanImage from "../../assets/images/ocean.jpg";

export default function SriLanka() {
  const species = [
    { name: "Tortue verte", region: "Hikkaduwa" },
    { name: "Raie pastenague", region: "Unawatuna" },
    { name: "Poisson-lion", region: "Pigeon Island" },
    { name: "Murène", region: "Trincomalee" },
    { name: "Poisson-scorpion", region: "Kalpitiya" },
    { name: "Dauphin tacheté", region: "Mirissa" },
    { name: "Baleine bleue", region: "Mirissa" },
    { name: "Poisson-papillon", region: "Unawatuna" },
    { name: "Requin de récif", region: "Pigeon Island" },
    { name: "Poisson-ange", region: "Hikkaduwa" },
    { name: "Raie manta", region: "Trincomalee" },
    { name: "Barracuda", region: "Kalpitiya" },
  ];

  return (
    <div className="w-full">
      {/* Bande bleue avec nom du pays */}
      <div className="w-full bg-gray-100 shadow-inner py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="ml-44 text-left uppercase text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-[#1113a2] via-[#3f51b5] to-[#8ab4f8] text-transparent bg-clip-text drop-shadow-md">
            Sri Lanka
          </h1>
        </div>
      </div>

      {/* Image de fond avec bloc blanc + carte */}
      <div
        className="py-16 px-4"
        style={{
          backgroundImage: `url(${oceanImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl max-w-[1200px] mx-auto p-1 sm:p-1">
          <div className="rounded-xl overflow-hidden">
            <CarteAvecEffetLibre country="sri_lanka" />
          </div>
        </div>
      </div>

      {/* Infos pratiques du plongeur */}
      <div className="bg-gray-300 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="border border-[#1113a2] bg-white shadow-md rounded-lg px-6 py-1 inline-block mb-6 ml-[1%]">
            <h2 className="text-2xl md:text-1xl font-bold text-[#1113a2]">
              Visibilité au cours de l'année
            </h2>
          </div>
          {/* Légende */}
          <div className="flex gap-4 mb-4 ml-[4%]">
            <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-500 rounded-full"></span> Excellente</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-400 rounded-full"></span> Moyenne</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 bg-orange-400 rounded-full"></span> Faible</div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"].map((month, i) => {
              const colors = [
                "bg-green-500", "bg-green-500", "bg-green-500", "bg-green-500",
                "bg-yellow-400", "bg-orange-400", "bg-orange-400", "bg-orange-400",
                "bg-yellow-400", "bg-green-500", "bg-green-500", "bg-green-500"
              ];
              return (
                <div
                  key={month}
                  className={`text-white ${colors[i]} px-4 py-2 rounded-full text-sm font-semibold shadow`}
                >
                  {month}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Espèces majoritaires */}
      <div className="bg-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="border border-[#1113a2] bg-[#ffffff] shadow-md rounded-lg px-6 py-1 inline-block mb-6 ml-[6%]">
            <h2 className="text-2xl md:text-1xl font-bold text-[#1113a2]">
              Espèces majoritaires observables
            </h2>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-6 w-max px-6">
              {species.map((specie, i) => (
                <div
                  key={i}
                  className="relative group w-40 h-44 bg-gray-300 rounded-lg shadow-md flex flex-col items-center justify-end p-2 hover:bg-opacity-90 transition"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/60 text-white text-xs p-2 rounded-lg flex items-center justify-center text-center">
                    {specie.name} – {specie.region}
                  </div>
                  <span className="text-sm mt-2 text-gray-800 font-medium text-center">
                    {specie.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-[#1113a2] py-12 px-6"></div>
    </div>
  );
}
