const mongoose = require("mongoose");

const partnerLimitSchema = new mongoose.Schema(
  {
    limit: {
      type: Number,
      default: 3,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PartnerLimit", partnerLimitSchema);
