const express = require("express");
const { getDashboardStats,totalLeads } = require("./controller");

const router = express.Router();

router.get("/stats", getDashboardStats);

router.get("/total-leads", totalLeads)

module.exports = router;
