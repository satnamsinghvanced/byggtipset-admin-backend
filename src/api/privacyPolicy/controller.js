const PrivacyPolicy = require("../../../models/privacyPolicy");

exports.createPrivacyPolicy = async (req, res) => {
  try {
    const { title, description , ...restOfData } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required." });
    }

    const policy = await PrivacyPolicy.create({ title, description , ...restOfData});

    res.status(201).json({
      success: true,
      message: "Privacy Policy created successfully.",
      data: policy,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllPrivacyPolicies = async (req, res) => {
  try {
    const policies = await PrivacyPolicy.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Content fetched successfully.",
      data: policies,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPrivacyPolicyById = async (req, res) => {
  try {
    const policy = await PrivacyPolicy.findById(req.params.id);
    if (!policy) {
      return res
        .status(404)
        .json({ success: false, message: "Privacy Policy not found." });
    }
    res.status(200).json({
      success: true,
      message: "Content fetched successfully.",
      data: policy,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePrivacyPolicy = async (req, res) => {
  try {
    const { title, description, ...restOfData } = req.body;
    const { id } = req.params;

    let result;

    // 1. Check if we need to create a new document
    if (id === "new") {
      result = await PrivacyPolicy.create({
        title,
        description,
        ...restOfData,
      });
    } else {
      // 2. Otherwise, perform a standard update
      result = await PrivacyPolicy.findByIdAndUpdate(
        id,
        { title, description, ...restOfData },
        { new: true, runValidators: true }
      );
    }

    // 3. Handle cases where the ID provided wasn't found in DB
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: "Privacy Policy not found." 
      });
    }

    res.status(200).json({
      success: true,
      message: id === "new" ? "Privacy Policy created successfully." : "Privacy Policy updated successfully.",
      data: result,
    });
  } catch (err) {
    // Catch-all for MongoDB CastErrors (invalid ID formats)
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: "Invalid ID format provided." });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.deletePrivacyPolicy = async (req, res) => {
  try {
    const deleted = await PrivacyPolicy.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Privacy Policy not found." });
    }

    res.status(200).json({
      success: true,
      message: "Privacy Policy deleted successfully.",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
