const express = require("express");
const { getAllLeads,getLeadById,updateLeadStatus,updateLeadProfit, getPartnerLeadInvoiceSummary,updateLeadPartnerPrice, getLeadByPartnerName } = require("./controller");

const router = express.Router();

router.get("/all", getAllLeads);
router.get("/details/:id", getLeadById);
router.get("/partner-leads", getLeadByPartnerName);
router.get("/partner-summary", getPartnerLeadInvoiceSummary);
router.patch("/status", updateLeadStatus);
router.patch("/update-profit", updateLeadProfit);
router.patch("/update-partner-profit", updateLeadPartnerPrice);


module.exports = router;
