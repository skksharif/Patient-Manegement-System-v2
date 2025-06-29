const UpcomingPatient = require("../models/UpcomingPatient");
const Patient = require("../models/Patient");
const Visit = require("../models/Visit");

// 1. Register with unique phone check
exports.registerUpcomingPatient = async (req, res) => {
  const { name, phone, gender, plannedVisitDate } = req.body;

  // Check if a scheduled patient with the same phone already exists
  const existing = await UpcomingPatient.findOne({ phone, status: "Scheduled" });
  console.log(existing);
  if (existing) {
    return res.status(400).json({ error: "Phone number already registered for a scheduled visit." });
  }

  const patient = new UpcomingPatient({ name, phone, gender, plannedVisitDate });
  await patient.save();
  res.status(201).json(patient);
};

// 2. Get All
exports.getAllUpcomingPatients = async (req, res) => {
  const patients = await UpcomingPatient.find().sort({ plannedVisitDate: 1 });
  res.json(patients);
};

// 3. Edit Data
exports.editUpcomingPatient = async (req, res) => {
  const { id } = req.params;
  const updated = await UpcomingPatient.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

// 4. Update Status
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, newDate } = req.body;

  const patient = await UpcomingPatient.findById(id);
  if (!patient) return res.status(404).json({ error: "Patient not found" });


  if (status === "Completed") {
    patient.status = "Completed";
    await patient.save();
    return res.json({ message: "Marked as completed" });
  }

  if (status === "Missed") {
    patient.status = "Missed";
    await patient.save();
    return res.json({ message: "Marked as missed" });
  }

  res.status(400).json({ error: "Invalid status" });
};

// 5. Today's Arrivals
exports.getTodayArrivals = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const patients = await UpcomingPatient.find({
    plannedVisitDate: { $gte: today, $lt: tomorrow },
    status: "Scheduled",
  });

  res.json(patients);
};

// 6. Missed Patients
exports.getMissedPatients = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const patients = await UpcomingPatient.find({
    plannedVisitDate: { $lt: today },
    status: "Scheduled",
  });

  // Auto-update status to "Missed"
  for (const patient of patients) {
    patient.status = "Missed";
    await patient.save();
  }

  res.json(patients);
};
