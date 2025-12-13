const User = require("../../../models/user");
const Partner = require("../../../models/partners");

exports.getDashboardStats = async (req, res) => {
  try {
    const { start, end } = req.query;

    let startDate, endDate;

    if (!start || !end) {
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date();
    } else {
      startDate = new Date(start);
      endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
    }

    const lastMonthStart = new Date(
      startDate.getFullYear(),
      startDate.getMonth() - 1,
      1
    );
    const lastMonthEnd = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      0
    );
    const topPartners = await User.aggregate([
      { $unwind: "$partnerIds" },

      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },

      {
        $group: {
          _id: "$partnerIds",
          totalLeads: { $sum: 1 },
        },
      },

      { $sort: { totalLeads: -1 } },
      { $limit: 5 },

      {
        $lookup: {
          from: "collaboratepartners",
          localField: "_id",
          foreignField: "_id",
          as: "partner",
        },
      },

      { $unwind: "$partner" },

      {
        $project: {
          _id: 1,
          totalLeads: 1,
          partnerName: "$partner.name",
        },
      },
    ]);

    const leadsCurrentRange = await User.aggregate([
      { $unwind: "$partnerIds" },

      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },

      {
        $group: {
          _id: "$partnerIds",
          leads: { $sum: 1 },
        },
      },
    ]);

    const leadsLastMonth = await User.aggregate([
      { $unwind: "$partnerIds" },

      {
        $match: {
          createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
        },
      },

      {
        $group: {
          _id: "$partnerIds",
          leads: { $sum: 1 },
        },
      },
    ]);

    const lastMonthMap = {};
    leadsLastMonth.forEach((l) => {
      lastMonthMap[l._id] = l.leads;
    });

    const growthData = await Promise.all(
      leadsCurrentRange.map(async (curr) => {
        const partner = await Partner.findById(curr._id).select("name");

        const prev = lastMonthMap[curr._id] || 0;

        const growth = prev === 0 ? 100 : ((curr.leads - prev) / prev) * 100;

        return {
          partnerId: curr._id,
          partnerName: partner?.name || "",
          leadsThisMonth: curr.leads,
          lastMonthLeads: prev,
          growthPercent: Number(growth.toFixed(2)),
        };
      })
    );

    const trendlineData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          leads: { $sum: 1 },
        },
      },

      { $sort: { _id: 1 } },

      {
        $project: {
          date: "$_id",
          leads: 1,
          _id: 0,
        },
      },
    ]);

    const totals = {
      totalLeads: await User.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate },
      }),
      totalPartners: await Partner.countDocuments(),
      leadsThisMonth: leadsCurrentRange.reduce((a, b) => a + b.leads, 0),
    };

    res.json({
      success: true,
      topPartners,
      growthData,
      trendlineData,
      totals,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
      error,
    });
  }
};

exports.totalLeads = async (req, res) => {
  try {
    const leadCounts = await User.aggregate([
      { $unwind: "$dynamicFields" }, // flatten the array
      {
        $group: {
          _id: "$dynamicFields.formTitle", // group by formTitle
          count: { $sum: 1 },
        },
      },
    ]);

    let formatted = {};
    let total = 0;

    leadCounts.forEach((item) => {
      formatted[item._id] = item.count;
      total += item.count;
    });

    return res.status(200).json({
      success: true,
      totalLeads: total,
      data: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};
