const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  label: { type: String, required: true, default: "" },
  name: { type: String, required: true, default: "" },
  type: { type: String, required: true, default: "text" },
  placeholder: { type: String, default: "" },
  required: { type: Boolean, default: false },
  options: { type: [String], default: [] },
  visible: { type: Boolean, default: true },
});

const StepSchema = new mongoose.Schema({
  stepTitle: { type: String, required: true, default: "" },
  stepOrder: { type: Number, required: true },
  fields: { type: [FieldSchema], default: [] },
  visible: { type: Boolean, default: true },
});

const FormSchema = new mongoose.Schema(
  {
    formName: { type: String, required: true, default: "" },
    description: { type: String, default: "" },
    steps: { type: [StepSchema], default: [] },
    isActive: { type: Boolean, default: true },
    formId: { type: mongoose.Schema.Types.ObjectId, ref: "FormSelect" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FormBuilder", FormSchema);
