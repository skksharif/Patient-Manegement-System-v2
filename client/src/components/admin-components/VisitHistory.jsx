import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";

export default function VisitHistory({ visits }) {
  const handleCheckOut = async (visitId) => {
    const nextVisit = prompt(
      "Enter Next Visit Date (YYYY-MM-DD or leave blank):"
    );
    try {
      await axios.put(
        `${BASE_URL}/api/visits/checkout/${visitId}`,
        { nextVisit: nextVisit || null },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Checked out successfully");
      window.location.reload();
    } catch {
      toast.error("Failed to check out");
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

              {!visit.checkOutTime && visit.checkInTime && (
                <button
                  className="checkout-button"
                  onClick={() => handleCheckOut(visit._id)}
                >
                  Check Out
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
