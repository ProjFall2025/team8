// src/pages/LandlordDashboard.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export default function LandlordDashboard() {
  const navigate = useNavigate();

  const user = useMemo(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }, []);

  const token = useMemo(() => localStorage.getItem('token'), []);
  const decoded = useMemo(() => (token ? jwtDecode(token) : null), [token]);
  const landlordId = useMemo(() => decoded?.user_id, [decoded]);

  const userInfo = useMemo(() => {
    return decoded
      ? { name: decoded.name, role: decoded.role, email: decoded.email }
      : user;
  }, [decoded, user]);

  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [leaseRequests, setLeaseRequests] = useState([]); // NEW
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo || userInfo.role?.toLowerCase() !== 'landlord') {
      navigate('/unauthorized');
      return;
    }

    if (!landlordId) {
      console.error("❌ Missing landlord ID. Cannot load dashboard.");
      return;
    }

    Promise.all([
      api.get('/properties/landlord', { headers: { Authorization: `Bearer ${token}` } }),
      api.get(`/lease-tenants/landlord-tenants/${landlordId}`, { headers: { Authorization: `Bearer ${token}` } }),
      api.get(`/payments/landlord/${landlordId}`, { headers: { Authorization: `Bearer ${token}` } }),
      api.get(`/maintenance/landlord/${landlordId}`, { headers: { Authorization: `Bearer ${token}` } }),
      api.get('/lease-requests', { headers: { Authorization: `Bearer ${token}` } }) // NEW
    ])
      .then(([propsRes, tenantsRes, paymentsRes, maintRes, requestsRes]) => {
        setProperties(propsRes.data);
        setTenants(tenantsRes.data);
        setPayments(paymentsRes.data);
        setMaintenance(maintRes.data);
        setLeaseRequests(requestsRes.data); // NEW
      })
      .catch(err =>
        console.error("❌ Error loading landlord dashboard:", err.response?.data || err.message)
      )
      .finally(() => setLoading(false));
  }, [userInfo, landlordId, navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const normalizedProperties = properties.map(p => ({
    ...p,
    is_owned: Number(p.is_owned) === 1 ? 1 : 0
  }));

  const totalCollected = payments.reduce(
    (sum, p) => sum + (parseFloat(p.total_paid) || 0),
    0
  );

  const uniqueAddresses = new Set(properties.map(p => p.address)).size;

  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>🏠 Landlord Portal</div>
        <div style={styles.navRight}>
          <button style={styles.navButton} onClick={() => navigate('/landlord')}>Dashboard</button>
          <button style={styles.navButton} onClick={() => navigate('/landlord/properties')}>Properties</button>
          <button style={styles.navButton} onClick={() => navigate('/landlord/tenants')}>Tenants</button>
          <button style={styles.navButton} onClick={() => navigate('/landlord/payments')}>Payments</button>
          <button style={styles.navButton} onClick={() => navigate('/landlord/maintenance')}>Maintenance</button>
          <button style={styles.navButton} onClick={() => navigate('/landlord/lease-requests')}>Lease Requests</button> {/* NEW NAV */}
          <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div style={styles.container}>
        <h2 style={styles.heading}>Welcome, {userInfo?.name}</h2>
        <p style={styles.role}>Role: {userInfo?.role}</p>

        {/* ✅ Summary Bar */}
        <div style={styles.summaryBar}>
          <div style={styles.summaryItem}>🏠 <strong>{uniqueAddresses}</strong> Properties / <strong>{properties.length}</strong> Units</div>
          <div style={styles.summaryItem}>👥 <strong>{tenants.length}</strong> Tenants</div>
          <div style={styles.summaryItem}>💳 <strong>${totalCollected.toFixed(2)}</strong> Collected</div>
          <div style={styles.summaryItem}>🛠️ <strong>{maintenance.length}</strong> Requests</div>
          <div style={styles.summaryItem}>📑 <strong>{leaseRequests.length}</strong> Lease Requests</div> {/* NEW */}
        </div>

        <div style={styles.grid}>
          {/* Properties */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>🏠 Properties</h3>
            {loading ? <p>Loading properties...</p> : (
              <ul style={styles.list}>
                {normalizedProperties.slice(0, 3).map(p => (
                  <li key={p.property_id}>
                    <strong>{p.address}</strong> — {p.city}, {p.state}
                    <div>Rent: ${p.rent_amount}</div>
                    <span style={{
                      backgroundColor: p.status === 'occupied' ? '#f87171' : '#34d399',
                      color: '#fff',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      marginTop: '4px',
                      display: 'inline-block'
                    }}>{p.status}</span>
                    {p.is_owned === 1 && (
                      <div style={{ color: '#2563eb', fontWeight: 'bold' }}>✅ Your Property</div>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <button style={styles.viewAllButton} onClick={() => navigate('/landlord/properties')}>
              View All Properties
            </button>
          </div>

          {/* Tenants */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>👥 Tenants</h3>
            {loading ? <p>Loading tenants...</p> : (
              <ul style={styles.list}>
                {tenants.slice(0, 3).map(t => (
                  <li key={`${t.user_id}-${t.lease_id}`}>
                    {t.name} — Lease #{t.lease_id}
                  </li>
                ))}
              </ul>
            )}
            <button style={styles.viewAllButton} onClick={() => navigate('/landlord/tenants')}>
              View All Tenants
            </button>
          </div>


         
          {/* Payments */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>💳 Payments</h3>
            {loading ? <p>Loading payments...</p> : (
              <ul style={styles.list}>
                {payments.slice(0, 3).map((pay) => {
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
                  const amount = pay.total_paid ? `$${parseFloat(pay.total_paid).toFixed(2)}` : '$N/A';
                  const paidDate = formatDate(pay.last_paid_date);
                  const monthLabel = formatMonth(pay.payment_month);
                  return (
                    <li key={`${pay.lease_id}-${pay.payment_month}`}>
                      {pay.tenant_names ?? 'Unknown'} — {amount} on {paidDate} ({monthLabel})
                      <span style={{
                        backgroundColor: pay.latest_status === 'completed' ? '#10b981' : '#fbbf24',
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        marginLeft: '6px'
                      }}>{pay.latest_status}</span>
                    </li>
                  );
                })}
              </ul>
            )}
            <button style={styles.viewAllButton} onClick={() => navigate('/landlord/payments')}>
              View All Payments
            </button>
          </div>

          {/* Maintenance */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>🛠️ Maintenance Requests</h3>
            {loading ? <p>Loading requests...</p> : (
              <ul style={styles.list}>
                {maintenance.slice(0, 3).map((m, index) => (
                  <li key={`${m.request_id}-${index}`}>
                    {m.description} — 
                    <span style={{
                      backgroundColor: m.status === 'open' ? '#fbbf24' : '#10b981',
                      color: '#fff',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      marginLeft: '6px'
                    }}>
                      {m.status}
                    </span>
                    ({new Date(m.created_at).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            )}
            <button style={styles.viewAllButton} onClick={() => navigate('/landlord/maintenance')}>
              View All Requests
            </button>
          </div>

          {/* Lease Requests */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>📑 Lease Requests</h3>
            {loading ? <p>Loading requests...</p> : (
              <ul style={styles.list}>
                {leaseRequests.slice(0, 3).map(r => (
                  <li key={r.request_id}>
                    Tenant #{r.user_id} — {new Date(r.requested_at).toLocaleDateString()}
                    <span style={{
                      backgroundColor: r.status === 'approved' ? '#10b981' :
                                       r.status === 'rejected' ? '#ef4444' : '#fbbf24',
                      color: '#fff',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      marginLeft: '6px'
                    }}>
                      {r.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <button style={styles.viewAllButton} onClick={() => navigate('/landlord/lease-requests')}>
              View All Lease Requests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    fontFamily: 'Inter, Segoe UI, sans-serif',
    color: '#1f2937'
  },
  navbar: {
    backgroundColor: '#1e40af',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  navLeft: {
    fontWeight: 600,
    fontSize: '1.25rem',
    letterSpacing: '0.5px'
  },
  navRight: {
    display: 'flex',
    gap: '0.75rem'
  },
  navButton: {
    backgroundColor: 'transparent',
    border: '1px solid #fff',
    color: '#fff',
    padding: '0.4rem 0.9rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    fontWeight: 500
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    border: 'none',
    color: '#fff',
    padding: '0.45rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'background 0.2s ease'
  },
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#111827'
  },
  role: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '2rem'
  },
  summaryBar: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#eef2ff',
    padding: '1rem 2rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    fontSize: '1rem',
    fontWeight: 500,
    color: '#1e3a8a'
  },
  summaryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    padding: '1.5rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    border: '1px solid #e5e7eb'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: '#1f2937',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '0.5rem'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#374151'
  },
  viewAllButton: {
    marginTop: '1rem',
    backgroundColor: '#1e40af',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.95rem',
    transition: 'background 0.2s ease'
  }
};