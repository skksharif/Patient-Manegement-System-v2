import React from "react";
import PatientProfile from "./admin-components/PatientProfile";
import { useNavigate } from "react-router-dom";
import { NavLink, Routes, Route } from "react-router-dom";
import {
  FaUserPlus,
  FaUserInjured,
  FaUsers,
  FaHospitalUser,
  FaUserCheck,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import "./AdminHome.css";
import Home from "./admin-components/Home";
import AddPatient from "./admin-components/AddPatient";
import AllPatients from "./admin-components/AllPatients";
import CheckedIn from "./admin-components/CheckedIn";
import Checkedout from "./admin-components/Checkedout";
import Upcoming from "./admin-components/Upcoming";

export default function AdminHome() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!localStorage.getItem("token")) {
    return (
      <div>
        <center>
          <h1>
            <h1>Not Authorized</h1>
          </h1>
        </center>
      </div>
    );
  }
  return (
    <>
      <div className="main-container">
        <aside>
          <aside className={`sidebar`}>
            <nav className="sidebar-nav">
              <div className="sidebar-header">
                <h2>Prakruthi Ashram</h2>
              </div>

              <NavLink
                to="/admin-home"
                end
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                onClick={() => setSidebarOpen(false)}
              >
            <MdDashboard/>
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/admin-home/add-patient"
                end
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                onClick={() => setSidebarOpen(false)}
              >
                   <FaUserPlus />
                <span>Add Patient</span>
              </NavLink>

              <NavLink
                to="/admin-home/all-patients"
                end
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                onClick={() => setSidebarOpen(false)}
              >
                <FaUsers />
                <span>All Patients</span>
              </NavLink>

              <NavLink
                to="/admin-home/checkedin"
                end
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                onClick={() => setSidebarOpen(false)}
              >
                <FaHospitalUser />
                <span>Checked In</span>
              </NavLink>

              <NavLink
                to="/admin-home/checkedout"
                end
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                onClick={() => setSidebarOpen(false)}
              >
                <FaUserCheck />
                <span>Checked Out</span>
              </NavLink>

              <NavLink
                to="/admin-home/upcoming-visits"
                end
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                onClick={() => setSidebarOpen(false)}
              >
                <FaCalendarAlt />
                <span>Upcoming Visits</span>
              </NavLink>
            </nav>

            <div
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <CiLogout size={24} /> Logout
            </div>
          </aside>
        </aside>
        <main className="main-board">
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="add-patient" element={<AddPatient />} />
            <Route path="all-patients" element={<AllPatients />} />
            <Route path="patient/:id" element={<PatientProfile />} />
            <Route path="checkedin" element={<CheckedIn />} />
            <Route path="checkedout" element={<Checkedout />} />
            <Route path="upcoming-visits" element={<Upcoming />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
