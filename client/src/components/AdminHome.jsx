import React, { useState } from "react";
import PatientProfile from "./admin-components/PatientProfile";
import { useNavigate } from "react-router-dom";
import { NavLink, Routes, Route } from "react-router-dom";
import {
  FaUserPlus,
  FaUsers,
  FaHospitalUser,
  FaUserCheck,
  FaCalendarAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { FiMessageSquare } from "react-icons/fi";
import "./AdminHome.css";
import Home from "./admin-components/Home";
import AddPatient from "./admin-components/AddPatient";
import AllPatients from "./admin-components/AllPatients";
import CheckedIn from "./admin-components/CheckedIn";
import Checkedout from "./admin-components/Checkedout";
import Upcoming from "./admin-components/Upcoming";
import Enquiry from "./admin-components/Enquiry";

export default function AdminHome() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (!localStorage.getItem("token")) {
    return (
      <div className="unauthorized-container">
        <div className="unauthorized-content">
          <h1>Access Denied</h1>
          <p>You need to be logged in to access this page.</p>
          <button onClick={() => navigate("/login-portal")} className="btn btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Mobile Sidebar Toggle */}
      <button
        className="mobile-sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Overlay */}
      <div
        className={`mobile-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src="/doc-logo.png" alt="Prakruthi Ashram" className="sidebar-logo" />
          <h2 className="sidebar-title">Admin Portal</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/admin-home"
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <MdDashboard className="nav-item-icon" />
            <span className="nav-item-text">Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin-home/enquiries"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <FiMessageSquare className="nav-item-icon" />
            <span className="nav-item-text">Enquiries</span>
          </NavLink>

          <NavLink
            to="/admin-home/add-patient"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <FaUserPlus className="nav-item-icon" />
            <span className="nav-item-text">Add Patient</span>
          </NavLink>

          <NavLink
            to="/admin-home/all-patients"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <FaUsers className="nav-item-icon" />
            <span className="nav-item-text">All Patients</span>
          </NavLink>

          <NavLink
            to="/admin-home/checkedin"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <FaHospitalUser className="nav-item-icon" />
            <span className="nav-item-text">Active Patients</span>
          </NavLink>

          <NavLink
            to="/admin-home/checkedout"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <FaUserCheck className="nav-item-icon" />
            <span className="nav-item-text">Discharged</span>
          </NavLink>

          <NavLink
            to="/admin-home/upcoming-visits"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <FaCalendarAlt className="nav-item-icon" />
            <span className="nav-item-text">Upcoming Visits</span>
          </NavLink>
        </nav>

        <div className="logout-section">
          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Sign out of admin portal"
          >
            <CiLogout className="logout-icon" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-board">
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="enquiries" element={<Enquiry />} />
            <Route path="add-patient" element={<AddPatient />} />
            <Route path="all-patients" element={<AllPatients />} />
            <Route path="patient/:id" element={<PatientProfile />} />
            <Route path="checkedin" element={<CheckedIn />} />
            <Route path="checkedout" element={<Checkedout />} />
            <Route path="upcoming-visits" element={<Upcoming />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}