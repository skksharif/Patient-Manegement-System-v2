import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import BASE_URL from "../config";
import "./DailyTreatmentsPanel.css";

export default function DailyTreatmentsPanel({ visible, visitId, onClose }) {
  const [form, setForm] = useState({
    date: null,
    morning: "",
    morningTherapist: "",
    evening: "",
    eveningTherapist: "",
  });
  const [treatments, setTreatments] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (visible && visitId) fetchTreatments();
  }, [visible, visitId]);

  const fetchTreatments = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/treatments/${visitId}/daily-treatment`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTreatments(res.data);
    } catch {
      toast.error("Failed to fetch treatments");
    }
  };

  const handleSave = async () => {
    if (!form.date) return toast.error("Date is required");

    try {
      const payload = {
        date: form.date.toISOString(),
        morning: {
          therapy: form.morning,
          therapist: form.morningTherapist,
        },
        evening: {
          therapy: form.evening,
          therapist: form.eveningTherapist,
        },
      };

      if (editingId) {
        await axios.put(`${BASE_URL}/api/treatments/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Treatment updated");
      } else {
        await axios.post(
          `${BASE_URL}/api/treatments/${visitId}/daily-treatment`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Treatment added");
      }

      resetForm();
      fetchTreatments();
    } catch {
      toast.error("Failed to save treatment");
    }
  };

  const handleEdit = (t) => {
    setEditingId(t._id);
    setForm({
      date: new Date(t.date),
      morning: t.morning.therapy,
      morningTherapist: t.morning.therapist || "",
      evening: t.evening.therapy,
      eveningTherapist: t.evening.therapist || "",
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      date: null,
      morning: "",
      morningTherapist: "",
      evening: "",
      eveningTherapist: "",
    });
  };

  const filtered = treatments.filter((t) => {
    const q = search.toLowerCase();
    return (
      new Date(t.date).toLocaleDateString().includes(q) ||
      t.morning.therapy.toLowerCase().includes(q) ||
      t.evening.therapy.toLowerCase().includes(q)
    );
  });

  if (!visible) return null;

  return (
    <div className="daily-treatments-panel">
      <div className="left-panel">
        <h3 className="panel-heading">
          {editingId ? "Edit" : "Add"} Daily Treatment
        </h3>

        <label className="form-label">Date</label>
        <DatePicker
          selected={form.date}
          onChange={(date) => setForm({ ...form, date })}
          dateFormat="dd/MM/yyyy"
          placeholderText="Select date"
          className="form-input"
          popperPlacement="top"
        />

        <label className="form-label">Morning Therapy</label>
        <textarea
          className="form-textarea"
          placeholder="Therapy"
          value={form.morning}
          onChange={(e) => setForm({ ...form, morning: e.target.value })}
        />
        <input
          className="form-input"
          placeholder="Therapist Name"
          value={form.morningTherapist}
          onChange={(e) =>
            setForm({ ...form, morningTherapist: e.target.value })
          }
        />

        <label className="form-label">Evening Therapy</label>
        <textarea
          className="form-textarea"
          placeholder="Therapy"
          value={form.evening}
          onChange={(e) => setForm({ ...form, evening: e.target.value })}
        />
        <input
          className="form-input"
          placeholder="Therapist Name"
          value={form.eveningTherapist}
          onChange={(e) =>
            setForm({ ...form, eveningTherapist: e.target.value })
          }
        />

        <div className="button-group">
          <button className="btn btn-clear" onClick={resetForm}>
            Clear
          </button>
          <button className="btn btn-save" onClick={handleSave}>
            {editingId ? "Update" : "Save"}
          </button>
        </div>
      </div>

      <div className="right-panel">
        <div className="top-bar">
          <h3 className="panel-heading">DAILY TREATMENTS REPORT</h3>
          <input
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by date"
          />
        </div>
        <div className="treatment-table-container">
          {filtered.length === 0 ? (
            <p className="no-records-text">No records found</p>
          ) : (
            <div className="report-container">
              <table className="treatment-table redesigned">
                <thead>
                  <tr>
                    <th rowSpan="2">DATE</th>
                    <th colSpan="2">MORNING</th>
                    <th colSpan="2">EVENING</th>
                  </tr>
                  <tr>
                    <th>THERAPY</th>
                    <th>THERAPIST</th>
                    <th>THERAPY</th>
                    <th>THERAPIST</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((t) => (
                      <tr key={t._id} onDoubleClick={() => handleEdit(t)}>
                        <td>
                          {new Date(t.date).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </td>
                        <td>{t.morning.therapy || "—"}</td>
                        <td>{t.morning.therapist || "—"}</td>
                        <td>{t.evening.therapy || "—"}</td>
                        <td>{t.evening.therapist || "—"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <button className="btn btn-close" onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
}
