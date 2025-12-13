const express = require("express");
const {
  create,
  getCities,
  getCityById,
  update,
  deleteCity,
} = require("./controller");
const uploadImage = require("../../../service/multer");

const router = express.Router();

// Use `upload.fields` for multiple file fields
// Accept `image` and `icon` as separate file fields
const uploadFields = uploadImage.fields([
  { name: "image", maxCount: 1 },
  { name: "icon", maxCount: 1 },
]);

// Create City (with image + icon)
router.post("/create", uploadFields, create);

// Get all cities
router.get("/", getCities);

// Get city by ID
router.get("/detail/:id", getCityById);

// Update city (with image + icon)
router.put("/update/:id", uploadFields, update);

// Delete city
router.delete("/delete/:id", deleteCity);

module.exports = router;
