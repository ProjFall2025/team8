<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MaintenanceForm from '../components/MaintenanceForm';
import MaintenanceList from '../components/MaintenanceList';

axios.defaults.baseURL = 'http://localhost:5000';

const MaintenancePage = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/api/maintenance', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error('❌ Fetch error:', err);
    }
  };

  const handleCreate = (newRequest) => {
    setRequests(prev => [...prev, newRequest]);
  };

  const handleUpdate = async (id, data) => {
    try {
      await axios.patch(`/api/maintenance/${id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRequests(prev =>
        prev.map(r => (r.request_id === id ? { ...r, ...data } : r))
      );
    } catch (err) {
      console.error('❌ Update error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/maintenance/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRequests(prev => prev.filter(r => r.request_id !== id));
    } catch (err) {
      console.error('❌ Delete error:', err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(r => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const matchesSearch =
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      String(r.property_id).includes(search);
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={header}>
        <span style={headerIcon}>🛠️</span>
        <h2 style={headerTitle}>Maintenance Requests</h2>
      </div>

      {/* Filter + Search */}
      {['admin','landlord'].includes(user?.role) && (
        <div style={filterRow}>
          {['all','open','in_progress','closed'].map(f => (
            <button
              key={f}
              style={{
                ...filterButton,
                backgroundColor: filter === f ? '#2563eb' : '#3498db'
              }}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f.replace('_',' ').replace(/\b\w/g,c=>c.toUpperCase())}
            </button>
          ))}
          <input
            type="text"
            placeholder="Search by description or property ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchBox}
          />
        </div>
      )}

      {/* Form */}
      {user?.role === 'tenant' && (
        <div style={card}>
          <MaintenanceForm onCreate={handleCreate} user={user} />
        </div>
      )}

      {/* List */}
      <div style={card}>
        <MaintenanceList
          requests={filteredRequests}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          user={user}
        />
      </div>
    </div>
  );
};

/* 🎨 Styles */
const pageContainer = {
  maxWidth: '960px',
  margin: '3rem auto',
  padding: '2rem',
  backgroundColor: '#f9fafb',
  borderRadius: '12px',
  boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
  fontFamily: 'Segoe UI, sans-serif'
};

const header = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '2rem',
  borderBottom: '2px solid #e5e7eb',
  paddingBottom: '0.75rem'
};

const headerIcon = { fontSize: '2rem' };
const headerTitle = { fontSize: '1.75rem', fontWeight: '600', margin: 0, color: '#111' };

const filterRow = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  marginBottom: '2rem'
};

const filterButton = {
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#3498db',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.9rem',
  transition: 'background-color 0.2s ease'
};

const searchBox = {
  flex: 1,
  minWidth: '220px',
  padding: '0.6rem',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '0.9rem',
  backgroundColor: '#fff',
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
};

const card = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '1.5rem',
  marginBottom: '2rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
};

export default MaintenancePage;
=======
export default function MaintenancePage() {
  return <h2>🛠️ Maintenance Requests Coming Soon</h2>;
}
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
