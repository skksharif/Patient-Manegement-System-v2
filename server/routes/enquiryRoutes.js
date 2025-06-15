const express = require("express");
const router = express.Router();
const { createEnquiry, getAllEnquiries } = require("../controllers/enquiryController");

// POST /api/enquiries
router.post("/", createEnquiry);

// GET /api/enquiries
router.get("/", getAllEnquiries);

module.exports = router;
