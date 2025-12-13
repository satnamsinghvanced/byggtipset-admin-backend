const express = require("express");
const {
  createAbout,
  getAbout,
  getSingleAbout,
  updateAbout,
  deleteAbout,
} = require("../about/controller");
const uploadImage = require("../../../service/multer");

const router = express.Router();

router.post("/create", uploadImage.single("image"), createAbout);
router.get("/", getAbout);
router.get("/:id", getSingleAbout);
router.put("/update", uploadImage.single("image"), updateAbout);
router.delete("/delete/:id", deleteAbout);

module.exports = router;
