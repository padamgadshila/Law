import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { google } from "googleapis";
import { getOtp } from "../helpers/otpGenerator.js";

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const configuration = async () => {
  const accessToken = await oAuth2Client.getAccessToken();

  return nodemailer.createTransport({
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
};

export const Mail = async (req, res) => {
  try {
    const transporter = await configuration();
    const { type, username, userEmail, text, subject } = req.body;

    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Admin",
        link: "https://your-website-link.com", // Replace with your website's URL
      },
    });

    // Email content based on type
    let emailBody;

    if (type === "registration") {
      emailBody = mailGenerator.generate({
        body: {
          name: username,
          intro: `<p style="color: #333; font-size: 18px; font-family: Arial, sans-serif;">
              Welcome to our platform! Your account has been successfully created.
            </p>`,
          table: {
            data: [
              {
                Key: `<b>Username</b>`,
                Value: `<span style="color: #555;">${username}</span>`,
              },
              {
                Key: `<b>Password</b>`,
                Value: `<span style="color: #555;">${text.password}</span>`,
              },
            ],
            columns: {
              customWidth: { Key: "30%", Value: "70%" },
              customAlignment: { Key: "left", Value: "right" },
            },
          },
          outro: `<p style="font-size: 16px; font-family: Arial, sans-serif; color: #666;">
              We are excited to have you on board! If you have any questions, feel free to contact us.
            </p>`,
        },
      });
    } else if (type === "forgotPassword") {
      const otp = getOtp(); // Generate OTP
      emailBody = mailGenerator.generate({
        body: {
          name: username,
          intro: `<p style="font-size: 18px; color: #333; font-family: Arial, sans-serif;">
              We received a request to reset your password.
            </p>`,
          action: {
            instructions: `<p style="font-size: 16px; color: #333; font-family: Arial, sans-serif;">
                       Use the OTP below to reset your password:
                     </p>`,
            button: {
              color: "#1a73e8", // Google Blue
              text: `<span style="font-weight: bold; font-size: 20px; padding: 10px; font-family: Arial, sans-serif;">${text.otp}</span>`,
            },
          },
          outro: `<p style="font-size: 16px; font-family: Arial, sans-serif; color: #666;">
              If you did not request this, please ignore this email. Your account is safe.
            </p>`,
        },
      });
    } else {
      return res.status(400).json({ error: "Invalid email type specified." });
    }

    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: subject,
      html: emailBody,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {

    return res
      .status(500)
      .json({ error: "Something went wrong while sending the email." });
  }
};
