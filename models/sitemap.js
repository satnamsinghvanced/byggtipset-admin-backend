const mongoose = require("mongoose");

const SitemapPageSchema = new mongoose.Schema({
  href: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
});

const SitemapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Sitemap",
    },
    description: {
      type: String,
      required: true,
    },
    pages: {
      type: [SitemapPageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sitemap", SitemapSchema);
