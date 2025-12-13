const FormPage = require("../../../models/formPage");

exports.createFormPage = async (req, res) => {
  try {
    const { title, description,  ...restOfData } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required fields.",
      });
    }

    const existingForm = await FormPage.findOne({ title });
    if (existingForm) {
      return res.status(409).json({
        success: false,
        message: `Form page with title '${title}' already exists.`,
      });
    }

    const newFormPage = await FormPage.create({
      title,
      description,
      ...restOfData,
    });

    return res.status(201).json({
      success: true,
      message: "Form Page created successfully.",
      data: newFormPage,
    });
  } catch (error) {
    console.error("Error creating Form Page:", error);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while creating the Form page.",
    });
  }
};

exports.getFormPage = async (req, res) => {
  try {
    let page = await FormPage.findOne();

    // If no Form page exists → create one with default values
    if (!page) {
      page = await FormPage.create({
        title: "Forms",
        description: "This is the default Form page description.",
        questions: [], // add fields based on your schema
      });

      return res.status(201).json({
        success: true,
        message: "No Form page found, so a default one was created.",
        data: page,
      });
    }

    // If page exists → return it
    return res.status(200).json({
      success: true,
      message: "Form page fetched successfully.",
      data: page,
    });
  } catch (error) {
    console.error("Error fetching Form page:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching the Form page.",
    });
  }
};

exports.updateFormPage = async (req, res) => {
  try {
    const data = req.body;

    let Form = await FormPage.findOne();

    if (!Form) {
      Form = new FormPage({
        ...data,
      });
    } else {
      Object.assign(Form, {
        ...data,
      });
    }

    await Form.save();

    res.json({
      success: true,
      message: "Form page updated successfully",
      data: Form,
    });
  } catch (error) {
    console.error("Form update error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
