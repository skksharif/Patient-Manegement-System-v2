// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getDashboardInsights } = require("../controllers/dashboardController");

router.get("/insights", auth, getDashboardInsights);

module.exports = router;
