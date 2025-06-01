import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import { useNavigate } from "react-router-dom";

export default function Upcoming() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) return <div className="checkedin-card">Loading...</div>;

  return (
    <div className="checkedin-list">
      <h2>Upcoming Visits</h2>
      <div className="checkedin-container">
        {visits.length === 0 ? (
          <div className="checkedin-card">No upcoming visits found.</div>
        ) : (
          visits.map((visit) => (
            <div className="checkedin-card" key={visit._id} 
               onClick={() =>
                navigate(`/admin-home/patient/${visit.patientId?._id}`)
              }>
              <p><strong>Name:</strong> {visit.patientId?.name || "Unknown"}</p>
              <p><strong>Phone:</strong> {visit.patientId?.phone || "N/A"}</p>
              <p><strong>Aadhar No:</strong> {visit.patientId?.aadharNo || "N/A"}</p>
              <p><strong>Next Visit:</strong> {new Date(visit.nextVisit).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
