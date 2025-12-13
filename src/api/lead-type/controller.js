const LeadType = require("../../../models/leadType");

exports.getAllLeadTypes = async (req, res) => {
  try {
    const leadTypes = await LeadType.find();
    res.json({ success: true, data: leadTypes });
  } catch (err) {
    console.error("Error fetching lead types:", err);
    res.status(500).json({ success: false, message: "Failed to fetch lead types" });
  }
};


exports.getLeadTypeById = async (req, res) => {
  try {
    const leadType = await LeadType.findById(req.params.id);
    if (!leadType) {
      return res.status(404).json({ success: false, message: "Lead type not found" });
    }
    res.json({ success: true, data: leadType });
  } catch (err) {
    console.error("Error fetching lead type:", err);
    res.status(500).json({ success: false, message: "Failed to fetch lead type" });
  }
};


exports.createLeadType = async (req, res) => {
  try {
    const { name, defaultPrice, description } = req.body;
    const existing = await LeadType.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: "Lead type already exists" });
    }

    const leadType = await LeadType.create({ name, defaultPrice, description });
    res.status(201).json({ success: true, message: "Lead type created", data: leadType });
  } catch (err) {
    console.error("Error creating lead type:", err);
    res.status(500).json({ success: false, message: "Failed to create lead type" });
  }
};


exports.updateLeadType = async (req, res) => {
  try {
    const { name, defaultPrice, description } = req.body;
    const leadType = await LeadType.findByIdAndUpdate(
      req.params.id,
      { name, defaultPrice, description },
      { new: true, runValidators: true }
    );
    if (!leadType) {
      return res.status(404).json({ success: false, message: "Lead type not found" });
    }
    res.json({ success: true, message: "Lead type updated", data: leadType });
  } catch (err) {
    console.error("Error updating lead type:", err);
    res.status(500).json({ success: false, message: "Failed to update lead type" });
  }
};


exports.deleteLeadType = async (req, res) => {
  try {
    const leadType = await LeadType.findByIdAndDelete(req.params.id);
    if (!leadType) {
      return res.status(404).json({ success: false, message: "Lead type not found" });
    }
    res.json({ success: true, message: "Lead type deleted", data: leadType });
  } catch (err) {
    console.error("Error deleting lead type:", err);
    res.status(500).json({ success: false, message: "Failed to delete lead type" });
  }
};
