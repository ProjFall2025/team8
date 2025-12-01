import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const role = parsedUser.role?.toLowerCase();
      if (role === "tenant") navigate("/tenant");
      else if (role === "landlord") navigate("/landlord");
      else if (role === "admin") navigate("/admin-panel");
      else navigate("/unauthorized");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>
      <div style={styles.card}>
        <div style={styles.heroIcon}>🏠</div>
        <h1 style={styles.heading}>Smart Property System</h1>
        <p style={styles.subHeading}>
          Manage leases, payments, and access — all in one place.
        </p>

        {user && (
          <p style={styles.welcome}>
            👋 Welcome back, <strong>{user.name}</strong>
          </p>
        )}

        <div style={styles.buttonRow}>
          {!user ? (
            <>
              <Link to="/login">
                <button style={styles.primaryButton}>Login</button>
              </Link>
              <Link to="/register">
                <button style={styles.secondaryButton}>Register</button>
              </Link>
            </>
          ) : (
            <button style={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    position: "relative",
    height: "100vh",
    backgroundImage: "url('/smart-property.webp')", // make sure this file is in public/
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Segoe UI, sans-serif",
    padding: "1rem",
    overflow: "hidden"
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.45)", // dark overlay only
    zIndex: 1
  },
  card: {
    position: "relative",
    zIndex: 2,
    backgroundColor: "#fff",
    padding: "3rem 2rem",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    textAlign: "center",
    maxWidth: "520px",
    width: "100%",
    animation: "fadeIn 0.8s ease"
  },
  heroIcon: {
    fontSize: "3.5rem",
    marginBottom: "0.75rem"
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#1e3a8a",
    marginBottom: "0.75rem"
  },
  subHeading: {
    fontSize: "1.15rem",
    color: "#374151",
    marginBottom: "2rem",
    lineHeight: "1.6"
  },
  welcome: {
    fontSize: "1rem",
    color: "#1f2937",
    marginBottom: "1.5rem"
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap"
  },
  primaryButton: {
    padding: "0.8rem 1.6rem",
    backgroundColor: "#1e3a8a",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 4px 12px rgba(30,58,138,0.2)"
  },
  secondaryButton: {
    padding: "0.8rem 1.6rem",
    backgroundColor: "#f3f4f6",
    color: "#1e3a8a",
    border: "1px solid #1e3a8a",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.25s ease"
  },
  logoutButton: {
    padding: "0.8rem 1.6rem",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 4px 12px rgba(220,38,38,0.2)"
  },
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" }
  }
};

export default Home;