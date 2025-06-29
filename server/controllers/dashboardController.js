// controllers/dashboardController.js

const Patient = require("../models/Patient");
const Visit = require("../models/Visit");
const Upcoming = require("../models/UpcomingPatient");

const getDashboardInsights = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();

    const activeInpatients = await Visit.countDocuments({
      type: "IP",
      checkOutTime: null,
    });

    const opCount = await Visit.countDocuments({ type: "OP" });
    const ipCount = await Visit.countDocuments({ type: "IP" });

    const upcomingToday = await Upcoming.countDocuments({
      status: "Scheduled",
      plannedVisitDate: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999),
      },
    });
    const totalUpcoming = await Upcoming.countDocuments({
      status: "Scheduled",
    });

    const missedCount = await Upcoming.countDocuments({ status: "Missed" });
    const completedUpcoming = await Upcoming.countDocuments({
      status: "Completed",
    });

    const visitsPerDay = await Visit.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$checkInTime" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 7 },
    ]);

    res.json({
      totalPatients,
      activeInpatients,
      opCount,
      ipCount,
      upcomingToday,
      totalUpcoming,
      missedCount,
      completedUpcoming,
      visitsPerDay,
    });
  } catch (err) {
    console.error("Dashboard insights error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard insights" });
  }
};

module.exports = { getDashboardInsights };
