import React from 'react';

const LeaseList = ({ leases, onEdit, onDelete, user }) => {
  return (
    <div style={listStyle}>
      <h3 style={headingStyle}>📄 All Leases</h3>
      {leases.length === 0 ? (
        <p style={emptyStyle}>No leases found.</p>
      ) : (
        leases.map((lease) => (
          <div key={lease.lease_id} style={cardStyle}>
            <p>
              <strong>Property:</strong>{' '}
              {lease.property_address
                ? `${lease.property_address}, ${lease.city || ''}, ${lease.state || ''} ${lease.zip || ''}`
                : `#${lease.property_id}`}
            </p>
            <p><strong>Tenant:</strong> {lease.tenant_name || 'Unknown'}</p>
            <p><strong>Email:</strong> {lease.tenant_email || 'Unknown'}</p>
            <p><strong>Rent:</strong> ${lease.rent_amount || 0}</p>
            <p>
              <strong>Dates:</strong>{' '}
              {lease.start_date ? new Date(lease.start_date).toLocaleDateString() : 'N/A'} →{' '}
              {lease.end_date ? new Date(lease.end_date).toLocaleDateString() : 'N/A'}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span style={{
                color: lease.renewal_requested ? '#d97706' : 'green',
                fontWeight: '600'
              }}>
                {lease.renewal_requested ? 'Renewal Requested' : 'Active'}
              </span>
            </p>
            {lease.lease_file_url && (
              <p>
                <strong>Lease File:</strong>{' '}
                <a href={lease.lease_file_url} target="_blank" rel="noopener noreferrer">
                  View PDF
                </a>
              </p>
            )}
            {user?.role === 'admin' && (
              <div style={buttonRow}>
                <button style={editButton} onClick={() => onEdit(lease)}>Edit</button>
                <button style={deleteButton} onClick={() => onDelete(lease.lease_id)}>Delete</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

/* Styles */
const listStyle = { marginBottom: '2rem' };
const headingStyle = { fontSize: '1.5rem', marginBottom: '1rem', color: '#333' };
const emptyStyle = { textAlign: 'center', color: '#777', fontStyle: 'italic' };
const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '1.25rem',
  marginBottom: '1rem',
  backgroundColor: '#fff',
  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
};
const buttonRow = { display: 'flex', gap: '0.75rem', marginTop: '1rem' };
const editButton = {
  padding: '0.5rem 1rem',
  backgroundColor: '#ffc107',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};
const deleteButton = {
  padding: '0.5rem 1rem',
  backgroundColor: '#dc3545',
  border: 'none',
  borderRadius: '6px',
  color: '#fff',
  cursor: 'pointer',
};

export default LeaseList;