import React from "react";
import "./Hero.css";
import { FiUser } from "react-icons/fi";
import { NavLink } from "react-router-dom";

export default function Hero() {
  return (
    <>
      <main>
        <img src="/logo.png" alt="logo" className="hero-logo" />
        <div className="btn-container">
          <NavLink to="/login-portal">
            <button className="login-btn">
              <FiUser />
              <span>Admin Portal</span>
            </button>
          </NavLink>
        </div>
      </main>
    </>
  );
}
