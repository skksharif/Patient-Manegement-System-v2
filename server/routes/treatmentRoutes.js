const express = require("express");
const router = express.Router();
const {
  addDailyTreatment,
  getDailyTreatments,
  updateDailyTreatment,
  getTreatmentsGroupedByCheckInOut,
  getTreatmentsByCheckInOut
} = require("../controllers/treatmentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/:visitId/daily-treatment",authMiddleware, addDailyTreatment);
router.get("/:visitId/daily-treatment",authMiddleware, getDailyTreatments);
router.put("/:treatmentId",authMiddleware, updateDailyTreatment);
router.get("/by-checkinout", getTreatmentsByCheckInOut);




module.exports = router;
