import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AllPatients.css";
import BASE_URL from "../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader";

export default function AllPatients() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/patients/all-patients`);
        setPatients(response.data);
      } catch (error) {
        toast.error("Failed to fetch patients");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.aadharNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="all-patients-container">
      <h2 className="title">All Patients</h2>

      <input
        type="text"
        placeholder="Search by Aadhar number..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <div className="patient-cards"><Loader/></div>
      ) : (
        <div className="patient-cards">
          {filteredPatients.map((patient) => (
            <div
              key={patient._id}
              className="patient-card"
              onClick={() => navigate(`/admin-home/patient/${patient._id}`)}
            >
              <h3>{patient.name}</h3>
              <p><strong>Phone:</strong> {patient.phone}</p>
              <p><strong>Aadhar:</strong> {patient.aadharNo}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
