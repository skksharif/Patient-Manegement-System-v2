const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  registerUpcomingPatient,
  getAllUpcomingPatients,
  editUpcomingPatient,
  updateStatus,
  getTodayArrivals,
  getMissedPatients,
} = require("../controllers/upcomingController");

// 1. Register
router.post("/register", auth, registerUpcomingPatient);

// 2. Get All
router.get("/all", auth, getAllUpcomingPatients);

// 3. Edit Data
router.put("/edit/:id", auth, editUpcomingPatient);

// 4. Update Status (Reschedule, Completed, Missed)
router.put("/status/:id", auth, updateStatus);

// 5. Today's Arrivals
router.get("/arriving-today", auth, getTodayArrivals);

// 6. Missed Patients
router.get("/missed", auth, getMissedPatients);

module.exports = router;
