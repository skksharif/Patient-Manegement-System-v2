import React, { useState } from "react";
import "./AddPatient.css";
import axios from "axios";
import BASE_URL from "../config";
import toast, { Toaster } from "react-hot-toast";

export default function AddPatient() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    aadharNo: "",
    gender: "",
    age: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { name, phone, gender } = form;
    if (!name || !phone || !gender) return "Name, Phone, and Gender are required";
    if (!/^\d{10}$/.test(phone)) return "Phone must be 10 digits";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return toast.error(error);

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/patients/add-patient`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Patient added successfully!");
      setForm({
        name: "",
        phone: "",
        aadharNo: "",
        gender: "",
        age: "",
        address: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.error +err.response?.data?.name);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-entry-container">
      <Toaster position="top-right" />
      <h2 className="patient-entry-heading">Add New Patient</h2>
      <form onSubmit={handleSubmit} className="patient-entry-form">
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="patient-entry-input"
        />
        <input
          name="phone"
          placeholder="Phone (10 digits)"
          value={form.phone}
          onChange={handleChange}
          className="patient-entry-input"
        />
        <input
          name="aadharNo"
          placeholder="Aadhar Number (Optional)"
          value={form.aadharNo}
          onChange={handleChange}
          className="patient-entry-input"
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="patient-entry-select"
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input
          name="age"
          type="number"
          placeholder="Age (Optional)"
          value={form.age}
          onChange={handleChange}
          className="patient-entry-input"
        />
        <textarea
          name="address"
          placeholder="Address (Optional)"
          value={form.address}
          onChange={handleChange}
          className="patient-entry-textarea"
          rows="3"
        />
        <button type="submit" disabled={loading} className="patient-entry-submit-button">
          {loading ? <span className="patient-entry-spinner"></span> : "Add Patient"}
        </button>
      </form>
    </div>
  );
}
