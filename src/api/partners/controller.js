const Partners = require("../../../models/partners");
const Form = require("../../../models/forms");
const formSelect = require("../../../models/formSelect");
const partnerLimit = require("../../../models/partnerLimit");
const user = require("../../../models/user");

exports.createPartner = async (req, res) => {
  try {
    const {
      name,
      email,
      preferences,
      address,
      city,
      isPremium,
      isActive,
      wishes,
      postalCodes,
      // leadTypes,
      leads,
    } = req.body;
    const existingPartner = await Partners.findOne({ email });
    if (existingPartner) {
      return res.status(400).json({
        success: false,
        message: "Partner with this email already exists",
      });
    }
    const leadsType = await formSelect.find();

    const newPartner = new Partners({
      name,
      email,
      preferences,
      address,
      city,
      isPremium,
      isActive,
      wishes,
      leads,
      leadTypes: leadsType.map((lt) => ({
        typeId: lt._id,
        price: lt.price,
      })),

      postalCodes: {
        exact: postalCodes?.exact?.map((c) => ({ code: c })) || [],
        ranges:
          postalCodes?.ranges?.map((r) => ({
            from: r.from,
            to: r.to,
          })) || [],
      },
    });

    await newPartner.save();
    res.status(201).json({
      success: true,
      data: newPartner,
      message: "Partner Added Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getPartners = async (req, res) => {
  try {
    const {
      isActive,
      isPremium,
      city,
      name,
      postalCode,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }
    if (isPremium !== undefined) {
      query.isPremium = isPremium === "true";
    }
    if (city) {
      query.city = { $regex: city, $options: "i" };
    }
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }
    if (postalCode) {
      query.$or = [
        { "postalCodes.exact.code": { $regex: postalCode, $options: "i" } },
        { "postalCodes.ranges.from": { $regex: postalCode, $options: "i" } },
        { "postalCodes.ranges.to": { $regex: postalCode, $options: "i" } },
      ];
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { postalCodes: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (page - 1) * limit;
    const total = await Partners.countDocuments(query);
    const partners = await Partners.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Partners fetched successfully.",
      data: partners,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
exports.getAllPartners = async (req, res) => {
  try {
    const { search } = req.query;

    const query = {};
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }];
    }
    const total = await Partners.countDocuments(query);
    const partners = await Partners.find(query)
      .sort({ createdAt: -1 }).select("_id name email");

    res.status(200).json({
      success: true,
      message: "Partners fetched successfully.",
      data: partners,

    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getPartnerById = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Partner ID is required" });
    const partner = await Partners.findById(id).populate("leadTypes.typeId");
    if (!partner)
      return res
        .status(404)
        .json({ success: false, message: "Partner not found" });
    partner.leadTypes = partner.leadTypes.filter((lt) => lt.typeId !== null);

    res.status(200).json({
      success: true,
      message: "Partner details fetched successfully.",
      data: partner,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE PARTNER
exports.updatePartner = async (req, res) => {
  try {
    const { id } = req.query;

    const {
      name,
      email,
      preferences,
      address,
      city,
      isPremium,
      isActive,
      wishes,
      postalCodes,
      leadTypes,
      leads,
    } = req.body;
    if (email) {
      const existingPartner = await Partners.findOne({
        email,
        _id: { $ne: id },
      });
      if (existingPartner) {
        return res.status(400).json({
          success: false,
          message: "Email is already used by another partner",
        });
      }
    }
    const updateData = {
      name,
      email,
      preferences,
      address,
      city,
      isPremium,
      isActive,
      wishes,
      postalCodes: {
        exact: postalCodes?.exact?.map((c) => ({ code: c })) || [],
        ranges:
          postalCodes?.ranges?.map((r) => ({
            from: r.from,
            to: r.to,
          })) || [],
      },
      leadTypes:
        leadTypes?.map((lt) => ({
          typeId: lt.typeId,
          price: lt.price,
        })) || [],
      leads,
    };

    const updated = await Partners.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Partner not found" });
    }

    res.json({
      success: true,
      data: updated,
      message: "Partner Updated Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating partner" });
  }
};

exports.deletePartner = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Partner ID is required" });
    const partner = await Partners.findByIdAndDelete(id);
    if (!partner)
      return res
        .status(404)
        .json({ success: false, message: "Partner not found" });
    res.status(200).json({
      success: true,
      message: "Partner deleted successfully.",
      data: partner,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.questionForPartner = async (req, res) => {
  try {
    const form = await Form.findOne();

    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    const questions = form.steps
      .sort((a, b) => a.stepOrder - b.stepOrder)
      .flatMap((step) => step.fields)
      // .filter(field => field.label && field.label.trim() !== "")
      .map((field, index) => ({
        index: index + 1, // Start index from 1
        question: field.name,
        // name: field.name    // Optional: helps match answers later
      }));

    res.json({ success: true, questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAnwserOptionsForQuestion = async (req, res) => {
  try {
    const { question } = req.query;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // ✅ Special case: leadType – fetch from formSelect
    if (question === "leadType") {
      const leadTypes = await formSelect.find();

      const options = leadTypes.map((item) => item.formTitle);

      return res.status(200).json({
        success: true,
        question: "leadType",
        type: "select",
        options,
      });
    }

    // ✅ For all other questions → fetch from Form model
    const form = await Form.findOne();
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    // Find matching field
    let foundField = null;

    form.steps.forEach((step) => {
      step.fields.forEach((field) => {
        if (field.name === question) {
          foundField = field;
        }
      });
    });

    if (!foundField) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      question: foundField.name,
      type: foundField.type,
      options: foundField.options || [],
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.setPartnerLimit = async (req, res) => {
  try {
    const { limit } = req.body;

    const updatedLimit = await partnerLimit.findOneAndUpdate(
      {},
      { limit },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Limit updated successfully",
      data: updatedLimit,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the limit",
      error: error.message,
    });
  }
};
exports.getPartnerLimit = async (req, res) => {
  try {
    // 1. Try to find the existing limit record
    let limitData = await partnerLimit.findOne();

    // 2. If it doesn't exist, create it automatically with a default of 0
    if (!limitData) {
      limitData = await partnerLimit.create({
        limit: 0,
        // Add any other required default fields here
      });
    }

    // 3. Return the data (now guaranteed to exist)
    return res.status(200).json({
      success: true,
      data: limitData.limit, // This will be 0 if it was just created
    });
  } catch (error) {
    console.error("Error fetching or auto-creating partner limit:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
exports.leadsOfPartner = async (req, res) => {
  try {
    const partnerId = req.query.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const status = req.query.status || "";

    if (!partnerId) {
      return res.status(400).json({
        success: false,
        message: "Partner ID is required",
      });
    }

    const partner = await Partners.findById(partnerId);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    const skip = (page - 1) * limit;

    let filter = {
      partnerIds: partnerId,
    };

    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { "dynamicFields.name": { $regex: search, $options: "i" } },
        { "dynamicFields.email": { $regex: search, $options: "i" } },
        { "dynamicFields.phone": { $regex: search, $options: "i" } },
      ];
    }

    // ---------- COUNT ----------
    const total = await user.countDocuments(filter);

    // ---------- FETCH ----------
    const leads = await user
      .find(filter)
      .populate("partnerIds", "name email phone ")
      .skip(skip)
      .limit(limit);

    // ---------- FORMAT + PROFIT ----------
    const formatted = leads.map((lead) => {
      const leadObj = lead.toObject();
      const partnerObj = lead.partnerIds?.[0] || null;

      let computedProfit = 0;

      if (partnerObj) {
        const leadPreference = lead.dynamicFields?.preferranceType;

        const preferenceWish = partnerObj.wishes?.find(
          (w) => w.question === "preferranceType"
        );

        const isSupported =
          preferenceWish &&
          preferenceWish.expectedAnswer?.includes(leadPreference);

        if (isSupported) {
          if (partnerObj.leadTypes?.length) {
            const highestPrice = Math.max(
              ...partnerObj.leadTypes.map((lt) => lt.price || 0)
            );
            computedProfit = highestPrice;
          }
        }
      }

      return {
        ...leadObj,
        // partner: partnerObj,
        profit: computedProfit,
      };
    });

    return res.status(200).json({
      success: true,
      leads: formatted,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching partner leads:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching partner-specific leads",
    });
  }
};
