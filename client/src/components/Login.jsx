import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import BASE_URL from "./config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
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
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="outer-login-container">
      <div className="login-container">
        <img src="/logo.png" alt="logo" className="hero-logo" />
        <div className="login-heading">WELCOME TO</div>
        <div className="login-subheading">
          PRAKRUTHI ASHRAMAM
          <br />
          ADMIN PORTAL
        </div>
        <input
          type="text"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <div className="spinner"></div> : "Login"}
        </button>

        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
        )}
      </div>
    </div>
  );
}
