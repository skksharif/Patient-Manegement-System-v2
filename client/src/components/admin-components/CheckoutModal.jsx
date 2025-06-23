import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          showTimeSelect
          timeFormat="hh:mm aa"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          className="datepicker-input"
          placeholderText="Select checkout date"
          popperPlacement="top"
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
            <DatePicker
              selected={nextVisit}
              onChange={(date) => setNextVisit(date)}
          
              dateFormat="dd/MM/YYYY"
              className="datepicker-input"
              placeholderText="Select next visit date"
              popperPlacement="top"
            />
          </>
        )}

        <div className="modal-buttons">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={() => onConfirm(addNextVisit)} disabled={loading}>
            {loading ? "Checking out..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
