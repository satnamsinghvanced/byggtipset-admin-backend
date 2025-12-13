const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    countyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "County",
      required: true,
    },
    slug: { type: String, required: true },
    excerpt: { type: String },
    title: { type: String },
    description: { type: String },
    icon: { type: String },
    isRecommended: { type: Boolean, default: false },
    rank: { type: Number, default: 0 },
    companies: [
      {
        companyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Company",
          required: true,
        },
        rank: {
          type: Number,
          default: 0, // order inside this place
        },
        isRecommended: {
          type: Boolean,
          default: false,
        },
      },
    ],

    metaTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
    metaKeywords: { type: String, trim: true, default: "" },
    metaImage: { type: String, trim: true, default: "" },
    canonicalUrl: { type: String, trim: true, default: "" },
    jsonLd: { type: String, default: "" },

    ogTitle: { type: String, trim: true, default: "" },
    ogDescription: { type: String, trim: true, default: "" },
    ogImage: { type: String, trim: true, default: "" },
    ogType: { type: String, trim: true, default: "website" },

    publishedDate: { type: Date },
    lastUpdatedDate: { type: Date },
    showPublishedDate: { type: Boolean, default: false },
    showLastUpdatedDate: { type: Boolean, default: false },

    robots: {
      noindex: { type: Boolean, default: false },
      nofollow: { type: Boolean, default: false },
      noarchive: { type: Boolean, default: false },
      nosnippet: { type: Boolean, default: false },
      noimageindex: { type: Boolean, default: false },
      notranslate: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Places", placeSchema);
