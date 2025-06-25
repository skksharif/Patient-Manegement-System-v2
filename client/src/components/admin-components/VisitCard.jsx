import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";

import BASE_URL from "../config";
import DailyTreatmentsPanel from "./DailyTreatmentsPanel";
import CaseStudyModal from "./CaseStudyModal";
import "./VisitCard.css";

export default function VisitCard({ visit, onCheckout, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [showDailyPanel, setShowDailyPanel] = useState(false);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm({
      reason: visit.reason || "",
      note: visit.note || "",
      therapy: visit.therapy || "",
      doctor: visit.doctor || "",
      therapist: visit.therapist || "",
      roomNo: visit.roomNo || "",
      checkInTime: visit.checkInTime ? new Date(visit.checkInTime) : null,
      checkOutTime: visit.checkOutTime ? new Date(visit.checkOutTime) : null,
    });
  }, [visit]);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (date) => {
    if (!date) return "Not Available";
    const d = new Date(date);
    return `${d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })} | ${d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  };

  const handleSave = async () => {
    try {
      const payload = {
        doctor: form.doctor,
        reason: form.reason,
        note: form.note,
        therapist: form.therapist,
        therapy: form.therapy,
        roomNo: form.roomNo,
        checkInTime: form.checkInTime?.toISOString(),
        checkOutTime: form.checkOutTime?.toISOString(),
      };

      await axios.put(`${BASE_URL}/api/visits/edit/${visit._id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("Visit updated");
      setEditing(false);
      onRefresh();
    } catch (err) {
      toast.error("Failed to update visit");
    }
  };

  const renderInputGroup = (label, field, type = "text") => (
    <div className="form-group">
      <label>{label}</label>
      {type === "textarea" ? (
        <textarea
          value={form[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
        />
      ) : (
        <input
          type={type}
          value={form[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
        />
      )}
    </div>
  );

  const renderDatePicker = (label, field) => (
    <div className="form-group">
      <label>{label}</label>
      <DatePicker
        selected={form[field]}
        onChange={(date) => handleInputChange(field, date)}
        showTimeSelect
        timeFormat="hh:mm aa"
        timeIntervals={15}
        dateFormat="dd/MM/yyyy | h:mm aa"
        className="datepicker-input"
      />
    </div>
  );

  return (
    <>
      <div
        className={`visit-card ${
          visit.type === "IP" ? "ip-visit" : "op-visit"
        }`}
      >
        {!editing && (
          <button className="edit-btn" onClick={() => setEditing(true)}>
            <FaRegEdit />
          </button>
        )}

        <div className="visit-data">
          <p>
            <strong>Type:</strong> {visit.type}
          </p>

          {editing ? (
            <>
              {visit.type === "OP" && (
                <>
                  {renderInputGroup("Therapy", "therapy")}
                  {renderInputGroup("Therapist", "therapist")}
                  {renderDatePicker("Date", "checkInTime")}
                </>
              )}

              {visit.type === "IP" && (
                <>
                  {renderInputGroup("Doctor", "doctor")}
                  {renderInputGroup("Reason", "reason")}
                  {renderInputGroup("Note", "note", "textarea")}
                  {renderInputGroup("Room No", "roomNo")}
                  {renderDatePicker("Check-In", "checkInTime")}
                  {renderDatePicker("Check-Out", "checkOutTime")}
                </>
              )}
            </>
          ) : (
            <>
              {visit.type === "OP" && (
                <>
                  <p>
                    <strong>Therapy:</strong> {visit.therapy || "Not Set"}
                  </p>
                  <p>
                    <strong>Therapist:</strong>{" "}
                    {visit.therapist || "Not Assigned"}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(visit.checkInTime).toLocaleDateString("en-In")}
                  </p>
                </>
              )}
              {visit.type === "IP" && (
                <>
                  <p>
                    <strong>Doctor:</strong> {visit.doctor || "Not Assigned"}
                  </p>
                  <p>
                    <strong>Reason:</strong> {visit.reason}
                  </p>
                  <p>
                    <strong>Note:</strong> {visit.note || "No note"}
                  </p>
                  <p>
                    <strong>Room No:</strong> {visit.roomNo || "Not Assigned"}
                  </p>
                  <p>
                    <strong>Check-In:</strong> {formatDate(visit.checkInTime)}
                  </p>
                  <p>
                    <strong>Check-Out:</strong>{" "}
                    {visit.checkOutTime
                      ? formatDate(visit.checkOutTime)
                      : "Not yet"}
                  </p>
                </>
              )}
            </>
          )}
        </div>

        <div className="visit-actions">
          <div className="button-group-vc">
            {editing ? (
              <>
                <button className="button-green" onClick={handleSave}>
                  Save
                </button>
                <button
                  className="button-red"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {visit.type === "IP" && (
                  <button
                    className="button-green"
                    onClick={() => setShowDailyPanel(true)}
                  >
                    Daily Treatments
                  </button>
                )}

                {visit.type === "IP" && (
                  <button
                    className="button-indigo"
                    onClick={() => setShowCaseModal(true)}
                  >
                    Case Study
                  </button>
                )}

                {visit.type === "IP" && !visit.checkOutTime && (
                  <button className="button-red" onClick={onCheckout}>
                    Checkout
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showDailyPanel && (
        <DailyTreatmentsPanel
          visible={showDailyPanel}
          visitId={visit._id}
          onClose={() => setShowDailyPanel(false)}
        />
      )}

      {showCaseModal && (
        <CaseStudyModal
          visitId={visit._id}
          existingCaseStudy={visit.caseStudy}
          onClose={() => setShowCaseModal(false)}
          onSaved={onRefresh}
        />
      )}
    </>
  );
}
