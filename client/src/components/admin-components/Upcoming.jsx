import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader";
import "./Checkedout.css"; // Reuse styling from Checkedout

export default function Upcoming() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("aadhar");
  const navigate = useNavigate();
  const formatDate = (date, withTime = false) => {
    if (!date) return "Not Available";
    const d = new Date(date);
    return d.toLocaleString("en-IN", {
      hour: withTime ? "numeric" : undefined,
      minute: withTime ? "2-digit" : undefined,
      hour12: true,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchUpcomingVisits = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/visits/upcoming`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setVisits(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingVisits();
  }, []);

  const filteredVisits = visits.filter((visit) => {
    const patient = visit.patientId;
    const term = search.toLowerCase();

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

  return (
    <div className="checkedin-list">
      <h2>Upcoming Visits</h2>

      <div className="search-section">
        <input
          type="text"
          placeholder={`Search by ${searchBy}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
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
        {filteredVisits.length === 0 ? (
          <div style={{ padding: "110px 0", color: "red" }}>
            No upcoming visits found.
          </div>
        ) : (
          filteredVisits.map((visit) => (
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
                <strong>Phone:</strong> {visit.patientId?.phone || "N/A"}
              </p>
              <p>
                <strong>Aadhar No:</strong> {visit.patientId?.aadharNo || "N/A"}
              </p>
              <p>
                <strong>Next Visit:</strong>{" "}
                {formatDate(visit.nextVisit)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
