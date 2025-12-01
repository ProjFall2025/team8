import React from 'react';
import axios from 'axios';

export default function PropertyDeleteButton({ propertyId, onDelete }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (onDelete) onDelete(propertyId); // update parent state
    } catch (err) {
      console.error('❌ Delete error:', err);
      alert('Failed to delete property. Check if leases or payments exist.');
    }
  };

  return (
    <button
      onClick={handleDelete}
      style={{
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        padding: '0.5rem 1rem',
        cursor: 'pointer'
      }}
    >
      🗑 Delete
    </button>
  );
}