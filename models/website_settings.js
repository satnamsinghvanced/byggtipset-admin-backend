const mongoose = require("mongoose");

const websiteSettingsSchema = new mongoose.Schema(
  {
    theme: {
      primary: { type: String, required: false, trim: true },
      primarylight: { type: String, required: false, trim: true },
      secondary: { type: String, required: false, trim: true },
      dark: { type: String, required: false, trim: true },
      accent: { type: String, required: false, trim: true },
      background: { type: String, required: false, trim: true },
      cardbg: { type: String, required: false, trim: true },
      navbarbg: { type: String, required: false, trim: true },
      footerbg: { type: String, required: false, trim: true },
      formsteps: { type: String, required: false, trim: true },
    },
    logos: {
      logo: { type: String, required: false, trim: true },
      logoDark: { type: String, trim: true },
      wordmark: { type: String, required: false, trim: true },
      wordmarkDark: { type: String, trim: true },
      lettermark: { type: String, trim: true },
      tagline: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WebsiteSettings", websiteSettingsSchema);
