const Article = require("../../../models/article");

exports.createArticle = async (req, res) => {
  try {
    let {
      title,
      slug,
      excerpt,
      description,
      createdBy,
      categoryId,
      showDate,
      articleTags,
      articlePosition,
      ...restOfData
    } = req.body;

    if (articleTags) {
      try {
        articleTags = JSON.parse(articleTags);
      } catch {
        articleTags = articleTags.split(",").map((t) => t.trim());
      }
    } else {
      articleTags = [];
    }

    if (restOfData.robots) {
      try {
        restOfData.robots = JSON.parse(restOfData.robots);
      } catch {
        restOfData.robots = {};
      }
    }

    articlePosition = articlePosition ? Number(articlePosition) : null;

    const existingArticle = await Article.findOne({ slug });
    if (existingArticle)
      return res.status(400).json({
        success: false,
        message: "Slug already exists.",
      });

    if (articlePosition !== null) {
      const articleWithSamePos = await Article.findOne({ articlePosition });

      if (articleWithSamePos) {
        await Article.findByIdAndUpdate(articleWithSamePos._id, {
          articlePosition: null,
        });
      }
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const article = await Article.create({
      title,
      slug,
      excerpt,
      description,
      createdBy,
      categoryId,
      showDate,
      image: imagePath,
      articleTags,
      articlePosition: articlePosition ?? null,
      ...restOfData,
    });

    if (articlePosition !== null) {
      const articleWithSamePos = await Article.findOne({
        articlePosition: null,
        _id: { $ne: article._id },
      });

      if (articleWithSamePos) {
        await Article.findByIdAndUpdate(articleWithSamePos._id, {
          articlePosition: articlePosition + 1,
        });
      }
    }

    const addedArticle = await Article.findById(article._id)
      .populate("categoryId", "title")
      .populate("createdBy", "username");

    return res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: addedArticle,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    let filter = {};
    if (search) {

      filter = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    const total = await Article.countDocuments(filter);

    const articles = await Article.find(filter)
      .populate("createdBy")
      .populate("categoryId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Articles fetched successfully.",
      data: articles,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getSingleArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("createdBy")
      .populate("categoryId");
    if (!article)
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    res.status(200).json({
      success: true,
      message: "Article fetched successfully.",
      data: article,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    let {
      title,
      slug,
      excerpt,
      description,
      createdBy,
      categoryId,
      showDate,
      articleTags,
      articlePosition,
      ...restOfData
    } = req.body;

    if (articleTags) {
      try {
        articleTags = JSON.parse(articleTags);
      } catch {
        articleTags = articleTags.split(",").map((t) => t.trim());
      }
    }
    if (restOfData.robots) {
      try {
        restOfData.robots = JSON.parse(restOfData.robots);
      } catch {
        restOfData.robots = {};
      }
    }

    articlePosition = articlePosition ? Number(articlePosition) : null;

    const existingArticle = await Article.findOne({
      slug,
      _id: { $ne: req.params.id },
    });

    if (existingArticle)
      return res.status(400).json({
        success: false,
        message: "Slug already exists.",
      });

    const currentArticle = await Article.findById(req.params.id);

    if (!currentArticle)
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });

    if (
      articlePosition !== null &&
      articlePosition !== currentArticle.articlePosition
    ) {
      const articleWithSamePos = await Article.findOne({
        articlePosition,
        _id: { $ne: req.params.id },
      });

      if (articleWithSamePos) {
        await Article.findByIdAndUpdate(articleWithSamePos._id, {
          articlePosition: currentArticle.articlePosition || null,
        });
      }
    }

    const updateData = {
      title,
      slug,
      excerpt,
      description,
      createdBy,
      categoryId,
      showDate,
      articleTags,
      articlePosition,
      ...restOfData,
    };

    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const updated = await Article.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("categoryId", "title")
      .populate("createdBy", "username");

    return res.status(200).json({
      success: true,
      message: "Article updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article)
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    res.status(200).json({
      success: true,
      message: "Article deleted successfully",
      data: article,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
