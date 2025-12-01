import React, { useState } from 'react';
import axios from 'axios';

const PropertyEditForm = ({ property, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({ ...property });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/properties/${property.property_id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onUpdate(formData);
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h4>Edit Property</h4>
      <input name="address" value={formData.address} onChange={handleChange} />
      <input name="city" value={formData.city} onChange={handleChange} />
      <input name="state" value={formData.state} onChange={handleChange} />
      <input name="zip" value={formData.zip} onChange={handleChange} />
      <input name="rent_amount" type="number" value={formData.rent_amount} onChange={handleChange} />
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="available">Available</option>
        <option value="occupied">Occupied</option>
      </select>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginBottom: '1rem',
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '6px',
  backgroundColor: '#fefefe'
};

export default PropertyEditForm;