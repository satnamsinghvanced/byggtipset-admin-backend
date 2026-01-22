const County = require("../../../models/county");

exports.createCounty = async (req, res) => {
  try {
    const { name, slug, excerpt, ...restOfData } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let createData = { name: name.trim(), slug: slug.trim(), excerpt: excerpt.trim(), ...restOfData };

    // Parse companies if it's a string (from FormData JSON.stringify)
    if (typeof createData.companies === 'string') {
      try {
        createData.companies = JSON.parse(createData.companies);
      } catch (e) {
        createData.companies = [];
      }
    }

    // Parse robots if it's a string
    if (typeof createData.robots === 'string') {
      try {
        createData.robots = JSON.parse(createData.robots);
      } catch (e) {
        createData.robots = {};
      }
    }

    const existing = await County.findOne({
      $or: [{ name: name.trim() }, { slug: slug.trim() }],
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "County with that name or slug already exists." });
    }
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    createData.icon = imagePath;

    const county = await County.create(createData);

    res.status(201).json({
      success: true,
      message: "County created successfully.",
      data: county,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCounties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, sortBy, sortOrder } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    const sortField = sortBy || "createdAt";
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const total = await County.countDocuments(filter);

    const counties = await County.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ [sortField]: sortDirection });

    res.status(200).json({
      success: true,
      message: "Counties fetched successfully.",
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCounties: total,
      data: counties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getCountiesForPlace = async (req, res) => {
  try {
    const counties = await County.find();
    res.status(200).json({
      success: true,
      message: "Counties fetched successfully.",
      data: counties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCountyById = async (req, res) => {
  try {
    const county = await County.findById(req.params.id).populate(
      "companies.companyId",
      "companyName"
    );
    if (!county) return res.status(404).json({ message: "County not found" });
    res.status(200).json({
      success: true,
      message: "County fetched successfully.",
      data: county,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCounty = async (req, res) => {
  try {
    const { name, slug, excerpt, icon, ...restOfData } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    let updateData = { name, slug, excerpt, ...restOfData };

    // Only update icon if a new file is uploaded
    if (imagePath) {
      updateData.icon = imagePath;
    }

    // Parse companies if it's a string (from FormData JSON.stringify)
    if (typeof updateData.companies === 'string') {
      try {
        updateData.companies = JSON.parse(updateData.companies);
      } catch (e) {
        updateData.companies = [];
      }
    }

    // Parse robots if it's a string
    if (typeof updateData.robots === 'string') {
      try {
        updateData.robots = JSON.parse(updateData.robots);
      } catch (e) {
        updateData.robots = {};
      }
    }

    const county = await County.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!county) return res.status(404).json({ message: "County not found" });
    res.status(200).json({
      success: true,
      message: "County updated successfully.",
      data: county,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.deleteCounty = async (req, res) => {
  try {
    const county = await County.findByIdAndDelete(req.params.id);
    if (!county) return res.status(404).json({ message: "County not found" });
    res.status(200).json({
      success: true,
      message: "County deleted successfully",
      data: county,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
