import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiAlertCircle, FiShield } from "react-icons/fi";
import BASE_URL from "./config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post(`${BASE_URL}/api/admin/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/admin-home");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="/logo.png" alt="Prakruthi Ashram Logo" className="login-logo" />
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">
            Sign in to access the Prakruthi Ashramam Admin Portal
          </p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-input-group">
            <input
              type="email"
              placeholder="Enter your email address"
              className="login-input has-icon"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <FiMail className="login-input-icon" />
          </div>

          <div className="login-input-group">
            <input
              type="password"
              placeholder="Enter your password"
              className="login-input has-icon"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <FiLock className="login-input-icon" />
          </div>

          {error && (
            <div className="login-error">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="login-spinner"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="security-badge">
            <FiShield />
            <span>Secure Login</span>
          </div>
          <p className="login-footer-text">
            Your data is protected with enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
}