const Place = require("../../../models/places");

function stripHtml(html = "") {
  return html
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<\/?p>/gi, "")
    .replace(/<\/?h2>/gi, "")
    .replace(/<\/?h3>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+>/gi, "")
    .trim();
}
 
exports.create = async (req, res) => {
  try {
    const {
      name,
      countyId,
      slug,
      excerpt,
      title,
      description,
      rank,
      companies,
      robots,
      ...restOfData
    } = req.body;

    // Handle uploaded icon
    const iconFile = req.file || req.files?.icon?.[0];
    const iconPath = iconFile ? `uploads/${iconFile.filename}` : "";

    if (!name || !countyId || !slug || !excerpt || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check duplicate
    const existingCity = await Place.findOne({
      $or: [{ title: title.trim() }, { slug: slug.trim() }, { name: name.trim() }],
    });

    if (existingCity) {
      return res.status(400).json({ success: false, message: "City already exists." });
    }

    // Parse companies and robots if sent as JSON strings
    let parsedCompanies = [];
    if (companies) {
      parsedCompanies = typeof companies === "string" ? JSON.parse(companies) : companies;
    }

    let parsedRobots = {};
    if (robots) {
      parsedRobots = typeof robots === "string" ? JSON.parse(robots) : robots;
    }
const cleanDescription = stripHtml(description);
    const newCity = await Place.create({
      name: name.trim(),
      countyId,
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      title: title.trim(),
      description: cleanDescription,
      icon: iconPath,
      rank: rank ? parseInt(rank) : 0,
      companies: parsedCompanies,
      robots: parsedRobots,
      ...restOfData,
    });

    res.status(201).json({
      success: true,
      message: "City created successfully.",
      data: newCity,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.getCities = async (req, res) => {
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
      ];
    }

    const sortField = sortBy || "name";
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const total = await Place.countDocuments(filter);

    const counties = await Place.find(filter)
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

exports.getCityById = async (req, res) => {
  try {
    const { id } = req.params;
    const city = await Place.findById(id)
      .populate("countyId", "name slug")
      .populate("companies.companyId", "companyName");
    if (!city) {
      return res
        .status(404)
        .json({ success: false, message: "City not found." });
    }
    res.status(200).json({
      success: true,
      message: "City fetched successfully.",
      data: city,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      countyId,
      slug,
      excerpt,
      title,
      description,
      rank,
      companies,
      robots,
      ...restOfData
    } = req.body;

    const updatedFields = {
      ...(name && { name }),
      ...(countyId && { countyId }),
      ...(slug && { slug }),
      ...(excerpt && { excerpt }),
      ...(title && { title }),
      ...(description && { description }),
      ...(rank !== undefined && { rank: parseInt(rank) }),
      ...restOfData,
    };

    // Handle icon update
    const iconFile = req.file || req.files?.icon?.[0];
    if (iconFile) updatedFields.icon = `uploads/${iconFile.filename}`;
if (description) {
  updatedFields.description = stripHtml(description);
}
    // Parse companies and robots if sent as JSON strings
    if (companies) {
      updatedFields.companies = typeof companies === "string" ? JSON.parse(companies) : companies;
    }

    if (robots) {
      updatedFields.robots = typeof robots === "string" ? JSON.parse(robots) : robots;
    }

    const updatedCity = await Place.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedCity) {
      return res.status(404).json({ success: false, message: "City not found." });
    }

    res.status(200).json({
      success: true,
      message: "City updated successfully.",
      data: updatedCity,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCity = await Place.findByIdAndDelete(id);
    if (!deletedCity) {
      return res
        .status(404)
        .json({ success: false, message: "City not found." });
    }
    res.status(200).json({
      success: true,
      message: "City deleted successfully.",
      data: deletedCity,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
