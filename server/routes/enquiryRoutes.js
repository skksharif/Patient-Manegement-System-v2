const express = require("express");
const router = express.Router();
const {
  createEnquiry,
  getAllEnquiries,
  updateEnquiry,
} = require("../controllers/enquiryController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/",authMiddleware, createEnquiry);
router.get("/",authMiddleware, getAllEnquiries);
router.put("/:id",authMiddleware, updateEnquiry);

module.exports = router;
