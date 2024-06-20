// src/utils/sendEmail.ts
import nodemailer from "nodemailer";

export const sendVerificationEmail = async (to: string, token: string) => {
  const transporter = nodemailer.createTransport({
    host: "mail.hertzopshub.com", // Outgoing server
    port: 465, // SMTP port for SSL
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.APP_EMAIL_PASS,
    },
  });

  const verificationLink = `http://localhost:3000/verify-email/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Verify your email address",
    text: `Please verify your email address by clicking on the link: ${verificationLink}`,
    html: `<p>Please verify your email address by clicking on the link: <a href="${verificationLink}">Click here</a></p>`,
  };

  return transporter.sendMail(mailOptions);
};
