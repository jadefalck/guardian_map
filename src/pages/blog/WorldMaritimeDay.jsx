import React from "react";
import { Link } from "react-router-dom";
import wmdImg from "../../assets/images/articles_blog/world_maritime_day.webp";
import NewsletterForm from "../../components/NewsletterForm";

export default function WorldMaritimeDay() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-100 py-10 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1113a2]">
          World Maritime Day : pourquoi le maritime nous concerne tous
        </h1>
        <p className="mt-3 text-gray-700 max-w-3xl mx-auto">
          Une journée OMI/ONU pour rappeler le rôle vital du transport maritime, la
          sécurité en mer et la protection de l’océan.
        </p>
      </header>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-6 py-10 text-gray-700">
        <img
          src={wmdImg}
          alt="World Maritime Day / Journée maritime mondiale"
          className="rounded-2xl shadow mb-8 w-full max-h-[480px] object-cover"
        />

        <p className="mb-4" style={{ textAlign: "justify" }}>
          La <strong>Journée maritime mondiale</strong> a été instaurée par
          l’<strong>Organisation Maritime Internationale</strong> (OMI), une agence des
          Nations Unies chargée des questions de sécurité, de sûreté et de protection de
          l’environnement dans le transport maritime. Elle est célébrée chaque année,
          généralement <strong>le dernier jeudi de septembre</strong>.
        </p>

        <p className="mb-4" style={{ textAlign: "justify" }}>
          L’objectif est double :{" "}
          <strong>mettre en avant l’importance du transport maritime</strong> dans le
          commerce mondial — on estime que <em>80 à 90 %</em> des échanges internationaux
          transitent par la mer — et <strong>valoriser les marins</strong> et travailleurs
          de la mer, tout en <strong>sensibilisant</strong> aux enjeux environnementaux,
          à la sécurité en mer et à l’innovation.
        </p>

        <h2 className="text-xl font-semibold text-[#1113a2] mt-6 mb-3">
          Un thème chaque année
        </h2>
        <p className="mb-4" style={{ textAlign: "justify" }}>
          Chaque édition propose un <strong>thème spécifique</strong> (ex. prévention de
          la pollution, transition énergétique, numérique, sécurité des navires, etc.).
          C’est l’occasion de faire le point sur les engagements de l’OMI et les avancées
          réglementaires.
        </p>

        <h2 className="text-xl font-semibold text-[#1113a2] mt-6 mb-3">
          Pourquoi en parler sur GuardianMap ?
        </h2>
        <ul className="list-disc list-inside mb-6">
          <li>
            Nos activités côtières et de plongée dépendent d’un{" "}
            <strong>océan en bonne santé</strong>.
          </li>
          <li>
            Des <strong>routes maritimes plus propres et plus sûres</strong> bénéficient à
            la biodiversité et aux communautés littorales.
          </li>
          <li>
            Comprendre ces enjeux nous aide à <strong>voyager mieux</strong> et à soutenir
            les opérateurs responsables.
          </li>
        </ul>

        <blockquote className="border-l-4 border-[#1113a2] pl-4 italic text-gray-800 mb-6">
          Protéger l’océan, c’est aussi s’intéresser à la manière dont nos marchandises
          circulent et au travail de celles et ceux qui font vivre la mer.
        </blockquote>

        <Link
          to="/blog"
          className="inline-block rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2"
        >
          ← Retour au blog
        </Link>
      </article>

      {/* Footer */}
      <footer className="bg-[#1113a2] py-12 px-6 text-white mt-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="mb-2">
              📧 Mail :
              <a
                href="mailto:contact@guardianmap.com"
                className="underline hover:text-gray-300 ml-1"
              >
                contact@guardianmap.com
              </a>
            </p>
            <p>
              📸 Instagram :
              <a
                href="https://instagram.com/guardianmap"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-300 ml-1"
              >
                @guardianmap
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Reste informé(e)</h3>
            <p className="mb-4">Inscris-toi pour suivre le développement de GuardianMap.</p>
            <NewsletterForm />
          </div>
        </div>
      </footer>
    </div>
  );
}
