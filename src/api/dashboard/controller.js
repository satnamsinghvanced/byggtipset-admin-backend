const User = require("../../../models/user");
const Partner = require("../../../models/partners");

exports.getDashboardStats = async (req, res) => {
  try {
    const { start, end, partnerName } = req.query;
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
  lastMonthStart.getFullYear(),
  lastMonthStart.getMonth(),
  startDate.getDate(),
 23,59,59,999
);

    const partnerFilterStage = partnerName
      ? [
          { $unwind: "$partnerIds" },
          {
            $lookup: {
              from: "collaboratepartners",
              localField: "partnerIds.partnerId",
              foreignField: "_id",
              as: "partner",
            },
          },
          { $unwind: "$partner" },
          {
            $match: {
              "partner.name": { $regex: partnerName, $options: "i" },
            },
          },
        ]
      : [{ $unwind: "$partnerIds" }];

    const topPartners = await User.aggregate([
      { $unwind: "$partnerIds" },
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: "Complete",
        },
      },
      {
        $group: {
          _id: "$partnerIds.partnerId",
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
      "partnerIds.partnerId": { $ne: null },
      createdAt: { $gte: startDate, $lte: endDate },
      status: "Complete",
    },
  },
  {
    $group: {
      _id: "$partnerIds.partnerId",
      leads: { $sum: 1 },
    },
  },
]);


   const leadsLastMonth = await User.aggregate([
  { $unwind: "$partnerIds" },
  {
    $match: {
      "partnerIds.partnerId": { $ne: null },
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
      status: "Complete",
    },
  },
  {
    $group: {
      _id: "$partnerIds.partnerId",
      leads: { $sum: 1 },
    },
  },
]);

const lastMonthMap = {};

leadsLastMonth.forEach((l) => {
  lastMonthMap[l._id.toString()] = l.leads;
});
      const growthData = await Promise.all(
      leadsCurrentRange.map(async (curr) => {
        const partner = await Partner.findById(curr._id).select("name");

       const prev = Number(lastMonthMap[curr._id.toString()] ?? 0);

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
      ...partnerFilterStage,
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
          },
          leads: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id.date",
          leads: 1,
        },
      },
    ]);

    const totals = {
      totalLeads: await User.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate },
      }),
      totalRejects: await User.countDocuments({
        status: "Reject",
      }),

      totalPending: await User.countDocuments({
        status: "Pending",
      }),

      totalPartners: await Partner.countDocuments(),

      leadsThisMonth: growthData.reduce(
        (sum, g) => sum + (g?.leadsThisMonth || 0),
        0,
      ),
    };

    res.json({
      success: true,
      topPartners,
      growthData: growthData.filter(Boolean),
      trendlineData,
      totals,
    });
  }catch (error) {
  console.error("Dashboard Stats Error:", error.message);
  console.error(error.stack);

  res.status(500).json({
    success: false,
    message: "Failed to load dashboard stats",
    error: error.message,
  });
}

};

exports.totalLeads = async (req, res) => {
  try {
    const leadCounts = await User.aggregate([
      { $unwind: "$dynamicFields" },
      {
        $group: {
          _id: "$dynamicFields.formTitle",
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
