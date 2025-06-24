import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import axios from "axios";
import BASE_URL from "../config";
import "./AdmitModal.css";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

export default function AdmitModal({ isOpen, onClose, patient }) {
    const navigate = useNavigate();
  const [exists, setExists] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [step, setStep] = useState(1);
  const [adding, setAdding] = useState(false);
  const [visitLoading, setVisitLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    aadharNo: "",
    gender: "",
    age: "",
    address: "",
  });

  const [visitForm, setVisitForm] = useState({
    type: "IP",
    reason: "",
    note: "",
    roomNo: "",
    doctor: "",
    checkInTime: "",
  });

  useEffect(() => {
    const checkExistence = async () => {
      if (!patient?.phone) return;
      try {
        const response = await axios.get(
          `${BASE_URL}/api/patients/check?phone=${patient.phone}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setExists(response.data.exists);
        if (response.data.patient) {
          setPatientDetails(response.data.patient);
          setStep(2);
        } else {
          setForm({
            ...form,
            name: patient?.name || "",
            phone: patient?.phone || "",
          });
        }
      } catch {
        setExists(null);
        setPatientDetails(null);
      }
    };

    if (isOpen) {
      setStep(1);
      setVisitForm({
        type: "IP",
        reason: "",
        note: "",
        roomNo: "",
        doctor: "",
        checkInTime: "",
      });
      checkExistence();
    }
  }, [isOpen, patient]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { name, phone, gender } = form;
    if (!name || !phone || !gender) return "Name, Phone & Gender are required";
    if (!/^\d{10}$/.test(phone)) return "Phone must be 10 digits";
    return "";
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return toast.error(error);

    const payload = { ...form };
    if (!payload.aadharNo?.trim()) delete payload.aadharNo;

    setAdding(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/patients/add-patient`,
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Patient added successfully");
      setPatientDetails(res.data);
      setExists(true);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add patient");
    } finally {
      setAdding(false);
    }
  };

  const handleAddVisit = async (e) => {
    e.preventDefault();
    const { reason, note, roomNo, doctor, checkInTime } = visitForm;
    if (!reason || !roomNo || !doctor) {
      return toast.error("All fields are required except note and time.");
    }

    setVisitLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/api/visits/create`,
        {
          patientId: patientDetails._id,
          type: "IP",
          reason,
          note,
          roomNo,
          doctor,
          checkInTime,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await axios.put(
        `${BASE_URL}/api/upcoming/status/${patient._id}`,
        { status: "Completed" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("IP Visit created successfully");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create visit");
    } finally {
      setVisitLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Admit Patient"
      className="modal-full"
      overlayClassName="overlay-full"
    >
      <div className="modal-header">
        <h2>Admit Patient</h2>
        <button className="btn-close" onClick={onClose}>
          ✖
        </button>
      </div>

      {exists !== null && (
        <div className="patient-summary">
          {exists ? (
            <div style={{
                cursor:"pointer"
            }}
              onClick={() =>
                navigate(`/admin-home/patient/${patientDetails?._id}`)
              }>
              <strong>✅ {patientDetails?.name}</strong> |{" "}
              {patientDetails?.gender} | {patientDetails?.phone}
              {patientDetails?.aadharNo && (
                <> | Aadhar: {patientDetails?.aadharNo}</>
              )}
            </div>
          ) : (
            <>
              <strong>❌ No patient found</strong> with phone {patient?.phone}
            </>
          )}
        </div>
      )}

      <div className="stepper">
        <div className={`step ${step === 1 ? "active" : ""}`}>
          1. Add Patient
        </div>
        <div className={`step ${step === 2 ? "active" : ""}`}>2. Add Visit</div>
      </div>

      <div className="step-content">
        {step === 1 && exists === false && (
          <form className="patient-form" onSubmit={handleAddPatient}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Phone (10 digits)"
              value={form.phone}
              onChange={handleChange}
            />
            <input
              name="aadharNo"
              placeholder="Aadhar No (Optional)"
              value={form.aadharNo}
              onChange={handleChange}
            />
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <input
              name="age"
              type="number"
              placeholder="Age (Optional)"
              value={form.age}
              onChange={handleChange}
            />
            <textarea
              name="address"
              placeholder="Address (Optional)"
              value={form.address}
              onChange={handleChange}
              rows="2"
            />
            <button type="submit" disabled={adding}>
              {adding ? "Adding..." : "Add Patient"}
            </button>
          </form>
        )}

        {step === 2 && (
          <>
      
            <form className="visit-form" onSubmit={handleAddVisit}>
              <h2>Add IP Visit</h2>

              <input
                name="doctor"
                placeholder="Doctor Name"
                value={visitForm.doctor}
                onChange={(e) =>
                  setVisitForm({ ...visitForm, doctor: e.target.value })
                }
              />
              <input
                name="reason"
                placeholder="Reason for Admission"
                value={visitForm.reason}
                onChange={(e) =>
                  setVisitForm({ ...visitForm, reason: e.target.value })
                }
              />
              <input
                name="roomNo"
                placeholder="Room Number"
                value={visitForm.roomNo}
                onChange={(e) =>
                  setVisitForm({ ...visitForm, roomNo: e.target.value })
                }
              />
              <textarea
                name="note"
                placeholder="Note"
                value={visitForm.note}
                onChange={(e) =>
                  setVisitForm({ ...visitForm, note: e.target.value })
                }
                rows="3"
              />

              <label>Check-In Time:</label>
              <input
                type="datetime-local"
                value={visitForm.checkInTime}
                onChange={(e) =>
                  setVisitForm({ ...visitForm, checkInTime: e.target.value })
                }
              />

              <div className="form-actions">
                <button type="submit" disabled={visitLoading}>
                  {visitLoading ? "Submitting..." : "Submit"}
                </button>
                <button type="button" className="btn-cancel" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}
