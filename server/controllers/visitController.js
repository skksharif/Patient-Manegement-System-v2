const Visit = require("../models/Visit");

// 1. Create a visit (OP or IP)
const createVisit = async (req, res) => {
  try {
    const { patientId, type, reason, note, roomNo, doctor, nextVisit } = req.body;

    if (type === "IP") {
      const activeIP = await Visit.findOne({ patientId, type: "IP", checkOutTime: null });
      if (activeIP) return res.status(400).json({ error: "Patient is already admitted." });

      const roomConflict = await Visit.findOne({ roomNo, type: "IP", checkOutTime: null });
      if (roomConflict) return res.status(400).json({ error: "Room is already occupied." });
    }

    const newVisit = new Visit({
      patientId,
      type,
      reason,
      note,
      roomNo,
      doctor,
      checkInTime: type === "IP" ? new Date() : null,
      nextVisit: nextVisit ? new Date(nextVisit) : null,
    });

    await newVisit.save();
    res.status(201).json(newVisit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 2. Checkout a patient (IP only)
const checkoutVisit = async (req, res) => {
  try {
    const { visitId } = req.params;
    const { nextVisit } = req.body;

    const visit = await Visit.findById(visitId);
    if (!visit) return res.status(404).json({ error: "Visit not found." });
    if (visit.checkOutTime) return res.status(400).json({ error: "Already checked out." });

    visit.checkOutTime = new Date();
    if (nextVisit) visit.nextVisit = new Date(nextVisit);
    await visit.save();

    res.status(200).json(visit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 3. Promote OP to IP (admit again)
const promoteToInpatient = async (req, res) => {
  try {
    const { patientId, reason, note, roomNo, doctor } = req.body;

    const existing = await Visit.findOne({
      patientId,
      type: "IP",
      checkOutTime: null,
    });
    if (existing) return res.status(400).json({ error: "Patient is already admitted." });

    const roomConflict = await Visit.findOne({ roomNo, type: "IP", checkOutTime: null });
    if (roomConflict) return res.status(400).json({ error: "Room is already occupied." });

    const visit = new Visit({
      patientId,
      type: "IP",
      reason,
      note,
      roomNo,
      doctor,
      checkInTime: new Date(),
    });

    await visit.save();
    res.status(201).json(visit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 4. Add next follow-up visit
const addNextVisit = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { nextVisit } = req.body;

    const latestVisit = await Visit.findOne({ patientId }).sort({ createdAt: -1 });
    if (!latestVisit) return res.status(404).json({ error: "No visit found." });

    if (latestVisit.type === "IP" && !latestVisit.checkOutTime) {
      return res.status(400).json({ error: "Cannot add next visit while patient is still admitted." });
    }

    latestVisit.nextVisit = new Date(nextVisit);
    await latestVisit.save();

    res.status(200).json(latestVisit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 5. Get full visit history
const getVisitHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const visits = await Visit.find({ patientId }).sort({ createdAt: -1 });
    res.status(200).json(visits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Get all active inpatients
const getAllActiveInpatients = async (req, res) => {
  try {
    const activeVisits = await Visit.find({
      type: "IP",
      checkOutTime: null,
    }).populate("patientId");

    res.status(200).json(activeVisits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 7. Get all checked-out patients
const getAllCheckedOutPatients = async (req, res) => {
  try {
    const checkedOutVisits = await Visit.find({
      type: "IP",
      checkOutTime: { $ne: null },
    }).populate("patientId");

    res.status(200).json(checkedOutVisits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 8. Get all upcoming follow-up visits
const getUpcomingVisits = async (req, res) => {
  try {
    const now = new Date();

    const visits = await Visit.aggregate([
      {
        $match: {
          nextVisit: { $gte: now }
        }
      },
      {
        $sort: { nextVisit: -1 }
      },
      {
        $group: {
          _id: "$patientId",
          visit: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$visit" }
      }
    ]);

    const populated = await Visit.populate(visits, { path: "patientId" });

    res.status(200).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 9. Get visits by type
const getVisitsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const visits = await Visit.find({ type }).sort({ createdAt: -1 });
    res.status(200).json(visits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createVisit,
  checkoutVisit,
  promoteToInpatient,
  addNextVisit,
  getVisitHistory,
  getAllActiveInpatients,
  getAllCheckedOutPatients,
  getUpcomingVisits,
  getVisitsByType,
};
