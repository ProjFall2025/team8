import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        // 🚫 no role field sent — backend enforces tenant
      });
      localStorage.setItem("token", res.data.token);
      navigate("/tenant"); // redirect straight to tenant dashboard
    } catch (err) {
      alert("Registration failed. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={headingStyle}>Register</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={inputStyle}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={inputStyle}
      />

      <button type="submit" style={buttonStyle}>
        Register
      </button>
    </form>
  );
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  width: "320px",
  margin: "0 auto",
  padding: "2rem",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  fontFamily: "Segoe UI, sans-serif",
  textAlign: "center",
};

const headingStyle = {
  marginBottom: "1.5rem",
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#1e3a8a",
};

const inputStyle = {
  marginBottom: "1rem",
  padding: "0.75rem",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none",
};

const buttonStyle = {
  padding: "0.75rem",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#1e3a8a",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background-color 0.25s ease",
};