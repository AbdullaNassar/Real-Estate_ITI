import nodemailer from "nodemailer";
import { otpTemplate } from "./otpTemplate.js";

export const sendOTPEmail = async (userEmail, otp, isVerified = true) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASSWORD,
    },
  });

  const htmlVerfied = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #C69963;">Maskn Verification</h2>
      <p>To complete your account verification, please use the code below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; background-color: #C69963; color: white; padding: 12px 24px; font-size: 20px; font-weight: bold; border-radius: 6px;">
        Your verification code is: <b>${otp}</b>
        </span>
      </div>
      <p>This code is valid for <b>10 minutes</b>.</p>
      <p>If you did not request this code, please ignore this email.</p>
      <p style="color: #888; font-size: 14px;">— The Maskn Team</p>
    </div>
  `;
  const htmlReset = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #C69963;">Maskn Reset Password</h2>
      <p>To complete your Reset Password, please use the code below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; background-color: #C69963; color: white; padding: 12px 24px; font-size: 20px; font-weight: bold; border-radius: 6px;">
        Your Reset code is: <b>${otp}</b>
        </span>
      </div>
      <p>This code is valid for <b>10 minutes</b>.</p>
      <p>If you did not request this code, please ignore this email.</p>
      <p style="color: #888; font-size: 14px;">— The Maskn Team</p>
    </div>
  `;
  const mailOptions = {
    from: "Maskn",
    to: userEmail,
    subject: `${
      isVerified ? "Maskn Verification Code" : "Maskn Reset Password"
    }`,
    html: isVerified ? htmlVerfied : htmlReset,
  };

  await transporter.sendMail(mailOptions);
};
