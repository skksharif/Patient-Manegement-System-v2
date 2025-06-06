const Patient = require("../models/Patient");

const createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.aadharNo) {
      return res.status(400).json({ error: 'Aadhar number already exists' });
    }
    res.status(400).json({ error: error.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.status(200).json(patients);
  } catch (error) {
    res.status(400).json({ error: "Aadhar number already exists." });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPatient = await Patient.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedPatient) {
      return res.status(404).json({ error: "Patient not found." });
    }
    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createPatient, getAllPatients, updatePatient,getPatientById };
