const express = require("express");
const {

  getFormPage,
  updateFormPage,

} = require("./controller");


const router = express.Router();

// router.post("/create", uploadImage.single("image"), createAbout);
router.get("/", getFormPage);
// router.get("/:id", getSingleAbout);
router.put("/update",  updateFormPage);
// router.delete("/delete/:id", deleteAbout);

module.exports = router;
