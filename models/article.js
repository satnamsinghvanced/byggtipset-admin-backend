const mongoose = require("mongoose");
const seoDataSchema = require("./seoSettings");
const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    articlePosition: { type: Number },
    slug: { type: String, unique: true, required: true , trim:true },
    image: { type: String, required: true },
    excerpt: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "articleCategory",
      required: false,
    },
    showDate: {
      type: String,
      required: true,
      default: () => new Date().toISOString().split("T")[0],
    },
    articleTags: {
      type: [String],
      default: [],
    },
    // seo: {
    //   type: seoDataSchema,
    //   default: () => ({}),
    // },
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

module.exports = mongoose.model("Article", articleSchema);
