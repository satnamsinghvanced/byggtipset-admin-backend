const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    ip: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactUs", contactSchema);
