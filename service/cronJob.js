const cron = require("node-cron");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.API_BASE_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const SITEMAP_PATH = process.env.SITEMAP_PATH;

if (!SITEMAP_PATH) {
  throw new Error("❌ SITEMAP_PATH is not defined in .env");
}

async function generateSitemap() {
  try {
    const [companyRes, articleRes, placesRes, countiesRes] =
      await Promise.all([
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

// Run once on startup
generateSitemap();
