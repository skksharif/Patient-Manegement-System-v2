import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CheckoutModal({
  visible,
  loading,
  date,
  setDate,
  onCancel,
  onConfirm,
}) {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="popup-modal">
        <h3>Confirm Checkout</h3>

        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          showTimeSelect
          timeFormat="hh:mm aa"
          timeIntervals={15}
          dateFormat="dd/MM/YYYY | h:mm aa"
          className="datepicker-input"
          placeholderText="Select checkout date"
          popperPlacement="top"
        />

        <div className="modal-buttons">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm} disabled={loading}>
            {loading ? "Checking out..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
