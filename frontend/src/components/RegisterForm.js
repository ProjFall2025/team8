import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});
  const navigate = useNavigate();

  const validateField = (field, value) => {
    let msg = "";
    let ok = "";

    switch (field) {
      case "name":
        if (!value.trim()) msg = "Name is required.";
        else ok = "✓ Looks good!";
        break;
      case "email":
        if (!value.trim()) msg = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          msg = "Invalid email format.";
        else ok = "✓ Valid email.";
        break;
      case "mobile":
        if (!/^\d{10}$/.test(value))
          msg = "Mobile number must be exactly 10 digits.";
        else ok = "✓ Valid mobile number.";
        break;
      case "password":
        if (!value) msg = "Password is required.";
        else ok = "✓ Password entered.";
        break;
      case "confirmPassword":
        if (value !== password) msg = "Passwords do not match.";
        else ok = "✓ Passwords match.";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: msg }));
    setSuccess((prev) => ({ ...prev, [field]: ok }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).some((err) => err)) return;

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        mobile,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/tenant");
    } catch (err) {
      setErrors({ api: "Registration failed. Try again." });
    }
  };

  const isFormValid =
    name.trim() &&
    email.trim() &&
    /^\d{10}$/.test(mobile) &&
    password &&
    confirmPassword &&
    password === confirmPassword &&
    Object.values(errors).every((err) => !err);

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={headingStyle}>Register</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          validateField("name", e.target.value);
        }}
        style={inputStyle}
      />
      {errors.name && <p style={errorStyle}>{errors.name}</p>}
      {success.name && !errors.name && <p style={successStyle}>{success.name}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          validateField("email", e.target.value);
        }}
        style={inputStyle}
      />
      {errors.email && <p style={errorStyle}>{errors.email}</p>}
      {success.email && !errors.email && <p style={successStyle}>{success.email}</p>}

      <input
        type="tel"
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, "");
          setMobile(val);
          validateField("mobile", val);
        }}
        maxLength={10}
        style={inputStyle}
      />
      {errors.mobile && <p style={errorStyle}>{errors.mobile}</p>}
      {success.mobile && !errors.mobile && <p style={successStyle}>{success.mobile}</p>}

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          validateField("password", e.target.value);
          validateField("confirmPassword", confirmPassword); // re-check confirm
        }}
        style={inputStyle}
      />
      {errors.password && <p style={errorStyle}>{errors.password}</p>}
      {success.password && !errors.password && <p style={successStyle}>{success.password}</p>}

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          validateField("confirmPassword", e.target.value);
        }}
        style={inputStyle}
      />
      {errors.confirmPassword && (
        <p style={errorStyle}>{errors.confirmPassword}</p>
      )}
      {success.confirmPassword && !errors.confirmPassword && (
        <p style={successStyle}>{success.confirmPassword}</p>
      )}

      {errors.api && <p style={errorStyle}>{errors.api}</p>}

      <button
        type="submit"
        style={{
          ...buttonStyle,
          backgroundColor: isFormValid ? "#1e3a8a" : "#9ca3af",
          cursor: isFormValid ? "pointer" : "not-allowed",
        }}
        disabled={!isFormValid}
      >
        Register
      </button>
    </form>
  );
}

/* 🎨 Styles */
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
  marginBottom: "0.5rem",
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
  transition: "background-color 0.25s ease",
};

const errorStyle = {
  color: "red",
  fontSize: "0.85rem",
  marginBottom: "0.5rem",
  textAlign: "left",
};

const successStyle = {
  color: "green",
  fontSize: "0.85rem",
  marginBottom: "0.5rem",
  textAlign: "left",
};