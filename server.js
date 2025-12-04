// server.js
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Transporter Gmail avec mot de passe d'application
// Assure-toi d'avoir dans ton .env :
// EMAIL_USER=ton_adresse_gmail
// EMAIL_PASS=ton_mot_de_passe_application
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true pour 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Simple check transport
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Erreur SMTP au démarrage :", err);
  } else {
    console.log("✅ SMTP prêt pour l'envoi d'emails");
  }
});

// Route API pour le quiz circuits
app.post("/api/circuits-quiz", async (req, res) => {
  try {
    console.log("📩 Requête reçue /api/circuits-quiz :", req.body);

    const data = req.body;

    const mailOptions = {
      from: `"GuardianMap – Quiz circuits" <${process.env.EMAIL_USER}>`,
      to: "gdm.guardianmap@gmail.com",
      subject: `Nouveau quiz circuits – ${data.name || "inconnu"}`,
      text: [
        `Prénom / pseudo : ${data.name || ""}`,
        `Email : ${data.email || ""}`,
        `Tu voyages : ${data.groupType || ""}`,
        `Nombre de personnes : ${data.people || ""}`,
        `Destination souhaitée : ${data.destination || ""}`,
        `Durée du séjour (jours) : ${data.days || ""}`,
        `Période envisagée : ${data.period || ""}`,
        `Style de voyage : ${data.travelStyle || ""}`,
        `Tolérance aux transferts : ${data.transfers || ""}`,
        `Mer / activités nautiques : ${data.likesWater ? "oui" : "non"}`,
        `Nature / randos : ${data.likesNature ? "oui" : "non"}`,
        `Culture / gastronomie : ${data.likesCulture ? "oui" : "non"}`,
        `Budget / personne : ${data.budget || ""}`,
        `Style d’hébergement : ${data.accommodation || ""}`,
        `Autres infos : ${data.extra || ""}`,
      ].join("\n"),
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email circuits envoyé pour :", data.email);

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("❌ Erreur d'envoi email circuits:", error);
    res.status(500).json({ ok: false, error: "email_error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API circuits quiz en écoute sur http://localhost:${PORT}`);
});
