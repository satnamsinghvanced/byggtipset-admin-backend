const express = require("express");
const {
  createTheme,
  getThemes,
  getThemeById,
  updateTheme,
  deleteTheme,
  uploadLogo,
} = require("../website_settings/controller");
const uploadImage = require("../../../service/multer");

const websiteSettingsRouter = express.Router();

websiteSettingsRouter.route("/").post(createTheme).get(getThemes);
websiteSettingsRouter.route("/details").get(getThemeById);

websiteSettingsRouter.route("/update").put(updateTheme);

websiteSettingsRouter.route("/delete").delete(deleteTheme);

websiteSettingsRouter.route("/upload-logo").put(
  uploadImage.fields([
    { name: "logo", maxCount: 1 },
    { name: "logoDark", maxCount: 1 },
    { name: "wordmark", maxCount: 1 },
    { name: "wordmarkDark", maxCount: 1 },
    { name: "lettermark", maxCount: 1 },
    { name: "tagline", maxCount: 1 },
  ]),
  uploadLogo
);

module.exports = websiteSettingsRouter;
