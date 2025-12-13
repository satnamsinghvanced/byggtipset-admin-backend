const express = require("express");
const {

  getFaqPage,
  updateFaqPage,

} = require("./controller");


const router = express.Router();

// router.post("/create", uploadImage.single("image"), createAbout);
router.get("/", getFaqPage);
// router.get("/:id", getSingleAbout);
router.put("/update",  updateFaqPage);
// router.delete("/delete/:id", deleteAbout);

module.exports = router;
