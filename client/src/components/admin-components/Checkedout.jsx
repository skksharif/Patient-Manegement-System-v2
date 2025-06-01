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
  const navigate = useNavigate();

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

  const filteredVisits = visits.filter((visit) =>
    visit.patientId?.aadharNo?.includes(search)
  );



  if (loading) return <div><Loader /></div>;

  return (
    <div className="checkedout-list">
      <h2>Checked-Out Records</h2>
      <input
        type="text"
        placeholder="Search by Aadhar No"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <div className="checkedout-container">
        {filteredVisits.length === 0 ? (
          <div className="checkedout-card">No records found.</div>
        ) : (
          filteredVisits.map((visit) => (
            <div
              className="checkedout-card"
              key={visit._id}
               onClick={() =>
                navigate(`/admin-home/patient/${visit.patientId?._id}`)
              }
            >
              <p><strong>Name:</strong> {visit.patientId?.name || "Unknown"}</p>
              <p><strong>Aadhar No:</strong> {visit.patientId?.aadharNo}</p>
              <p><strong>Check-In:</strong> {new Date(visit.checkInTime).toLocaleString()}</p>
              <p><strong>Check-Out:</strong> {new Date(visit.checkOutTime).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
