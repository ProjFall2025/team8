import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import TenantLeaseCard from '../components/TenantLeaseCard';
import TenantPayments from '../components/TenantPayments';
import LeasePhotosForm from '../components/LeasePhotosForm';
import DocumentsForm from '../components/DocumentsForm';

const TenantDashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [lease, setLease] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [passcodes, setPasscodes] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    if (onLogout) onLogout();
    navigate('/login');
  }, [navigate, onLogout]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return;

    const parsed = JSON.parse(stored);
    setUser(parsed);
    if (parsed.role !== 'tenant') navigate('/unauthorized');

    api.get(`/user-reminders/${parsed.user_id}`)
      .then(res => setReminders(res.data))
      .catch(err => {
        const msg = err.response?.data?.message;
        if (msg === 'Token expired') handleLogout();
        else console.error('❌ Error loading reminders:', msg || err.message);
      });
  }, [navigate, handleLogout]);

  // NEW EFFECT: Fetch the complete, current user profile details
  useEffect(() => {
    if (!user?.user_id) return;

    const fetchUserProfile = async () => {
      try {
        // Assuming there is an endpoint to fetch a single user by ID
        const res = await api.get(`/users/${user.user_id}`);
        // Update the user state with fresh data from the API
        setUser(prevUser => ({
          ...prevUser,
          ...res.data // Overwrite existing details with fresh profile data
        }));
      } catch (err) {
        const msg = err.response?.data?.message;
        console.error('❌ Error fetching user profile:', msg || err.message);
      }
    };
    fetchUserProfile();
  }, [user?.user_id]); // Trigger when the basic user object (from localStorage) is loaded

  useEffect(() => {
    if (!user?.user_id) return;
    const loadLease = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`/leases/user/${user.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLease(res.data.lease || res.data);
      } catch (err) {
        const msg = err.response?.data?.message;
        if (msg === 'Token expired') handleLogout();
        else console.error('❌ Error loading lease:', msg || err.message);
      }
    };
    loadLease();
  }, [user, handleLogout]);

  useEffect(() => {
    if (lease?.lease_id) {
      api.get(`/smart-passcodes/${lease.lease_id}`)
        .then(res => setPasscodes(res.data))
        .catch(err => {
          const msg = err.response?.data?.message;
          if (msg === 'Token expired') handleLogout();
          else console.error('❌ Error loading passcodes:', msg || err.message);
        });
    }
  }, [lease, handleLogout]);

  const handlePaymentClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.post(
        '/payments/create-session',
        {
          amount: lease?.rent_amount || 1000,
          lease_id: lease?.lease_id,
          user_id: user?.user_id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.url) window.location.href = res.data.url;
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === 'Token expired') handleLogout();
      else console.error('❌ Payment error:', msg || err.message);
    }
  };

  // Split cards into rows
  const row1 = [
    {
      title: 'Tenant Profile',
      content: (
        <>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          {/* The mobile number now reflects the current data fetched from the API */}
          <p><strong>Mobile:</strong> {user?.mobile_number || 'N/A'}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </>
      ),
      icon: '👤'
    },
    {
      title: 'Lease Information',
      content: <TenantLeaseCard lease={lease} user={user} showTitle={false} />,
      icon: '📄'
    },
    {
      title: 'Payment History',
      content: (
        <>
          <TenantPayments userId={user?.user_id} />
          <button style={styles.button} onClick={handlePaymentClick}>Make a Payment</button>
        </>
      ),
      icon: '💳'
    }
  ];

  const row2 = [
    lease ? {
      title: 'Lease Photos',
      content: <LeasePhotosForm leaseId={lease.lease_id} token={localStorage.getItem('token')} role={user?.role} showTitle={false} />,
      icon: '📷'
    } : null,
    lease ? {
      title: 'Lease Documents',
      content: <DocumentsForm leaseId={lease.lease_id} userId={user?.user_id} role={user?.role} showTitle={false} />,
      icon: '📄'
    } : null,
    {
      title: 'Reminders',
      content: (
        <>
          {reminders.length === 0 ? (
            <p style={styles.listEmpty}>No reminders yet 🎉</p>
          ) : (
            <ul style={styles.list}>
              {reminders.map((r) => (
                <li key={r.reminder_id} style={styles.listItem}>
                  <strong>{r.type}:</strong> {r.message} — {new Date(r.remind_at).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </>
      ),
      icon: '⏰'
    }
  ].filter(Boolean);

  const row3 = [
    lease ? {
      title: 'Smart Passcodes',
      content: (
        <>
          {passcodes.length === 0 ? (
            <p style={styles.listEmpty}>No active passcodes</p>
          ) : (
            <ul style={styles.list}>
              {passcodes.map((pc) => (
                <li key={pc.passcode_id} style={styles.listItem}>
                  <strong>Code:</strong> {pc.passcode} — Expires: {new Date(pc.expires_at).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </>
      ),
      icon: '🔐'
    } : null
  ].filter(Boolean);

  const renderRow = (cards) => (
    <div style={styles.row}>
      {cards.map((c) => (
        <div key={c.title} style={styles.card}>
          <div style={styles.cardIcon}>{c.icon}</div>
          <h3 style={styles.cardTitle}>{c.title}</h3>
          {c.content}
        </div>
      ))}
      {cards.length < 3 && (
        // Add invisible placeholders to maintain 3-column layout balance
        Array.from({ length: 3 - cards.length }).map((_, index) => (
          <div key={`placeholder-${index}`} style={{ flex: '1 1 280px', visibility: 'hidden' }}></div>
        ))
      )}
    </div>
  );

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>🏠 Tenant Portal</div>
        <div style={styles.navRight}>
          {location.pathname !== '/tenant/profile' && (
            <button style={styles.navButton} onClick={() => navigate('/tenant/profile')}>Profile</button>
          )}
          {location.pathname !== '/tenant' && (
            <button style={styles.navButton} onClick={() => navigate('/tenant')}>Dashboard</button>
          )}
          <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.welcomeBox}>
          <div style={styles.welcomeText}>Welcome, {user?.name || 'Guest'}</div>
          <div style={styles.roleBadge}>{user?.role}</div>
        </div>

        {/* SUMMARY BAR */}
        {lease && (
          <div style={styles.row}>
            {[
              { icon: '💰', label: 'Next Rent Due', value: parseFloat(lease.rent_amount || '0') > 0 ? `$${parseFloat(lease.rent_amount).toFixed(2)}` : 'Not set' },
              { icon: '📅', label: 'Lease Ends', value: lease.end_date ? new Date(lease.end_date).toLocaleDateString() : '—' },
              { icon: '💳', label: 'Payments Made', value: lease.rent_amount && passcodes.length > 0 ? `$${(passcodes.length * parseFloat(lease.rent_amount)).toFixed(2)}` : '—' }
            ].map((item) => (
              <div key={item.label} style={styles.summaryItem}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <div style={styles.summaryLabel}>{item.label}</div>
                <div style={styles.summaryValue}>{item.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* ROWS */}
        {renderRow(row1)}
        {renderRow(row2)}
        {renderRow(row3)}
      </div>
    </div>
  );
};

const styles = {
  page: {
    background: 'linear-gradient(to bottom, #eef2f7, #f9fafb)',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#1f2937',
    display: 'flex',
    flexDirection: 'column'
  },
  navbar: {
    background: '#1e3a8a',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%'
  },
  navLeft: { fontWeight: 'bold', fontSize: '1.4rem' },
  navRight: { display: 'flex', gap: '1rem', alignItems: 'center' },
  navButton: {
    background: 'transparent',
    border: '1px solid #fff',
    color: '#fff',
    padding: '0.45rem 1rem',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  logoutButton: {
    background: '#dc2626',
    border: 'none',
    color: '#fff',
    padding: '0.55rem 1.1rem',
    fontWeight: 600,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  container: { padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  welcomeBox: { display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem auto 1rem', maxWidth: '900px', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' },
  welcomeText: { fontSize: '1.8rem', fontWeight: 700, color: '#1f2937' },
  roleBadge: { backgroundColor: '#2563eb', color: '#fff', padding: '0.4rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 500, boxShadow: '0 2px 6px rgba(0,0,0,0.1)', display: 'inline-block' },
  summaryBar: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', background: '#ffffff', padding: '1rem 1.5rem', margin: '1rem auto 2rem', borderRadius: '16px', boxShadow: '0 6px 18px rgba(0,0,0,0.1)', maxWidth: '900px', textAlign: 'center' },
summaryItem: {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  background: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  flex: '1 1 280px',
  minHeight: '180px', // same height as cards
  cursor: 'default'
},
  summaryValue: { fontSize: '1.5rem', fontWeight: 700, color: '#1e3a8a', marginTop: '0.25rem' },
  summaryLabel: { fontSize: '0.95rem', fontWeight: 600, color: '#374151' },
  row: { display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '1200px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease', textAlign: 'center', flex: '1 1 280px' },
  cardIcon: { fontSize: '2.5rem', marginBottom: '0.75rem' },
  cardTitle: { fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111' },
  button: { marginTop: '1rem', padding: '0.7rem 1.4rem', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s ease' },
  listItem: { padding: '0.6rem 0', borderBottom: '1px solid #e5e7eb', fontSize: '0.95rem', color: '#374151' },
  listEmpty: { color: '#6b7280', fontStyle: 'italic', fontSize: '0.95rem', padding: '0.5rem 0' },
  list: { listStyle: 'none', padding: 0, margin: 0 }
};

export default TenantDashboard;