import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Knowledge from "./pages/Knowledge";
import Partenaires from "./pages/Partenaires";
import { MapContainer, TileLayer } from 'react-leaflet';
import { motion } from "framer-motion";
import 'leaflet/dist/leaflet.css';
import CarteAvecEffet from "./components/CarteAvecEffet";
import TitreSite from './assets/images/titre1.png';
import logo from './assets/images/logo.png';
import SeasonalFish from './components/SeasonalFish';
import ConditionsMeteo from './components/ConditionsMeteo';
import { useState } from "react"; 


export default function App() {
  const [selectedMonth, setSelectedMonth] = useState("Janvier")

  return (
    <Router>
      {/* Bande bleue foncée avec le titre */}
      <header className="bg-[#1113a2] py-6 flex justify-center items-center">
        <img
          src={TitreSite}
          alt="GDM"
          className="h-12 object-contain"
        />
      </header>

      {/* Barre de navigation */}
      <nav className="sticky top-2 z-[999] bg-white/60 backdrop-blur-md shadow-sm px-6 py-2 rounded-xl mx-auto max-w-5xl flex items-center justify-between">
        {/* Logo + Titre */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
          <span className="text-[#1113a2] font-bold text-lg">GuardianMap</span>
        </div>

        {/* Liens de navigation */}
        <div className="flex space-x-6 text-sm">
          <Link to="/" className="text-gray-700 hover:text-[#1113a2]">Home</Link>
          <Link to="/knowledge" className="text-gray-700 hover:text-[#1113a2]">Knowledge</Link>
          <Link to="/partenaires" className="text-gray-700 hover:text-[#1113a2]">Partenaires</Link>
        </div>
      </nav>


      <div className="text-center my-8 px-4 transition-transform duration-300 hover:scale-[1.02] hover:-translate-y-1">
        <h2 className="text-2xl font-bold text-[#1113a2]">
          Plongez là où la nature est respectée
        </h2>
        <p className="text-gray-700 mt-2 text-lg max-w-2xl mx-auto">
          Découvrez des sites soigneusement sélectionnés pour leur beauté, leur sécurité et leur engagement à protéger l’environnement.
        </p>
      </div>

      <CarteAvecEffet />

      <div className="w-full bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Titre "FILTRES" dans un rectangle blanc avec bordure bleue */}
          <div className="inline-block bg-white border-2 border-[#1113a2] rounded-full px-6 py-2 text-[#1113a2] text-lg font-semibold mb-6">
            FILTRES
          </div>

          {/* Bloc vide avec bordure bleue sur fond blanc */}
          <div className="bg-white border-2 border-[#1113a2] rounded-xl min-h-[120px] shadow-sm">
            {/* Tu rempliras ici plus tard */}
          </div>
        </div>
      </div>

      <div className="flex justify-center my-8">
        <div className="bg-[#1113a2] text-white text-xl font-semibold px-6 py-3 shadow-sm transition-all duration-300 hover:bg-[#0d0f8f] hover:scale-105 cursor-default">
          À quelle période souhaitez-vous plonger ?
        </div>
      </div>

      <SeasonalFish selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
      <ConditionsMeteo selectedMonth={selectedMonth} />



      {/* Footer avec infos de contact et formulaire */}
      <footer className="bg-[#1113a2] text-white py-10 px-6 mt-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 text-center">
            <p className="text-lg font-semibold">Suivez-nous sur Instagram : <span className="underline">@guardianmap</span></p>
            <p className="mt-1">Contactez-nous à : <a href="mailto:gdm.guardianmap@gmail.com" className="underline">gdm.guardianmap@gmail.com</a></p>
          </div>

          <form
            action="mailto:gdm.guardianmap@gmail.com"
            method="POST"
            encType="text/plain"
            className="bg-white text-gray-800 p-6 rounded-lg shadow-md max-w-xl mx-auto"
          >
            <label htmlFor="message" className="block font-semibold mb-2">
              Votre message :
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
              placeholder="Écrivez votre message ici..."
              required
            ></textarea>

            <button
              type="submit"
              className="bg-[#1113a2] text-white px-6 py-2 rounded hover:bg-[#0d0f8f] transition"
            >
              Envoyer
            </button>
          </form>
        </div>
      </footer>





      {/* Contenu */}
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/partenaires" element={<Partenaires />} />
        </Routes>
      </main>
    </Router>
  );
}





/*import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
//import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}*/

//export default App
