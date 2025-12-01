import React from "react";
import RegisterForm from "../components/RegisterForm";

const Register = () => {
  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>
      <div style={styles.card}>
        <div style={styles.heroIcon}>🏠</div>
        <h1 style={styles.heading}>Smart Property System</h1>
        <p style={styles.subHeading}>
          Create your account to manage leases, payments, and access — all in one place.
        </p>
        <RegisterForm />
      </div>
    </div>
  );
};

const styles = {
  page: {
    position: "relative",
    height: "100vh",
    backgroundImage: "url('/smart-property.webp')", // same background as Login
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Segoe UI, sans-serif",
    padding: "1rem",
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.45)", // dark overlay
    zIndex: 1,
  },
  card: {
    position: "relative",
    zIndex: 2,
    backgroundColor: "#fff",
    padding: "2.5rem 2rem",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
  },
  heroIcon: {
    fontSize: "3rem",
    marginBottom: "0.5rem",
  },
  heading: {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#1e3a8a",
    marginBottom: "0.5rem",
  },
  subHeading: {
    fontSize: "1rem",
    color: "#374151",
    marginBottom: "1.5rem",
    lineHeight: "1.5",
  },
};

export default Register;