const mongoose = require("mongoose");
const Counter = require("./counter");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    uniqueId: {
      type: Number,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Complete", "Archive", "Reject"],
      default: "Pending",
      required: true,
    },
    profit: {
      type: Number,
      default: 0,
    },
    partnerIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "CollaboratePartners",
      },
    ],

    ip: {
      type: String,
      trim: true,
    },

    dynamicFields: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { model: "User" },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    this.uniqueId = counter.count;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
