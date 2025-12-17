const Lead = require("../../../models/user");
const Partner = require("../../../models/partners");
const formSelect = require("../../../models/formSelect");
exports.getAllLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const status = req.query.status || "";

    const skip = (page - 1) * limit;

    // Build initial filter
    let filter = {};
    if (status) filter.status = status;

    if (search) {
      const orFilters = [
        { "dynamicFields.values.name": { $regex: search, $options: "i" } },
        { "dynamicFields.values.email": { $regex: search, $options: "i" } },
        { "dynamicFields.values.phone": { $regex: search, $options: "i" } },
      ];

      // Add uniqueId filter if search is numeric
      if (!isNaN(search)) {
        orFilters.push({ uniqueId: Number(search) });
      }

      filter.$or = orFilters;
    }

    // Count total documents
    const total = await Lead.countDocuments(filter);

    // Fetch leads with partners populated
    let leads = await Lead.find(filter)
      .populate("partnerIds", "name email phone wishes leadTypes")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Filter partnerIds inside each lead (without removing lead)
    if (search) {
      const lowerSearch = search.toLowerCase();
      leads = leads.map((lead) => ({
        ...lead.toObject(),
        partnerIds: lead.partnerIds.filter(
          (p) =>
            p.name?.toLowerCase().includes(lowerSearch) ||
            p.email?.toLowerCase().includes(lowerSearch)
        ),
      }));
    }

    res.json({
      success: true,
      leads,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Lead list error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
};


exports.updateLeadStatus = async (req, res) => {
  try {
    const { leadId, status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      leadId,
      { status },
      { new: true }
    );
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead status updated successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Error updating lead status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateLeadProfit = async (req, res) => {
  try {
    const { leadId, profit } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      leadId,
      { profit },
      { new: true }
    );
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Lead profit updated successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Error updating lead profit:", error);
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Lead ID is required",
      });
    }

    const lead = await Lead.findById(id).populate("partnerIds", "name email"); // ← fixes your partner issue

    const FormId = await formSelect.findById(lead.dynamicFields[0].formId);
    const formNumber = FormId.formNumber;

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }
    const finalLead = {
      ...lead.toObject(),
      formNumber: formNumber,
    };
    res.status(200).json({
      success: true,
      message: "Lead details fetched successfully.",
      data: finalLead,
      // formNumber: formNumber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
