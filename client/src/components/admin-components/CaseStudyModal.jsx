import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";
import "./CaseStudyModal.css";

export default function CaseStudyModal({ visitId, existingCaseStudy, onClose, onSaved }) {
  const [text, setText] = useState(existingCaseStudy || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`${BASE_URL}/api/visits/case-study/${visitId}`, {
        caseStudy: text,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Case study saved");
      onSaved();
      onClose();
    } catch {
      toast.error("Failed to save case study");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Case Study</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Enter case study notes here..."
        />
        <div className="modal-buttons">
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={onClose} className="case-close">Close</button>
        </div>
      </div>
    </div>
  );
}
