const express = require("express");

const adminRoutes = require("./admin/route");
const imageUpload = require("./upload/route");
const faqRoutes = require("./faq/route");
const categoryRoutes = require("./category/route");
const placeRoutes = require("./place/route");
const companiesRoutes = require("./companies/route");
const homepageRoutes = require("./homepage/route");
const articleCategoryRoutes = require("./articleCategory/route");
const articleRoutes = require("./article/route");
const aboutRoutes = require("./about/route");
const partnerRoutes = require("./partner/route");
const partnersRoute = require("./partners/route");
const countyRoutes = require("./county/route");
const formsRoutes = require("./forms/route");
const privacyPolicyRoutes = require("./privacyPolicy/route");
const termOfServiceRoutes = require("./termofservice/route");
const quoteRoutes = require("./quote/route");
const uploadCSV = require("./upload/route");
const emailTemplateRoutes = require("./email-templates/route");
const website_settingsRoutes = require("./website_settings/route");
const realEstateAgentRoutes = require("./realEstateAgent/route");
const footerRoutes = require("./footer/route");
const sitemapRoutes = require("./sitemap/route");
const contactUsRoutes = require("./contactUs/route");
const smtpRoutes = require("./SMTP/route");
const dashboardRoutes = require("./dashboard/route");
const leadLogsRoutes = require("./leadLogs/route");
const LeadTypesRoutes = require("./lead-type/route")
const FaqPageRoutes = require("./faqPage/route")
const articlePageRoutes = require("./articlePage/route")
const formPageRoutes = require("./formPage/route")
const formSelectRoutes = require("./FormSelect/route")


const router = express.Router();
router.use("/admin", adminRoutes);
router.use("/image", imageUpload);
router.use("/faq", faqRoutes);
router.use("/category", categoryRoutes);
router.use("/companies", companiesRoutes);
router.use("/places", placeRoutes);
router.use("/homepage", homepageRoutes);
router.use("/article-categories", articleCategoryRoutes);
router.use("/article", articleRoutes);
router.use("/about", aboutRoutes);
router.use("/partner", partnerRoutes);
router.use("/partners", partnersRoute);
router.use("/counties", countyRoutes);
router.use("/forms", formsRoutes);
router.use("/privacy-policy", privacyPolicyRoutes);
router.use("/term-of-service", termOfServiceRoutes);
router.use("/quote", quoteRoutes);
router.use("/email-templates", emailTemplateRoutes);
router.use("/upload", uploadCSV);
router.use("/website_settings", website_settingsRoutes);
router.use("/real-estate-agent", realEstateAgentRoutes);
router.use("/footer", footerRoutes);
router.use("/sitemap", sitemapRoutes);
router.use("/contact", contactUsRoutes);
router.use("/smtp" , smtpRoutes);
router.use("/dashboard" , dashboardRoutes);
router.use("/lead-logs", leadLogsRoutes);
router.use("/lead-type", LeadTypesRoutes);
router.use("/faq-page", FaqPageRoutes);
router.use("/article-page", articlePageRoutes);
router.use("/form-page", formPageRoutes);
router.use("/form-select", formSelectRoutes);
module.exports = router;
