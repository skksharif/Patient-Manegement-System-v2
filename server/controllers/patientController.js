const Patient = require("../models/Patient");

const createPatient = async (req, res) => {
  try {
    const { phone } = req.body;

    // Check if a patient with this phone number already exists
    const existingPatient = await Patient.findOne({ phone });

    if (existingPatient) {
      return res.status(409).json({
        error: `Patient with this phone number already exists with name `,
        name: existingPatient.name,
      });
    }

    // If not exists, create and save new patient
    const patient = new Patient(req.body);
    await patient.save();

    res.status(201).json(patient);
  } catch (error) {
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
    res.status(400).json({ error: "Fetching patient failed" });
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

const  checkPatient =  async (req, res) => {
  const { phone } = req.query;
  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  try {
    const patient = await Patient.findOne({ phone });
    if (patient) {
      return res.status(200).json({ exists: true, patient });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createPatient, getAllPatients, updatePatient,getPatientById,checkPatient };
