import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { jwtDecode } from "jwt-decode";export default function LandlordMaintenance() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  const decoded = jwtDecode(token);
  if (decoded.role?.toLowerCase() !== "landlord") {
    navigate("/unauthorized");
    return;
  }

  const landlordId = decoded.user_id; // ✅ always defined
  console.log("🔎 Using landlord ID:", landlordId);

  api.get(`/maintenance/landlord/${landlordId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => setRequests(res.data))
    .catch(err => setError("Failed to load maintenance requests."))
    .finally(() => setLoading(false));
}, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <p style={loadingStyle}>Loading maintenance requests...</p>;
  }

  return (
    <div style={pageStyle}>
      <nav style={navStyle}>
        <div style={navLeft}>🛠️ Landlord Portal — Maintenance</div>
        <div style={navRight}>
          <button style={navButton} onClick={() => navigate('/landlord')}>Dashboard</button>
          <button style={logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div style={containerStyle}>
        <h2 style={headingStyle}>My Maintenance Requests</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {requests.length === 0 ? (
          <p>No maintenance requests found.</p>
        ) : (
          <div style={cardGrid}>
            {requests.map(r => (
              <div key={r.request_id} style={card}>
                <h3 style={cardTitle}>{r.description}</h3>
                <p>Property: {r.address}, {r.city}, {r.state}</p>
                <p>Status: {r.status}</p>
                <p>Created: {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* Styles */
const pageStyle = { background: '#f9fafb', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' };
const navStyle = { background: '#2563eb', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000, width: '100%' };
const navLeft = { fontWeight: 'bold', fontSize: '1.5rem' };
const navRight = { display: 'flex', gap: '1rem' };
const navButton = { background: 'transparent', border: '1px solid #fff', color: '#fff', fontSize: '1rem', fontWeight: '500', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '6px' };
const logoutButton = { background: '#dc2626', border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' };
const containerStyle = { padding: '2rem', width: '100%', maxWidth: '1200px', margin: '0 auto' };
const headingStyle = { fontSize: '2rem', color: '#111', marginBottom: '1.5rem' };
const loadingStyle = { textAlign: 'center', fontSize: '1.2rem', marginTop: '3rem', color: '#555' };
const cardGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' };
const card = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '1.5rem' };
const cardTitle = { fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111' };