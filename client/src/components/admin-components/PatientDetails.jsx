import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import BASE_URL from "../config";
import DownloadPatientHistory from "./DownloadPatientHistory";
import { FaRegEdit } from "react-icons/fa";

Modal.setAppElement("#root");

export default function PatientDetails({
  patient,
  setPatient,
  patientId,
  visits,
}) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(patient);
  const [modalType, setModalType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalData, setModalData] = useState({
    type: "",
    reason: "",
    roomNo: "",
    doctor: "",
    therapist: "",
    therapy: "",
    checkInTime: null,
  });

  const hasActiveIP = visits.some((v) => v.type === "IP" && !v.checkOutTime);

  const openModal = (type) => {
    setModalType(type);
    setModalData({
      type: "",
      reason: "",
      roomNo: "",
      doctor: "",
      therapist: "",
      therapy: "",
      checkInTime: null,
    });
  };

  const closeModal = () => {
    setModalType(null);
    setModalData({
      type: "",
      reason: "",
      roomNo: "",
      doctor: "",
      therapist: "",
      therapy: "",
      checkInTime: null,
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalChange = (e) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/api/patients/${patientId}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Patient updated");
      setPatient(formData);
      setEditMode(false);
    } catch {
      toast.error("Update failed");
    }
  };

  const handleSubmitModal = async () => {
    setIsSubmitting(true);
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const payload = {
        ...modalData,
        patientId,
        checkInTime: modalData.checkInTime
          ? modalData.checkInTime.toISOString()
          : null,
      };

      // API for creating visit
      const res = await axios.post(`${BASE_URL}/api/visits/create`, payload, {
        headers,
      });
      toast.success(`${modalData.type} Visit Created`);
      closeModal();
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.error || "Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="details-section">
      <div className="section-header">
        <h2 className="section-title">{patient.name}'s Details</h2>
        <button className="edit-button" onClick={() => setEditMode(!editMode)}>
          {editMode ? "Cancel" :   <FaRegEdit />}
        </button>
      </div>

      {editMode ? (
        <div className="patient-details-form">
          {["name", "phone", "aadharNo", "gender", "age", "address"].map(
            (key) => (
              <label key={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
                <input
                  type={key === "age" ? "number" : "text"}
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleInputChange}
                />
              </label>
            )
          )}
          <button className="save-button" onClick={handleUpdate}>
            Save
          </button>
        </div>
      ) : (
        <>
          <div className="patient-details">
            <p>
              <strong>Phone:</strong> {patient.phone}
            </p>
            <p>
              <strong>Aadhar:</strong>{" "}
              {patient.aadharNo || <span>Not Set</span>}
            </p>
            <p>
              <strong>Gender:</strong> {patient.gender}
            </p>
            <p>
              <strong>Age:</strong> {patient.age || <span>Not Set</span>}
            </p>
            <p>
              <strong>Address:</strong> {patient.address || <span> Not Set</span>}
            </p>
          </div>

          {!hasActiveIP ? (
            <button
              className="checkin-button"
              onClick={() => openModal("visit")}
            >
              New Visit
            </button>
          ) : (
            <span className="status-info">Currently Admitted (IP)</span>
          )}

          <DownloadPatientHistory patientId={patientId} />
        </>
      )}

      {/* Modal */}
      <Modal
        isOpen={!!modalType}
        onRequestClose={closeModal}
        className="popup-modal"
        overlayClassName="modal-overlay"
      >
        <h3>Add {modalData.type} Visit</h3>

        {modalType === "visit" && (
          <>
            <label>
              Visit Type:
              <select
                name="type"
                value={modalData.type}
                onChange={handleModalChange}
              >
                <option value="">Select</option>
                <option value="OP">OP</option>
                <option value="IP">IP</option>
              </select>
            </label>

            {modalData.type === "IP" ? (
              <>
                <input
                  name="doctor"
                  placeholder="Doctor Name"
                  value={modalData.doctor}
                  onChange={handleModalChange}
                />
                <input
                  name="reason"
                  placeholder="Reason for Admission"
                  value={modalData.reason}
                  onChange={handleModalChange}
                />
                <input
                  name="roomNo"
                  placeholder="Room Number"
                  value={modalData.roomNo}
                  onChange={handleModalChange}
                />
                <textarea
                  name="note"
                  placeholder="Note"
                  value={modalData.note}
                  onChange={handleModalChange}
                />
                <label>Check-In Time:</label>
                <DatePicker
                  selected={modalData.checkInTime}
                  onChange={(date) =>
                    setModalData({ ...modalData, checkInTime: date })
                  }
                  showTimeSelect
                  timeFormat="hh:mm aa"
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy | h:mm aa"
                  className="datepicker-input"
                  popperPlacement="top"
                  placeholderText="Select check-in time"
                />
              </>
            ) : modalData.type === "OP" ? (
              <>
                <input
                  name="therapist"
                  placeholder="Therapist Name"
                  value={modalData.therapist}
                  onChange={handleModalChange}
                />
                <input
                  name="therapy"
                  placeholder="Therapy Name"
                  value={modalData.therapy}
                  onChange={handleModalChange}
                />
                <label>Date :</label>
                <DatePicker
                  selected={modalData.checkInTime}
                  onChange={(date) =>
                    setModalData({ ...modalData, checkInTime: date })
                  }
                  dateFormat="dd/MM/yyyy"
                  className="datepicker-input"
                  popperPlacement="top"
                  placeholderText="Select date"
                />
              </>
            ) : null}
          </>
        )}

        <div className="modal-buttons">
          <button
            onClick={handleSubmitModal}
            className="save-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          <button onClick={closeModal} className="edit-button">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
