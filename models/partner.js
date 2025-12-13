const mongoose = require("mongoose");

const contactFieldSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    placeholder: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["text", "email", "tel", "textarea", "number"],
    },
    required: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const partnerSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true, trim: true },
    subHeading: { type: String, required: true, trim: true },
    contactFormTitle: { type: String, required: true, trim: true },
    buttonText: { type: String, trim: true },
    formText: { type: String, trim: true },
    contactFields: [contactFieldSchema],
    title: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    description: { type: String, required: true, trim: true },


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

module.exports = mongoose.model("Partner", partnerSchema);
