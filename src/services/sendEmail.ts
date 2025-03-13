// src/utils/sendEmail.ts
import { configDotenv } from "dotenv";
import { readFileSync } from "fs";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import path, { join } from "path";

configDotenv();

export const sendVerificationEmail = async (
  to: string,
  token: string,
  first_name: string,
  last_name: string
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER, // Outgoing server
    port: 465, // SMTP port for SSL
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.APP_EMAIL_PASS,
    },
  });

  const verificationLink =
    process.env.NODE_ENV === "production"
      ? `https://jpstvethiopia.com/verify-email/${token}`
      : `http://localhost:3000/verify-email/${token}`;

  const tempPath = path.join(__dirname, "emailTemplate.html");

  let html = readFileSync(tempPath, "utf8");
  let template = handlebars.compile(html);

  let data = {
    fullname: first_name + " " + last_name,
    link: verificationLink,
    title: "Email Verification",
    content: "Verify Your Email By Clicking the following link",
    linkName: "Click to Verify Your Email",
  };

  let htmlToSend = template(data);

  const mailOptions = {
    from: '"JPS TV " <no-reply@jpstvethiopia.com>',
    to,
    subject: "Email Verification Message",
    html: htmlToSend,
  };

  return transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (
  to: string,
  token: string,
  first_name: string,
  last_name: string
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER, // Outgoing server
    port: 465, // SMTP port for SSL
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.APP_EMAIL_PASS,
    },
  });

  const verificationLink =
    process.env.NODE_ENV === "production"
      ? `https://jpstvethiopia.com/reset-password/${token}`
      : `http://localhost:3000/reset-password/${token}`;

  const tempPath = path.join(__dirname, "emailTemplate.html");

  let html = readFileSync(tempPath, "utf8");
  let template = handlebars.compile(html);

  let data = {
    fullname: first_name + " " + last_name,
    link: verificationLink,
    title: "Password Reset",
    content: "Reset Your Password By Clicking the following link",
    linkName: "Click to Reset Your Password",
  };

  let htmlToSend = template(data);

  const mailOptions = {
    from: '"JPS TV " <no-reply@jpstvethiopia.com>',
    to,
    subject: "Password Reset Message",
    html: htmlToSend,
  };

  return transporter.sendMail(mailOptions);
};

export const sendBibleStudyEmail = async (
  to: string,
  zoomInfo: {
    zoom_id: string;
    zoom_link: string;
    zoom_passcode: string;
  },
  first_name: string,
  last_name: string
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER, // Outgoing server
    port: 465, // SMTP port for SSL
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER_PROPHETIC_SCHOOL,
      pass: process.env.APP_EMAIL_PASS_PROPHETIC_SCHOOL,
    },
  });
  const tempPath = path.join(__dirname, "bibleStudy.html");

  let html = readFileSync(tempPath, "utf8");
  let template = handlebars.compile(html);

  let data = {
    fullname: first_name + " " + last_name,
    zoom_link: zoomInfo.zoom_link,
    zoom_id: zoomInfo.zoom_id,
    zoom_passcode: zoomInfo.zoom_passcode,
    title: "Prophetic School",
    content:
      "You have successfully Registered for prophetic school with man of God. Click the following to join us",
    linkName: "Click to Join",
  };

  let htmlToSend = template(data);

  const mailOptions = {
    from: '"JPS TV Prophetic School " <prophetic-school@jpstvethiopia.com>',
    to,
    subject: "Prophetic School Message",
    html: htmlToSend,
  };

  return transporter.sendMail(mailOptions);
};

export const sendVisitorConfirmationEmail = async (
  to: string,
  first_name: string,
  last_name: string
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER, // Outgoing server
    port: 465, // SMTP port for SSL
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER_VISITORS,
      pass: process.env.APP_EMAIL_PASS_VISITORS,
    },
  });

  const tempPath = path.join(__dirname, "emailTemplate.html");

  let html = readFileSync(tempPath, "utf8");
  let template = handlebars.compile(html);

  let data = {
    fullname: first_name + " " + last_name,
    link: "#",
    title: "Visitor / One to One Meeting With One of God",
    content: "We will contact you shortly soon",
    linkName: "Contact",
  };

  let htmlToSend = template(data);

  const mailOptions = {
    from: '"JPS TV Visitors " <no-reply@jpstvethiopia.com>',
    to,
    subject: "Visitor / One to One Meeting With Man of God Message",
    html: htmlToSend,
  };

  return transporter.sendMail(mailOptions);
};

export const sendPartnershipConfirmationEmail = async (
  to: string,
  first_name: string,
  last_name: string
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER, // Outgoing server
    port: 465, // SMTP port for SSL
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER_PARTNERS,
      pass: process.env.APP_EMAIL_PASS_PARTNERS,
    },
  });

  const tempPath = path.join(__dirname, "emailTemplate.html");

  let html = readFileSync(tempPath, "utf8");
  let template = handlebars.compile(html);

  let data = {
    fullname: first_name + " " + last_name,
    link: "https://jpstvethiopia.com/give/",
    title: "Partnership Registration Confirmation",
    content:
      "You have successfully registered as JPS TV  Partner. You will receive reminder email, on the payment due date.",
    linkName: "Payment Page",
  };

  let htmlToSend = template(data);

  const mailOptions = {
    from: '"JPS TV Partnership" <no-reply@jpstvethiopia.com>',
    to,
    subject: "Partnership Registration Confirmation Message",
    html: htmlToSend,
  };

  return transporter.sendMail(mailOptions);
};

