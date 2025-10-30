// src/pages/blog/Oman.jsx
import React from "react";
import { Link } from "react-router-dom";
import omanImg from "../../assets/images/articles_blog/oman.jpg";
import NewsletterForm from "../../components/NewsletterForm";

export default function Oman() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-100 py-10 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1113a2]">
          Oman : protéger, patienter… et vivre des rencontres magiques
        </h1>
        <p className="mt-3 text-gray-700 max-w-3xl mx-auto">
          Un pays exemplaire : accès régulé aux tortues, îles Daymaniyat protégées,
          rencontres naturelles sans nourrissage.
        </p>
      </header>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-6 py-10 text-gray-700">
        <img
          src={omanImg}
          alt="Oman : îles Daymaniyat, tortues, requins de récif"
          className="rounded-2xl shadow mb-8 w-full max-h-[480px] object-cover"
        />

        <p className="mb-4" style={{ textAlign: "justify" }}>
          S’il existe une destination où l’on ressent un véritable respect pour la faune
          marine, c’est bien <strong>Oman</strong>. Ici, la rencontre avec les animaux
          se vit <em>aux conditions de la nature</em>. Les autorités protègent activement
          les tortues marines et les écosystèmes côtiers, et le visiteur est invité à
          s’adapter à un rythme plus lent — pour de meilleures rencontres.
        </p>

        <h2 className="text-xl font-semibold text-[#1113a2] mt-6 mb-3">
          Tortues marines : un accès régulé pour leur tranquillité
        </h2>
        <p className="mb-4" style={{ textAlign: "justify" }}>
          Pour observer les tortues, il faut <strong>payer un droit d’accès</strong> —
          une contribution qui finance la protection et le suivi. Et lorsque les tortues
          sont en <strong>période de ponte</strong>, l’accès à certaines plages/îles
          est <strong>interdit</strong> aux touristes : on ne perturbe ni la nidification
          ni l’émergence des bébés. Résultat : des populations moins stressées et des
          comportements naturels préservés.
        </p>

        <h2 className="text-xl font-semibold text-[#1113a2] mt-6 mb-3">
          Îles Daymaniyat : requins de récif… sans nourrissage
        </h2>
        <p className="mb-4" style={{ textAlign: "justify" }}>
          Autour des <strong>îles Daymaniyat</strong>, on peut croiser des
          <strong> requins de récif</strong> dans un cadre <em>100 % naturel</em> :
          <strong> ils ne sont pas nourris</strong>. Les bateaux se positionnent à distance,
          on se met à l’eau et on <strong>nage jusqu’aux zones d’observation</strong>.
          Parfois, il faut <strong>être patient</strong> — et c’est tant mieux : cela
          évite tout déséquilibre et rend la rencontre encore plus <strong>magique</strong>.
        </p>

        <h2 className="text-xl font-semibold text-[#1113a2] mt-6 mb-3">
          Une philosophie simple : voir sans déranger
        </h2>
        <ul className="list-disc list-inside mb-6">
          <li>Pas de nourrissage, pas de manipulation : <strong>observation passive</strong>.</li>
          <li>Respect des distances et <strong>groupes limités</strong> si nécessaire.</li>
          <li>Briefings clairs, et un <strong>encadrement local</strong> qui connaît les sites.</li>
        </ul>

        <blockquote className="border-l-4 border-[#1113a2] pl-4 italic text-gray-800 mb-6">
          À Oman, la patience est une vertu : le spectacle est naturel, imprévisible — et
          c’est ce qui le rend inoubliable.
        </blockquote>

        <Link
          to="/blog"
          className="inline-block rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2"
        >
          ← Retour au blog
        </Link>
      </article>


    </div>
  );
}
