const express = require("express");
const {
  createCounty,
  getCounties,
  getCountyById,
  updateCounty,
  deleteCounty,
  getCountiesForPlace
} = require("../county/controller");
const uploadImage = require("../../../service/multer");

const router = express.Router();


router.post("/create", uploadImage.single("icon"), createCounty);
router.get("/", getCounties);
router.get("/detail/:id", getCountyById);
router.get("/counties-for-place", getCountiesForPlace);
router.put("/update/:id", uploadImage.single("icon"), updateCounty);
router.delete("/delete/:id", deleteCounty);

module.exports = router;
