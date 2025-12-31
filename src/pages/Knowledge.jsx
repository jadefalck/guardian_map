import { useState } from 'react';
import logo from '../assets/images/logo.png';
import videoPoissons from '../assets/videos/video_poissons_knowledge.mp4';

const themes = [
  {
    title: "Préserver un patrimoine naturel irremplaçable",
    subtitle: "Une fois détruits, les écosystèmes marins mettent des siècles à se régénérer — s’ils le peuvent. Et sans eux, la vie dans l’océan ne peut tout simplement pas exister.",
    fullText: `Imaginez un instant : un récif corallien met entre 10 000 et 30 000 ans à se former naturellement.
Une fois détruits, ils ne reviendront pas de notre vivant.

Aux Philippines, la Grande Barrière de corail d'Apo Island était quasiment morte dans les années 1980 à cause de la pêche à la dynamite et du piétinement des touristes. Il a fallu 40 ans de protection stricte pour voir les premiers signes de régénération. Aujourd'hui, c'est l'un des sites de plongée les plus prisés du pays.

Votre impact : Un simple coup de palme peut briser un corail de 100 ans. Mais en choisissant des centres respectueux et en maîtrisant votre flottabilité, vous participez à sa préservation.`
  },
  {
    title: "Éduquer pour mieux plonger",
    subtitle: "Pour profiter de plongées riches en poissons et en végétation, il faut d’abord apprendre à les préserver. Nos gestes peuvent abîmer ce qu’on est venu admirer.",
    fullText: `Paradoxalement, les plus beaux sites de plongée sont souvent les plus fragiles.

Un plongeur non sensibilisé peut involontairement :
- Effrayer un banc de poissons qui ne reviendra pas de la journée
- Déranger une tortue en ponte
- Toucher des animaux marins, perturbant leur comportement naturel

La bonne nouvelle : Avec les bonnes techniques et connaissances, vous multiplierez vos chances d'observations exceptionnelles. Les poissons s'approchent des plongeurs calmes et respectueux. C'est un cercle vertueux.`
  },
  {
    title: "Respecter l’équilibre du vivant",
    subtitle: "Les espèces marines ne vivent pas isolées : elles régulent le climat, produisent de l’oxygène, nourrissent des milliards d’êtres vivants. Ne pas les respecter, c’est fragiliser toute la vie sur Terre.",
    fullText: `L'océan n'est pas qu'un terrain de jeu aquatique. C'est le poumon de notre planète :
- 50% de l'oxygène que nous respirons provient du phytoplancton marin
- Les océans absorbent 30% du CO2 que nous produisons
- 3,5 milliards de personnes dépendent de l'océan pour leur alimentation principale

Aux Philippines, les récifs coralliens protègent naturellement les côtes des typhons et de l'érosion. Ils abritent 25% de toute la vie marine mondiale sur seulement 1% de la surface océanique.

Votre rôle : En tant que plongeur, vous êtes un ambassadeur de l'océan. Vos choix de plongée éthique façonnent l'avenir de ces écosystèmes vitaux.`
  },
  {
    title: "Soutenir les territoires qui nous accueillent",
    subtitle: "En protégeant l’océan, on soutient aussi les communautés locales qui en dépendent pour vivre — pêche, tourisme, artisanat… Préserver la mer, c’est aussi respecter ceux qui l’habitent.",
    fullText: `Aux Philippines, plus de 5 millions de personnes vivent directement de la mer : pêcheurs, guides de plongée, propriétaires de resorts, artisans...

Quand nous choisissons des centres certifiés Green Fins ou d'autres labels éthiques, nous soutenons :
- Des emplois locaux durables plutôt que l'exploitation
- Des communautés de pêcheurs qui deviennent gardiens des récifs
- Le développement économique respectueux des traditions locales
- La formation de jeunes guides aux pratiques responsables

L'effet multiplicateur : Un euro dépensé dans le tourisme de plongée responsable génère en moyenne 3 euros pour l'économie locale, contre seulement 0,50 euro pour le tourisme de masse.`
  }
];

