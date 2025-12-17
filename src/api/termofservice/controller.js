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
    const { id } = req.params;

    let result;

    if (id === "new") {
      // 1. Logic for creating a new document if ID is "new"
      result = await TermOfService.create({
        title,
        description,
        ...restOfData,
      });
    } else {
      // 2. Logic for updating an existing document
      result = await TermOfService.findByIdAndUpdate(
        id,
        { title, description, ...restOfData },
        { new: true, runValidators: true }
      );
    }

    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: "Term of service record not found." 
      });
    }

    res.status(200).json({
      success: true,
      message: id === "new" ? "Created successfully." : "Updated successfully.",
      data: result,
    });
  } catch (err) {
    // If the error is a cast error (invalid ID format), send a clearer message
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: "Invalid ID format." });
    }
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
