import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import "./Checkedout.css";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader";

export default function Checkedout() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("phone");
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
    const fetchCheckedOutPatients = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/visits/checkedout-patients`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setVisits(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckedOutPatients();
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
    <div className="checkedout-list">
      <h2>Checked-Out Records</h2>

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
          <option value="phone">Phone</option>
          <option value="name">Name</option>
          <option value="aadhar">Aadhar</option>
        </select>
      </div>

      <div className="checkedout-container">
        {filteredVisits.length === 0 ? (
          <div style={{ padding: "110px 0", color: "red" }}>
            No Records found.
          </div>
        ) : (
          filteredVisits.map((visit) => (
            <div
              className="checkedout-card"
              key={visit._id}
              onClick={() =>
                navigate(`/admin-home/patient/${visit.patientId?._id}`)
              }
            >
              <p>
                <strong>Name:</strong> {visit.patientId?.name || "Unknown"}
              </p>
              <p>
                <strong>Phone No:</strong> {visit.patientId?.phone}
              </p>
              <p>
                <strong>Aadhar No:</strong> {visit.patientId?.aadharNo}
              </p>

              <p>
                <strong>Check-In:</strong> {formatDate(visit.checkInTime)}
              </p>
              <p>
                <strong>Check-Out:</strong> {formatDate(visit.checkOutTime)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
