const Company = require("../../../models/companies");

exports.createCompany = async (req, res) => {
  try {
    const {
      companyName,
      companyImage,
      address,
      email,
      websiteAddress,
      zipCode,
      description,
      extractor,
      brokerSites,
      ...restOfData
    } = req.body;

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res
        .status(400)
        .json({ success: false, message: "Company already exists" });
    }

    const newCompany = new Company({
      companyName,
      companyImage,
      email,
      address,
      zipCode,
      websiteAddress,
      description,
      extractor,
      brokerSites,
      ...restOfData,
    });

    await newCompany.save();

    res.status(201).json({
      message: "Company created successfully.",
      data: newCompany,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    // Build filter object
    const filter = {};
    if (search) {
      // Search by company name (case-insensitive)
      filter.companyName = { $regex: search, $options: "i" };
    }

    const totalCompanies = await Company.countDocuments(filter);

    const companies = await Company.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Companies fetched successfully.",
      data: companies,
      currentPage: page,
      totalPages: Math.ceil(totalCompanies / limit),
      totalCompanies: totalCompanies,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCompaniesAll = async (req, res) => {
  try {
    const search = req.query.search || "";

    const filter = {};
    if (search) {
      filter.companyName = { $regex: search, $options: "i" };
    }
    const companies = await Company.find(filter)
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Companies fetched successfully.",
      data: companies
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    // const { id } = req.query;
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    res.status(200).json({
      success: true,
      message: "Company fetched successfully.",
      data: company,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("REQ BODY:", req.body);
    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCompany) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    res.status(200).json({
      success: true,
      message: "Company updated successfully.",
      data: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCompany = await Company.findByIdAndDelete(id);
    if (!deletedCompany) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    res.status(200).json({
      success: true,
      message: "Company deleted successfully.",
      data: deletedCompany,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
