import nodemailer from "nodemailer";
import { otpTemplate } from "./otpTemplate.js";

export const sendOTPEmail = async (userEmail, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Airbnb",
    to: userEmail,
    subject: "Your OTP Verification Code",
    html: otpTemplate(otp),
  };

  await transporter.sendMail(mailOptions);
};
