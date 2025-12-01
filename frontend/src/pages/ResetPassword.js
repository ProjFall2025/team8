import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/reset-password", { token, newPassword });
      setStatus(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setStatus("Reset failed. Token may be invalid or expired.");
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={headingStyle}>Reset Your Password</h2>
        <p style={subtextStyle}>Enter a new password to complete the reset process.</p>

        <label style={labelStyle}>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>Reset Password</button>

        {status && <p style={statusStyle}>{status}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#f5f5f5"
};

const formStyle = {
  width: "320px",
  padding: "2rem",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  fontFamily: "Segoe UI, sans-serif"
};

const headingStyle = {
  marginBottom: "0.5rem",
  fontSize: "1.5rem",
  textAlign: "center",
  color: "#333"
};

const subtextStyle = {
  marginBottom: "1.5rem",
  fontSize: "0.95rem",
  textAlign: "center",
  color: "#666"
};

const labelStyle = {
  marginBottom: "0.5rem",
  fontSize: "0.9rem",
  color: "#555"
};

const inputStyle = {
  marginBottom: "1rem",
  padding: "0.75rem",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "100%"
};

const buttonStyle = {
  padding: "0.75rem",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#007bff",
  color: "#fff",
  cursor: "pointer",
  width: "100%"
};

const statusStyle = {
  marginTop: "1rem",
  fontSize: "0.9rem",
  textAlign: "center",
  color: "#007bff"
};