import React from "react";
import "./Hero.css";
import { FiUser, FiShield, FiClock, FiHeart } from "react-icons/fi";
import { NavLink } from "react-router-dom";

export default function Hero() {
  return (
    <div className="hero-container">
      {/* Floating decorative elements */}
      <div className="floating-element">
        <FiHeart size={40} />
      </div>
      <div className="floating-element">
        <FiShield size={35} />
      </div>
      <div className="floating-element">
        <FiClock size={30} />
      </div>

      <div className="hero-content">
        <img src="/logo.png" alt="Prakruthi Ashram Logo" className="hero-logo" />
        
        <h1 className="hero-title">
          Welcome to Prakruthi Ashramam
        </h1>
        
        <p className="hero-subtitle">
          Comprehensive Patient Management System for Natural Healthcare Excellence
        </p>
        
        <div className="hero-actions">
          <NavLink to="/login-portal" className="hero-btn">
            <FiUser className="hero-btn-icon" />
            <span>Admin Portal</span>
          </NavLink>
        </div>
      </div>

      <div className="hero-features">
        <div className="hero-feature">
          <FiShield className="hero-feature-icon" />
          <span>Secure & Private</span>
        </div>
        <div className="hero-feature">
          <FiClock className="hero-feature-icon" />
          <span>24/7 Access</span>
        </div>
        <div className="hero-feature">
          <FiHeart className="hero-feature-icon" />
          <span>Patient Focused</span>
        </div>
      </div>
    </div>
  );
}