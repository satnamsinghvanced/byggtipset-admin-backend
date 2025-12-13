const express = require("express");
const router = express.Router();
const {
  getCompanies,
  getPlaces,
  getArticles,
  getCounties,
} = require("./controller");

router.get("/companies", getCompanies);
router.get("/places", getPlaces);
router.get("/articles", getArticles);
router.get("/counties", getCounties);


module.exports = router;