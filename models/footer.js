const mongoose = require("mongoose")
const FooterSchema = new mongoose.Schema(
  {
    header: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      button: { type: String, required: true },
      buttonLink: { type: String, required: true }, 
    },

    articles: [
      {
        title: { type: String, required: true },
        href: { type: String, required: true },
      },
    ],

    places: [
      {
        title: { type: String, required: true },
        href: { type: String, required: true },
      },
    ],

    companies: [
      {
        title: { type: String, required: true },
        href: { type: String, required: true },
      },
    ],

    exploreLinks: [
      {
        text: { type: String, required: true },
        href: { type: String, required: true },
      },
    ],

    socialLinks: [
      {
        icon: { type: String, required: false }, 
        href: { type: String, required: true },
        newPage: { type: Boolean, default: false },
      },
    ],

    contactInfo: [
      {
        type: { type: String, enum: ["phone", "email", "location"], required: true },
        value: { type: String, required: true },
        href: { type: String, required: true },
        newPage: { type: Boolean, default: false },
      },
    ],

    footerLinks: [
      {
        text: { type: String, required: true },
        href: { type: String, required: true },
      },
    ],
    footerText:[
      {
        text: { type: String, required: true },
      },
    ],
    address:{
      text:{type:String , default: ""}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("footer", FooterSchema);
