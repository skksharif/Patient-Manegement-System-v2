import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import axios from "axios";
import BASE_URL from "../config";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "./AdmitModal.css";
import { MdClose } from "react-icons/md";

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
    checkInTime: null,
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
          setForm((prev) => ({
            ...prev,
            name: patient?.name || "",
            phone: patient?.phone || "",
          }));
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
        checkInTime: null,
      });
      checkExistence();
    }
  }, [isOpen, patient]);

  const handlePatientChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePatient = () => {
    const { name, phone, gender } = form;
    if (!name || !phone || !gender)
      return "Name, Phone, and Gender are required";
    if (!/^\d{10}$/.test(phone)) return "Phone must be 10 digits";
    return "";
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    const error = validatePatient();
    if (error) return toast.error(error);

    const payload = { ...form };
    if (!payload.aadharNo?.trim()) delete payload.aadharNo;

    setAdding(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/patients/add-patient`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
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

  const handleVisitChange = (e) => {
    setVisitForm({ ...visitForm, [e.target.name]: e.target.value });
  };

  const handleAddVisit = async (e) => {
    e.preventDefault();
    const { reason, roomNo, doctor } = visitForm;
    if (!reason || !roomNo || !doctor) {
      return toast.error("Reason, Room Number, and Doctor are required");
    }

    setVisitLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/api/visits/create`,
        {
          patientId: patientDetails._id,
          type: "IP",
          reason: visitForm.reason,
          note: visitForm.note,
          roomNo: visitForm.roomNo,
          doctor: visitForm.doctor,
          checkInTime: visitForm.checkInTime,
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
        <button className="adv-btn-close" onClick={onClose}><MdClose/></button>
      </div>

      {exists !== null && (
        <div className="patient-existence">
          {exists ? (
            <div>
              ✅ <strong>{patientDetails?.name}</strong> | {patientDetails?.gender} | {patientDetails?.phone}
              {patientDetails?.aadharNo && <> | Aadhar: {patientDetails?.aadharNo}</>}
              <button
                className="btn-primary patient-link"
                onClick={() => navigate(`/admin-home/patient/${patientDetails?._id}`)}
              >
                Go To Profile
              </button>
            </div>
          ) : (
            <div>
              ❌ <strong>No Patient Found</strong> with phone {patient?.phone}
            </div>
          )}
        </div>
      )}

      <div className="stepper">
        <div className={`step ${step === 1 ? "active" : ""}`}>1. Add Patient</div>
        <div className={`step ${step === 2 ? "active" : ""}`}>2. Add Visit</div>
      </div>

      <div className="step-content">
        {step === 1 && exists === false && (
          <form className="patient-form" onSubmit={handleAddPatient}>
            {/* patient fields */}
            <input name="name" placeholder="Full Name" value={form.name} onChange={handlePatientChange} required />
            <input name="phone" placeholder="Phone (10 digits)" value={form.phone} onChange={handlePatientChange} required />
            <input name="aadharNo" placeholder="Aadhar No (Optional)" value={form.aadharNo} onChange={handlePatientChange} />
            <select name="gender" value={form.gender} onChange={handlePatientChange} required>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <input name="age" type="number" placeholder="Age (Optional)" value={form.age} onChange={handlePatientChange} />
            <textarea name="address" placeholder="Address (Optional)" value={form.address} onChange={handlePatientChange} rows="2" />
            <div className="form-actions">
              <button className="submit-adv-visit" type="submit" disabled={adding}>{adding ? "Adding..." : "Add Patient"}</button>
              <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="visit-form" onSubmit={handleAddVisit}>
            {/* visit fields */}
            <input name="doctor" placeholder="Doctor Name" value={visitForm.doctor} onChange={handleVisitChange} required />
            <input name="reason" placeholder="Reason for Admission" value={visitForm.reason} onChange={handleVisitChange} required />
            <input name="roomNo" placeholder="Room Number" value={visitForm.roomNo} onChange={handleVisitChange} required />
            <textarea name="note" placeholder="Note" value={visitForm.note} onChange={handleVisitChange} rows="2" />
            <DatePicker
              selected={visitForm.checkInTime ? new Date(visitForm.checkInTime) : null}
              onChange={(date) => setVisitForm({ ...visitForm, checkInTime: date?.toISOString() })}
              showTimeSelect
              timeFormat="HH:mm aa"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd | HH:mm aa"
              placeholderText="Select Check In date and time"
              className="custom-datepicker-input"
            />
            <div className="form-actions">
              <button className="submit-adv-visit" type="submit" disabled={visitLoading}>{visitLoading ? "Submitting..." : "Submit"}</button>
              <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
