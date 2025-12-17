const mongoose = require("mongoose")
const FooterSchema = new mongoose.Schema(
  {
    header: {
      title: { type: String,  },
      description: { type: String,  },
      button: { type: String,  },
      buttonLink: { type: String,  }, 
    },

    articles: [
      {
        title: { type: String,  },
        href: { type: String,  },
      },
    ],

    places: [
      {
        title: { type: String,  },
        href: { type: String,  },
      },
    ],

    companies: [
      {
        title: { type: String,  },
        href: { type: String, },
      },
    ],

    exploreLinks: [
      {
        text: { type: String, },
        href: { type: String,  },
      },
    ],

    socialLinks: [
      {
        icon: { type: String, }, 
        href: { type: String,  },
        newPage: { type: Boolean, default: false },
      },
    ],

    contactInfo: [
      {
        type: { type: String, enum: ["phone", "email", "location"],  },
        value: { type: String, required: false },
        href: { type: String, required: false },
        newPage: { type: Boolean, default: false },
      },
    ],

    footerLinks: [
      {
        text: { type: String, required: false },
        href: { type: String, required: false },
      },
    ],
    footerText:[
      {
        text: { type: String, required: false },
      },
    ],
    address:{
      text:{type:String , default: ""}
    }
  },
  { timestamps: false }
);

module.exports = mongoose.model("footer", FooterSchema);
