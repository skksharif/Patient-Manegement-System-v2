import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import "./CheckedIn.css";
import { useNavigate } from "react-router-dom";

export default function AllActiveInpatients() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredPatients = patients.filter((visit) =>
    visit.patientId?.aadharNo
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="checkedin-card">Loading...</div>;

  if (filteredPatients.length === 0)
    return (
      <div className="checkedin-card">No active in-patients found.</div>
    );

  return (
    <div className="checkedin-list">
      <h2>All Active In-Patients</h2>

      <input
        type="text"
        placeholder="Search by Aadhar number..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="checkedin-container">
        {filteredPatients.map((visit) => (
          <div
            className="checkedin-card"
            key={visit._id}
            onClick={() =>
              navigate(`/admin-home/patient/${visit.patientId?._id}`)
            }
          >
            <p><strong>Name:</strong> {visit.patientId?.name || "Unknown"}</p>
            <p><strong>Admitted On:</strong> {new Date(visit.createdAt).toLocaleDateString()}</p>
            <p><strong>Check-In:</strong> {visit.checkInTime ? new Date(visit.checkInTime).toLocaleTimeString() : "Not Joined"}</p>
            <p><strong>Phone:</strong> {visit.patientId?.phone || "N/A"}</p>
            <p><strong>Aadhar No:</strong> {visit.patientId?.aadharNo || "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
