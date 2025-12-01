<<<<<<< HEAD
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
=======
import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tenant');
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
<<<<<<< HEAD
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role: "tenant", // 🔒 hardcoded role
      });
      localStorage.setItem("token", res.data.token);
      navigate("/"); // redirect to dashboard
    } catch (err) {
      alert("Registration failed. Try again.");
=======
      const res = await api.post('/auth/register', { name, email, password, role });
      localStorage.setItem('token', res.data.token);
      navigate('/'); // redirect to dashboard
    } catch (err) {
      alert('Registration failed. Try again.');
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
    }
  };

  return (
<<<<<<< HEAD
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={headingStyle}>Register</h2>

=======
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
      <input
        type="text"
        placeholder="Name"
        value={name}
<<<<<<< HEAD
        onChange={(e) => setName(e.target.value)}
        required
        style={inputStyle}
=======
        onChange={e => setName(e.target.value)}
        required
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
<<<<<<< HEAD
        onChange={(e) => setEmail(e.target.value)}
        required
        style={inputStyle}
=======
        onChange={e => setEmail(e.target.value)}
        required
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
<<<<<<< HEAD
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
=======
        onChange={e => setPassword(e.target.value)}
        required
      />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="landlord">landlord</option>
        <option value="tenant">Tenant</option>
        <option value="admin">Admin</option>
    
      </select>
      <button type="submit">Register</button>
    </form>
  );
}
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
