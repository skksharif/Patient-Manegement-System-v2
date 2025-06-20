const express = require("express");
const router = express.Router();
const {
  createEnquiry,
  getAllEnquiries,
  updateEnquiry,
} = require("../controllers/enquiryController");

router.post("/", createEnquiry);
router.get("/", getAllEnquiries);
router.put("/:id", updateEnquiry);

module.exports = router;
