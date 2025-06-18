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
import { 
  FaUsers, 
  FaHospitalUser, 
  FaCalendarAlt, 
  FaChartBar,
  FaUserPlus,
  FaClipboardList,
  FaArrowUp,
  FaArrowDown,
  FaMinus
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { NavLink } from "react-router-dom";
import BASE_URL from "../config";
import "./Home.css";
import Loader from "../../Loader";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/dashboard/stats`);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader />
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  if (!stats || !stats.visitsPerDay) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📊</div>
        <h3 className="empty-state-title">No Data Available</h3>
        <p className="empty-state-description">
          Dashboard data is currently unavailable. Please try again later.
        </p>
      </div>
    );
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { 
          color: '#6b7280',
          font: { weight: 500, size: 12 }
        },
      },
      y: {
        grid: { 
          color: 'rgba(0, 0, 0, 0.05)',
          borderDash: [2, 2]
        },
        ticks: { 
          color: '#6b7280',
          stepSize: 1,
          font: { size: 12 }
        },
      },
    },
  };

  const barData = {
    labels: stats.visitsPerDay.map((v) => {
      const date = new Date(v._id);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: "Daily Visits",
        data: stats.visitsPerDay.map((v) => v.count),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const doughnutData = {
    labels: ["Outpatient Visits", "Inpatient Visits"],
    datasets: [
      {
        data: [stats.opCount, stats.ipCount],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 12, weight: 500 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
  };

  const statCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: FaUsers,
      variant: "primary",
      change: { value: 12, type: "positive" }
    },
    {
      title: "Active Inpatients",
      value: stats.activePatients,
      icon: FaHospitalUser,
      variant: "success",
      change: { value: 3, type: "positive" }
    },
    {
      title: "Upcoming Visits",
      value: stats.upcomingVisits,
      icon: FaCalendarAlt,
      variant: "warning",
      change: { value: 0, type: "neutral" }
    },
    {
      title: "Tomorrow's Visits",
      value: stats.tomorrowVisits,
      icon: FaChartBar,
      variant: "info",
      change: { value: 2, type: "positive" }
    },
  ];

  const quickActions = [
    {
      title: "Add Patient",
      icon: FaUserPlus,
      link: "/admin-home/add-patient"
    },
    {
      title: "View All Patients",
      icon: FaUsers,
      link: "/admin-home/all-patients"
    },
    {
      title: "Active Patients",
      icon: FaHospitalUser,
      link: "/admin-home/checkedin"
    },
    {
      title: "Enquiries",
      icon: FaClipboardList,
      link: "/admin-home/enquiries"
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <MdDashboard className="dashboard-title-icon" />
          Dashboard Overview
        </h1>
        <p className="dashboard-subtitle">
          Welcome back! Here's what's happening at Prakruthi Ashramam today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className={`stat-card ${card.variant}`}>
            <div className="stat-header">
              <h3 className="stat-title">{card.title}</h3>
              <div className="stat-icon">
                <card.icon />
              </div>
            </div>
            <p className="stat-value">{card.value}</p>
            <div className={`stat-change ${card.change.type}`}>
              {card.change.type === 'positive' && <FaArrowUp />}
              {card.change.type === 'negative' && <FaArrowDown />}
              {card.change.type === 'neutral' && <FaMinus />}
              <span>
                {card.change.value > 0 ? `+${card.change.value}` : card.change.value} this week
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="charts-header">
          <h2 className="charts-title">Analytics & Insights</h2>
          <p className="charts-subtitle">
            Visual representation of patient visit patterns and distribution
          </p>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">
                <FaChartBar className="chart-title-icon" />
                Daily Visit Trends
              </h3>
              <p className="chart-subtitle">Patient visits over the last 7 days</p>
            </div>
            <div className="chart-container">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">
                <FaUsers className="chart-title-icon" />
                Visit Distribution
              </h3>
              <p className="chart-subtitle">Breakdown by visit type</p>
            </div>
            <div className="chart-container">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="quick-actions-header">
          <h2 className="quick-actions-title">Quick Actions</h2>
        </div>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <NavLink key={index} to={action.link} className="action-card">
              <div className="action-icon">
                <action.icon />
              </div>
              <h4 className="action-title">{action.title}</h4>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}