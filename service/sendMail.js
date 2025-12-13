const nodemailer = require("nodemailer");
const SmtpConfig = require("../models/SMTPConfig");

const sendEmail = async ({ to, subject, html }) => {
  const smtp = await SmtpConfig.findOne();

  if (!smtp) throw new Error("SMTP configuration not found!");

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure, // true for 465, false for others
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

  return await transporter.sendMail({
    from: smtp.fromEmail,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
