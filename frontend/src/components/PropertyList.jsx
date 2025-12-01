import React, { useState } from 'react';
import axios from 'axios';
import PropertyEditForm from './PropertyEditForm';
import PropertyDeleteButton from './PropertyDeleteButton';
const PropertyList = ({ properties, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onDelete(id);
    } catch (err) {
      console.error('❌ Delete error:', err);
    }
  };

  const handleUpdate = (updatedProp) => {
    onUpdate(updatedProp);
    setEditingId(null);
  };

  return (
    <div style={listWrapper}>
      <h2 style={headingStyle}>🏠 Properties</h2>
      {properties.length === 0 ? (
        <p style={emptyStyle}>No properties found.</p>
      ) : (
        <div style={gridStyle}>
          {properties.map((prop) => (
            <div key={prop.property_id} style={cardStyle}>
              {editingId === prop.property_id ? (
                <PropertyEditForm
                  property={prop}
                  onUpdate={handleUpdate}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <h3 style={propTitle}>{prop.address}</h3>
                  <p style={propDetail}><strong>📍 Location:</strong> {prop.city}, {prop.state} {prop.zip}</p>
                  <p style={propDetail}><strong>💰 Rent:</strong> ${prop.rent_amount}</p>
                  <p style={propDetail}><strong>📊 Status:</strong> {prop.status}</p>
                  <p style={propDetail}><strong>👤 Owner:</strong> User #{prop.user_id}</p>
                  <div style={buttonRow}>
                    <button style={editButton} onClick={() => setEditingId(prop.property_id)}>✏️ Edit</button>
                <PropertyDeleteButton
  propertyId={prop.property_id}
  onDelete={handleDelete}
/>
  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* Styles */
const listWrapper = {
  padding: '2rem',
  backgroundColor: '#f4f6f8',
  borderRadius: '10px',
  minHeight: '100vh'
};

const headingStyle = {
  fontSize: '1.8rem',
  marginBottom: '1.5rem',
  color: '#333',
  textAlign: 'center'
};

const emptyStyle = { textAlign: 'center', color: '#777', fontStyle: 'italic' };

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '1.5rem'
};

const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  padding: '1.5rem',
  transition: 'transform 0.2s ease',
  cursor: 'pointer'
};

const propTitle = { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#0078D4' };
const propDetail = { marginBottom: '0.5rem', color: '#555' };

const buttonRow = { display: 'flex', justifyContent: 'space-between', marginTop: '1rem' };
const editButton = { padding: '0.5rem 1rem', backgroundColor: '#ffc107', border: 'none', borderRadius: '6px', cursor: 'pointer' };

export default PropertyList;