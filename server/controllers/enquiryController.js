const Enquiry = require("../models/Enquiry");

exports.createEnquiry = async (req, res) => {
  try {
    const { name, phone, date, enquiry } = req.body;

    const newEnquiry = new Enquiry({
      name,
      phone,
      date: date || Date.now(),
      enquiry,
    });

    await newEnquiry.save();
    res.status(201).json({ message: "Enquiry recorded successfully", enquiry: newEnquiry });
  } catch (error) {
    res.status(500).json({ error: "Failed to record enquiry", details: error.message });
  }
};

exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ date: -1 }); // recent first
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enquiries", details: error.message });
  }
};