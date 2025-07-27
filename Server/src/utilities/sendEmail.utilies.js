import nodemailer from "nodemailer";

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
    html: `<h2>OTP Verification</h2>
            <p>Your verification code is: <b>${otp}</b></p>
            <p>This code is valid for 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
