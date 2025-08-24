import React, { useState } from "react";
import CarteAvecDonnees from "../../components/CarteAvecDonnees";
import oceanImage from "../../assets/images/ocean.jpg";
import data from "../../data/Thailande_BDD_GF.json";

export default function Thailande() {
  const species = [
    { name: "Requin léopard", region: "Koh Phi Phi" },
    { name: "Poisson clown", region: "Similan Islands" },
    { name: "Tortue imbriquée", region: "Koh Tao" },
    { name: "Raie pastenague bleue", region: "Phuket" },
    { name: "Murène", region: "Koh Lanta" },
    { name: "Poisson lion", region: "Richelieu Rock" },
    { name: "Barracuda", region: "Similan Islands" },
    { name: "Serpent marin", region: "Hin Daeng" },
    { name: "Poisson-ballon", region: "Koh Phi Phi" },
    { name: "Crevette nettoyeuse", region: "Koh Tao" },
    { name: "Poisson coffre", region: "Racha Islands" },
    { name: "Raie manta (occasionnelle)", region: "Koh Bon" },
  ];

  const [regionFilter, setRegionFilter] = useState("");
  const uniqueRegions = Array.from(new Set(data.map((d) => d.region))).sort();

  return (
    <div className="w-full">
      {/* Bande bleue avec nom du pays */}
      <div className="w-full bg-gray-100 shadow-inner py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="ml-44 text-left uppercase text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-[#1113a2] via-[#3f51b5] to-[#8ab4f8] text-transparent bg-clip-text drop-shadow-md">
            Thaïlande
          </h1>
        </div>
      </div>

      {/* Carte + filtre */}
      <div
        className="py-16 px-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${oceanImage})` }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl max-w-[1200px] mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Carte */}
          <div className="md:col-span-3 rounded-xl overflow-hidden">
            <CarteAvecDonnees country="thailande" regionFilter={regionFilter} />
          </div>

          {/* Filtres région */}
          <div className="bg-white/80 p-4 rounded-xl shadow-inner max-h-[600px] overflow-y-auto">
            <h3 className="text-[#1113a2] text-xl font-semibold mb-2">Filtrer par région</h3>
            <div className="space-y-2 text-sm">
              {uniqueRegions.map((region, i) => (
                <div key={i}>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="region"
                      value={region}
                      checked={regionFilter === region}
                      onChange={() => setRegionFilter(region)}
                    />
                    {region}
                  </label>
                </div>
              ))}
              <button
                className="mt-4 text-xs underline text-blue-600"
                onClick={() => setRegionFilter("")}
              >
                Réinitialiser le filtre
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Pourquoi choisir un club GreenFins */}
      <div className="bg-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="border border-[#1113a2] bg-white shadow-md rounded-lg px-6 py-1 inline-block mb-6 ml-[6%]">
            <h2 className="text-2xl md:text-1xl font-bold text-[#1113a2]">
              Pourquoi aller dans un club qui a un label GreenFins
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            <div className="bg-white rounded-xl shadow-md p-6 transition transform hover:scale-105">
              <h3 className="text-[#1113a2] text-lg font-semibold mb-2">Protection des écosystèmes marins</h3>
              <p className="text-sm text-gray-700">
                Les clubs labellisés GreenFins s'engagent à respecter des pratiques de plongée durables qui réduisent les dommages aux coraux, à la faune marine et aux habitats sensibles.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 transition transform hover:scale-105">
              <h3 className="text-[#1113a2] text-lg font-semibold mb-2">Encadrement formé et responsable</h3>
              <p className="text-sm text-gray-700">
                Le personnel est formé aux bonnes pratiques environnementales et sensibilise les plongeurs au respect de la vie marine, avant, pendant et après la plongée.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 transition transform hover:scale-105">
              <h3 className="text-[#1113a2] text-lg font-semibold mb-2">Contribuer à un tourisme durable</h3>
              <p className="text-sm text-gray-700">
                En choisissant un club GreenFins, vous soutenez une démarche éthique et durable, favorisant la préservation des sites de plongée pour les générations futures.
              </p>
            </div>
          </div>
        </div>
      </div>




      {/* Visibilité */}
      <div className="bg-gray-300 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="border border-[#1113a2] bg-white shadow-md rounded-lg px-6 py-1 inline-block mb-6 ml-[1%]">
            <h2 className="text-2xl md:text-1xl font-bold text-[#1113a2]">
              Visibilité au cours de l'année
            </h2>
          </div>
          <div className="flex gap-4 mb-4 ml-[4%]">
            <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-500 rounded-full"></span> Excellente</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-400 rounded-full"></span> Moyenne</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 bg-orange-400 rounded-full"></span> Faible</div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
              "Juil", "Août", "Sept", "Oct", "Nov", "Déc"
            ].map((month, i) => {
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
