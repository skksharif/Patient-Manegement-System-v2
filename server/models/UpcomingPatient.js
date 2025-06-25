const mongoose = require("mongoose");

const upcomingPatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  plannedVisitDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Scheduled", "Completed","~"],
    default: "Scheduled",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UpcomingPatient", upcomingPatientSchema);
