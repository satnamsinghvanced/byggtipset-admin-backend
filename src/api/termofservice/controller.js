const TermOfService = require("../../../models/termofservice");

exports.createTermOfService = async (req, res) => {
  try {
    const { title, description , ...restOfData} = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required." });
    }

    const policy = await TermOfService.create({ title, description ,...restOfData});

    res.status(201).json({
      success: true,
      message: "Term of service created successfully.",
      data: policy,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllTermOfService = async (req, res) => {
  try {
    const policies = await TermOfService.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Content fetched successfully.",
      data: policies,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTermOfServiceId = async (req, res) => {
  try {
    const policy = await TermOfService.findById(req.params.id);
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

exports.updateTermOfService = async (req, res) => {
  try {
    const { title, description, ...restOfData } = req.body;

    const updated = await TermOfService.findByIdAndUpdate(
      req.params.id,
      { title, description, ...restOfData },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Term of service not found." });
    }

    res.status(200).json({
      success: true,
      message: "Term of service updated successfully.",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteTermOfService = async (req, res) => {
  try {
    const deleted = await TermOfService.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Term of service not found." });
    }

    res.status(200).json({
      success: true,
      message: "Term of service deleted successfully.",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
