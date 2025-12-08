// api/send-circuit-quiz.js
import nodemailer from "nodemailer";

// Petite fonction utilitaire pour lire le JSON brut si besoin
function getBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        const json = JSON.parse(data || "{}");
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  // Autoriser uniquement POST
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    // Vercel parse parfois déjà le body, sinon on lit à la main
    const body =
      (req.body && typeof req.body === "object" ? req.body : await getBody(req)) ||
      {};

    const {
      name,
      email,
      groupType,
      people,
      destination,
      days,
      period,
      travelStyle,
      transfers,
      likesWater,
      likesNature,
      likesCulture,
      budget,
      accommodation,
      extra,
    } = body;

    // Transport SMTP configuré avec tes variables d'env Vercel
    const transporter = nodemailer.createTransport({
      host: process.env.QUIZ_MAIL_HOST, // ex. smtp.gmail.com
      port: Number(process.env.QUIZ_MAIL_PORT || 465),
      secure: true,
      auth: {
        user: process.env.QUIZ_MAIL_USER, // ton adresse Gmail
        pass: process.env.QUIZ_MAIL_PASS, // mot de passe d’application
      },
    });

    const to = process.env.QUIZ_MAIL_TO || process.env.QUIZ_MAIL_USER;
    const subject = `Nouveau quiz circuits – ${name || "Sans nom"}`;

    const text = `
Nouveau quiz circuits reçu depuis GuardianMap :

Nom / pseudo : ${name || "-"}
Email de contact : ${email || "-"}

Tu voyages : ${groupType || "-"}
Nombre de personnes : ${people || "-"}

Destination souhaitée : ${destination || "-"}
Durée du séjour (jours) : ${days || "-"}
Période envisagée : ${period || "-"}

Style de voyage : ${travelStyle || "-"}
Tolérance aux longs trajets : ${transfers || "-"}

Mer / activités nautiques : ${likesWater ? "Oui" : "Non / non précisé"}
Nature / randos : ${likesNature ? "Oui" : "Non / non précisé"}
Culture / gastronomie : ${likesCulture ? "Oui" : "Non / non précisé"}

Budget / personne (hors vol) : ${budget || "-"}
Style d’hébergement : ${accommodation || "-"}

Infos supplémentaires :
${extra || "-"}
`;

    await transporter.sendMail({
      from: `"GuardianMap – Quiz circuits" <${process.env.QUIZ_MAIL_USER}>`,
      to,
      subject,
      text,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Erreur API send-circuit-quiz :", err);
    res.status(500).json({
      success: false,
      message: "Erreur interne lors de l’envoi du mail.",
    });
  }
}