export const sendDonationConfirmationEmail = async (
  to: string,
  first_name: string,
  last_name: string
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER, // Outgoing server
    port: 465, // SMTP port for SSL
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER_PARTNERS,
      pass: process.env.APP_EMAIL_PASS_PARTNERS,
    },
  });

  const tempPath = path.join(__dirname, "emailTemplate.html");

  let html = readFileSync(tempPath, "utf8");
  let template = handlebars.compile(html);

  let data = {
    fullname: first_name + " " + last_name,
    link: "https://jpstvethiopia.com/give/",
    title: "JPS TV Donation Confirmation",
    content:
      "You have successfully Donated for JPS TV . Thank you God bless you !",
    linkName: "Payment Page",
  };

  let htmlToSend = template(data);

  const mailOptions = {
    from: '"JPS TV Team" <no-reply@jpstvethiopia.com>',
    to,
    subject: "JPS TV Donation Confirmation Message",
    html: htmlToSend,
  };

  return transporter.sendMail(mailOptions);
};

export const sendReminderEmail = async (
  to: string,
  token: string,
  first_name: string,
  last_name: string
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER, // Outgoing server
    port: 465, // SMTP port for SSL
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER_PARTNERS,
      pass: process.env.APP_EMAIL_PASS_PARTNERS,
    },
  });

  const verificationLink =
    process.env.NODE_ENV === "production"
      ? `https://jpstvethiopia.com/give/${token}`
      : `http://localhost:3000/give/${token}`;

  const tempPath = path.join(__dirname, "emailTemplate.html");

  let html = readFileSync(tempPath, "utf8");
  let template = handlebars.compile(html);

  let data = {
    fullname: first_name + " " + last_name,
    link: verificationLink,
    title: "Partnership Reminder",
    content:
      "Your partnership due date is here. Please click the below link link to make a payment !",
    linkName: "Make Partnership Payment",
  };

  let htmlToSend = template(data);

  const mailOptions = {
    from: '"JPS TV Partnership" <no-reply@jpstvethiopia.com>',
    to,
    subject: "Partnership Reminder Message",
    html: htmlToSend,
  };

  return transporter.sendMail(mailOptions);
};

export const sendMemberEmail = async ({
  to,
  title,
  subject,
  body,
  first_name,
  last_name,
}: {
  to: string;
  title: string;
  subject: string;
  body: string;
  first_name: string;
  last_name: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER, // Outgoing server
    port: 465, // SMTP port for SSL
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER_PROPHETIC_SCHOOL,
      pass: process.env.APP_EMAIL_PASS_PROPHETIC_SCHOOL,
    },
  });

  const link =
    process.env.NODE_ENV === "production"
      ? `https://jpstvethiopia.com`
      : `http://localhost:3000`;

  const tempPath = path.join(__dirname, "emailTemplate3.html");

  let html = readFileSync(tempPath, "utf8");
  let template = handlebars.compile(html);

  let data = {
    fullname: first_name + " " + last_name,
    link: link,
    internal_title: title,
    content: body,
    linkName: "Go to Website",
  };

  let htmlToSend = template(data);

  const mailOptions = {
    from: '"JPS TV Prophetic School" <prophetic-school@jpstvethiopia.com>',
    to,
    subject: subject,
    html: htmlToSend,
  };

  return transporter.sendMail(mailOptions);
};

export const sendBookPurchaseEmail = async (
  to: string,
  first_name: string,
  last_name: string
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER, // Outgoing server
    port: 465, // SMTP port for SSL
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER_BOOK_ORDER,
      pass: process.env.APP_EMAIL_PASS_BOOK_ORDER,
    },
  });

  const tempPath = path.join(__dirname, "emailTemplate.html");

  let html = readFileSync(tempPath, "utf8");
  let template = handlebars.compile(html);

  let data = {
    fullname: first_name + " " + last_name,
    link: "https://jpstvethiopia.com",
    title: "Book Order Confirmation",
    content:
      "You have successfully ordered Prophet Deresse Lakew's Book. Find the book as an attachment Below. Thank you!",
    linkName: "Home Page",
  };

  let preText = readFileSync(join(__dirname, "PRE_TEXT.pdf"));
  let mainBook = readFileSync(join(__dirname, "THE_LAYING_ON_OF_HANDS.pdf"));

  let htmlToSend = template(data);

  const mailOptions = {
    from: '"JPS TV Book Order" <book-order@jpstvethiopia.com>',
    to,
    subject: "Book Order Confirmation Message",
    html: htmlToSend,
    attachments: [
      {
        filename: "Pre_Text.pdf",
        content: preText,
        encoding: "base64",
      },
      {
        filename: "The_Laying_On_Of_Hands.pdf",
        content: mainBook,
        encoding: "base64",
      },
    ],
  };

  return transporter.sendMail(mailOptions);
};
