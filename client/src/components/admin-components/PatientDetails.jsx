import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";

export default function PatientDetails({ patient, setPatient, patientId, visits }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(patient);

  const hasActiveIP = visits.some((v) => v.type === "IP" && !v.checkOutTime);
  const latestVisit = visits[0];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const handleAddVisit = async () => {
    const type = prompt("Enter Visit Type (OP/IP):");
    const reason = prompt("Enter Reason for Visit:");
    const note = prompt("Enter Note:");

    if (!type || !reason || !note) return;

    try {
      await axios.post(`${BASE_URL}/api/visits/create`,
        { patientId, type, reason, note },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Visit added");
      window.location.reload();
    } catch {
      toast.error("Failed to add visit");
    }
  };

  const handlePromoteToIP = async () => {
    const reason = prompt("Enter reason for IP promotion:");
    const note = prompt("Enter note:");

    if (!reason || !note) return;

    try {
      await axios.post(`${BASE_URL}/api/visits/promote-ip`,
        { patientId, reason, note },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Promoted to Inpatient");
      window.location.reload();
    } catch {
      toast.error("Promotion failed");
    }
  };

  const handleAddNextVisit = async () => {
    const nextVisit = prompt("Enter Next Visit Date (YYYY-MM-DD):");
    if (!nextVisit) return;
    try {
      await axios.put(`${BASE_URL}/api/visits/next-visit/${patientId}`, { nextVisit }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Next visit added");
      window.location.reload();
    } catch {
      toast.error("Failed to add next visit");
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
          <button className="save-button" onClick={handleUpdate}>Save</button>
        </div>
      ) : (
        <>
          <div className="patient-details">
            <p><strong>Phone:</strong> {patient.phone}</p>
            <p><strong>Aadhar:</strong> {patient.aadharNo}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Address:</strong> {patient.address}</p>
            <p><strong>Created At:</strong> {new Date(patient.createdAt).toLocaleString()}</p>
          </div>

          {!hasActiveIP && (
            <>
              <button className="checkin-button" onClick={handleAddVisit}>New Visit</button>
              <button className="nextvisit-button" onClick={handleAddNextVisit}>Add Next Visit</button>
              {latestVisit && latestVisit.type === "OP" && !latestVisit.checkOutTime && (
                <button className="promote-button" onClick={handlePromoteToIP}>Promote to Inpatient</button>
              )}
            </>
          )}
          {hasActiveIP && <p className="status-info">Currently Admitted (IP)</p>}
        </>
      )}
    </div>
  );
}
