const express = require("express");
const router = express.Router();
const {
  addDailyTreatment,
  getDailyTreatments,
  updateDailyTreatment
} = require("../controllers/treatmentController");

router.post("/:visitId/daily-treatment", addDailyTreatment);
router.get("/:visitId/daily-treatment", getDailyTreatments);
router.put("/update/:treatmentId", updateDailyTreatment);


module.exports = router;
