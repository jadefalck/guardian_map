// src/components/CountryCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function CountryCard({ name, image, path }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="cursor-pointer w-full sm:w-1/2 md:w-1/3 xl:w-1/4 p-2"
    >
      <div className="rounded-xl overflow-hidden shadow-md transition-transform transform hover:scale-105">
        <img src={image} alt={name} className="w-full h-48 object-cover" />
        <div className="bg-white text-blue-800 font-semibold text-center text-lg py-4">
          {name}
        </div>
      </div>
    </div>
  );
}
