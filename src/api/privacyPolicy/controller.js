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

    const updated = await PrivacyPolicy.findByIdAndUpdate(
      req.params.id,
      { title, description, ...restOfData },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Privacy Policy not found." });
    }

    res.status(200).json({
      success: true,
      message: "Privacy Policy updated successfully.",
      data: updated,
    });
  } catch (err) {
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
