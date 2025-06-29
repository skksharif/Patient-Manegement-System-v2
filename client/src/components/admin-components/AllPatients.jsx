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
  const [searchBy, setSearchBy] = useState("phone");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/patients/all-patients`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
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
    if (searchBy === "phone") return patient.phone.toLowerCase().includes(term);
    if (searchBy === "name") return patient.name.toLowerCase().includes(term);
    if (searchBy === "aadhar")
      return patient.aadharNo.toLowerCase().includes(term);

    return false;
  });

  return (
    <div className="all-patients-container">
      <div className="patients-header">
        <h2 className="patients-title">All Patients</h2>
        <span className="patients-count">Total count : {patients.length}</span>
      </div>

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
          <option value="phone">Phone</option>
          <option value="name">Name</option>
          <option value="aadhar">Aadhar</option>
        </select>
      </div>

      {loading ? (
        <div className="patient-cards">
          <Loader />
        </div>
      ) : (
        <div className="patient-cards">
          {filteredPatients.length != 0 ? (
            filteredPatients.map((patient) => (
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
                  <strong>Aadhar:</strong>{" "}
                  {patient.aadharNo ? patient.aadharNo : <span>Not Set</span>}
                </p>
              </div>
            ))
          ) : (
            <span style={{ padding: "110px 0", color: "red" }}>
              No Records Found
            </span>
          )}
        </div>
      )}
    </div>
  );
}
