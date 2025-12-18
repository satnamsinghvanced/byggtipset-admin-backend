const ArticleCategory = require("../../../models/articleCategory");

exports.createArticleCategory = async (req, res) => {
  try {
    const { title, slug, description, categoryPosition , ...restOfData} = req.body;

    const existing = await ArticleCategory.findOne({ slug });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Slug already exists" });
    }
     if (categoryPosition !== undefined && categoryPosition !== null) {
      await ArticleCategory.updateMany(
        { categoryPosition: { $gte: categoryPosition } },
        { $inc: { categoryPosition: 1 } }
      );
    }

    const newCategory = new ArticleCategory({
      title,
      slug,
      description,
      categoryPosition,
      ...restOfData
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Article category created successfully",
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getArticleCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    // Build search query
    const query = search
      ? { title: { $regex: search, $options: "i" } } // case-insensitive search
      : {};

    const total = await ArticleCategory.countDocuments(query);

    const categories = await ArticleCategory.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully.",
      data: categories,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getCategoriesAll = async (req, res) => {
  try {
    const categories = await ArticleCategory.find().select("title slug")

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully.",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSingleArticleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ArticleCategory.findById(id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Article category not found" });
    }

    res.status(200).json({
      success: true,
      message:"Article category data fetched successfully.",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateArticleCategory = async (req, res) => {
  const session = await ArticleCategory.startSession();
  session.startTransaction();

  try {
    const { title, slug, description, categoryPosition, ...restOfData } = req.body;
    const categoryId = req.params.id;

    // Find current category
    const currentCategory = await ArticleCategory.findById(categoryId).session(session);

    if (!currentCategory) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // If categoryPosition is changing
    if (
      categoryPosition !== undefined &&
      categoryPosition !== currentCategory.categoryPosition
    ) {
      // Find category with same position
      const existingCategory = await ArticleCategory.findOne({
        categoryPosition,
        _id: { $ne: categoryId },
      }).session(session);

      // Swap positions if exists
      if (existingCategory) {
        await ArticleCategory.findByIdAndUpdate(
          existingCategory._id,
          { categoryPosition: currentCategory.categoryPosition },
          { session }
        );
      }
    }

    // Update current category
    const updatedCategory = await ArticleCategory.findByIdAndUpdate(
      categoryId,
      { title, slug, description, categoryPosition, ...restOfData },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Article category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};


exports.deleteArticleCategory = async (req, res) => {
  try {
    const deleted = await ArticleCategory.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Article category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
