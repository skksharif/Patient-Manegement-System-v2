import React from "react";
import "./AddTreatmentModal.css";

export default function AddTreatmentModal({ visible, form, setForm, onCancel, onSave }) {
  if (!visible) return null;

  return (
    <div className="fullscreen-modal">
      <div className="modal-content olive-theme">
        <h2>Add Daily Treatment</h2>

        <label>Date</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <label>Morning Therapy</label>
        <textarea
          placeholder="Morning Therapy Description"
          value={form.morning}
          onChange={(e) => setForm({ ...form, morning: e.target.value })}
        />

        <input
          type="text"
          placeholder="Morning Therapist Name"
          value={form.morningTherapist || ""}
          onChange={(e) => setForm({ ...form, morningTherapist: e.target.value })}
        />

        <label>Evening Therapy</label>
        <textarea
          placeholder="Evening Therapy Description"
          value={form.evening}
          onChange={(e) => setForm({ ...form, evening: e.target.value })}
        />

        <input
          type="text"
          placeholder="Evening Therapist Name"
          value={form.eveningTherapist || ""}
          onChange={(e) => setForm({ ...form, eveningTherapist: e.target.value })}
        />

        <div className="modal-buttons">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
