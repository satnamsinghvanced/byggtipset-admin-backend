const mongoose = require("mongoose");
const seoDataSchema = require("./seoSettings");

const formPage = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    // seo: {
    //   type: seoDataSchema,
    //   default: () => ({}),
    // },
    multipleSelect :{type:Boolean,default:false},
    privacyText:{type:String,default:""},
    metaTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
    metaKeywords: { type: String, trim: true, default: "" },
    metaImage: { type: String, trim: true, default: "" },
    // categoriesHeading:{type: String, default:""},

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
module.exports = mongoose.model("formPage", formPage);
