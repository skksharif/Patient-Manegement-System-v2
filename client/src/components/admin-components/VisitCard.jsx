import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";
import CaseStudyModal from "./CaseStudyModal";
import "./VisitCard.css";

export default function VisitCard({
  visit,
  onCheckout,
  onAdd,
  onView,
  onRefresh,
}) {
  const [editing, setEditing] = useState(false);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [form, setForm] = useState({
    reason: visit.reason || "",
    note: visit.note || "",
    doctor: visit.doctor || "",
    therapist: visit.therapist || "",
    roomNo: visit.roomNo || "",
    caseStudy: visit.caseStudy || "",
    checkInTime: visit.checkInTime || "",
    checkOutTime: visit.checkOutTime || "",
    nextVisit: visit.nextVisit || "",
  });

  useEffect(() => {
    setForm({
      reason: visit.reason || "",
      note: visit.note || "",
      doctor: visit.doctor || "",
      therapist: visit.therapist || "",
      roomNo: visit.roomNo || "",
      caseStudy: visit.caseStudy || "",
      checkInTime: visit.checkInTime || "",
      checkOutTime: visit.checkOutTime || "",
      nextVisit: visit.nextVisit || "",
    });
  }, [visit]);

  const formatDate = (dateStr, includeTime = false) => {
    if (!dateStr) return "Not Available";
    const date = new Date(dateStr);
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    if (!includeTime) return `${d}/${m}/${y}`;
    const h = date.getHours() % 12 || 12;
    const min = String(date.getMinutes()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    return `${d}/${m}/${y}, ${h}:${min} ${ampm}`;
  };

  const handleSave = async () => {
    try {
      const updatedForm = {
        ...form,
        checkInTime: form.checkInTime
          ? new Date(form.checkInTime).toISOString()
          : null,
        checkOutTime: form.checkOutTime
          ? new Date(form.checkOutTime).toISOString()
          : null,
      };

      console.log("Sending update:", updatedForm);

      await axios.put(`${BASE_URL}/api/visits/edit/${visit._id}`, updatedForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("Visit updated");
      setEditing(false);
      onRefresh();
    } catch (err) {
      console.error(err.response?.data || err.message);
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
              <input
                placeholder="Therapist"
                value={form.therapist}
                onChange={(e) =>
                  setForm({ ...form, therapist: e.target.value })
                }
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
              <p>
                <strong>Therapist:</strong> {visit.therapist || "Not Assigned"}
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
              <input
                type="datetime-local"
                value={
                  form.checkInTime
                    ? new Date(form.checkInTime).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setForm({ ...form, checkInTime: e.target.value })
                }
              />

              <label>
                <strong>Check-Out:</strong>
              </label>
              <input
                type="datetime-local"
                value={
                  form.checkOutTime
                    ? new Date(form.checkOutTime).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setForm({ ...form, checkOutTime: e.target.value })
                }
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
                  <>
                    <button className="button-green" onClick={onAdd}>
                      Add Daily Treatment
                    </button>
                    <button className="button-green" onClick={onView}>
                      View Treatments
                    </button>
                  </>
                )}
                <button
                  className="button-indigo"
                  onClick={() => setShowCaseModal(true)}
                >
                  Case Study
                </button>
                {!visit.checkOutTime && (
                  <button className="button-red" onClick={onCheckout}>
                    Checkout
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

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
