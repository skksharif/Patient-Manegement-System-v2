// ViewTreatmentsModal.js
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";

export default function ViewTreatmentsModal({ visible, treatments, onClose }) {
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ date: "", morning: "", evening: "" });

  if (!visible) return null;

  const handleEditClick = (t) => {
    setEditing(t._id);
    setEditForm({
      date: t.date,
      morning: t.morning.therapy,
      evening: t.evening.therapy,
    });
  };

  const handleEditSave = async () => {
    try {
      await axios.put(
        `${BASE_URL}/api/treatments/${editing}`,
        {
          date: editForm.date,
          morning: { therapy: editForm.morning, therapist: "" },
          evening: { therapy: editForm.evening, therapist: "" },
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Treatment updated successfully");
      setEditing(null);
      onClose(); // Trigger refresh from parent
    } catch {
      toast.error("Failed to update treatment");
    }
  };

  return (
    <div className="fullscreen-modal view-dt">
      <div className="modal-content">
        <h2>Daily Treatments</h2>
        {treatments.length === 0 ? (
          <p>No records</p>
        ) : (
          <ul>
            {treatments.map((t, i) => (
              <li key={i}>
                {editing === t._id ? (
                  <>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    />
                    <textarea
                      placeholder="Morning Therapy"
                      value={editForm.morning}
                      onChange={(e) => setEditForm({ ...editForm, morning: e.target.value })}
                    />
                    <textarea
                      placeholder="Evening Therapy"
                      value={editForm.evening}
                      onChange={(e) => setEditForm({ ...editForm, evening: e.target.value })}
                    />
                    <button onClick={handleEditSave}>Save</button>
                    <button onClick={() => setEditing(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <strong>{t.date}</strong>
                    <br />
                    Morning: {t.morning.therapy}
                    <br />
                    Evening: {t.evening.therapy}
                    <br />
                    <button onClick={() => handleEditClick(t)}>Edit</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="modal-buttons">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
