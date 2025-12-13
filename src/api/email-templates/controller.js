const EmailTemplate = require("../../../models/email-templates");

exports.createEmailTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.create(req.body);
    return res.status(201).json({ success: true, data: template });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: error.message || "Bad Request" });
  }
};

exports.getEmailTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplate.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: templates });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server Error" });
  }
};

exports.getEmailTemplateById = async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.query.id);
    if (!template) {
      return res
        .status(404)
        .json({ success: false, message: "Template not found" });
    }
    return res.json({ success: true, data: template });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: error.message || "Bad Request" });
  }
};

exports.updateEmailTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findByIdAndUpdate(
      req.query.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!template) {
      return res
        .status(404)
        .json({ success: false, message: "Template not found" });
    }

    return res.json({ success: true, data: template });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: error.message || "Bad Request" });
  }
};
exports.defaultEmailTemplate = async (req, res) => {
  try {
    const { id } = req.query;

    // First, deactivate every other template
    await EmailTemplate.updateMany(
      { _id: { $ne: id }, isActive: true },
      { $set: { isActive: false } }
    );

    // Then activate the selected template
    const template = await EmailTemplate.findByIdAndUpdate(
      id,
      { isActive: true },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!template) {
      return res
        .status(404)
        .json({ success: false, message: "Template not found" });
    }

    return res.json({ success: true, data: template });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: error.message || "Bad Request" });
  }
};
exports.deleteEmailTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findByIdAndDelete(req.query.id);
    if (!template) {
      return res
        .status(404)
        .json({ success: false, message: "Template not found" });
    }
    return res.json({ success: true, message: "Template deleted" });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: error.message || "Bad Request" });
  }
};



