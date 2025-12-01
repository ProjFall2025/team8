import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [editTenant, setEditTenant] = useState(null);
  const [editForm, setEditForm] = useState({ email: '', phone: '' });

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    async function fetchTenants() {
      try {
        const res = await axios.get('/api/users?role=tenant', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTenants(res.data);
      } catch (err) {
        console.error('❌ Fetch tenants error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTenants();
  }, []);

  if (!user || user.role !== 'admin') {
    return <p style={unauthorizedStyle}>🚫 Unauthorized access</p>;
  }

  if (loading) {
    return <p style={loadingStyle}>Loading tenants...</p>;
  }

  const filteredTenants = tenants.filter((t) => {
    if (!searchTerm.trim()) return true;
    return (
      `User ${t.id}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleView = (tenant) => setSelectedTenant(tenant);

  const handleEdit = (tenant) => {
    setEditTenant(tenant);
    setEditForm({ email: tenant.email, phone: tenant.phone || tenant.mobile_number || '' });
  };

  const handleDelete = async (tenantId) => {
    const confirmDelete = window.confirm(`Are you sure you want to remove tenant #${tenantId}?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/users/${tenantId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTenants((prev) => prev.filter((t) => t.id !== tenantId));
      alert(`✅ Tenant ${tenantId} removed successfully`);
    } catch (err) {
  console.error('❌ Delete error:', err);
  alert(err.response?.data?.error || 'Failed to delete tenant');
}
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/users/${editTenant.id}`, editForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTenants((prev) =>
        prev.map((t) => (t.id === editTenant.id ? { ...t, ...editForm } : t))
      );
      setEditTenant(null);
      alert(`Tenant ${editTenant.id} updated successfully`);
    } catch (err) {
      console.error('❌ Update error:', err);
      alert('Failed to update tenant');
    }
  };
    return (
    <div style={pageStyle}>
      <div style={headerRow}>
  <span style={iconStyle}>👥</span>
  <h2 style={headingStyle}>Registered Tenants</h2>
</div>

<form
  onSubmit={(e) => {
    e.preventDefault();
    const value = e.target.search.value.trim();
    setSearchTerm(value);
  }}
  style={controlsStyle}
>
  <input
    type="text"
    name="search"
    placeholder="Search by ID or email..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={searchInput}
  />
  <button type="submit" style={viewButton}>Search</button>
  <button
    type="button"
    style={deleteButton}
    onClick={() => setSearchTerm('')}
  >
    Clear
  </button>
</form>


      {filteredTenants.length === 0 ? (
        <p style={emptyStyle}>No tenants found.</p>
      ) : (
        <div style={gridStyle}>
          {filteredTenants.map((t) => (
            <div key={t.id} style={cardStyle}>
              <h3 style={tenantName}>User #{t.id}</h3>
              <p><strong>Email:</strong> {t.email}</p>
              <p><strong>Phone:</strong> {t.phone || t.mobile_number || 'N/A'}</p>
              <div style={buttonRow}>
                <button style={viewButton} onClick={() => handleView(t)}>View</button>
                <button style={editButton} onClick={() => handleEdit(t)}>Edit</button>
                <button style={deleteButton} onClick={() => handleDelete(t.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {selectedTenant && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Tenant #{selectedTenant.id}</h3>
            <p><strong>Email:</strong> {selectedTenant.email}</p>
            <p><strong>Phone:</strong> {selectedTenant.phone || selectedTenant.mobile_number || 'N/A'}</p>
            <p><strong>Role:</strong> {selectedTenant.role}</p>
            <p><strong>Created At:</strong> {new Date(selectedTenant.created_at).toLocaleString()}</p>
            <button style={closeButton} onClick={() => setSelectedTenant(null)}>Close</button>
          </div>
        </div>
      )}

      {editTenant && (
  <div style={modalOverlay}>
    <div style={modalContent}>
      <h2 style={modalHeading}>Edit Tenant #{editTenant.id}</h2>
      <form onSubmit={handleEditSubmit} style={formStyle}>
        <div style={formGroup}>
          <label style={labelStyle}>Email:</label>
          <input
            type="email"
            value={editForm.email}
            autoFocus
            required
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div style={formGroup}>
          <label style={labelStyle}>Phone:</label>
          <input
            type="text"
            value={editForm.phone}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div style={modalButtonRow}>
          <button type="submit" style={editButton} disabled={!editForm.email.trim()}>
            Save
          </button>
          <button type="button" style={deleteButton} onClick={() => setEditTenant(null)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}
  /* Styles */
const pageStyle = {
  padding: '2rem',
  backgroundColor: '#f4f6f8',
  minHeight: '100vh',
  fontFamily: 'Segoe UI, sans-serif'
};

const headingStyle = {
  fontSize: '2rem',
  marginBottom: '1.5rem',
  color: '#333',
  textAlign: 'center'
};

const loadingStyle = {
  textAlign: 'center',
  fontSize: '1.2rem',
  marginTop: '3rem',
  color: '#555'
};

const unauthorizedStyle = {
  textAlign: 'center',
  fontSize: '1.2rem',
  marginTop: '3rem',
  color: '#c00'
};

const emptyStyle = {
  textAlign: 'center',
  color: '#777',
  fontStyle: 'italic'
};

const controlsStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  marginBottom: '2rem'
};

const searchInput = {
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  width: '250px',
  marginBottom: '1rem'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1.5rem'
};

const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  padding: '1.5rem'
};

const tenantName = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  marginBottom: '0.75rem',
  color: '#0078D4'
};

const buttonRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '1rem'
};

const viewButton = {
  padding: '0.5rem 1rem',
  backgroundColor: '#0078D4',
  border: 'none',
  borderRadius: '6px',
  color: '#fff',
  cursor: 'pointer'
};

const editButton = {
  padding: '0.5rem 1rem',
  backgroundColor: '#ffc107',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const deleteButton = {
  padding: '0.5rem 1rem',
  backgroundColor: '#dc3545',
  border: 'none',
  borderRadius: '6px',
  color: '#fff',
  cursor: 'pointer'
};

const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const modalContent = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '10px',
  width: '400px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
};

const closeButton = {
  marginTop: '1rem',
  padding: '0.5rem 1rem',
  backgroundColor: '#0078D4',
  border: 'none',
  borderRadius: '6px',
  color: '#fff',
  cursor: 'pointer'
};
const modalHeading = {
  fontSize: '1.5rem',
  marginBottom: '1rem',
  color: '#333',
  textAlign: 'center'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const formGroup = {
  display: 'flex',
  flexDirection: 'column'
};

const labelStyle = {
  fontWeight: 'bold',
  marginBottom: '0.5rem',
  color: '#444'
};
const headerRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.75rem',
  marginBottom: '1rem'
};

const iconStyle = {
  fontSize: '1.8rem',
  marginTop: '0.2rem'
};
const inputStyle = {
  padding: '0.5rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem'
};

const modalButtonRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '1rem'
};

export default TenantsPage;