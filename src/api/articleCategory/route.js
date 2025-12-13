const express = require("express");
const {
  createArticleCategory,
  getArticleCategory,
  getSingleArticleCategory,
  updateArticleCategory,
  deleteArticleCategory,
  getCategoriesAll
} = require("../articleCategory/controller");

const router = express.Router();

router.post("/create", createArticleCategory);

router.get("/", getArticleCategory);
router.get("/all", getCategoriesAll);



router.get("/details/:id", getSingleArticleCategory);

router.put("/update/:id", updateArticleCategory);

router.delete("/delete/:id", deleteArticleCategory);

module.exports = router;
