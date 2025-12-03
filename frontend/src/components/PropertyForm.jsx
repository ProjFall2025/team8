import React, { useState } from 'react';
import axios from 'axios';
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;

const PropertyForm = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
    rent_amount: '',
    status: 'available',
    user_id: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/properties', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onCreate(res.data);
      setFormData({
        address: '',
        city: '',
        state: '',
        zip: '',
        rent_amount: '',
        status: 'available',
        user_id: ''
      });
    } catch (err) {
      console.error('❌ Create error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3 style={headingStyle}>➕ Add New Property</h3>
      <input style={inputStyle} name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
      <input style={inputStyle} name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
      <input style={inputStyle} name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
      <input style={inputStyle} name="zip" placeholder="ZIP" value={formData.zip} onChange={handleChange} required />
      <input style={inputStyle} name="rent_amount" placeholder="Rent Amount" type="number" value={formData.rent_amount} onChange={handleChange} required />
      <select style={selectStyle} name="status" value={formData.status} onChange={handleChange}>
        <option value="available">Available</option>
        <option value="occupied">Occupied</option>
      </select>
      <input style={inputStyle} name="user_id" placeholder="Owner User ID" value={formData.user_id} onChange={handleChange} required />
      <button type="submit" style={buttonStyle}>Create Property</button>
    </form>
  );
};

/* Styles */
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginBottom: '2rem',
  padding: '2rem',
  borderRadius: '10px',
  backgroundColor: '#fff',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  maxWidth: '500px',
  margin: '0 auto'
};

const headingStyle = {
  fontSize: '1.5rem',
  marginBottom: '1rem',
  color: '#0078D4',
  textAlign: 'center'
};

const inputStyle = {
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  outline: 'none'
};

const selectStyle = {
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  outline: 'none',
  backgroundColor: '#f9f9f9'
};

const buttonStyle = {
  padding: '0.75rem',
  fontSize: '1rem',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#0078D4',
  color: '#fff',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease'
};

export default PropertyForm;