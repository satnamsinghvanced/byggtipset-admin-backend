const articlePage = require("../../../models/articlePage");

exports.createArticlePage = async (req, res) => {
  try {
    const { title, description,  ...restOfData } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required fields.",
      });
    }

    const existingArticle = await articlePage.findOne({ title });
    if (existingArticle) {
      return res.status(409).json({
        success: false,
        message: `Article page with title '${title}' already exists.`,
      });
    }

    const newArticlePage = await articlePage.create({
      title,
      description,
      ...restOfData,
    });

    return res.status(201).json({
      success: true,
      message: "Article Page created successfully.",
      data: newArticlePage,
    });
  } catch (error) {
    console.error("Error creating Article Page:", error);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while creating the Article page.",
    });
  }
};

exports.getArticlePage = async (req, res) => {
  try {
    let page = await articlePage.findOne();

    // If no Article page exists → create one with default values
    if (!page) {
      page = await articlePage.create({
        title: "Articles",
        description: "This is the default Article page description.",
        questions: [], // add fields based on your schema
      });

      return res.status(201).json({
        success: true,
        message: "No Article page found, so a default one was created.",
        data: page,
      });
    }

    // If page exists → return it
    return res.status(200).json({
      success: true,
      message: "Article page fetched successfully.",
      data: page,
    });
  } catch (error) {
    console.error("Error fetching Article page:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching the Article page.",
    });
  }
};

exports.updateArticlePage = async (req, res) => {
  try {
    const data = req.body;

    let Article = await articlePage.findOne();

    if (!Article) {
      Article = new articlePage({
        ...data,
      });
    } else {
      Object.assign(Article, {
        ...data,
      });
    }

    await Article.save();

    res.json({
      success: true,
      message: "Article page updated successfully",
      data: Article,
    });
  } catch (error) {
    console.error("Article update error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
