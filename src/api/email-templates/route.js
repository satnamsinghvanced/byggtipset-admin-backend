const express = require("express");
const {
  createEmailTemplate,
  getEmailTemplates,
  getEmailTemplateById,
  updateEmailTemplate,
  deleteEmailTemplate,
  defaultEmailTemplate,
} = require("./controller");

const router = express.Router();

router.post("/", createEmailTemplate);

router.get("/", getEmailTemplates);

router.get("/detail", getEmailTemplateById);

router.put("/update", updateEmailTemplate);

router.delete("/delete", deleteEmailTemplate);

router.patch("/default-email-template", defaultEmailTemplate);

module.exports = router;
