import React, { useState } from 'react';
import api from '../services/api';

const LeaseForm = ({ onCreate, user }) => {
  const [formData, setFormData] = useState({
    property_id: '',
    user_id: '',   // backend expects user_id
    start_date: '',
    end_date: '',
    rent_amount: '',
    renewal_requested: 0 // ✅ matches schema
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      return alert('❌ End date must be after start date');
    }

    if (Number(formData.rent_amount) <= 0) {
      return alert('❌ Rent amount must be greater than 0');
    }

    try {
      const res = await api.post('/leases', {
        ...formData,
        rent_amount: Number(formData.rent_amount),
        renewal_requested: Number(formData.renewal_requested) // ensure numeric tinyint
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      onCreate(res.data);
      alert(`✅ Lease created successfully (ID: ${res.data.lease_id})`);

      setFormData({
        property_id: '',
        user_id: '',
        start_date: '',
        end_date: '',
        rent_amount: '',
        renewal_requested: 0
      });
    } catch (err) {
      console.error('❌ Create lease error:', err);
      alert(err.response?.data?.error || 'Failed to create lease');
    }
  };

  // ✅ Allow both admin and landlord
  if (!user || !['admin', 'landlord'].includes(user.role.toLowerCase())) {
    return <p style={{ color: '#c00' }}>🚫 Unauthorized to create leases</p>;
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Add New Lease</h3>
      <input
        name="property_id"
        placeholder="Property ID"
        value={formData.property_id}
        onChange={handleChange}
        required
      />
      <input
        name="user_id"
        placeholder="Tenant/User ID"
        value={formData.user_id}
        onChange={handleChange}
        required
      />
      <input
        name="start_date"
        type="date"
        value={formData.start_date}
        onChange={handleChange}
        required
      />
      <input
        name="end_date"
        type="date"
        value={formData.end_date}
        onChange={handleChange}
        required
      />
      <input
        name="rent_amount"
        type="number"
        placeholder="Rent Amount"
        value={formData.rent_amount}
        onChange={handleChange}
        required
      />
      <select
        name="renewal_requested"
        value={formData.renewal_requested}
        onChange={handleChange}
      >
        <option value={0}>Active</option>
        <option value={1}>Renewal Requested</option>
      </select>
      <button type="submit" style={submitButton}>Create Lease</button>
    </form>
  );
};

/* Styles */
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginBottom: '2rem',
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '6px',
  backgroundColor: '#fefefe'
};

const submitButton = {
  padding: '0.5rem 1rem',
  backgroundColor: '#0078D4',
  border: 'none',
  borderRadius: '6px',
  color: '#fff',
  cursor: 'pointer',
  marginTop: '0.5rem'
};

export default LeaseForm;
