const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createVisit,
  checkoutVisit,
  promoteToInpatient,
  addNextVisit,
  getVisitHistory,
  getUpcomingVisits,
  getVisitsByType,
  getAllActiveInpatients,
  getAllCheckedOutPatients,
  editVisit,
  updateCaseStudy,
  getCaseStudy,
} = require("../controllers/visitController");

router.post("/create", auth, createVisit);                      // OP or IP
router.put("/checkout/:visitId", auth, checkoutVisit);          // Checkout IP
router.post("/promote-ip", auth, promoteToInpatient);           // Convert OP → IP
router.put("/next-visit/:patientId", auth, addNextVisit);       // Add Next Visit
router.get("/history/:patientId", auth, getVisitHistory);       // History
router.get("/active-inpatients", auth, getAllActiveInpatients); // All IPs who are currently admitted
router.get("/checkedout-patients", auth, getAllCheckedOutPatients); // All IPs who are currently admitted
router.get("/upcoming", auth, getUpcomingVisits);    // Upcoming Visits
router.get("/type/:type", auth, getVisitsByType);               // By Type
router.put("/edit/:visitId", editVisit);
// PUT: Update case study
router.put("/case-study/:visitId", updateCaseStudy);

// GET: Get case study
router.get("/case-study/:visitId", getCaseStudy);




module.exports = router;
