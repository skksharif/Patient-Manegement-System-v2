import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";
import "./VisitHistory.css"; // Import the custom CSS

export default function VisitHistory({ visits }) {
  const [loadingVisitId, setLoadingVisitId] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(null);
  const [nextVisitDate, setNextVisitDate] = useState("");

  const [reportModal, setReportModal] = useState(null); // { id, mode: "enter" | "view" }
  const [reportNote, setReportNote] = useState("");
  const [savingReportId, setSavingReportId] = useState(null);

  const formatDate = (dateStr, includeTime = false) => {
    if (!dateStr) return "Not Available";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    if (!includeTime) return `${day}/${month}/${year}`;

    const hours = date.getHours() % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";

    return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
  };

  const handleCheckOut = async (visitId) => {
    setLoadingVisitId(visitId);
    try {
      await axios.put(
        `${BASE_URL}/api/visits/checkout/${visitId}`,
        { nextVisit: nextVisitDate || null },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
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
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
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

  return (
    <div className="history-section p-4">
      <h2 className="section-title text-xl font-bold mb-4">Visit History</h2>

      {visits.length === 0 ? (
        <p className="text-gray-600">No visits yet.</p>
      ) : (
        <div className="visit-history grid gap-4">
          {visits.map((visit) => (
            <div
              key={visit._id}
              className="visit-card bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col md:flex-row justify-between"
            >
              {/* Left Section */}
              <div className="visit-left space-y-2 text-sm text-gray-700">
                <p><strong>Type:</strong> {visit.type}</p>
                <p><strong>Reason:</strong> {visit.reason}</p>
                <p><strong>Note:</strong> {visit.note}</p>
                <p><strong>Doctor:</strong> {visit.doctor || "Not Assigned"}</p>
                <p><strong>Therapist:</strong> {visit.therapist || "Not Assigned"}</p>
              </div>

              {/* Right Section */}
              <div className="visit-right space-y-2 text-sm text-gray-700 mt-4 md:mt-0 md:text-right">
                <p><strong>Room No:</strong> {visit.roomNo || "Not Assigned"}</p>
                <p><strong>Check-In:</strong> {formatDate(visit.checkInTime, true)}</p>
                <p><strong>Check-Out:</strong> {visit.checkOutTime ? formatDate(visit.checkOutTime, true) : "Not yet"}</p>
                <p><strong>Next Visit:</strong> {formatDate(visit.nextVisit)}</p>

                {!visit.checkOutTime && visit.checkInTime && (
                  <div className="space-y-2">
                    <button
                      className="checkout-button"
                      onClick={() => {
                        setShowCheckoutModal(visit._id);
                        document.body.classList.add("overflow-hidden");
                      }}
                    >
                      Checkout
                    </button>

                    {visit.type === "IP" && (
                      <>
                        <button
                          className="enter-note-button"
                          onClick={() => {
                            setReportModal({ id: visit._id, mode: "enter" });
                            setReportNote("");
                            document.body.classList.add("overflow-hidden");
                          }}
                        >
                          Enter Note
                        </button>

                        <button
                          className="view-note-button"
                          onClick={() => {
                            setReportModal({ id: visit._id, mode: "view" });
                            document.body.classList.add("overflow-hidden");
                          }}
                        >
                          View Notes
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Checkout Modal */}
              {showCheckoutModal === visit._id && (
                <div className="modal-overlay">
                  <div className="popup-modal">
                    <h3 className="text-lg font-semibold">Confirm Checkout</h3>
                    <p className="text-sm text-gray-600">Enter next visit date (optional):</p>
                    <input
                      type="date"
                      value={nextVisitDate}
                      onChange={(e) => setNextVisitDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded text-sm"
                    />
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        className="modal-button cancel"
                        onClick={() => {
                          setShowCheckoutModal(null);
                          setNextVisitDate("");
                          document.body.classList.remove("overflow-hidden");
                        }}
                        disabled={loadingVisitId === visit._id}
                      >
                        Cancel
                      </button>
                      <button
                        className="modal-button confirm"
                        onClick={() => handleCheckOut(visit._id)}
                        disabled={loadingVisitId === visit._id}
                      >
                        {loadingVisitId === visit._id ? "Checking out..." : "Confirm"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Report Modal */}
              {reportModal?.id === visit._id && (
                <div className="modal-overlay">
                  <div className="popup-modal">
                    <h3 className="text-lg font-semibold mb-2">
                      {reportModal.mode === "enter" ? "Enter Daily Report" : "Daily Notes"}
                    </h3>

                    {reportModal.mode === "enter" ? (
                      <>
                        <textarea
                          rows={5}
                          value={reportNote}
                          onChange={(e) => setReportNote(e.target.value)}
                          placeholder="Enter today's report..."
                          className="w-full px-3 py-2 border rounded text-sm"
                        />
                        <div className="flex justify-end gap-2 mt-4">
                          <button
                            className="modal-button cancel"
                            onClick={() => {
                              setReportModal(null);
                              setReportNote("");
                              document.body.classList.remove("overflow-hidden");
                            }}
                            disabled={savingReportId === visit._id}
                          >
                            Cancel
                          </button>
                          <button
                            className="modal-button confirm"
                            onClick={() => handleSaveReport(visit._id)}
                            disabled={savingReportId === visit._id}
                          >
                            {savingReportId === visit._id ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                          • 10/06/2025 - Patient stable.{"\n"}
                          • 11/06/2025 - Physiotherapy done.{"\n"}
                          • 12/06/2025 - Responding well.
                        </p>
                        <div className="flex justify-end mt-4">
                          <button
                            className="modal-button cancel"
                            onClick={() => {
                              setReportModal(null);
                              document.body.classList.remove("overflow-hidden");
                            }}
                          >
                            Close
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
