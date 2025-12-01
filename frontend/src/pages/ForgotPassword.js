import React, { useState } from "react";
import api from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setStatus(res.data.message);
    } catch {
      setStatus("Failed to send reset link.");
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={headingStyle}>Forgot Your Password?</h2>
        <p style={subtextStyle}>Enter your email and we’ll send you a reset link.</p>

        <label style={labelStyle}>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>Send Reset Link</button>

        {status && <p style={statusStyle}>{status}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
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