const mongoose = require("mongoose");

const FormSelectSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormBuilder",
    },
    formTitle: {
      type: String,
      required: true,
      trim: true,
    },
    formDescription: {
      type: String,
      default: "",
      trim: true,
    },
    formNumber:{
        type:Number,
        unique:true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,       
    },
  },
  { timestamps: true }  
);
FormSelectSchema.pre("save", async function (next) {
  if (!this.isNew) return next(); // Only on create

  const lastForm = await mongoose.model("FormSelect").findOne().sort({ formNumber: -1 });

  this.formNumber = lastForm ? lastForm.formNumber + 1 : 1000;

  next();
});
module.exports = mongoose.model("FormSelect", FormSelectSchema);
