const mongoose = require("mongoose");

const dailyReportSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    required: true,
  }
});

const visitSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },

  type: {
    type: String,
    enum: ["OP", "IP"],
    required: true,
  },

  reason: {
    type: String,
    required: true,
  },

  note: {
    type: String,
    required: true,
  },

  checkInTime: {
    type: Date,
    default: null,
  },

  roomNo: {
    type: String,
    default: null,
  },

  doctor: {
    type: String,
    required: false,
  },

  therapist: {
    type: String,
    required: false,
  },

  checkOutTime: {
    type: Date,
    default: null,
  },

  nextVisit: {
    type: Date,
    default: null,
  },

  dailyReports: [dailyReportSchema],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Visit", visitSchema);
