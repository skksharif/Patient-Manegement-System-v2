import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaUserMd,
  FaUsers,
  FaChartLine,
  FaHospitalAlt,
  FaClipboardList,
} from "react-icons/fa";
import BASE_URL from "../config";
import "./Home.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Home() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/dashboard/insights`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStats(data);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="loading">Loading dashboard...</div>;

  const barData = {
    labels: stats.visitsPerDay.map((d) => d._id),
    datasets: [
      {
        label: "Daily Visits",
        data: stats.visitsPerDay.map((d) => d.count),
        backgroundColor: "darkorange",
        borderRadius: 5,
      },
    ],
  };

  const doughnutData = {
    labels: ["OP Visits", "IP Visits"],
    datasets: [
      {
        data: [stats.opCount, stats.ipCount],
        backgroundColor: ["darkorange", "olive"],
        borderColor: ["#fff", "#fff"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Prakruthi Ashramam Insights</h1>

      <div className="stats-grid">
        <div className="stat-box olive">
          <FaUsers /> Total Patients
          <span>{stats.totalPatients}</span>
        </div>
        <div className="stat-box darkorange">
          <FaHospitalAlt /> Active Inpatients
          <span>{stats.activeInpatients}</span>
        </div>
        <div className="stat-box olive">
          <FaClipboardList /> Upcoming Today
          <span>{stats.upcomingToday}</span>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <h3>Visit Distribution</h3>
          <Doughnut data={doughnutData} options={{ responsive: true }} />
        </div>
        <div className="chart-box graph">
          <h3>Daily Visits</h3>
          <Bar data={barData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}
