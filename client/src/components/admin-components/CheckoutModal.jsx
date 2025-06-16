import React from "react";

export default function CheckoutModal({ visible, loading, date, setDate, onCancel, onConfirm }) {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="popup-modal">
        <h3>Confirm Checkout</h3>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>
            {loading ? "Checking out..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}