const mongoose = require("mongoose");
const seoDataSchema = require("./seoSettings");
const homePageSchema = new mongoose.Schema(
  {
    heroSection: {
      title: { type: String, trim: true },
      subtitle: { type: String, trim: true },
      backgroundImage: { type: String, trim: true },
      buttonText: { type: String, trim: true },
      ctaLink: { type: String, trim: true },
    },
    howDoesItworks: {
      heading: { type: String },
    },
    howDoesItworksCards: [
      {
        title: { type: String },
        icon: { type: String },
        description: { type: String },
      },
    ],
    ourArticlesHeading: {
      heading: { type: String },
    },
    articlesHeading: {
      heading: { type: String },
      buttonText: { type: String, trim: true },
      ctaLink: { type: String, trim: true },
    },
    whyChooseMeglertipHeading: {
      heading: { type: String },
    },
    whyChooseMeglertipCards: [
      {
        title: { type: String },
        icon: { type: String },
        description: { type: String },
      },
    ],

    citySectionHeading: {
      title: { type: String },
      description: { type: String },
      buttonText: { type: String, trim: true },
      ctaLink: { type: String, trim: true },

      locations: [
        {
          locationId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "citySectionHeading.locations.locationType",
          },
          locationType: {
            type: String,
            required: true,
            enum: ["County", "Place"], 
          },
          order: {
            type: Number, 
          },
        },
      ],
    },
    prosSection: [
      {
        title: { type: String },
        subHeading: { type: String },
        description: [{ type: String }],
        image: {
          type: String,
        },
        imagePosition: { type: String },
        buttonText: {
          type: String,
        },
      },
    ],
    faq: {
      title: { type: String },
    },
    //   seo: {
    //   type: seoDataSchema,
    //   default: () => ({}),
    // },
    seo: {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomePage", homePageSchema);
