import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import BASE_URL from "../config";
import "./Upcoming.css";
import AdmitModal from "./AdmitModal";
import { useNavigate } from "react-router-dom";

const TABS = ["Scheduled", "Completed"];

export default function Upcoming() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "Male",
    plannedVisitDate: new Date(),
  });
  const [patients, setPatients] = useState([]);
  const [statusTab, setStatusTab] = useState("Scheduled");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [admitModalOpen, setAdmitModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate = useNavigate();

  const handleAdmit = (patient) => {
    setSelectedPatient(patient);
    setAdmitModalOpen(true);
  };

  const fetchPatients = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/upcoming/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPatients(data);
    } catch {
      toast.error("Failed to fetch patients");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [admitModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      plannedVisitDate: form.plannedVisitDate.toISOString(),
    };

    try {
      if (editId) {
        await axios.put(`${BASE_URL}/api/upcoming/edit/${editId}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Patient updated");
      } else {
        await axios.post(`${BASE_URL}/api/upcoming/register`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Patient added");
      }
      setForm({
        name: "",
        phone: "",
        gender: "Male",
        plannedVisitDate: new Date(),
      });
      setEditId(null);
      fetchPatients();
    } catch (err) {
      toast.error(err.response?.data?.error || "Operation failed");
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      phone: p.phone,
      gender: p.gender,
      plannedVisitDate: new Date(p.plannedVisitDate),
    });
    setEditId(p._id);
  };

  const cancelEdit = () => {
    setForm({
      name: "",
      phone: "",
      gender: "Male",
      plannedVisitDate: new Date(),
    });
    setEditId(null);
  };

  const handleGoToHistory = async (phone) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/patients/check?phone=${phone}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.exists) {
        navigate(`/admin-home/patient/${res.data.patient._id}`);
      } else {
        toast.error("Patient not found");
      }
    } catch {
      toast.error("Error fetching patient");
    }
  };

  const filtered = patients
    .filter((p) => p.status === statusTab)
    .filter((p) =>
      [p.name, p.phone].some((val) =>
        val.toLowerCase().includes(search.toLowerCase())
      )
    );

  return (
    <div className="upcoming-container">
      <h2 className="heading">Upcoming Registrations</h2>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="inner-form-container">
          <input
            placeholder="Name"
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Phone"
            className="input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <select
            className="input"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <DatePicker
            selected={form.plannedVisitDate}
            onChange={(date) => setForm({ ...form, plannedVisitDate: date })}
            className="input"
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <div className="btn-row">
          <button type="submit" className="submit-btn">
            {editId ? "Update" : "Add Patient"}
          </button>
          {editId && (
            <button type="button" className="btn-cancel" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusTab(tab)}
            className={`tab-btn ${statusTab === tab ? "active-tab" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Search by name or phone"
        className="input search-box"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Date of Visit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const visitDate = new Date(p.plannedVisitDate);
              visitDate.setHours(0, 0, 0, 0);
              let rowClass = "";
              if (statusTab === "Completed") rowClass = "row-green";
              else if (visitDate < today) rowClass = "row-red";
              else if (visitDate.getTime() === today.getTime())
                rowClass = "row-orange";

              return (
                <tr
                  key={p._id}
                  onDoubleClick={() => handleEdit(p)}
                  className={rowClass}
                  style={{ cursor: "pointer" }}
                >
                  <td>{p.name}</td>
                  <td>{p.phone}</td>
                  <td>{p.gender}</td>
                  <td>{visitDate.toLocaleDateString("en-IN")}</td>
                  <td>
                    {p.status === "Completed" ? (
                      <button
                        className="btn-history"
                        onClick={() => handleGoToHistory(p.phone)}
                      >
                        Go to History
                      </button>
                    ) : (
                      <button
                        className="btn-history"
                        onClick={() => handleAdmit(p)}
                      >
                        Admit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="no-records">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdmitModal
        isOpen={admitModalOpen}
        onClose={() => setAdmitModalOpen(false)}
        patient={selectedPatient}
        onAdmit={fetchPatients}
      />
    </div>
  );
}
