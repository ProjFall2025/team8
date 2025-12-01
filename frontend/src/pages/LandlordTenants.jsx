// src/pages/LandlordTenants.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export default function LandlordTenants() {
  const navigate = useNavigate();

  const user = useMemo(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }, []);

  const token = useMemo(() => localStorage.getItem('token'), []);
  const decoded = useMemo(() => (token ? jwtDecode(token) : null), [token]);
  const landlordId = useMemo(() => decoded?.user_id, [decoded]);

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== 'landlord') {
      navigate('/unauthorized');
      return;
    }

    if (!landlordId) {
      console.error("❌ Missing landlord ID. Cannot load tenants.");
      setLoading(false);
      return;
    }

    // ✅ Call landlord-specific endpoint
    api.get(`/lease-tenants/landlord-tenants/${landlordId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setTenants(res.data);
      })
      .catch(err =>
        console.error("❌ Error loading landlord tenants:", err.response?.data || err.message)
      )
      .finally(() => setLoading(false));
  }, [navigate, user, token, landlordId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <p style={loadingStyle}>Loading tenants...</p>;
  }

  // ✅ Summary stats
  const totalTenants = tenants.length;
  const totalRentCollected = tenants.reduce((sum, t) => sum + parseFloat(t.rent_collected || 0), 0);
  const totalBalance = tenants.reduce((sum, t) => sum + parseFloat(t.balance || 0), 0);
  const totalRequests = tenants.reduce((sum, t) => sum + (t.open_requests || 0), 0);

  return (
    <div style={pageStyle}>
      <nav style={navStyle}>
        <div style={navLeft}>👥 Landlord Portal — Tenants</div>
        <div style={navRight}>
          <button style={navButton} onClick={() => navigate('/landlord')}>Dashboard</button>
          <button style={logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div style={containerStyle}>
        <h2 style={headingStyle}>My Tenants</h2>

        {/* ✅ Summary bar */}
        <div style={summaryBar}>
          <div style={summaryItem}>👥 Tenants: <strong>{totalTenants}</strong></div>
          <div style={summaryItem}>💳 Rent Collected: <strong>${totalRentCollected}</strong></div>
          <div style={summaryItem}>⚠️ Outstanding Balance: <strong>${totalBalance}</strong></div>
          <div style={summaryItem}>🛠️ Open Requests: <strong>{totalRequests}</strong></div>
        </div>

        {tenants.length === 0 ? (
          <p>No tenants found.</p>
        ) : (
          <div style={cardGrid}>
            {tenants.map(t => (
              <div key={t.lease_id} style={card}>
                <h3 style={cardTitle}>{t.name}</h3>
                <p>📍 Property: {t.address}, {t.city}, {t.state}</p>
                <p>📑 Lease ID: {t.lease_id}</p>
                <p>📅 Lease Period: {t.start_date ? new Date(t.start_date).toLocaleDateString() : "N/A"} → {t.end_date ? new Date(t.end_date).toLocaleDateString() : "N/A"}</p>
                <p>💳 Rent: ${t.rent_amount || 0}</p>
                <p>💰 Rent Collected: ${t.rent_collected || 0}</p>
                <p>⚠️ Outstanding Balance: ${t.balance || 0}</p>
                <p>🛠️ Open Requests: {t.open_requests || 0}</p>
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
const summaryBar = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem', background: '#fff', padding: '1rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const summaryItem = { fontSize: '1rem', color: '#333' };
const cardGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' };
const card = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '1.5rem' };
const cardTitle = { fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111' };