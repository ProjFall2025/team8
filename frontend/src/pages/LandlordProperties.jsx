// src/pages/LandlordProperties.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function LandlordProperties() {
  const navigate = useNavigate();
  const user = useMemo(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }, []);

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null); // ✅ track detail view

  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== 'landlord') {
      navigate('/unauthorized');
      return;
    }

    // 🛑 FIX APPLIED: Changed to '/landlord/all' to get the 'is_owned' flag 
    // and full dashboard data calculated in Property.getAllWithOwnershipFlag
    api.get('/properties/landlord/all', { 
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setProperties(res.data))
      .catch(err =>
        console.error("❌ Error loading landlord properties:", err.response?.data || err.message)
      )
      .finally(() => setLoading(false));
  }, [user, navigate]);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <p style={loadingStyle}>Loading properties...</p>;
  }

  const sortedProperties = [...properties].sort((a, b) =>
    a.status === 'occupied' ? -1 : 1
  );

  const totalTenants = properties.reduce((sum, p) => sum + (p.tenant_count || 0), 0);
  const totalCollected = properties.reduce((sum, p) => sum + (parseFloat(p.rent_collected) || 0), 0);
  const totalRequests = properties.reduce((sum, p) => sum + (p.open_requests || 0), 0);

  return (
    <div style={pageStyle}>
      <nav style={navStyle}>
        <div style={navLeft}>🏠 Landlord Portal</div>
        <div style={navRight}>
          <button style={navButton} onClick={() => navigate('/landlord')}>Dashboard</button>
          <button style={logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div style={containerStyle}>
        <h2 style={headingStyle}>All Properties</h2>

        {/* ✅ Summary Bar */}
        {!selectedProperty && (
          <div style={summaryBar}>
            <div>🏠 {properties.length} Properties</div>
            <div>👥 {totalTenants} Tenants</div>
            <div>💳 ${totalCollected.toFixed(2)} Collected</div>
            <div>🛠️ {totalRequests} Requests</div>
          </div>
        )}

        {/* ✅ Conditional rendering */}
        {selectedProperty ? (
          <div style={detailCard}>
            <button style={backButton} onClick={() => setSelectedProperty(null)}>⬅ Back</button>
            <h2>{selectedProperty.address} — {selectedProperty.city}, {selectedProperty.state}</h2>
            <p>Status: {selectedProperty.status}</p>
            <p>Rent Amount: ${selectedProperty.rent_amount}</p>
            {selectedProperty.unit_count && <p>Units: {selectedProperty.unit_count}</p>}
            <p>Tenants: {selectedProperty.tenant_count || 0}</p>
            <p>Total Rent Collected: ${selectedProperty.rent_collected || 0}</p>
            <p>Open Requests: {selectedProperty.open_requests || 0}</p>
          </div>
        ) : (
          <div style={cardGrid}>
            {sortedProperties.map(p => {
              const owned = Number(p.is_owned) === 1;
              return (
                <div
                  key={p.property_id}
                  style={{
                    ...card,
                    border: owned ? '2px solid #2563eb' : '1px solid #ccc',
                    backgroundColor: owned ? '#e0f2fe' : '#fff'
                  }}
                  onClick={() => setSelectedProperty(p)} // ✅ show detail view
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = card.boxShadow;
                  }}
                >
                  <h3 style={cardTitle}>{p.address} — {p.city}, {p.state}</h3>
                  <p>
                    Status: <span style={{
                      backgroundColor: p.status === 'occupied' ? '#dc2626' : '#16a34a',
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>{p.status}</span>
                  </p>
                  <p>Rent Amount: ${p.rent_amount}</p>
                  {p.unit_count && <p>Units: {p.unit_count}</p>}
                  <p>Tenants: {p.tenant_count || 0}</p>
                  <p>Total Rent Collected: ${p.rent_collected || 0}</p>
                  <p>
                    Open Requests: <span style={{
                      backgroundColor: p.open_requests > 0 ? '#f59e0b' : '#6b7280',
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>{p.open_requests || 0}</span>
                  </p>
                  {owned && (
                    <div style={{
                      backgroundColor: '#2563eb',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'inline-block',
                      marginTop: '8px'
                    }}>
                      ✅ Owned
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* Styles */
const pageStyle = { background: 'linear-gradient(to bottom, #eef2f7, #f9fafb)', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' };
const navStyle = { background: '#2563eb', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000, width: '100%' };
const navLeft = { fontWeight: 'bold', fontSize: '1.5rem' };
const navRight = { display: 'flex', gap: '1rem' };
const navButton = { background: 'transparent', border: '1px solid #fff', color: '#fff', fontSize: '1rem', fontWeight: '500', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '6px' };
const logoutButton = { background: '#dc2626', border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' };
const containerStyle = { padding: '2rem', width: '100%', maxWidth: '1200px', margin: '0 auto' };
const headingStyle = { fontSize: '2rem', color: '#111', marginBottom: '1.5rem' };
const loadingStyle = { textAlign: 'center', fontSize: '1.2rem', marginTop: '3rem', color: '#555' };
const summaryBar = { display: 'flex', justifyContent: 'space-between', backgroundColor: '#eef2ff', padding: '1rem 2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', fontSize: '1rem', fontWeight: 500, color: '#1e3a8a' };
const cardGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'stretch' };
const card = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', padding: '1.5rem', transition: 'transform 0.2s ease, box-shadow 0.2s ease', cursor: 'pointer'};
const cardTitle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  marginBottom: '0.5rem',
  color: '#111'
};

const detailCard = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  padding: '2rem',
  maxWidth: '800px',
  margin: '0 auto'
};

const backButton = {
  backgroundColor: '#2563eb',
  color: '#fff',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  fontWeight: '500',
  cursor: 'pointer',
  marginBottom: '1rem'
};