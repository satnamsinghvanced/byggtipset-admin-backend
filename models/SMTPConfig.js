const mongoose = require("mongoose");

const smtpSchema = new mongoose.Schema(
  {
    host: { type: String, required: true },
    port: { type: Number, required: true },
    secure: { type: Boolean, default: false },
    user: { type: String, required: true },
    pass: { type: String, required: true },
    fromEmail: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SmtpConfig", smtpSchema);
