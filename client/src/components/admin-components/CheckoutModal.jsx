import React, { useState } from "react";

export default function CheckoutModal({
  visible,
  loading,
  date,
  setDate,
  nextVisit,
  setNextVisit,
  onCancel,
  onConfirm,
}) {
  const [addNextVisit, setAddNextVisit] = useState(false);

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="popup-modal">
        <h3>Confirm Checkout</h3>

        <label>Checkout Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="addNextVisit"
            checked={addNextVisit}
            onChange={() => setAddNextVisit(!addNextVisit)}
          />
          <label htmlFor="addNextVisit">
            Do you want to schedule an upcoming visit?
          </label>
        </div>

        {addNextVisit && (
          <>
            <label>Next Visit Date</label>
            <input
              type="date"
              value={nextVisit}
              onChange={(e) => setNextVisit(e.target.value)}
            />
          </>
        )}

        <div className="modal-buttons">
          <button onClick={onCancel}>Cancel</button>
          <button
            onClick={() => onConfirm(addNextVisit)}
            disabled={loading}
          >
            {loading ? "Checking out..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
