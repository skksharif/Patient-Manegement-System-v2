const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createVisit,
  checkoutVisit,
  getVisitHistory,
  getAllActiveInpatients,
  getAllCheckedOutPatients,
  editVisit,
  updateCaseStudy,
  getCaseStudy,
  getGroupedCaseStudies,
} = require("../controllers/visitController");

router.post("/create", auth, createVisit); // OP or IP creation
router.put("/checkout/:visitId", auth, checkoutVisit); // IP discharge
router.get("/history/:patientId", auth, getVisitHistory); // All visits
router.get("/active-inpatients", auth, getAllActiveInpatients); // IPs in hospital
router.get("/checkedout-patients", auth, getAllCheckedOutPatients); // Discharged IPs
router.put("/edit/:visitId", auth, editVisit); // Edit
router.put("/case-study/:visitId", auth, updateCaseStudy); // Add/update case study
router.get("/case-study/:visitId", auth, getCaseStudy); // Get case study
router.get("/case-studies/grouped", getGroupedCaseStudies);


module.exports = router;
