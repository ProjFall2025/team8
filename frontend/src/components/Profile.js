import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import TenantLeaseCard from '../components/TenantLeaseCard';
import TenantPayments from '../components/TenantPayments';

export default function Profile({ user }) {
  const navigate = useNavigate();
  const userId = user?.user_id;
  const [lease, setLease] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem('token');
    api.get(`/leases/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setLease(res.data))
      .catch(err => console.error("❌ Error loading lease:", err.response?.data || err.message));
  }, [userId]);

  if (!user) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Tenant Profile</h2>
          <p style={styles.empty}>No user data found.</p>
          <button style={styles.backButton} onClick={() => navigate('/tenant')}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Tenant Info Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.icon}>👤</span>
          <h2 style={styles.heading}>Tenant Profile</h2>
        </div>
        <div style={styles.cardContent}>
          <p><strong>Name:</strong> {user.name || 'N/A'}</p>
          <p><strong>Email:</strong> {user.email || 'N/A'}</p>
          <p><strong>Role:</strong> {user.role || 'tenant'}</p>
        </div>
      </div>

      {/* Lease Info Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.icon}>📄</span>
          <h3 style={styles.sectionTitle}>Lease Info</h3>
        </div>
        <div style={styles.cardContent}>
          <TenantLeaseCard lease={lease} user={user} />
        </div>
      </div>

      {/* Payment History Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.icon}>💳</span>
          <h3 style={styles.sectionTitle}>Payment History</h3>
        </div>
        <div style={styles.cardContent}>
          <TenantPayments userId={userId} />
          {(user.role === 'tenant' || user.role === 'landlord') && (
            <button style={styles.button} onClick={() => navigate('/payments')}>
              Make a Payment
            </button>
          )}
        </div>
      </div>

      <button style={styles.backButton} onClick={() => navigate('/tenant')}>
        ← Back to Dashboard
      </button>
    </div>
  );
}

const styles = {
  page: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
    background: 'linear-gradient(to bottom, #eef2f7, #f9fafb)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    padding: '1.5rem 2rem',
    width: '100%',
    maxWidth: '700px',
    marginBottom: '2rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    gap: '0.75rem'
  },
  icon: { fontSize: '2rem' },
  heading: { fontSize: '1.8rem', color: '#1f2937', margin: 0 },
  sectionTitle: { fontSize: '1.4rem', color: '#1f2937', margin: 0 },
  cardContent: { marginTop: '0.5rem' },
  button: {
    marginTop: '1rem',
    padding: '0.7rem 1.4rem',
    background: '#1e3a8a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
  },
  backButton: {
    background: 'transparent',
    border: 'none',
    color: '#1e3a8a',
    cursor: 'pointer',
    fontSize: '1rem',
    textDecoration: 'underline',
    marginTop: '1rem'
  },
  empty: { color: '#6b7280', fontStyle: 'italic', marginBottom: '1rem' },
};