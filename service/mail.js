const nodemailer = require("nodemailer");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

// if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//   console.error("Missing email credentials. Please check your .env file.");
//   process.exit(1);
// }

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail(to, subject, templateName, replacements) {
  try {
    const templatePath = path.join(
      process.cwd(),
      "emailTemplates",
      templateName
    );
    let htmlContent = fs.readFileSync(templatePath, "utf-8");
    Object.keys(replacements).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      htmlContent = htmlContent.replace(regex, replacements[key]);
    });

    const mailOptions = {
      from: `"Meglertip" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      // templateName: templateName,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: error.message };
  }
}

module.exports = { sendMail };
