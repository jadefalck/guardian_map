import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

// Pages principales
import Accueil from "./pages/Accueil";
import Knowledge from "./pages/Knowledge";
import Partenaires from "./pages/Partenaires";
import APropos from "./pages/APropos";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import LabelsCertifications from "./pages/LabelsCertifications";
import Circuits from "./pages/Circuits";
import Especes from "./pages/Especes";

// Blog articles
import RequinsBaleines from "./pages/blog/RequinsBaleines";
import WorldMaritimeDay from "./pages/blog/WorldMaritimeDay";
import Oman from "./pages/blog/Oman";
import TortuesVertes from "./pages/blog/TortuesVertes";
import CorauxBlancs from "./pages/blog/CorauxBlancs";

// Activités
import Activites from "./pages/activites/Activités";
import Plongée from "./pages/activites/Plongée";
import Observation from "./pages/activites/Observation"; // ← NOUVELLE PAGE

// Pays
import Philippines from "./pages/pays/Philippines";
import Indonesie from "./pages/pays/Indonesie";
import Thailande from "./pages/pays/Thailande";
import Malaisie from "./pages/pays/Malaisie";
import Japon from "./pages/pays/Japon";
import Vietnam from "./pages/pays/Vietnam";
import Maldives from "./pages/pays/Maldives";

// Autres routes
import ContinentRouter from "./pages/ContinentRouter";
import CountryPage from "./pages/pays2/CountryPage";

// Components
import NewsletterForm from "./components/NewsletterForm";

// Assets
import logo from "./assets/images/logo.png";

