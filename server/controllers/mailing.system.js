import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { google } from "googleapis";

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export const Mail = async (req, res) => {
  try {
    const { username, userEmail, text, subject } = req.body;

    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL, // Your Gmail address
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Admin",
        link: "Login",
      },
    });

    const emailBody = mailGenerator.generate({
      body: {
        intro: `${text}`,
        outro: "Looking forward to serving you.",
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: subject || "Password Reset!",
      html: emailBody,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result.messageId);

    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong while sending the email." });
  }
};
