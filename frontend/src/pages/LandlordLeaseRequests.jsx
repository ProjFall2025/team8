// src/pages/LandlordLeaseRequests.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function LandlordLeaseRequests() {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem('token'), []);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // Filter state

  useEffect(() => {
    api.get('/lease-requests/pending', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setRequests(res.data))
      .catch(err => console.error('❌ Error loading lease requests:', err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleUpdate = async (id, status) => {
    try {
      await api.put(`/lease-requests/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setRequests(requests.map(r => r.request_id === id ? { ...r, status } : r));
    } catch (err) {
      console.error('❌ Error updating request:', err.response?.data?.message || err.message);
    }
  };

  const filteredRequests = requests.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>📑 Lease Requests</div>
        <div style={styles.navRight}>
          <button style={styles.navButton} onClick={() => navigate('/landlord')}>Dashboard</button>
          <button style={styles.logoutButton} onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }}>Logout</button>
        </div>
      </nav>

      <div style={styles.container}>
        <h2 style={styles.heading}>Lease Requests</h2>

        {/* Filter Tabs */}
        <div style={styles.tabs}>
          {['all', 'pending', 'approved', 'rejected'].map(tab => (
            <button
              key={tab}
              style={{
                ...styles.tabButton,
                backgroundColor: filter === tab ? '#2563eb' : '#e5e7eb',
                color: filter === tab ? '#fff' : '#111'
              }}
              onClick={() => setFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading requests...</p>
        ) : filteredRequests.length === 0 ? (
          <p style={styles.listEmpty}>No {filter} requests 🎉</p>
        ) : (
          <ul style={styles.list}>
            {filteredRequests.map(r => (
              <li key={r.request_id} style={styles.listItem}>
                Tenant #{r.user_id} — {new Date(r.requested_at).toLocaleString()}
                <span style={{
                  marginLeft: '10px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: r.status === 'approved' ? '#10b981' :
                                   r.status === 'rejected' ? '#ef4444' : '#fbbf24',
                  color: '#fff'
                }}>
                  {r.status}
                </span>
                {r.status === 'pending' && (
                  <>
                    <button style={styles.button} onClick={() => handleUpdate(r.request_id, 'approved')}>Approve</button>
                    <button style={styles.button} onClick={() => handleUpdate(r.request_id, 'rejected')}>Reject</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '20px', fontFamily: 'Arial, sans-serif' },
  navbar: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  navLeft: { fontWeight: 'bold' },
  navRight: { display: 'flex', gap: '10px' },
  navButton: { padding: '6px 12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px' },
  logoutButton: { padding: '6px 12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px' },
  container: { backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px' },
  heading: { marginBottom: '10px' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '15px' },
  tabButton: { padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0 },
  listItem: { marginBottom: '10px' },
  listEmpty: { color: '#6b7280' },
  button: { marginLeft: '10px', padding: '4px 8px', borderRadius: '4px', border: 'none', cursor: 'pointer' }
};
