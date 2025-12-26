const Lead = require("../../../models/user");
const Partner = require("../../../models/partners");
const formSelect = require("../../../models/formSelect");
const mongoose = require("mongoose");

exports.getAllLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const status = req.query.status || "";
    const formType = req.query.formType || "";

    const skip = (page - 1) * limit;

    let filter = {};

    if (status) filter.status = status;

    if (formType) {
      filter["dynamicFields.values.selectedFormTitle"] = {
        $regex: `^${formType}$`,
        $options: "i",
      };
    }

    if (search) {
      const orFilters = [
        { "dynamicFields.values.name": { $regex: search, $options: "i" } },
        { "dynamicFields.values.email": { $regex: search, $options: "i" } },
        { "dynamicFields.values.phone": { $regex: search, $options: "i" } },
      ];

      if (!isNaN(search)) {
        orFilters.push({ uniqueId: Number(search) });
      }

      filter.$or = orFilters;
    }

    const total = await Lead.countDocuments(filter);

    let leads = await Lead.find(filter)
      .populate("partnerIds.partnerId", "name email phone")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Optional: partner search inside populated data
    if (search) {
      const lowerSearch = search.toLowerCase();
      leads = leads.map((lead) => ({
        ...lead.toObject(),
        partnerIds: lead.partnerIds.filter(
          ({ partnerId }) =>
            partnerId?.name?.toLowerCase().includes(lowerSearch) ||
            partnerId?.email?.toLowerCase().includes(lowerSearch)
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


exports.getLeadByPartnerName = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Partner name is required",
      });
    }

    // 1️⃣ Find partner IDs by name
    const partners = await Partner.find({
      name: { $regex: search, $options: "i" },
    }).select("_id");

    if (!partners.length) {
      return res.json({
        success: true,
        leads: [],
        pagination: {
          total: 0,
          page,
          limit,
          pages: 0,
        },
      });
    }

    const partnerIds = partners.map((p) => p._id);

    // 2️⃣ Count leads
    const total = await Lead.countDocuments({
      "partnerIds.partnerId": { $in: partnerIds },
    });

    // 3️⃣ Fetch leads
    const leads = await Lead.find({
      "partnerIds.partnerId": { $in: partnerIds },
    })
      .populate("partnerIds.partnerId", "name email phone")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // 4️⃣ Filter partnerIds inside leads
    const filteredLeads = leads.map((lead) => ({
      ...lead.toObject(),
      partnerIds: lead.partnerIds.filter((p) =>
        partnerIds.some((id) => id.toString() === p.partnerId?._id?.toString())
      ),
    }));

    res.json({
      success: true,
      leads: filteredLeads,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Get leads by partner name error:", err);
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
exports.updateLeadPartnerPrice = async (req, res) => {
  try {
    const { leadId, partnerId, leadPrice } = req.body;

    if (!leadId || !partnerId || leadPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: "leadId, partnerId and leadPrice are required",
      });
    }

    const lead = await Lead.findOneAndUpdate(
      {
        _id: leadId,
        "partnerIds.partnerId": partnerId,
      },
      {
        $set: {
          "partnerIds.$.leadPrice": leadPrice,
        },
      },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead or Partner not found",
      });
    }

    // 🔢 Recalculate total profit
    const totalProfit = lead.partnerIds.reduce(
      (sum, p) => sum + (p.leadPrice || 0),
      0
    );

    lead.profit = totalProfit;
    await lead.save();

    return res.status(200).json({
      success: true,
      message: "Partner lead price updated successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Error updating partner lead price:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
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
    const lead = await Lead.findById(id).populate(
      "partnerIds.partnerId",
      "name email"
    );

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
exports.getPartnerLeadInvoiceSummary = async (req, res) => {
  try {
    const { partnerId, startDate, endDate, filter } = req.query;

    if (!partnerId) {
      return res.status(400).json({
        success: false,
        message: "partnerId is required",
      });
    }

    // ================= DATE FILTER =================
    let dateFilter = {};

    if (filter === "currentMonth") {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      dateFilter = { $gte: start };
    } else if (filter === "previousMonth") {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59,
        999
      );
      dateFilter = { $gte: start, $lte: end };
    }

    if (startDate || endDate) {
      dateFilter = {};

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        dateFilter.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
    }

    // ================= PIPELINE =================
    const result = await Lead.aggregate([
      // 1️⃣ Match partner + date
      {
        $match: {
          "partnerIds.partnerId": new mongoose.Types.ObjectId(partnerId),
          ...(Object.keys(dateFilter).length && { createdAt: dateFilter }),
        },
      },

      // 2️⃣ Unwind partnerIds
      { $unwind: "$partnerIds" },

      {
        $match: {
          "partnerIds.partnerId": new mongoose.Types.ObjectId(partnerId),
        },
      },

      // 3️⃣ Lookup partner BEFORE grouping
      {
        $lookup: {
          from: "collaboratepartners",
          localField: "partnerIds.partnerId",
          foreignField: "_id",
          as: "partner",
        },
      },
      {
        $addFields: {
          partnerName: {
            $ifNull: [{ $first: "$partner.name" }, "Unknown Partner"],
          },
        },
      },

      // 4️⃣ Detect lead type
      {
        $addFields: {
          leadType: {
            $ifNull: [
              { $first: "$dynamicFields.values.selectedFormTitle" },
              "Unknown",
            ],
          },
        },
      },

      // 5️⃣ Shape lead-level data
      {
        $project: {
          partnerName: 1,
          leadId: "$uniqueId",
          leadType: 1,
          price: "$partnerIds.leadPrice",
          sent: "$createdAt",
        },
      },

      // 6️⃣ Group everything by partner
      {
        $group: {
          _id: "$partnerIds.partnerId",

          partnerName: { $first: "$partnerName" },

          leadDetails: {
            $push: {
              leadId: "$leadId",
              type: "$leadType",
              price: "$price",
              sent: "$sent",
            },
          },

          leadTypes: {
            $push: {
              leadType: "$leadType",
              price: "$price",
            },
          },

          totalLeads: { $sum: 1 },
          grandTotal: { $sum: "$price" },
        },
      },
      {
        $lookup: {
          from: "formselects", // ⚠️ collection name (check exact spelling)
          localField: "leadTypes.leadType",
          foreignField: "formTitle",
          as: "formPrices",
        },
      },
      // 7️⃣ Build lead type summary
      {
        $addFields: {
          leadTypes: {
            $map: {
              input: { $setUnion: ["$leadTypes.leadType"] },
              as: "type",
              in: {
                leadType: "$$type",

                // ✅ COUNT
                count: {
                  $size: {
                    $filter: {
                      input: "$leadTypes",
                      as: "lt",
                      cond: { $eq: ["$$lt.leadType", "$$type"] },
                    },
                  },
                },

                // ✅ EXACT price from FormSelect table
                pricePerLead: {
                  $ifNull: [
                    {
                      $first: {
                        $map: {
                          input: {
                            $filter: {
                              input: "$formPrices",
                              as: "fp",
                              cond: { $eq: ["$$fp.formTitle", "$$type"] },
                            },
                          },
                          as: "x",
                          in: "$$x.price",
                        },
                      },
                    },
                    0,
                  ],
                },

                // ✅ TOTAL = sum of saved lead prices
                totalPrice: {
                  $sum: {
                    $map: {
                      input: {
                        $filter: {
                          input: "$leadTypes",
                          as: "lt",
                          cond: { $eq: ["$$lt.leadType", "$$type"] },
                        },
                      },
                      as: "x",
                      in: "$$x.price",
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result[0] || {
        _id: partnerId,
        partnerName: "Unknown Partner",
        leadTypes: [],
        leadDetails: [],
        totalLeads: 0,
        grandTotal: 0,
      },
    });
  } catch (error) {
    console.error("Invoice summary error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate invoice summary",
    });
  }
};
