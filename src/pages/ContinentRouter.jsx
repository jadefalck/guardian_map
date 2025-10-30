import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { Asie, Europe, Afrique, AmeriqueNord, AmeriqueSud, Oceanie } from "./continents";


const CONTINENT_COMPONENTS = {
  "asie": Asie,
  "europe": Europe,
  "afrique": Afrique,
  "amerique-du-nord": AmeriqueNord,
  "amerique-du-sud": AmeriqueSud,
  "oceanie": Oceanie,
};

export default function ContinentRouter() {
  const { slug } = useParams();
  const C = CONTINENT_COMPONENTS[slug];
  return C ? <C /> : <Navigate to="/accueil" replace />;
}
