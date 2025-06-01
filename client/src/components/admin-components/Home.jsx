import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import BASE_URL from "../config";
import "./Home.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Home() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/dashboard/stats`)
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  if (!stats || !stats.visitsPerDay) return <p className="loading">Loading Dashboard...</p>;

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#555", font: { weight: 600 } },
      },
      y: {
        grid: { borderDash: [3, 3], color: "#ddd" },
        ticks: { color: "#888", stepSize: 1 },
      },
    },
  };

  const barData = {
    labels: stats.visitsPerDay.map((v) => v._id),
    datasets: [
      {
        label: "Visits",
        data: stats.visitsPerDay.map((v) => v.count),
        backgroundColor: "#00b894",
        borderRadius: 6,
        barThickness: 30,
      },
    ],
  };

  const doughnutData = {
    labels: ["OP Visits", "IP Visits"],
    datasets: [
      {
        label: "Visit Distribution",
        data: [stats.opCount, stats.ipCount],
        backgroundColor: ["#0984e3", "#d63031"],
        borderColor: "#fff",
        borderWidth: 1,
        hoverOffset: 3,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">📊 Dashboard</h2>

      <div className="cards-grid">
        <div className="stat-card gradient-green">
          <h3>Total Patients</h3>
          <p>{stats.totalPatients}</p>
        </div>
        <div className="stat-card gradient-blue">
          <h3>Active IP Patients</h3>
          <p>{stats.activePatients}</p>
        </div>
        <div className="stat-card gradient-yellow">
          <h3>Upcoming Visits</h3>
          <p>{stats.upcomingVisits}</p>
        </div>
        <div className="stat-card gradient-red">
          <h3>Tomorrow's Visits</h3>
          <p>{stats.tomorrowVisits}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-box">
          <h4>📅 Daily Visit Trends</h4>
          <Bar data={barData} options={barOptions} />
        </div>

        <div className="chart-box">
          <h4>🔍 Visit Type Distribution</h4>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
}