// i18n
import { useTranslation } from "react-i18next";
import drapeauFR from "./assets/images/drapeau_france.svg.png";
import drapeauEN from "./assets/images/drapeau_anglais.svg.png";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [activitiesOpenMobile, setActivitiesOpenMobile] = useState(false);

  const { t, i18n } = useTranslation();
  const changeLanguage = (lang) => i18n.changeLanguage(lang);

  return (
    <Router>
      {/* ===== HEADER — CLIQUABLE ===== */}
      <header className="bg-[#1113a2] py-6 flex justify-center items-center">
        <Link to="/" aria-label="Retour à l’accueil" className="flex justify-center items-center">
          <h1 className="text-white font-extrabold text-3xl tracking-normal">
            <span className="text-4xl">G</span>UARDIAN
            <span className="text-4xl">M</span>AP
          </h1>
        </Link>
      </header>

      {/* ===== NAVBAR ===== */}
      <nav className="sticky top-2 z-[999] bg-white/60 backdrop-blur-md shadow-sm px-4 md:px-6 py-2 rounded-xl mx-auto max-w-5xl">
        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-4">
            {/* === Logo + nom CLIQUABLE === */}
            <Link to="/" aria-label="Accueil" className="flex items-center space-x-2 group">
              <img src={logo} alt="Logo GuardianMap" className="h-8 w-8 object-contain" />
              <span className="text-[#1113a2] font-bold text-lg group-hover:underline">
                GuardianMap
              </span>
            </Link>

            {/* Sélecteur FR/EN */}
            <div className="flex items-center gap-2">
              <div
                onClick={() => changeLanguage("fr")}
                className={`h-7 w-7 rounded-full flex items-center justify-center cursor-pointer border 
                ${i18n.language === "fr" ? "border-[#1113a2]" : "border-gray-300 opacity-60"} 
                hover:opacity-100 bg-white shadow-sm`}
                aria-label="Français"
              >
                <img src={drapeauFR} alt="FR" className="h-4 w-4 rounded-full" />
              </div>

              <div
                onClick={() => changeLanguage("en")}
                className={`h-7 w-7 rounded-full flex items-center justify-center cursor-pointer border 
                ${i18n.language === "en" ? "border-[#1113a2]" : "border-gray-300 opacity-60"} 
                hover:opacity-100 bg-white shadow-sm`}
                aria-label="English"
              >
                <img src={drapeauEN} alt="EN" className="h-4 w-4 rounded-full" />
              </div>
            </div>
          </div>

          {/* Hamburger (contraste renforcé) */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-900 hover:bg-white/70"
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-6 text-sm">
            <Link to="/" className="text-gray-700 hover:text-[#1113a2]">{t("menu.home")}</Link>

            <div
              className="relative"
              onMouseEnter={() => setActivitiesOpen(true)}
              onMouseLeave={() => setActivitiesOpen(false)}
            >
              <Link to="/activites" className="text-gray-700 hover:text-[#1113a2] inline-flex items-center gap-1">
                {t("menu.activities")}
                <span className={`transition-transform ${activitiesOpen ? "rotate-180" : ""}`}>▾</span>
              </Link>

              {activitiesOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-lg bg-white shadow-lg ring-1 ring-black/5 py-2">
                  <Link
                    to="/plongée"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {t("menu.diving")}
                  </Link>
                  <Link
                    to="/observation"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {t("activities.observation.title")}
                  </Link>
                </div>
              )}
            </div>

            <Link to="/especes" className="text-gray-700 hover:text-[#1113a2]">{t("menu.especes")}</Link>
            <Link to="/circuits" className="text-gray-700 hover:text-[#1113a2]">{t("menu.circuits")}</Link>
            <Link to="/blog" className="text-gray-700 hover:text-[#1113a2]">{t("menu.blog")}</Link>
            <Link to="/apropos" className="text-gray-700 hover:text-[#1113a2]">{t("menu.about")}</Link>
          </div>
        </div>

        {/* Menu Mobile — CONTRASTE FORT */}
        <div className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${menuOpen ? "max-h-[70vh]" : "max-h-0"}`}>
          <div className="mt-2 flex flex-col rounded-lg bg-white shadow-md text-base text-gray-800">

            <Link
              onClick={() => setMenuOpen(false)}
              to="/"
              className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50"
            >
              {t("menu.home")}
            </Link>

            <button
              className="px-4 py-3 text-left border-b border-gray-200 flex items-center justify-between hover:bg-gray-50"
              onClick={() => setActivitiesOpenMobile((v) => !v)}
            >
              <span className="font-medium">{t("menu.activities")}</span>
              <span className={`transform transition ${activitiesOpenMobile ? "rotate-180" : ""}`}>▾</span>
            </button>

            {activitiesOpenMobile && (
              <div className="pl-6 pb-2">
                <Link
                  onClick={() => { setMenuOpen(false); setActivitiesOpenMobile(false); }}
                  to="/plongée"
                  className="block px-2 py-2 hover:text-[#1113a2]"
                >
                  {t("menu.diving")}
                </Link>
                <Link
                  onClick={() => { setMenuOpen(false); setActivitiesOpenMobile(false); }}
                  to="/observation"
                  className="block px-2 py-2 hover:text-[#1113a2]"
                >
                  {t("activities.observation.title")}
                </Link>
              </div>
            )}

            <Link
              onClick={() => setMenuOpen(false)}
              to="/especes"
              className="px-4 py-3 border-t border-gray-200 hover:bg-gray-50"
            >
              {t("menu.especes")}
            </Link>

            <Link
              onClick={() => setMenuOpen(false)}
              to="/circuits"
              className="px-4 py-3 border-t border-gray-200 hover:bg-gray-50"
            >
              {t("menu.circuits")}
            </Link>

            <Link
              onClick={() => setMenuOpen(false)}
              to="/blog"
              className="px-4 py-3 border-t border-gray-200 hover:bg-gray-50"
            >
              {t("menu.blog")}
            </Link>

            <Link
              onClick={() => setMenuOpen(false)}
              to="/apropos"
              className="px-4 py-3 border-t border-gray-200 hover:bg-gray-50"
            >
              {t("menu.about")}
            </Link>

            {/* Sélecteur de langue mobile */}
            <div className="flex gap-3 px-4 py-3 border-t border-gray-200">
              <img
                src={drapeauFR}
                alt="FR"
                onClick={() => changeLanguage("fr")}
                className={`h-6 w-6 cursor-pointer ${i18n.language==="fr"?"opacity-100":"opacity-50"}`}
              />
              <img
                src={drapeauEN}
                alt="EN"
                onClick={() => changeLanguage("en")}
                className={`h-6 w-6 cursor-pointer ${i18n.language==="en"?"opacity-100":"opacity-50"}`}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* ===== ROUTES ===== */}
      <main className="pt-0">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/partenaires" element={<Partenaires />} />
          <Route path="/philippines" element={<Philippines />} />
          <Route path="/indonesie" element={<Indonesie />} />
          <Route path="/thailande" element={<Thailande />} />
          <Route path="/malaisie" element={<Malaisie />} />
          <Route path="/japon" element={<Japon />} />
          <Route path="/vietnam" element={<Vietnam />} />
          <Route path="/maldives" element={<Maldives />} />
          <Route path="/labels" element={<LabelsCertifications />} />
          <Route path="/apropos" element={<APropos />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/requins-baleines" element={<RequinsBaleines />} />
          <Route path="/blog/world-maritime-day" element={<WorldMaritimeDay />} />
          <Route path="/blog/oman" element={<Oman />} />
          <Route path="/circuits" element={<Circuits />} />
          <Route path="/activites" element={<Activites />} />
          <Route path="/plongée" element={<Plongée />} />
          <Route path="/observation" element={<Observation />} /> {/* ← NOUVELLE ROUTE */}
          <Route path="/continents/:slug" element={<ContinentRouter />} />
          <Route path="/pays2/:slug" element={<CountryPage />} />
          <Route path="/especes" element={<Especes />} />
          <Route path="/blog/tortues-vertes" element={<TortuesVertes />} />
          <Route path="/blog/coraux-blancs" element={<CorauxBlancs />} />
        </Routes>
      </main>

      {/* ===== FOOTER TRADUIT ===== */}
      <footer className="bg-[#1113a2] py-12 px-6 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="md:w-1/2">
            <h3 className="text-xl font-bold mb-4">{t("footer.contact.title")}</h3>
            <p className="mb-2">
              {t("footer.contact.email")} :{" "}
              <a href="mailto:contact@guardianmap.com" className="underline hover:text-gray-300">
                contact@guardianmap.com
              </a>
            </p>
            <p>
              {t("footer.contact.instagram")} :{" "}
              <a
                href="https://instagram.com/guardianmap"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-300"
              >
                @guardianmap
              </a>
            </p>
          </div>

          <div className="md:w-1/2">
            <h3 className="text-xl font-bold mb-4">{t("footer.newsletter.title")}</h3>
            <p className="mb-4">{t("footer.newsletter.subtitle")}</p>
            <NewsletterForm />
          </div>
        </div>
      </footer>
    </Router>
  );
}
