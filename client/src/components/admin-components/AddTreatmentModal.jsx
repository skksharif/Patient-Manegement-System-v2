// AddTreatmentModal.js
import React from "react";
import "./AddTreatmentModal.css";


export default function AddTreatmentModal({ visible, form, setForm, onCancel, onSave }) {
  if (!visible) return null;

  return (
    <div className="fullscreen-modal">
      <div className="modal-content">
        <h2>Add Daily Treatment</h2>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <textarea
          placeholder="Morning Therapy"
          value={form.morning}
          onChange={(e) => setForm({ ...form, morning: e.target.value })}
        />
        <textarea
          placeholder="Evening Therapy"
          value={form.evening}
          onChange={(e) => setForm({ ...form, evening: e.target.value })}
        />
        <div className="modal-buttons">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
