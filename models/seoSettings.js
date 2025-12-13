const mongoose = require("mongoose");


// const breadcrumbSchema = new mongoose.Schema(
//   {
//     label: { type: String, trim: true },
//     url: { type: String, trim: true },
//   },
//   { _id: false }
// );

const seoDataSchema = new mongoose.Schema(
  {
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

    // customHead: { type: String, default: "" },

    // redirect: {
    //   enabled: { type: Boolean, default: false },
    //   from: { type: String, trim: true },
    //   to: { type: String, trim: true },
    //   type: { type: Number, enum: [301, 302], default: 301 },
    // },

    // breadcrumbs: [breadcrumbSchema],

    // includeInSitemap: { type: Boolean, default: true },
    // priority: { type: Number, default: 0.7, min: 0.0, max: 1.0 },
    // changefreq: {
    //   type: String,
    //   enum: ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"],
    //   default: "weekly",
    // },

    // isScheduled: { type: Boolean, default: false },
    // scheduledPublishDate: { type: Date },

    // isDeleted: { type: Boolean, default: false },
    // isHidden: { type: Boolean, default: false },
  },
  { _id: false } 
);

module.exports = seoDataSchema;