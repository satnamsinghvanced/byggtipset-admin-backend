const mongoose = require("mongoose");
const slugify = require("slugify");
const seoDataSchema = require("./seoSettings");
const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    companyImage: {
      type: String,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    description: {
      type: String,
    },
    extractor: {
      type: [String],
    },
    brokerSites: {
      type: [String],
    },
    websiteAddress: {
      type: String,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRating: {
      type: Number,
      default: 0,
    },
    isRecommended: {
      type: Boolean,
      default: false,
    },
    features: { type: [String] },
    // 
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
companySchema.pre("save", function (next) {
  if (this.isModified("companyName") || !this.slug) {
    this.slug = slugify(this.companyName, { lower: true, strict: true });
  }
  next();
});
module.exports = mongoose.model("Company", companySchema);
