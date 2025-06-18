import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";
import "./ViewTreatmentsModal.css";

export default function ViewTreatmentsModal({ visible, treatments, onClose }) {
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [editForm, setEditForm] = useState({
    date: "",
    morning: "",
    morningTherapist: "",
    evening: "",
    eveningTherapist: "",
  });

  if (!visible) return null;

  const handleEditClick = (t) => {
    setEditingId(t._id);
    setEditForm({
      date: t.date,
      morning: t.morning.therapy,
      morningTherapist: t.morning.therapist || "",
      evening: t.evening.therapy,
      eveningTherapist: t.evening.therapist || "",
    });
  };

  const handleEditSave = async () => {
    try {
      await axios.put(
        `${BASE_URL}/api/treatments/${editingId}`,
        {
          date: editForm.date,
          morning: {
            therapy: editForm.morning,
            therapist: editForm.morningTherapist,
          },
          evening: {
            therapy: editForm.evening,
            therapist: editForm.eveningTherapist,
          },
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Treatment updated");
      setEditingId(null);
      onClose();
    } catch {
      toast.error("Update failed");
    }
  };

  const filteredTreatments = treatments.filter((t) => {
    const query = search.toLowerCase();
    return (
      new Date(t.date).toLocaleDateString().includes(query) ||
      t.morning.therapy.toLowerCase().includes(query) ||
      t.evening.therapy.toLowerCase().includes(query)
    );
  });

  return (
    <div className="view-treatments-overlay">
      <div className="view-treatments-modal">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>Daily Treatments</h2>

        <input
          type="text"
          placeholder="Search by date or therapy"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="treatment-search"
        />

        {filteredTreatments.length === 0 ? (
          <p>No matching records</p>
        ) : (
          <ul className="view-treatments-list">
            {filteredTreatments
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((t) => (
                <li key={t._id} className="view-treatment-card">
                  <div className="view-treatment-date">
                    {new Date(t.date).toLocaleDateString()}
                  </div>
                  <div className="view-treatment-info">
                    <div className="view-treatment-section">
                      <div className="view-treatment-label">Morning Therapy</div>
                      <div className="view-treatment-value">{t.morning.therapy || "—"}</div>
                      <small>Therapist: {t.morning.therapist || "—"}</small>
                    </div>
                    <div className="view-treatment-section">
                      <div className="view-treatment-label">Evening Therapy</div>
                      <div className="view-treatment-value">{t.evening.therapy || "—"}</div>
                      <small>Therapist: {t.evening.therapist || "—"}</small>
                    </div>
                    <button onClick={() => handleEditClick(t)}>Edit</button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
