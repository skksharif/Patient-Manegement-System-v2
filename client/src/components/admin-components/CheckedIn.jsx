import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import "./CheckedIn.css";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader";

export default function AllActiveInpatients() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("aadhar");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveInpatients = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/visits/active-inpatients`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPatients(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveInpatients();
  }, []);

  const filteredPatients = patients.filter((visit) => {
    const patient = visit.patientId;
    const term = searchTerm.toLowerCase();

    if (!patient) return false;

    if (searchBy === "aadhar")
      return patient.aadharNo?.toLowerCase().includes(term);
    if (searchBy === "phone")
      return patient.phone?.toLowerCase().includes(term);
    if (searchBy === "name") return patient.name?.toLowerCase().includes(term);

    return false;
  });

  if (loading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (filteredPatients.length === 0)
    return (
      <div style={{ padding: "110px 0", color: "red" }}>
        No active in-patients found.
      </div>
    );

  return (
    <div className="checkedin-list">
      <h2>All Active In-Patients</h2>

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

      <div className="checkedin-container">
        {filteredPatients.map((visit) => (
          <div
            className="checkedin-card"
            key={visit._id}
            onClick={() =>
              navigate(`/admin-home/patient/${visit.patientId?._id}`)
            }
          >
            <p>
              <strong>Name:</strong> {visit.patientId?.name || "Unknown"}
            </p>
            <p>
              <strong>Admitted On:</strong>{" "}
              {new Date(visit.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Check-In:</strong>{" "}
              {visit.checkInTime
                ? new Date(visit.checkInTime).toLocaleTimeString()
                : "Not Joined"}
            </p>
            <p>
              <strong>Phone:</strong> {visit.patientId?.phone || "N/A"}
            </p>
            <p>
              <strong>Aadhar No:</strong> {visit.patientId?.aadharNo || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
