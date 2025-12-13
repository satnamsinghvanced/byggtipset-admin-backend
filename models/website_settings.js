const mongoose = require("mongoose");

const websiteSettingsSchema = new mongoose.Schema(
  {
    theme: {
      primary: { type: String, required: true, trim: true },
      primarylight: { type: String, required: true, trim: true },
      secondary: { type: String, required: true, trim: true },
      dark: { type: String, required: true, trim: true },
      accent: { type: String, required: true, trim: true },
      background: { type: String, required: true, trim: true },
      cardbg: { type: String, required: true, trim: true },
      navbarbg: { type: String, required: true, trim: true },
      footerbg: { type: String, required: true, trim: true },
      formsteps: { type: String, required: true, trim: true },
    },
    logos: {
      logo: { type: String, required: true, trim: true },
      logoDark: { type: String, trim: true },
      wordmark: { type: String, required: true, trim: true },
      wordmarkDark: { type: String, trim: true },
      lettermark: { type: String, trim: true },
      tagline: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WebsiteSettings", websiteSettingsSchema);
