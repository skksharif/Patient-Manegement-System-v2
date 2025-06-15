import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";
import "./VisitHistory.css";

export default function VisitHistory({ visits }) {
  const [loadingVisitId, setLoadingVisitId] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(null);
  const [nextVisitDate, setNextVisitDate] = useState("");

  const [reportModal, setReportModal] = useState(null);
  const [reportNote, setReportNote] = useState("");
  const [savingReportId, setSavingReportId] = useState(null);
  const [dailyReports, setDailyReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

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

  const handleCheckOut = async (visitId) => {
    setLoadingVisitId(visitId);
    try {
      await axios.put(
        `${BASE_URL}/api/visits/checkout/${visitId}`,
        { nextVisit: nextVisitDate || null },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Checked out successfully");
      window.location.reload();
    } catch {
      toast.error("Failed to check out");
    } finally {
      setLoadingVisitId(null);
      setShowCheckoutModal(null);
      setNextVisitDate("");
      document.body.classList.remove("overflow-hidden");
    }
  };

  const handleSaveReport = async (visitId) => {
    setSavingReportId(visitId);
    try {
      await axios.post(
        `${BASE_URL}/api/visits/${visitId}/daily-report`,
        { note: reportNote },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Report saved!");
      window.location.reload();
    } catch {
      toast.error("Failed to save report");
    } finally {
      setSavingReportId(null);
      setReportModal(null);
      setReportNote("");
      document.body.classList.remove("overflow-hidden");
    }
  };

  const handleViewReports = async (visitId) => {
    setLoadingReports(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/visits/${visitId}/daily-report`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDailyReports(res.data);
      setReportModal({ id: visitId, mode: "view" });
      document.body.classList.add("overflow-hidden");
    } catch {
      toast.error("Failed to fetch reports");
    } finally {
      setLoadingReports(false);
    }
  };

  return (
    <div className="visit-history-container">
      <h2 className="title">Visit History</h2>
      {visits.length === 0 ? (
        <p className="text-muted">No visits yet.</p>
      ) : (
        <div className="visit-list">
          {visits.map((visit) => (
            <div className="visit-card" key={visit._id}>
              <div className="visit-left">
                <p><strong>Type:</strong> {visit.type}</p>
                <p><strong>Reason:</strong> {visit.reason}</p>
                <p><strong>Note:</strong> {visit.note}</p>
                <p><strong>Doctor:</strong> {visit.doctor || "Not Assigned"}</p>
                <p><strong>Therapist:</strong> {visit.therapist || "Not Assigned"}</p>
              </div>
              <div className="visit-right">
                <p><strong>Room No:</strong> {visit.roomNo || "Not Assigned"}</p>
                <p><strong>Check-In:</strong> {formatDate(visit.checkInTime, true)}</p>
                <p><strong>Check-Out:</strong> {visit.checkOutTime ? formatDate(visit.checkOutTime, true) : "Not yet"}</p>
                <p><strong>Next Visit:</strong> {formatDate(visit.nextVisit)}</p>

                {!visit.checkOutTime && visit.checkInTime && (
                  <div className="button-group">
                    <button onClick={() => {
                      setShowCheckoutModal(visit._id);
                      document.body.classList.add("overflow-hidden");
                    }}>
                      Checkout
                    </button>
                    {visit.type === "IP" && (
                      <>
                        <button onClick={() => {
                          setReportModal({ id: visit._id, mode: "enter" });
                          setReportNote("");
                          document.body.classList.add("overflow-hidden");
                        }}>
                          Enter Note
                        </button>
                        <button onClick={() => handleViewReports(visit._id)}>
                          View Notes
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="modal-overlay">
          <div className="popup-modal">
            <h3>Confirm Checkout</h3>
            <p>Enter next visit date (optional):</p>
            <input
              type="date"
              value={nextVisitDate}
              onChange={(e) => setNextVisitDate(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={() => {
                setShowCheckoutModal(null);
                setNextVisitDate("");
                document.body.classList.remove("overflow-hidden");
              }}>
                Cancel
              </button>
              <button onClick={() => handleCheckOut(showCheckoutModal)}>
                {loadingVisitId === showCheckoutModal ? "Checking out..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModal && (
        <div className="modal-overlay">
          <div className="popup-modal">
            <h3>{reportModal.mode === "enter" ? "Enter Daily Report" : "Daily Notes"}</h3>
            {reportModal.mode === "enter" ? (
              <>
                <textarea
                  rows={5}
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                  placeholder="Enter today's report..."
                />
                <div className="modal-buttons">
                  <button onClick={() => {
                    setReportModal(null);
                    setReportNote("");
                    document.body.classList.remove("overflow-hidden");
                  }}>
                    Cancel
                  </button>
                  <button onClick={() => handleSaveReport(reportModal.id)}>
                    {savingReportId === reportModal.id ? "Saving..." : "Save"}
                  </button>
                </div>
              </>
            ) : (
              <>
                {loadingReports ? (
                  <p>Loading...</p>
                ) : dailyReports.length === 0 ? (
                  <p>No reports available.</p>
                ) : (
                  <div className="report-notes">
                    {dailyReports.map((r, i) => (
                      <p key={i}>• {formatDate(r.date)} - {r.note}</p>
                    ))}
                  </div>
                )}
                <div className="modal-buttons">
                  <button onClick={() => {
                    setReportModal(null);
                    document.body.classList.remove("overflow-hidden");
                  }}>
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
