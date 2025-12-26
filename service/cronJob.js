const cron = require("node-cron");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const user = require("../models/user");
const SmtpConfig = require("../models/SMTPConfig");
const emailTemplates = require("../models/email-templates");
const nodemailer = require("nodemailer");
const partners = require("../models/partners");

const BASE_URL = process.env.API_BASE_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const SITEMAP_PATH = process.env.SITEMAP_PATH;

if (!SITEMAP_PATH) {
  throw new Error("❌ SITEMAP_PATH is not defined in .env");
}

async function generateSitemap() {
  try {
    const [companyRes, articleRes, placesRes, countiesRes] = await Promise.all([
      axios.get(`${BASE_URL}/api/sitemap/companies`),
      axios.get(`${BASE_URL}/api/sitemap/articles`),
      axios.get(`${BASE_URL}/api/sitemap/places`),
      axios.get(`${BASE_URL}/api/sitemap/counties`),
    ]);

    const companies = companyRes?.data?.data || [];
    const articles = articleRes?.data?.data || [];
    const places = placesRes?.data?.data || [];
    const counties = countiesRes?.data?.data || [];

    const companyUrls = companies.map(
      (c) => `${FRONTEND_URL}/eiendomsmegler/${c.slug}`
    );

    const placesUrls = places.map(
      (p) => `${FRONTEND_URL}/eiendomsmegler/${p.slug}`
    );

    const countiesUrls = counties.map(
      (c) => `${FRONTEND_URL}/eiendomsmegler?county=${c.slug}`
    );

    const articleUrls = articles.map(
      (a) => `${FRONTEND_URL}/articles/${a.categoryId?.slug}/${a.slug}`
    );

    const now = new Date().toISOString();

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    const staticUrls = [
      "",
      "/about",
      "/eiendomsmegler",
      "/partner",
      "/faq",
      "/form",
    ];

    const addUrl = (loc, freq, priority) => {
      sitemapXml += `
  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    };

    staticUrls.forEach((url) =>
      addUrl(`${FRONTEND_URL}${url}`, "weekly", "0.8")
    );

    companyUrls.forEach((url) => addUrl(url, "daily", "0.9"));
    articleUrls.forEach((url) => addUrl(url, "daily", "0.9"));
    placesUrls.forEach((url) => addUrl(url, "daily", "0.9"));
    countiesUrls.forEach((url) => addUrl(url, "daily", "0.9"));

    sitemapXml += `\n</urlset>`;

    fs.writeFileSync(SITEMAP_PATH, sitemapXml, "utf8");

    console.log("✅ Sitemap updated:", SITEMAP_PATH);
  } catch (error) {
    console.error("❌ Sitemap generation failed:", error.message);
  }
}

cron.schedule("0 1 * * *", () => {
  console.log("⏳ Running daily sitemap cron...");
  generateSitemap();
});

generateSitemap();

cron.schedule("0 0 * * *", async () => {
  console.log("Cron job started at:", new Date().toISOString());

  try {
    const threeWeeksAgoStart = new Date();
    threeWeeksAgoStart.setDate(threeWeeksAgoStart.getDate() - 21);
    threeWeeksAgoStart.setHours(0, 0, 0, 0);

    const threeWeeksAgoEnd = new Date();
    threeWeeksAgoEnd.setDate(threeWeeksAgoEnd.getDate() - 21);
    threeWeeksAgoEnd.setHours(23, 59, 59, 999);

    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    const lastDayStart = new Date(
      Date.UTC(
        yesterday.getUTCFullYear(),
        yesterday.getUTCMonth(),
        yesterday.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );

    const lastDayEnd = new Date(
      Date.UTC(
        yesterday.getUTCFullYear(),
        yesterday.getUTCMonth(),
        yesterday.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );

    console.log(
      "Fetching leads created yesterday:",
      lastDayStart,
      "-",
      lastDayEnd
    );
    const leads = await user.find({
      createdAt: { $gte: lastDayStart, $lte: lastDayEnd },
      status: "Complete",
    });
    console.log(`Found ${leads.length} lead(s)`);

    if (leads.length === 0)
      return console.log("No leads to send email to today.");

    console.log("Fetching active SMTP configuration...");
    const smtpConfig = await SmtpConfig.findOne();
    if (!smtpConfig) throw new Error("No active SMTP configuration found");
    console.log("SMTP configuration found:", smtpConfig.host);

    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass,
      },
    });

    console.log("Fetching active email template...");
    const template = await emailTemplates.findOne({
      name: "Response from lead after 3 weeks",
    });
    if (!template) throw new Error("No active email template found");
    console.log("Email template found:", template.name);

    for (const lead of leads) {
      const emailBody = fillTemplate(template.body, lead);
      console.log("Sending email to:", lead.dynamicFields[0].values.email);
      await transporter.sendMail({
        from: smtpConfig.fromEmail,
        to: lead.dynamicFields[0].values.email,
        subject: template.subject,
        html: emailBody,
      });
      console.log(
        `Email successfully sent to ${lead.dynamicFields[0].values.email}`
      );
    }

    console.log("Cron job finished successfully at:", new Date().toISOString());
  } catch (err) {
    console.error("Error in cron job:", err);
  }
});
function fillTemplate(templateBody, lead) {
  let body = templateBody;

  // Replace placeholders
  body = body.replace(
    /{{name}}/g,
    lead.dynamicFields?.[0]?.values?.name || "Lead"
  );
  body = body.replace(/{{id}}/g, lead.uniqueId || "");
  body = body.replace(
    /{{buttonLink}}/g,
    `https://docs.google.com/forms/d/e/1FAIpQLSfC7vn3ztpbPhhVwEAC0sa1Mo8O4sDaFYXb9vPpzRgp5Tsk_g/viewform `
  );

  return body;
}

cron.schedule(
  "2 0 1 * *",
  async () => {
    console.log("🇳🇴 Monthly partner lead reset (Norway time)");

    await partners.updateMany({}, [
      {
        $set: {
          "leads.lastMonth": "$leads.currentMonth",
          "leads.currentMonth": 0,
          "leads.lastReset": new Date(),
        },
      },
    ]);
  },
  {
    timezone: "Europe/Oslo",
  }
);
