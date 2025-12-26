const express = require("express");
const { getDashboardStats, totalLeads } = require("./controller");
const auth = require("../../../middleware/middleware");

const router = express.Router();

router.get("/stats", auth, getDashboardStats);

router.get("/total-leads", auth, totalLeads);

module.exports = router;
