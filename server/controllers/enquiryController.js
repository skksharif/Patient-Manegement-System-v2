const Enquiry = require("../models/Enquiry");


exports.createEnquiry = async (req, res) => {
  try {
    const { name, phone, enquiry, date } = req.body;

    const newEnquiry = new Enquiry({
      name,
      phone,
      enquiry,
      date: date || Date.now(),
    });

    await newEnquiry.save();
    res.status(201).json({ message: "Enquiry recorded", enquiry: newEnquiry });
  } catch (error) {
    res.status(500).json({ error: "Failed to record enquiry", details: error.message });
  }
};

exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ date: -1 });
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enquiries", details: error.message });
  }
};

exports.updateEnquiry = async (req, res) => {
  try {
    const updated = await Enquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Enquiry not found" });
    res.status(200).json({ message: "Enquiry updated", enquiry: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to update enquiry", details: error.message });
  }
};
