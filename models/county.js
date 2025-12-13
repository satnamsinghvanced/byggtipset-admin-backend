const mongoose = require("mongoose");

const countySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
    },
    excerpt: { type: String },
    icon: { type: String },
    companies: [
      {
        companyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Company",
          required: true,
        },
        rank: {
          type: Number,
          default: 0, // order inside this place
        },
        isRecommended: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("County", countySchema);
