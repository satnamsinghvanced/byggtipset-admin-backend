const Website_Settings = require("../../../models/website_settings");

const sendErrorResponse = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({ success: false, message });
};

const sendSuccessResponse = (res, message, data, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, data });
};

const handleValidationError = (error, res) => {
  if (error.name === "ValidationError") {
    const errorMessages = Object.values(error.errors).map((err) => err.message);
    return sendErrorResponse(res, errorMessages.join(", "), 400);
  }
  sendErrorResponse(res, error.message);
};

const checkRequiredFields = (fields, body) => {
  const missingFields = fields.filter((field) => !body[field]);
  if (missingFields.length > 0) {
    return `The following fields are required: ${missingFields.join(", ")}`;
  }
  return null;
};

const updateThemeFields = (existingTheme, body) => {
  const updatedTheme = { ...existingTheme };

  const themeFields = [
    "primary",
    "primarylight",
    "secondary",
    "dark",
    "accent",
    "background",
    "cardbg",
    "navbarbg",
    "footerbg",
    "formsteps",
  ];

  themeFields.forEach((field) => {
    if (body.theme && body.theme[field]) {
      updatedTheme.theme[field] = body.theme[field];
    }
  });

  const logoFields = [
    "logo",
    "logoDark",
    "wordmark",
    "wordmarkDark",
    "lettermark",
    "tagline",
  ];

  logoFields.forEach((field) => {
    if (body.logos && body.logos[field]) {
      updatedTheme.logos[field] = body.logos[field];
    }
  });

  return updatedTheme;
};

exports.createTheme = async (req, res) => {
  try {
    const { theme, logos } = req.body;

    if (!theme || !logos) {
      return sendErrorResponse(
        res,
        "Both theme and logos must be provided",
        400
      );
    }

    const requiredFieldsMessage = checkRequiredFields(
      [
        "primary",
        "primarylight",
        "secondary",
        "dark",
        "accent",
        "background",
        "cardbg",
        "navbarbg",
        "footerbg",
        "formsteps",
      ],
      theme
    );
    if (requiredFieldsMessage) {
      return sendErrorResponse(res, requiredFieldsMessage, 400);
    }

    const newTheme = await Website_Settings.create({ theme, logos });
    sendSuccessResponse(
      res,
      "Theme and logos created successfully.",
      [newTheme],
      201
    );
  } catch (error) {
    handleValidationError(error, res);
  }
};

exports.getThemes = async (req, res) => {
  try {
    const themes = await Website_Settings.findOne({});
    sendSuccessResponse(
      res,
      "All themes and logos fetched successfully.",
      themes
    );
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

exports.getThemeById = async (req, res) => {
  try {
    const theme = await Website_Settings.findById(req.query.id);
    if (!theme) return sendErrorResponse(res, "Theme not found", 404);
    sendSuccessResponse(res, "Theme fetched successfully.", theme);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};
// ... existing helper functions ...

exports.updateTheme = async (req, res) => {
  try {
    const id = req.params.id || req.query.id;
    let settings;

    // Fix: Handle the "new" case properly for the first-ever save
    if (id === "new" || !id) {
      settings = new Website_Settings({ theme: req.body, logos: {} });
    } else {
      settings = await Website_Settings.findById(id);
    }

    if (!settings) return sendErrorResponse(res, "Theme settings not found", 404);

    if (!settings.theme) settings.theme = {};
    
    // Merge new colors into the existing theme object
    Object.keys(req.body).forEach((key) => {
      settings.theme[key] = req.body[key];
    });

    const saved = await settings.save();
    sendSuccessResponse(res, "Theme saved successfully.", saved);
  } catch (error) {
    if (error.name === "CastError") return sendErrorResponse(res, "Invalid ID format", 400);
    handleValidationError(error, res);
  }
};

exports.uploadLogo = async (req, res) => {
  try {
    const id = req.query.id || req.params.id;
    if (!id) return sendErrorResponse(res, "Theme ID required", 400);

    const theme = await Website_Settings.findById(id);
    if (!theme) return sendErrorResponse(res, "Theme not found", 404);

    // Update image paths from Multer
    if (req.files?.logo) theme.logos.logo = req.files.logo[0].path;
    if (req.files?.logoDark) theme.logos.logoDark = req.files.logoDark[0].path;
    if (req.files?.lettermark) theme.logos.lettermark = req.files.lettermark[0].path;
    if (req.files?.tagline) theme.logos.tagline = req.files.tagline[0].path;

    // Handle Wordmark (File or Text)
    if (req.files?.wordmark) {
      theme.logos.wordmark = req.files.wordmark[0].path;
    } else if (req.body.wordmarkText) {
      theme.logos.wordmark = req.body.wordmarkText;
    }

    if (req.files?.wordmarkDark) {
      theme.logos.wordmarkDark = req.files.wordmarkDark[0].path;
    } else if (req.body.wordmarkDarkText) {
      theme.logos.wordmarkDark = req.body.wordmarkDarkText;
    }

    await theme.save();
    sendSuccessResponse(res, "Logos updated successfully.", theme);
  } catch (error) {
    handleValidationError(error, res);
  }
};
exports.deleteTheme = async (req, res) => {
  try {
    const theme = await Website_Settings.findByIdAndDelete(req.query.id);
    if (!theme) return sendErrorResponse(res, "Theme not found", 404);
    sendSuccessResponse(res, "Theme deleted successfully.", theme);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

// exports.uploadLogo = async (req, res) => {
//   try {
//     if (!req.files && Object.keys(req.body).length === 0) {
//       return sendErrorResponse(res, "No data provided", 400);
//     }
//     const theme = await Website_Settings.findById(req.query.id);
//     if (!theme) return sendErrorResponse(res, "Theme not found", 404);
//     if (req.files?.logo) {
//       theme.logos.logo = req.files.logo[0].path;
//     }
//     if (req.files?.logoDark) {
//       theme.logos.logoDark = req.files.logoDark[0].path;
//     }
//     if (req.files?.wordmark) {
//       theme.logos.wordmark = req.files.wordmark[0].path;
//     } else if (req.body.wordmarkText) {
//       theme.logos.wordmark = req.body.wordmarkText;
//       t;
//     }
//     if (req.files?.wordmarkDark) {
//       theme.logos.wordmarkDark = req.files.wordmarkDark[0].path;
//     } else if (req.body.wordmarkDarkText) {
//       theme.logos.wordmarkDark = req.body.wordmarkDarkText;
//     }
//     if (req.files?.lettermark) {
//       theme.logos.lettermark = req.files.lettermark[0].path;
//     }
//     if (req.files?.tagline) {
//       theme.logos.tagline = req.files.tagline[0].path;
//     }
//     await theme.save();
//     sendSuccessResponse(res, "Logos updated successfully.", theme);
//   } catch (error) {
//     handleValidationError(error, res);
//   }
// };
