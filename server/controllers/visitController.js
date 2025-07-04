const Visit = require("../models/Visit");

// 1. Create a visit (OP or IP)
const createVisit = async (req, res) => {
  try {
    const {
      patientId,
      type,
      reason,
      note,
      roomNo,
      doctor,
      therapist,
      therapy,
      checkInTime,
    } = req.body;

    if (!["OP", "IP"].includes(type)) {
      return res.status(400).json({ error: "Invalid visit type" });
    }

    // IP logic
    if (type === "IP") {
      const activeIP = await Visit.findOne({
        patientId,
        type: "IP",
        checkOutTime: null,
      });
      if (activeIP)
        return res.status(400).json({ error: "Patient is already admitted." });

      const newVisit = new Visit({
        patientId,
        type,
        reason,
        note,
        roomNo,
        doctor,
        checkInTime: checkInTime ? new Date(checkInTime) : new Date(),
      });

      await newVisit.save();
      return res.status(201).json(newVisit);
    }

    // OP logic
    const newVisit = new Visit({
      patientId,
      type,
      reason: "Therapy Visit",
      note: therapy,
      therapist,
      therapy,
      checkInTime: checkInTime ? new Date(checkInTime) : new Date(),
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
    const { checkoutDate } = req.body;

    const visit = await Visit.findById(visitId);
    if (!visit) return res.status(404).json({ error: "Visit not found." });
    if (visit.checkOutTime)
      return res.status(400).json({ error: "Already checked out." });

    visit.checkOutTime = checkoutDate ? new Date(checkoutDate) : new Date();
    await visit.save();

    res.status(200).json(visit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 3. Get full visit history
const getVisitHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const visits = await Visit.find({ patientId }).sort({ createdAt: -1 });
    res.status(200).json(visits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Get all active inpatients
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

// 5. Get all checked-out patients
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

// 6. Edit a visit (OP or IP)
const editVisit = async (req, res) => {
  try {
    const { visitId } = req.params;
    const updates = req.body;

    const visit = await Visit.findById(visitId);
    if (!visit) return res.status(404).json({ error: "Visit not found." });

    if (updates.reason !== undefined) visit.reason = updates.reason;
    if (updates.note !== undefined) visit.note = updates.note;
    if (updates.roomNo !== undefined) visit.roomNo = updates.roomNo;
    if (updates.doctor !== undefined) visit.doctor = updates.doctor;
    if (updates.therapist !== undefined) visit.therapist = updates.therapist;
    if (updates.therapy !== undefined) visit.therapy = updates.therapy;
    if (updates.checkInTime) visit.checkInTime = new Date(updates.checkInTime);
    if (updates.checkOutTime)
      visit.checkOutTime = new Date(updates.checkOutTime);

    await visit.save();
    res.status(200).json({ message: "Visit updated successfully", visit });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 7. Update case study for a visit
const updateCaseStudy = async (req, res) => {
  try {
    const { visitId } = req.params;
    const { caseStudy } = req.body;

    const visit = await Visit.findByIdAndUpdate(
      visitId,
      { caseStudy },
      { new: true }
    );

    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    res.status(200).json({ message: "Case study updated", visit });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 8. Get case study of a visit
const getCaseStudy = async (req, res) => {
  try {
    const { visitId } = req.params;
    const visit = await Visit.findById(visitId).select("caseStudy");

    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    res.status(200).json({ caseStudy: visit.caseStudy });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getGroupedCaseStudies = async (req, res) => {
  try {
    const grouped = await Visit.aggregate([
      {
        $match: {
          caseStudy: { $ne: null },
          type: "IP", // Only for IP patients — optional
        },
      },
      {
        $group: {
          _id: {
            checkIn: "$checkInTime",
            checkOut: "$checkOutTime",
          },
          caseStudies: {
            $push: {
              caseStudy: "$caseStudy",
            },
          },
        },
      },
      {
        $sort: {
          "_id.checkIn": 1,
        },
      },
    ]);

    res.status(200).json(grouped);
  } catch (err) {
    console.error("Error fetching grouped case studies:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createVisit,
  checkoutVisit,
  getVisitHistory,
  getAllActiveInpatients,
  getAllCheckedOutPatients,
  editVisit,
  updateCaseStudy,
  getCaseStudy,
  getGroupedCaseStudies,
};
