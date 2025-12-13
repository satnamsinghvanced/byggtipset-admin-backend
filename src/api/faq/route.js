const express = require("express");
const {
  createFAQ,
  getFAQs,
  getFAQById,
  updateFAQ,
  deleteFAQ,
} = require("./controller");

const router = express.Router();

router.post("/create", createFAQ);
router.get("/", getFAQs);
router.get("/detail", getFAQById);
router.put("/update", updateFAQ);
router.delete("/delete", deleteFAQ);

module.exports = router;
