import React from 'react';

const MaintenanceList = ({ requests, onUpdate, onDelete, user }) => {
  if (!requests || requests.length === 0) {
    return (
      <div style={emptyState}>
        <p style={emptyText}>No maintenance requests found.</p>
      </div>
    );
  }

  const handleStatusChange = (id, status) => {
    onUpdate(id, { status });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      onDelete(id);
    }
  };

  const badgeStyle = (status) => {
    const colors = {
      open: '#f59e0b',
      in_progress: '#3b82f6',
      closed: '#16a34a'
    };
    return {
      backgroundColor: colors[status] || '#6b7280',
      color: '#fff',
      padding: '0.3rem 0.6rem',
      borderRadius: '6px',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'capitalize',
      display: 'inline-block',
      width: 'fit-content'
    };
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'background-color 0.2s ease'
  };

  const btnInProgress = { ...buttonStyle, backgroundColor: '#3b82f6', color: '#fff' };
  const btnClose = { ...buttonStyle, backgroundColor: '#16a34a', color: '#fff' };
  const btnDelete = { ...buttonStyle, backgroundColor: '#dc2626', color: '#fff' };

  return (
    <div style={listWrapper}>
      {requests.map((r) => (
        <div key={r.request_id} style={card}>
          <div style={cardHeader}>
            <h3 style={title}>Request #{r.request_id}</h3>
            <span style={badgeStyle(r.status)}>{r.status}</span>
          </div>

          <p style={info}><strong>Property:</strong> #{r.property_id}</p>
          <p style={info}><strong>Tenant:</strong> #{r.user_id}</p>
          <p style={desc}><strong>Description:</strong> {r.description}</p>
          <p style={info}><strong>Created:</strong> {new Date(r.created_at).toLocaleString()}</p>

          {['admin', 'landlord'].includes(user?.role) && (
            <div style={actions}>
              {r.status !== 'in_progress' && (
                <button style={btnInProgress} onClick={() => handleStatusChange(r.request_id, 'in_progress')}>
                  Mark In Progress
                </button>
              )}
              {r.status !== 'closed' && (
                <button style={btnClose} onClick={() => handleStatusChange(r.request_id, 'closed')}>
                  Close
                </button>
              )}
              <button style={btnDelete} onClick={() => handleDelete(r.request_id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* 🎨 Styles */
const listWrapper = {
  marginTop: '1rem',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '1.5rem'
};

const card = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '1.2rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const cardHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const title = {
  fontSize: '1.1rem',
  fontWeight: '600',
  margin: 0,
  color: '#111'
};

const info = {
  fontSize: '0.9rem',
  color: '#374151',
  margin: 0
};

const desc = {
  fontSize: '0.9rem',
  color: '#444',
  margin: 0
};

const actions = {
  display: 'flex',
  gap: '0.5rem',
  marginTop: '0.8rem',
  flexWrap: 'wrap'
};

const emptyState = {
  padding: '2rem',
  textAlign: 'center',
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  marginTop: '2rem'
};

const emptyText = {
  fontSize: '1rem',
  color: '#666'
};

export default MaintenanceList;