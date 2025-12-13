const mongoose = require("mongoose");
const { Schema } = mongoose;

const leadTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      default : ""
    },
    price: {
      type: Number,
      required: true,
      default: 0, 
    },
    description: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeadType", leadTypeSchema);
