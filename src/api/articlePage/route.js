const express = require("express");
const {

  getArticlePage,
  updateArticlePage,

} = require("./controller");


const router = express.Router();

// router.post("/create", uploadImage.single("image"), createAbout);
router.get("/", getArticlePage);
// router.get("/:id", getSingleAbout);
router.put("/update",  updateArticlePage);
// router.delete("/delete/:id", deleteAbout);

module.exports = router;
