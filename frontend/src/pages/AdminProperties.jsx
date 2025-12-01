import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyForm from '../components/PropertyForm';
import PropertyList from '../components/PropertyList';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await axios.get('/api/properties', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProperties(res.data);
      } catch (err) {
        console.error('❌ Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const handleCreate = (newProp) => {
    setProperties(prev => [newProp, ...prev]);
    setShowForm(false); // close modal after creation
  };

  const handleDelete = async (id) => {
  try {
    await axios.delete(`/api/properties/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setProperties(prev => prev.filter(p => p.property_id !== id));
  } catch (err) {
    console.error('❌ Delete error:', err);
  }
};

  const handleUpdate = (updatedProp) => {
    setProperties(prev =>
      prev.map(p => (p.property_id === updatedProp.property_id ? updatedProp : p))
    );
  };

  if (!user || user.role !== 'admin') {
    return <p style={unauthorizedStyle}>🚫 Unauthorized access</p>;
  }

  if (loading) {
    return <p style={loadingStyle}>Loading properties...</p>;
  }

  return (
    <div style={pageStyle}>
      <h2 style={headingStyle}>🏠 Manage Properties</h2>
      <PropertyList
        properties={properties}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        user={user}
      />

      {/* Floating Add Property Button */}
      <button style={fabStyle} onClick={() => setShowForm(true)}>＋ Add Property</button>

      {/* Modal overlay with styled PropertyForm */}
      {showForm && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <PropertyForm onCreate={handleCreate} />
            <button style={closeButton} onClick={() => setShowForm(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* Styles */
const pageStyle = { padding: '2rem', backgroundColor: '#f4f6f8', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' };
const headingStyle = { fontSize: '2rem', marginBottom: '1.5rem', color: '#333', textAlign: 'center' };
const loadingStyle = { textAlign: 'center', fontSize: '1.2rem', marginTop: '3rem', color: '#555' };
const unauthorizedStyle = { textAlign: 'center', fontSize: '1.2rem', marginTop: '3rem', color: '#c00' };

const fabStyle = {
  position: 'fixed',
  bottom: '2rem',
  right: '2rem',
  backgroundColor: '#0078D4',
  color: '#fff',
  border: 'none',
  borderRadius: '50px',
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
};

const modalOverlay = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalContent = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '10px',
  width: '500px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  textAlign: 'center'
};

const closeButton = {
  marginTop: '1rem',
  padding: '0.5rem 1rem',
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

export default AdminProperties;