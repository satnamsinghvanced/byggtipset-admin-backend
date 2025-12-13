const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    heading: { type: String, trim: true, required: true },
    subHeading: { type: String, trim: true, required: true },
    image: { type: String, trim: true, required: true },

    heading1: { type: String, trim: true, required: true },
    subHeading1: { type: String, trim: true, required: true },
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

    // slug: { type: String, trim: true, unique: true },

    // redirect: {
    //   enabled: { type: Boolean, default: false },
    //   from: { type: String, trim: true },
    //   to: { type: String, trim: true },
    //   type: { type: Number, enum: [301, 302], default: 301 },
    // },

    // breadcrumbs: [
    //   {
    //     label: { type: String, trim: true },
    //     url: { type: String, trim: true },
    //   }
    // ],

    // includeInSitemap: { type: Boolean, default: true },
    // priority: { type: Number, default: 0.7 },      
    // changefreq: { type: String, default: "weekly" }, 

    // isScheduled: { type: Boolean, default: false },
    // scheduledPublishDate: { type: Date },

    // isDeleted: { type: Boolean, default: false },
    // isHidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", aboutSchema);
