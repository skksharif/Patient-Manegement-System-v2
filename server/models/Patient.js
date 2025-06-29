const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  aadharNo: { type: String, required: false },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  age: { type: Number,required: false },
  address: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Patient", patientSchema);
