import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";

export default function VisitHistory({ visits }) {
  const [loadingVisitId, setLoadingVisitId] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(null); // visitId or null
  const [nextVisitDate, setNextVisitDate] = useState("");

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
    }
  };

  return (
    <div className="history-section">
      <h2 className="section-title">Visit History</h2>
      {visits.length === 0 ? (
        <p>No visits yet.</p>
      ) : (
        <div className="visit-history">
          {visits.map((visit) => (
            <div key={visit._id} className="visit-card">
              <div className="visit-left">
                <p>
                  <strong>Type:</strong> {visit.type}
                </p>
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
              </div>

              <div className="visit-right">
                <p>
                  <strong>Room No:</strong> {visit.roomNo || "Not Assigned"}
                </p>
                <p>
                  <strong>Check-In:</strong>{" "}
                  {visit.checkInTime
                    ? new Date(visit.checkInTime).toLocaleString()
                    : "Not Joined"}
                </p>
                <p>
                  <strong>Check-Out:</strong>{" "}
                  {visit.checkOutTime
                    ? new Date(visit.checkOutTime).toLocaleString()
                    : "Not yet"}
                </p>
                <p className="next-visit">
                  <strong>Next Visit:</strong>{" "}
                  {visit.nextVisit
                    ? new Date(visit.nextVisit).toLocaleDateString()
                    : "Not set"}
                </p>

                <p>
                  {" "}
                  {!visit.checkOutTime && visit.checkInTime && (
                    <button
                      className="checkout-button"
                      onClick={() => setShowCheckoutModal(visit._id)}
                    >
                      Checkout
                    </button>
                  )}
                </p>
              </div>

              {showCheckoutModal === visit._id && (
                <div className="modal-overlay">
                  <div className="popup-modal">
                    <h3>Confirm Checkout</h3>
                    <p>Enter next visit date (optional):</p>
                    <input
                      type="date"
                      value={nextVisitDate}
                      onChange={(e) => setNextVisitDate(e.target.value)}
                      className="date-input"
                    />
                    <div className="modal-buttons">
                      <button
                        className="edit-button"
                        onClick={() => {
                          setShowCheckoutModal(null);
                          setNextVisitDate("");
                        }}
                        disabled={loadingVisitId === visit._id}
                      >
                        Cancel
                      </button>
                      <button
                        className="checkout-button"
                        onClick={() => handleCheckOut(visit._id)}
                        disabled={loadingVisitId === visit._id}
                      >
                        {loadingVisitId === visit._id
                          ? "Checking out..."
                          : "Confirm"}
                      </button>
                    </div>
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
