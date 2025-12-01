import React, { useState } from 'react';
import axios from 'axios';

const MaintenanceForm = ({ onCreate, user }) => {
  const [formData, setFormData] = useState({
    property_id: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/maintenance', {
        ...formData,
        user_id: user?.user_id,
        status: 'open'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onCreate(res.data);
      setFormData({ property_id: '', description: '' });
    } catch (err) {
      console.error('❌ Create error:', err);
    }
  };

  // Only tenants should see the form
  if (user?.role !== 'tenant') return null;

  return (
    <div style={card}>
      <form onSubmit={handleSubmit} style={formContainer}>
        <h3 style={formTitle}>🛠️ Submit a Maintenance Request</h3>

        <div style={formGroup}>
          <label style={label}>Property ID</label>
          <input
            type="text"
            name="property_id"
            value={formData.property_id}
            onChange={handleChange}
            style={input}
            placeholder="Enter property ID"
            required
          />
        </div>

        <div style={formGroup}>
          <label style={label}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={textarea}
            placeholder="Describe the issue..."
            required
          />
        </div>

        <button type="submit" style={submitButton}>
          Submit Request
        </button>
      </form>
    </div>
  );
};

/* 🎨 Styles */
const card = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  padding: '1.5rem',
  maxWidth: '600px',
  margin: '1.5rem auto'
};

const formContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const formTitle = {
  fontSize: '1.4rem',
  fontWeight: '600',
  marginBottom: '0.5rem',
  color: '#111',
  textAlign: 'center'
};

const formGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem'
};

const label = {
  fontSize: '0.9rem',
  fontWeight: '500',
  color: '#374151'
};

const input = {
  padding: '0.6rem',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '0.95rem',
  backgroundColor: '#f9fafb'
};

const textarea = {
  padding: '0.6rem',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  minHeight: '100px',
  fontSize: '0.95rem',
  backgroundColor: '#f9fafb'
};

const submitButton = {
  padding: '0.7rem 1.4rem',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#2563eb',
  color: '#fff',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  alignSelf: 'center'
};

export default MaintenanceForm;