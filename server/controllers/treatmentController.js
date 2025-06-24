const DailyTreatment = require("../models/DailyTreatment");
const Visit = require("../models/Visit");

// Add a daily treatment report
const addDailyTreatment = async (req, res) => {
  const { visitId } = req.params;
  const { date, morning, evening } = req.body;

  try {
    const visit = await Visit.findById(visitId);
    if (!visit) {
      return res.status(404).json({ error: "Visit not found" });
    }

    const treatment = new DailyTreatment({
      visitId,
      date,
      morning,
      evening,
    });

    await treatment.save();

    visit.dailyTreatments.push(treatment._id);
    await visit.save();

    res.status(201).json({ message: "Daily treatment added successfully" });
  } catch (err) {
    console.error("Add Treatment Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getTreatmentsByCheckInOut = async (req, res) => {
  try {
    const grouped = await DailyTreatment.aggregate([
      {
        $lookup: {
          from: "visits",
          localField: "visitId",
          foreignField: "_id",
          as: "visit"
        }
      },
      { $unwind: "$visit" },
      {
        $group: {
          _id: {
            checkIn: "$visit.checkInTime",
            checkOut: "$visit.checkOutTime"
          },
          treatments: { $push: "$$ROOT" }
        }
      },
      {
        $project: {
          checkIn: "$_id.checkIn",
          checkOut: "$_id.checkOut",
          treatments: 1,
          _id: 0
        }
      },
      { $sort: { checkIn: 1 } }
    ]);

    res.status(200).json(grouped);
  } catch (err) {
    console.error("Error fetching grouped treatments", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all daily treatments for a visit
const getDailyTreatments = async (req, res) => {
  const { visitId } = req.params;

  try {
    const treatments = await DailyTreatment.find({ visitId }).sort({ date: 1 });
    res.status(200).json(treatments);
  } catch (err) {
    console.error("Fetch Treatments Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Edit daily treatment
const updateDailyTreatment = async (req, res) => {
  const { treatmentId } = req.params;
  const { date, morning, evening } = req.body;

  try {
    const treatment = await DailyTreatment.findById(treatmentId);
    if (!treatment) {
      return res.status(404).json({ error: "Treatment not found" });
    }

    treatment.date = date || treatment.date;
    treatment.morning = morning || treatment.morning;
    treatment.evening = evening || treatment.evening;

    await treatment.save();
    res.status(200).json({ message: "Treatment updated successfully" });
  } catch (err) {
    console.error("Update Treatment Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addDailyTreatment,
  getDailyTreatments,
  updateDailyTreatment,
  getTreatmentsByCheckInOut
};
