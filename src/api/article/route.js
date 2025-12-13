const express = require("express");
const router = express.Router();
const uploadImage = require("../../../service/multer");
const {
  createArticle,
  getArticles,
  getSingleArticle,
  updateArticle,
  deleteArticle,
} = require("../article/controller");

router.post("/create", uploadImage.single("image"),  createArticle);

router.get("/", getArticles);

router.get("/:id", getSingleArticle);

router.put("/update/:id", uploadImage.single("image"), updateArticle);

router.delete("/delete/:id", deleteArticle);

module.exports = router;
