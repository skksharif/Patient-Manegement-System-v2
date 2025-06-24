const mongoose = require("mongoose");

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
  
  therapy: {
    type: String,
    required: false,
  },

  checkOutTime: {
    type: Date,
    default: null,
  },

  caseStudy: {
    type: String,
    default: null,
  },

  dailyTreatments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DailyTreatment",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Visit", visitSchema);
