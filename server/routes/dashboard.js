const express = require("express");
const Patient = require("../models/Patient");
const Visit = require("../models/Visit");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Utility to start and end of a day
const getDayRange = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

// GET /api/dashboard/stats
router.get("/stats",authMiddleware, async (req, res) => {
  try {
    const today = new Date();

    const totalPatients = await Patient.countDocuments();

    const activePatients = await Visit.countDocuments({
      type: "IP",
      checkOutTime: null,
    });

    const opCount = await Visit.countDocuments({ type: "OP" });
    const ipCount = await Visit.countDocuments({ type: "IP" });

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6); // Including today

    const visitsPerDay = await Visit.aggregate([
      {
        $match: {
          checkInTime: { $gte: last7Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$checkInTime" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json({
      totalPatients,
      activePatients,
      opCount,
      ipCount,
      visitsPerDay,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

module.exports = router;
