import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LeaseForm from '../components/LeaseForm';
import LeaseList from '../components/LeaseList';

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;

// Assume the 'user' prop contains user_id and role from the JWT
const AdminLeases = ({ user }) => {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeases = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Missing auth token');
      
      // 🛑 FIX: Dynamically set the API endpoint based on user role
      let apiEndpoint = '/api/leases';
      if (user && user.role.toLowerCase() === 'landlord') {
          // Landlords use the secure, filtered route
          apiEndpoint = `/api/leases/landlord/${user.user_id}`;
      }
      
      const res = await axios.get(apiEndpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeases(res.data);
    } catch (err) {
      console.error('❌ Fetch leases error:', err);
      // Update error state with response error or generic message
      setError(err.response?.data?.error || 'Failed to load leases');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    await fetchLeases();
  };

  const handleEdit = async (updatedLease) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/leases/${updatedLease.lease_id}`, updatedLease, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchLeases();
      alert(`✅ Lease ${updatedLease.lease_id} updated successfully`);
    } catch (err) {
      console.error('❌ Update lease error:', err);
      alert(err.response?.data?.error || 'Failed to update lease');
    }
  };

  const handleDelete = async (leaseId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete lease #${leaseId}?`);
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/leases/${leaseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchLeases();
      alert(`✅ Lease ${leaseId} deleted successfully`);
    } catch (err) {
      console.error('❌ Delete lease error:', err);
      alert(err.response?.data?.error || 'Failed to delete lease');
    }
  };

  useEffect(() => {
    // 💡 NOTE: The 'user' prop is needed here to determine the endpoint.
    // If 'user' is null initially, this fetch will use the default (Admin) route.
    // Ensure 'user' is passed correctly and is available on initial render.
    if (user) {
        fetchLeases();
    }
  }, [user]); // Re-fetch when the user data becomes available

  if (!user || !['admin', 'landlord'].includes(user.role.toLowerCase())) {
    return <p style={{ color: '#c00', textAlign: 'center', fontWeight: '600' }}>🚫 Unauthorized access</p>;
  }

  if (loading) return <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>⏳ Loading leases...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center', fontWeight: '600' }}>{error}</p>;

  // Summary bar logic (unchanged)
  const totalLeases = leases.length;
  const activeLeases = leases.filter(l => !l.renewal_requested).length;
  const renewalLeases = leases.filter(l => l.renewal_requested).length;
  const avgRent = totalLeases
    ? (leases.reduce((sum, l) => sum + Number(l.rent_amount || 0), 0) / totalLeases).toFixed(2)
    : 0;

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h2 style={{ marginBottom: '0.25rem' }}>Welcome, {user.name}</h2>
        <p style={{ fontSize: '0.95rem', color: '#555' }}>Role: <strong>{user.role}</strong></p>
      </div>

      <div style={summaryBar}>
        <div style={summaryItem}><span>Total Leases</span><strong>{totalLeases}</strong></div>
        <div style={summaryItem}><span>Active</span><strong style={{ color: 'green' }}>{activeLeases}</strong></div>
        <div style={summaryItem}><span>Renewal Requested</span><strong style={{ color: '#d97706' }}>{renewalLeases}</strong></div>
        <div style={summaryItem}><span>Average Rent</span><strong>${avgRent}</strong></div>
      </div>

      <LeaseForm onCreate={handleCreate} user={user} />

      <LeaseList
        leases={leases}
        onEdit={handleEdit}
        onDelete={handleDelete}
        user={user}
      />
    </div>
  );
};

/* Styles */
const pageStyle = {
  padding: '2rem',
  fontFamily: 'Segoe UI, sans-serif',
  backgroundColor: '#f9fafb',
  minHeight: '100vh'
};

const headerStyle = {
  marginBottom: '1rem',
  paddingBottom: '0.5rem',
  borderBottom: '1px solid #ddd'
};

const summaryBar = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '1rem',
  backgroundColor: '#fff',
  padding: '1rem',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  marginBottom: '2rem'
};

const summaryItem = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontSize: '0.95rem',
  color: '#333'
};

export default AdminLeases;