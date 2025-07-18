import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import { toast } from "react-toastify";
import PatientDetails from "./PatientDetails";
import VisitHistory from "./VisitHistory";
import "./PatientProfile.css";
import Loader from "../../Loader";

export default function PatientProfile() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);

  const fetchPatient = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPatient(res.data);
    } catch {
      toast.error("Failed to fetch patient");
    }
  };

  const fetchVisits = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/visits/history/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setVisits(res.data);
    } catch {
      toast.error("Failed to fetch visit history");
    }
  };

  useEffect(() => {
    fetchPatient();
    fetchVisits();
  }, [id]);

  if (!patient) return <Loader />;

  return (
    <div className="patient-profile-container">
      <PatientDetails
        patient={patient}
        setPatient={setPatient}
        patientId={id}
        visits={visits}
      />
      <VisitHistory visits={visits} refreshVisits={fetchVisits} />
    </div>
  );
}
