const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  aadharNo: { type: String, unique: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  age: { type: Number },
  address: { type: String, required: true },
  
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Patient", patientSchema);
