import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";
import DownloadPatientHistory from "./DownloadPatientHistory";

Modal.setAppElement("#root");

export default function PatientDetails({ patient, setPatient, patientId, visits }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(patient);
  const [modalType, setModalType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalData, setModalData] = useState({
    type: "",
    reason: "",
    note: "",
    nextVisit: "",
    roomNo: "",
    doctor: "",
    therapist: "",
    checkInTime: "",
  });

  const hasActiveIP = visits.some((v) => v.type === "IP" && !v.checkOutTime);
  const latestVisit = visits[0];

  const openModal = (type) => {
    setModalType(type);
    setModalData({
      type: "",
      reason: "",
      note: "",
      nextVisit: "",
      roomNo: "",
      doctor: "",
      therapist: "",
      checkInTime: "",
    });
  };

  const closeModal = () => {
    setModalType(null);
    setModalData({
      type: "",
      reason: "",
      note: "",
      nextVisit: "",
      roomNo: "",
      doctor: "",
      therapist: "",
      checkInTime: "",
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

      if (modalType === "visit") {
        await axios.post(
          `${BASE_URL}/api/visits/create`,
          { patientId, ...modalData },
          { headers }
        );
        toast.success("Visit added");
      } else if (modalType === "nextVisit") {
        await axios.put(
          `${BASE_URL}/api/visits/next-visit/${patientId}`,
          { nextVisit: modalData.nextVisit },
          { headers }
        );
        toast.success("Next visit added");
      } else if (modalType === "promote") {
        await axios.post(
          `${BASE_URL}/api/visits/promote-ip`,
          {
            patientId,
            reason: modalData.reason,
            note: modalData.note,
            roomNo: modalData.roomNo,
            doctor: modalData.doctor,
            therapist: modalData.therapist,
          },
          { headers }
        );
        toast.success("Promoted to Inpatient");
      }

      closeModal();
      window.location.reload();
    } catch {
      toast.error("Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="details-section">
      <div className="section-header">
        <h2 className="section-title">{patient.name}'s Details</h2>
        <button className="edit-button" onClick={() => setEditMode(!editMode)}>
          {editMode ? "Cancel" : "Edit"}
        </button>
      </div>

      {editMode ? (
        <div className="patient-details-form">
          {["name", "phone", "aadharNo", "gender", "age", "address"].map((key) => (
            <label key={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
              <input
                type={key === "age" ? "number" : "text"}
                name={key}
                value={formData[key] || ""}
                onChange={handleInputChange}
              />
            </label>
          ))}
          <button className="save-button" onClick={handleUpdate}>
            Save
          </button>
        </div>
      ) : (
        <>
          <div className="patient-details">
            <p><strong>Phone:</strong> {patient.phone}</p>
            <p><strong>Aadhar:</strong> {patient.aadharNo}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Address:</strong> {patient.address}</p>
          </div>

          {!hasActiveIP ? (
            <>
              <button className="checkin-button" onClick={() => openModal("visit")}>New Visit</button>
              <button className="nextvisit-button" onClick={() => openModal("nextVisit")}>Add Next Visit</button>
              {latestVisit && latestVisit.type === "OP" && !latestVisit.checkOutTime && (
                <button className="promote-button" onClick={() => openModal("promote")}>Promote to Inpatient</button>
              )}
            </>
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
        <h3>
          {modalType === "visit"
            ? "Add Visit"
            : modalType === "nextVisit"
            ? "Add Next Visit"
            : "Promote to Inpatient"}
        </h3>

        {modalType === "visit" && (
          <>
            <label>
              Visit Type:
              <select name="type" value={modalData.type} onChange={handleModalChange}>
                <option value="">Select</option>
                <option value="OP">OP</option>
                <option value="IP">IP</option>
              </select>
            </label>
            <input
              type="text"
              name="doctor"
              placeholder="Doctor Name"
              value={modalData.doctor}
              onChange={handleModalChange}
            />
            <input
              type="text"
              name="reason"
              placeholder="Reason"
              value={modalData.reason}
              onChange={handleModalChange}
            />
            <input
              type="text"
              name="therapist"
              placeholder="Therapist Name"
              value={modalData.therapist}
              onChange={handleModalChange}
            />
            <label>
              <textarea
                name="note"
                placeholder="Note"
                value={modalData.note}
                onChange={handleModalChange}
              />
            </label>

            {modalData.type === "IP" && (
              <>
                <input
                  type="text"
                  name="roomNo"
                  placeholder="Room Number"
                  value={modalData.roomNo}
                  onChange={handleModalChange}
                />
                <label>
                  <input
                    type="datetime-local"
                    name="checkInTime"
                    value={modalData.checkInTime}
                    onChange={handleModalChange}
                  />
                </label>
              </>
            )}
          </>
        )}

        {modalType === "nextVisit" && (
          <input
            type="date"
            name="nextVisit"
            value={modalData.nextVisit}
            onChange={handleModalChange}
          />
        )}

        {modalType === "promote" && (
          <>
            <input
              type="text"
              name="reason"
              placeholder="Reason for IP"
              value={modalData.reason}
              onChange={handleModalChange}
            />
            <label>
              <textarea
                name="note"
                placeholder="Note"
                value={modalData.note}
                onChange={handleModalChange}
              />
            </label>
            <input
              type="text"
              name="roomNo"
              placeholder="Room Number"
              value={modalData.roomNo}
              onChange={handleModalChange}
            />
            <input
              type="text"
              name="doctor"
              placeholder="Doctor Name"
              value={modalData.doctor}
              onChange={handleModalChange}
            />
            <input
              type="text"
              name="therapist"
              placeholder="Therapist Name"
              value={modalData.therapist}
              onChange={handleModalChange}
            />
          </>
        )}

        <div className="modal-buttons">
          <button onClick={handleSubmitModal} className="save-button" disabled={isSubmitting}>
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
