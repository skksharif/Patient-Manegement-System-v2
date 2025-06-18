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
    const { name, phone, aadharNo, gender, age, address } = form;
    if (!name || !phone || !aadharNo || !gender || !age || !address)
      return "All fields are required";
    if (!/^\d{10}$/.test(phone)) return "Phone must be 10 digits";
    if (!/^\d{12}$/.test(aadharNo)) return "Aadhar must be 12 digits";
    if (age <= 0) return "Age must be a positive number";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) return toast.error(validationError);

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/patients/add-patient`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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
      console.log(err);
      toast.error(err.response?.data?.error || "Failed to add patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-form-container">
      <Toaster position="top-right" />
      <h2 className="form-title">Add New Patient</h2>
      <form onSubmit={handleSubmit} className="patient-form">
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Phone (10 digits)"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          name="aadharNo"
          placeholder="Aadhar Number (12 digits)"
          value={form.aadharNo}
          onChange={handleChange}
        />
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input
          name="age"
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />
        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          rows="3"
        />
        <button type="submit" disabled={loading}>
          {loading ? <span className="spinner"></span> : "Add Patient"}
        </button>
      </form>
    </div>
  );
}
