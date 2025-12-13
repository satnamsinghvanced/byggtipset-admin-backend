const faqPage = require("../../../models/faqPage");

exports.createFaqPage = async (req, res) => {
  try {
    const { title, description, ...restOfData } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required fields.",
      });
    }

    const existingFaq = await faqPage.findOne({ title });
    if (existingFaq) {
      return res.status(409).json({
        success: false,
        message: `FAQ page with title '${title}' already exists.`,
      });
    }

    const newFaqPage = await faqPage.create({
      title,
      description,
      ...restOfData,
    });

    return res.status(201).json({
      success: true,
      message: "FAQ Page created successfully.",
      data: newFaqPage,
    });
  } catch (error) {
    console.error("Error creating FAQ Page:", error);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while creating the FAQ page.",
    });
  }
};

exports.getFaqPage = async (req, res) => {
  try {
    let page = await faqPage.findOne();

    // If no FAQ page exists → create one with default values
    if (!page) {
      page = await faqPage.create({
        title: "FAQ",
        description: "This is the default FAQ page description.",
        questions: [], // add fields based on your schema
      });

      return res.status(201).json({
        success: true,
        message: "No FAQ page found, so a default one was created.",
        data: page,
      });
    }

    // If page exists → return it
    return res.status(200).json({
      success: true,
      message: "FAQ page fetched successfully.",
      data: page,
    });
  } catch (error) {
    console.error("Error fetching FAQ page:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching the FAQ page.",
    });
  }
};

exports.updateFaqPage = async (req, res) => {
  try {
    const data = req.body;

    let faq = await faqPage.findOne();

    if (!faq) {
      faq = new faqPage({
        ...data,
      });
    } else {
      Object.assign(faq, {
        ...data,
      });
    }

    await faq.save();

    res.json({
      success: true,
      message: "FAQ page updated successfully",
      data: faq,
    });
  } catch (error) {
    console.error("FAQ update error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
