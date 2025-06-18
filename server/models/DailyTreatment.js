const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema({
  visitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Visit",
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  morning: {
    therapy: { type: String, default: "" },
    therapist: { type: String, default: "" },
  },

  evening: {
    therapy: { type: String, default: "" },
    therapist: { type: String, default: "" },
  },
});

module.exports = mongoose.model("DailyTreatment", treatmentSchema);
