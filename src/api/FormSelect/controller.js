const FormSelect = require("../../../models/formSelect");
const partners = require("../../../models/partners");

exports.CreateFormSelect = async (req, res) => {
  try {
    const { formTitle, formDescription, price } = req.body;

    if (!formTitle) {
      return res.status(400).json({
        success: false,
        message: " Form Title is required",
      });
    }
    if (!price) {
      return res.status(400).json({
        success: false,
        message: " Price is required",
      });
    }
    const newForm = await FormSelect.create({
      formTitle,
      formDescription,
      price,
    });
    await partners.updateMany(
      {},
      {
        $addToSet: {
          leadTypes: {
            typeId: newForm._id,
            name: newForm.formTitle,
            price: newForm.price,
          },
        },
      }
    );
    res.status(201).json({
      success: true,
      message: "Form created successfully",
      data: newForm,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.GetAllForms = async (req, res) => {
  try {
    const forms = await FormSelect.find().sort({ formNumber: 1 });

    res.status(200).json({
      success: true,
      data: forms,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.GetSingleForm = async (req, res) => {
  try {
    const form = await FormSelect.findById(req.params.id);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    res.status(200).json({
      success: true,
      data: form,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.UpdateFormSelect = async (req, res) => {
  try {
    const { formTitle, formDescription, price } = req.body;

    if (!formTitle) {
      return res.status(400).json({
        success: false,
        message: " Form Title is required",
      });
    }
    if (!price) {
      return res.status(400).json({
        success: false,
        message: " Price is required",
      });
    }
    const updated = await FormSelect.findByIdAndUpdate(
      req.params.id,
      { formTitle, formDescription, price },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }
    await partners.updateMany(
      { "leadTypes.typeId": updated._id },
      {
        $set: {
          "leadTypes.$[elem].name": updated.formTitle,
          "leadTypes.$[elem].price": updated.price,
        },
      },
      {
        arrayFilters: [{ "elem.typeId": updated._id }],
      }
    );
    res.status(200).json({
      success: true,
      message: "Form updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.DeleteForm = async (req, res) => {
  try {
    const deleted = await FormSelect.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Form deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
