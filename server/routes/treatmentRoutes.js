const express = require("express");
const router = express.Router();
const {
  addDailyTreatment,
  getDailyTreatments,
  updateDailyTreatment
} = require("../controllers/treatmentController");

// POST /api/treatments/:visitId/daily-treatment
router.post("/:visitId/daily-treatment", addDailyTreatment);

// GET /api/treatments/:visitId/daily-treatment
router.get("/:visitId/daily-treatment", getDailyTreatments);
router.put("/:treatmentId", updateDailyTreatment); 

module.exports = router;
