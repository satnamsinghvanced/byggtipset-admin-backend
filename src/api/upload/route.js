const express = require("express");
const router = express.Router();
const uploadImage = require("../../../service/multer");
const { uploadProfileImage } = require("./controller");
const {uploadCompanies} = require("./controller")
const {uploadPlaces } = require("./controller")


router.post(
  "/upload-profile",
  uploadImage.single("avatar"),
  uploadProfileImage
);
router.post(
  "/",
  uploadImage.single("image"),
  uploadProfileImage
);

router.post("/csv-companies", uploadImage.single("csv"), uploadCompanies);

router.post("/csv-places", uploadImage.single("csv"), uploadPlaces)

module.exports = router;