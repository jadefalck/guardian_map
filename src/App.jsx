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
import Philippines from "./pages/pays/Philippines";
import Indonesie from "./pages/pays/Indonesie";
import Thailande from "./pages/pays/Thailande";
import Malaisie from "./pages/pays/Malaisie";
import SriLanka from "./pages/pays/SriLanka";
import Japon from "./pages/pays/Japon";
import Inde from "./pages/pays/Inde";
import Vietnam from "./pages/pays/Vietnam";
import CoreeDuSud from "./pages/pays/CoreeDuSud";


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
        </div>
      </nav>




      {/* Contenu */}
      <main className="pt-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/partenaires" element={<Partenaires />} />
          <Route path="/philippines" element={<Philippines />} />
          <Route path="/indonesie" element={<Indonesie />} />
          <Route path="/thailande" element={<Thailande />} />
          <Route path="/malaisie" element={<Malaisie />} />
          <Route path="/sri_lanka" element={<SriLanka />} />
          <Route path="/japon" element={<Japon />} />
          <Route path="/inde" element={<Inde />} />
          <Route path="/vietnam" element={<Vietnam />} />
          <Route path="/coree_du_sud" element={<CoreeDuSud />} />
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
