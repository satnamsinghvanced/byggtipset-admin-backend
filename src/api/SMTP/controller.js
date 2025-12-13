const SmtpConfig = require("../../../models/SMTPConfig");

// Save SMTP (create OR update)
exports.saveSmtpConfig = async (req, res) => {
  try {
    const data = req.body;

    // Check if already exists
    let config = await SmtpConfig.findOne();

    if (config) {
      // Update existing config
      config = await SmtpConfig.findOneAndUpdate({}, data, { new: true });
    } else {
      // Create new config
      config = await SmtpConfig.create(data);
    }

    res.json({
      success: true,
      message: "SMTP settings saved successfully.",
      data: config,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save SMTP settings",
      error: error.message,
    });
  }
};

// Get SMTP details
exports.getSmtpConfig = async (req, res) => {
  try {
    const config = await SmtpConfig.findOne();

    res.json({
      success: true,
      data: config,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update SMTP only (PATCH)
exports.updateSmtpConfig = async (req, res) => {
  try {
    const data = req.body;

    const config = await SmtpConfig.findOneAndUpdate({}, data, {
      new: true,
      upsert: true, // if not exists, create
    });

    res.json({
      success: true,
      message: "SMTP settings updated successfully.",
      data: config,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update SMTP settings",
      error: error.message,
    });
  }
};
