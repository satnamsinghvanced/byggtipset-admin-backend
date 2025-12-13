const express = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("./controller");

const router = express.Router();

router.post("/create", createCategory);
router.get("/", getCategories);
router.get("/detail", getCategoryById);
router.put("/update", updateCategory);
router.delete("/delete", deleteCategory);

module.exports = router;
