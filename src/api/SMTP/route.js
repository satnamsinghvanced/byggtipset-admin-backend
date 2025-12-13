const express = require("express");
const {
  saveSmtpConfig,
  getSmtpConfig,
  updateSmtpConfig,
} = require("./controller");

const router = express.Router();

router.post("/save-smtp", saveSmtpConfig);

router.get("/", getSmtpConfig);

router.put("/update-smtp", updateSmtpConfig);

module.exports = router;
