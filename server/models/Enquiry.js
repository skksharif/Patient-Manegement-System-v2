const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  enquiry: { type: String, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Enquiry", enquirySchema);
