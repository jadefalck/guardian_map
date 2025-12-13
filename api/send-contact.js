// api/send-contact.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Méthode non autorisée" });
    return;
  }

  try {
    const { email, message } = req.body;

    const transporter = nodemailer.createTransport({
      host: process.env.QUIZ_MAIL_HOST,
      port: Number(process.env.QUIZ_MAIL_PORT || 465),
      secure: true,
      auth: {
        user: process.env.QUIZ_MAIL_USER,
        pass: process.env.QUIZ_MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"GuardianMap – Contact" <${process.env.QUIZ_MAIL_USER}>`,
      to: process.env.QUIZ_MAIL_TO || process.env.QUIZ_MAIL_USER,
      subject: `Nouveau message via la page A propos`,
      text: `
Email : ${email}

Message :
${message}
      `,
    });

    res.status(200).json({ success: true });
  } catch (e) {
    console.error("Erreur API contact :", e);
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
}
