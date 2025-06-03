import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AllPatients.css";
import BASE_URL from "../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader";

export default function AllPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("aadhar");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/patients/all-patients`
        );
        setPatients(response.data);
      } catch (error) {
        toast.error("Failed to fetch patients");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const term = searchTerm.toLowerCase();
    if (searchBy === "aadhar")
      return patient.aadharNo.toLowerCase().includes(term);
    if (searchBy === "phone") return patient.phone.toLowerCase().includes(term);
    if (searchBy === "name") return patient.name.toLowerCase().includes(term);
    return false;
  });

  return (
    <div className="all-patients-container">
      <h2 className="title">All Patients</h2>

      <div className="search-section">
        <input
          type="text"
          placeholder={`Search by ${searchBy}...`}
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="search-select"
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
        >
          <option value="aadhar">Aadhar</option>
          <option value="phone">Phone</option>
          <option value="name">Name</option>
        </select>
      </div>

      {loading ? (
        <div className="patient-cards">
          <Loader />
        </div>
      ) : (
        <div className="patient-cards">
          {filteredPatients.map((patient) => (
            <div
              key={patient._id}
              className="patient-card"
              onClick={() => navigate(`/admin-home/patient/${patient._id}`)}
            >
              <h3>{patient.name}</h3>
              <p>
                <strong>Phone:</strong> {patient.phone}
              </p>
              <p>
                <strong>Aadhar:</strong> {patient.aadharNo}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
