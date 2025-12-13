const FormBuilder = require("../../../models/forms");
const FormSelect = require("../../../models/formSelect");

exports.createForm = async (req, res) => {
  try {
    const form = new FormBuilder(req.body);
    await form.save();
    res.status(201).json({ success: true, form });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

exports.updateForm = async (req, res) => {
  try {
    const form = await FormBuilder.findByIdAndUpdate(req.query.id, req.body, {
      new: true,
    });
    res.status(200).json({ success: true, form });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

exports.getFormById = async (req, res) => {
  try {
    const form = await FormBuilder.findById(req.query.id);
    if (!form) return res.status(404).json({ msg: "Form not found" });
    res.json(form);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.getForm = async (req, res) => {
  try {
    const form = await FormBuilder.find();
    if (!form) return res.status(404).json({ msg: "Form not found" });
    res.json(form);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};    
exports.addStepToForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const { stepTitle, stepDescription, fields } = req.body;

    if (!stepTitle)
      return res.status(400).json({ success: false, msg: "Step Title required" });

    const formSelect = await FormSelect.findById(formId);
    if (!formSelect)
      return res.status(404).json({ success: false, msg: "FormSelect not found" });

    let form = await FormBuilder.findOne({ formId: formSelect._id });

    if (!form) {
      form = new FormBuilder({
        formName: formSelect.formTitle,
        description: formSelect.formDescription,
        formId: formSelect._id,
        steps: []
      });

      await form.save();
    }

    const step = {
      stepTitle,
      stepDescription,
      stepOrder: form.steps.length + 1,
      fields
    };

    form.steps.push(step);
    await form.save();

    return res.status(201).json({
      success: true,
      msg: "Step added successfully",
      data: form.steps
    });

  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};


// GET ALL STEPS OF A FORM
exports.getStepsOfForm = async (req, res) => {
  try {
    const { formId } = req.params;

    const form = await FormSelect.findById(formId);
    if (!form)
      return res.status(404).json({ success: false, msg: "Form not found" });
    const formSteps = await FormBuilder.findOne({formId:form._id});
    if (!formSteps){
      return res.status(404).json({ success: false, msg: "Form steps not found" });
    }

    return res.json({ success: true, data: formSteps });

  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};
exports.updateStep = async (req, res) => {
  try {
    const { formId, stepId } = req.params;
    const { stepTitle, stepDescription, stepOrder, fields } = req.body;

    // Fetch form
    const form = await FormBuilder.findOne({ formId: formId });
    if (!form)
      return res.status(404).json({ success: false, msg: "Form not found" });

    // Find step index
    const stepIndex = form.steps.findIndex(
      (s) => s._id.toString() === stepId
    );
    if (stepIndex === -1)
      return res.status(404).json({ success: false, msg: "Step not found" });

    const step = form.steps[stepIndex];

    // ===== Update Normal Fields =====
    if (stepTitle !== undefined) step.stepTitle = stepTitle;
    if (stepDescription !== undefined) step.stepDescription = stepDescription;
    if (fields !== undefined) step.fields = fields;

    // ===== Handle Step Order Swap =====
    if (stepOrder !== undefined && stepOrder !== step.stepOrder) {
      const targetOrder = stepOrder;

      // Find step that currently has the target order
      const otherStepIndex = form.steps.findIndex(
        (s) => s.stepOrder === targetOrder
      );

      if (otherStepIndex !== -1) {
        // Swap their stepOrder
        form.steps[otherStepIndex].stepOrder = step.stepOrder;
      }

      // Move updated step to new order
      step.stepOrder = targetOrder;

      // Re-sort steps by stepOrder for consistency
      form.steps.sort((a, b) => a.stepOrder - b.stepOrder);
    }

    await form.save();

    return res.json({
      success: true,
      msg: "Step updated successfully",
      steps: form.steps,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

exports.deleteStep = async (req, res) => {
  try {
    const { formId, stepId } = req.params;

    // Fetch form
    const form = await FormBuilder.findOne({ formId });
    if (!form)
      return res.status(404).json({ success: false, msg: "Form not found" });

    // Find step index
    const stepIndex = form.steps.findIndex((s) => s._id.toString() === stepId);
    if (stepIndex === -1)
      return res.status(404).json({ success: false, msg: "Step not found" });

    // Remove the step
    form.steps.splice(stepIndex, 1);

    // Reorder remaining steps sequentially
    form.steps = form.steps
      .sort((a, b) => a.stepOrder - b.stepOrder)
      .map((step, index) => ({ ...step.toObject(), stepOrder: index + 1 }));

    // Save form
    await form.save();

    return res.json({
      success: true,
      msg: "Step deleted successfully",
      steps: form.steps,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};
