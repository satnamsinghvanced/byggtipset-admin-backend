const express = require("express");
const router = express.Router();
const {
  createPrivacyPolicy,
  getAllPrivacyPolicies,
  getPrivacyPolicyById,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
} = require("../privacyPolicy/controller");

router.post("/create", createPrivacyPolicy);
router.get("/", getAllPrivacyPolicies);
router.get("/:id", getPrivacyPolicyById);
router.put("/update/:id", updatePrivacyPolicy);
router.delete("/delete/:id", deletePrivacyPolicy);

module.exports = router;
