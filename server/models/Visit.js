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
    type: String, // or use ObjectId if referencing a Doctor model
    required: false,
  },
  therapist: {
    type: String, // or use ObjectId if referencing a Doctor model
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

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Visit", visitSchema);
