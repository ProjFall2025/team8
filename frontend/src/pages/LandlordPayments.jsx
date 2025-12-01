// src/pages/LandlordPayments.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export default function LandlordPayments() {
  const navigate = useNavigate();

  const token = useMemo(() => localStorage.getItem('token'), []);
  const decoded = useMemo(() => (token ? jwtDecode(token) : null), [token]);
  const landlordId = useMemo(() => decoded?.user_id, [decoded]);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    month: 'All',
    status: 'All',
    property: 'All'
  });

  useEffect(() => {
    if (!decoded || decoded.role?.toLowerCase() !== 'landlord') {
      navigate('/unauthorized');
      return;
    }

    if (!landlordId) {
      console.error('❌ Missing landlord ID');
      return;
    }

    api
      .get(`/payments/landlord/${landlordId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setPayments(res.data))
      .catch(err =>
        console.error('❌ Error loading landlord payments:', err.response?.data || err.message)
      )
      .finally(() => setLoading(false));
  }, [landlordId, decoded, token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // ✅ Helpers for safe date formatting
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const parsed = Date.parse(dateStr);
    return isNaN(parsed) ? dateStr : new Date(parsed).toLocaleDateString();
  };

  const formatMonth = (ym) => {
    if (!ym) return 'N/A';
    const [year, month] = ym.split('-');
    if (!year || !month) return ym;
    return new Date(year, month - 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  // ✅ Deduplicate by lease and normalized month
  const uniquePayments = Array.from(
    new Map(
      payments.map(p => [`${p.lease_id}-${p.payment_month}`, p])
    ).values()
  );

  // ✅ Build filter options
  const months = [
    'All',
    ...new Set(uniquePayments.map(p => formatMonth(p.payment_month)))
  ];
  const properties = ['All', ...new Set(uniquePayments.map(p => p.property_address))];
  const statuses = ['All', 'completed', 'pending'];

  // ✅ Apply filters
  const paymentsToShow = uniquePayments.filter(p => {
    const monthLabel = formatMonth(p.payment_month);
    const matchMonth = filters.month === 'All' || filters.month === monthLabel;
    const matchStatus = filters.status === 'All' || p.latest_status === filters.status;
    const matchProperty = filters.property === 'All' || p.property_address === filters.property;
    return matchMonth && matchStatus && matchProperty;
  });

  if (loading) {
    return <p style={loadingStyle}>Loading payments...</p>;
  }

  return (
    <div style={pageStyle}>
      <nav style={navStyle}>
        <div style={navLeft}>💳 Landlord Portal — Payments</div>
        <div style={navRight}>
          <button style={navButton} onClick={() => navigate('/landlord')}>Dashboard</button>
          <button style={logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div style={containerStyle}>
        <h2 style={headingStyle}>My Payments</h2>

        {/* ✅ Filter Bar */}
        <div style={filterBar}>
          <select
            value={filters.month}
            onChange={e => setFilters({ ...filters, month: e.target.value })}
          >
            {months.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={filters.property}
            onChange={e => setFilters({ ...filters, property: e.target.value })}
          >
            {properties.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <button
            style={clearButton}
            onClick={() => setFilters({ month: 'All', status: 'All', property: 'All' })}
          >
            Clear Filters
          </button>
        </div>

        {paymentsToShow.length > 0 ? (
          <div style={cardGrid}>
            {paymentsToShow.map(pay => (
              <div
                key={`${pay.lease_id}-${pay.payment_month}`}
                style={card}
              >
                <h3 style={cardTitle}>
                  {pay.tenant_names ?? 'Unknown Tenant'} — ${parseFloat(pay.total_paid || 0).toFixed(2)}
                </h3>
                <p>
                  Property: {pay.property_address ?? 'N/A'}, {pay.city ?? ''}, {pay.state ?? ''}
                </p>
                <p>
                  Last Paid: {formatDate(pay.last_paid_date)}
                </p>
                <p>
                  Rent Cycle: {formatMonth(pay.payment_month)}
                </p>
                <p>Status: {pay.latest_status ?? 'N/A'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No payments found.</p>
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
const filterBar = { display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' };
const clearButton = { background: '#e5e7eb', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' };
const cardGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' };
const card = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '1.5rem' };
const cardTitle = { fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111' };