export default function Knowledge() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="min-h-screen bg-white pt-6">
      {/* Première section avec fond gris et nouveau titre stylisé */}
      <div className="bg-gray-100 pb-16">
        <div className="flex justify-center pt-20 pb-10">
          <div className="bg-[#7c6fd1]/80 px-6 py-3 shadow text-gray-800 text-2xl font-bold border border-gray-800">
            Pourquoi pratiquer une plongée éthique ?
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 max-w-6xl mx-auto">
          {themes.map((theme, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={index}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`p-6 rounded-xl bg-white shadow-md transition-all duration-500 ease-in-out cursor-pointer overflow-hidden
                  ${isActive ? 'scale-105 z-10 bg-white' : 'opacity-60 hover:opacity-100'}`}
                style={{
                  filter: !isActive && activeIndex !== null ? 'blur(1px)' : 'none',
                }}
              >
                <h2 className="text-lg font-bold text-[#1113a2] mb-2">{theme.title}</h2>
                <p className="italic text-sm text-gray-600 mb-2">{theme.subtitle}</p>
                {isActive && (
                  <p className="text-gray-700 mt-4 whitespace-pre-line text-sm">{theme.fullText}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Vidéo en pleine largeur mais moins haute */}
      <div className="w-full overflow-hidden">
        <video
          src={videoPoissons}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-[200px] object-cover"
        ></video>
      </div>

      {/* Nouveau titre stylisé pour Green Fins */}
      <div className="flex justify-center pt-20 pb-10">
        <div className="bg-orange-400/70 px-6 py-3 shadow text-gray text-2xl font-bold border border-gray-700">
          Le label Green Fins
        </div>
      </div>

      <div className="text-center text-gray-700 font-semibold text-lg pb-10">
        La référence mondiale de la plongée responsable
      </div>

      {/* Section Green Fins stylisée */}
      <section className="py-10 px-6 bg-gradient-to-br from-white to-purple-50">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6 text-gray-800 text-[1rem] leading-relaxed">
            <p>
              <strong>Un label qui a du poids</strong><br />
              Green Fins n'est pas un énième autocollant marketing. C'est une initiative internationale portée par le Programme des Nations Unies pour l'Environnement (PNUE) et pilotée par la Reef-World Foundation. Autrement dit : quand vous voyez ce logo, vous savez que l'ONU elle-même garantit le sérieux de la démarche.
            </p>

            <p>
              <strong>Comment ça marche concrètement ?</strong><br />
              Chaque centre candidat subit un audit minutieux basé sur 15 critères environnementaux précis. L'auditeur, spécialement formé, inspecte tout : les briefings, les pratiques de mouillage, la gestion des déchets, la formation du personnel...<br />
              Le système de notation est inversé (comme au golf) : plus votre score est bas, meilleures sont vos pratiques. Sur 330 points possibles, il faut obtenir moins de 200 points pour être certifié.
            </p>
            <ul className="list-disc list-inside ml-6">
              <li>Bronze (≤ 200 points) : Les bases sont maîtrisées</li>
              <li>Argent (≤ 150 points) : Excellence confirmée</li>
              <li>Or (≤ 50 points) : Référence absolue en écoresponsabilité</li>
            </ul>

            <p>
              Après l'évaluation, chaque centre s'engage sur 3 actions concrètes à réaliser dans l'année. Pas de promesses vagues : des objectifs mesurables avec un suivi rigoureux.
            </p>

            <div className="text-lg font-semibold italic text-[#1113a2] text-center pt-4">
              Les 12 critères (à venir)
            </div>

            <p>
              <strong>Un contrôle qui ne plaisante pas</strong><br />
              La certification Green Fins n'est valable que 18 mois. Après ? Nouvel audit obligatoire. Si un centre ne progresse pas en 2 ans, il peut être suspendu du programme. Cette exigence garantit une amélioration continue, pas juste un effort ponctuel.
            </p>

            <p>
              <strong>Le résultat ?</strong> Dans les zones où les centres Green Fins sont majoritaires, les récifs montrent des signes de régénération mesurables. C'est la preuve que l'approche fonctionne.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}






