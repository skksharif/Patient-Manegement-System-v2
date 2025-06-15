const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, default: Date.now },
  enquiry: { type: String, required: true },
});

module.exports = mongoose.model("Enquiry", enquirySchema);
