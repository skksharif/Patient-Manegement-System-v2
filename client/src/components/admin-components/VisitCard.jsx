import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import BASE_URL from "../config";
import DailyTreatmentsPanel from "./DailyTreatmentsPanel";
import CaseStudyModal from "./CaseStudyModal";
import "./VisitCard.css";

export default function VisitCard({ visit, onCheckout, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [showDailyPanel, setShowDailyPanel] = useState(false);
  const [showCaseModal, setShowCaseModal] = useState(false);

  const [form, setForm] = useState({
    reason: "",
    note: "",
    doctor: "",
    therapist: "",
    roomNo: "",
    caseStudy: "",
    checkInTime: null,
    checkOutTime: null,
  });

  useEffect(() => {
    setForm({
      reason: visit.reason || "",
      note: visit.note || "",
      doctor: visit.doctor || "",
      therapist: visit.therapist || "",
      roomNo: visit.roomNo || "",
      caseStudy: visit.caseStudy || "",
      checkInTime: visit.checkInTime ? new Date(visit.checkInTime) : null,
      checkOutTime: visit.checkOutTime ? new Date(visit.checkOutTime) : null,
    });
  }, [visit]);

  const formatDate = (date) => {
    if (!date) return "Not Available";
    const d = new Date(date);
    const dateStr = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const timeStr = d.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${dateStr}  |  ${timeStr}`;
  };
  const handleSave = async () => {
    try {
      const payload = {
        ...form,
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

  return (
    <>
      <div className="visit-card">
        {!editing && (
          <button className="edit-btn" onClick={() => setEditing(true)}>
            Edit
          </button>
        )}

        <div className="visit-left">
          <p>
            <strong>Type:</strong> {visit.type}
          </p>

          {editing ? (
            <>
              <input
                placeholder="Reason"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
              <input
                placeholder="Note"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
              <input
                placeholder="Doctor"
                value={form.doctor}
                onChange={(e) => setForm({ ...form, doctor: e.target.value })}
              />
            </>
          ) : (
            <>
              <p>
                <strong>Reason:</strong> {visit.reason}
              </p>
              <p>
                <strong>Note:</strong> {visit.note}
              </p>
              <p>
                <strong>Doctor:</strong> {visit.doctor || "Not Assigned"}
              </p>
            </>
          )}
        </div>

        <div className="visit-right">
          {editing ? (
            <>
              <input
                placeholder="Room No"
                value={form.roomNo}
                onChange={(e) => setForm({ ...form, roomNo: e.target.value })}
              />

              <label>
                <strong>Check-In:</strong>
              </label>
              <DatePicker
                selected={form.checkInTime}
                onChange={(date) => setForm({ ...form, checkInTime: date })}
                showTimeSelect
                timeFormat="hh:mm aa"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy | h:mm aa"
                placeholderText="Select check-in time"
                popperPlacement="top"
                className="datepicker-input"
              />

              <label>
                <strong>Check-Out:</strong>
              </label>
              <DatePicker
                selected={form.checkOutTime}
                onChange={(date) => setForm({ ...form, checkOutTime: date })}
                showTimeSelect
                timeFormat="hh:mm aa"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy h:mm aa"
                placeholderText="Select check-out time"
                popperPlacement="top"
                className="datepicker-input"
              />
            </>
          ) : (
            <>
              <p>
                <strong>Room No:</strong> {visit.roomNo || "Not Assigned"}
              </p>
              <p>
                <strong>Check-In:</strong> {formatDate(visit.checkInTime, true)}
              </p>
              <p>
                <strong>Check-Out:</strong>{" "}
                {visit.checkOutTime
                  ? formatDate(visit.checkOutTime, true)
                  : "Not yet"}
              </p>
            </>
          )}

          <p>
            <strong>Next Visit:</strong> {formatDate(visit.nextVisit)}
          </p>

          <div className="button-group">
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
                <button
                  className="button-indigo"
                  onClick={() => setShowCaseModal(true)}
                >
                  Case Study
                </button>
                {/* Show Checkout only if not already checked out and not OP */}
                {visit.type !== "OP" && !visit.checkOutTime && (
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
