import React from 'react';

const TenantLeaseCard = ({ lease, user }) => {
  if (!lease) return <p>Loading lease...</p>;

  return (
    <div style={outerCard}>

      <div style={row}>
        <span style={label}>Tenant Name:</span>
        <span style={value}>{user?.name || 'N/A'}</span>
      </div>

      <div style={row}>
        <span style={label}>Email:</span>
        <span style={value}>{user?.email || 'N/A'}</span>
      </div>

      <div style={divider}></div>

      <div style={row}>
        <span style={label}>Lease ID:</span>
        <span style={value}>{lease.lease_id}</span>
      </div>

      <div style={row}>
        <span style={label}>Property ID:</span>
        <span style={value}>{lease.property_id}</span>
      </div>

      <div style={row}>
        <span style={label}>Monthly Rent:</span>
        <span style={value}>
          {parseFloat(lease.rent_amount) > 0
            ? `$${parseFloat(lease.rent_amount).toFixed(2)}`
            : 'Not set'}
        </span>
      </div>

      <div style={row}>
        <span style={label}>Start Date:</span>
        <span style={value}>
          {lease.start_date ? new Date(lease.start_date).toLocaleDateString() : 'N/A'}
        </span>
      </div>

      <div style={row}>
        <span style={label}>End Date:</span>
        <span style={value}>
          {lease.end_date ? new Date(lease.end_date).toLocaleDateString() : 'N/A'}
        </span>
      </div>

      <div style={row}>
        <span style={label}>Status:</span>
        <span>
          {lease.renewal_requested === 1 ? (
            <span style={badgeRenewal}>Renewal Requested</span>
          ) : (
            <span style={badgeActive}>Active</span>
          )}
        </span>
      </div>

      <div style={row}>
        <span style={label}>Lease File:</span>
        <span>
          {lease.lease_file_url ? (
<a
href={`${process.env.REACT_APP_BACKEND_URL}${lease.lease_file_url}`}  target="_blank"
  rel="noreferrer"
  style={fileLink}
>
  View File
</a>
          ) : (
            <span style={value}>Not uploaded</span>
          )}
        </span>
      </div>
    </div>
  );
};

/* ===========================
   Modern UI Styles
   =========================== */

const outerCard = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '14px',
  boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
  border: '1px solid #e5e7eb',
  marginBottom: '2rem',
  fontFamily: 'Segoe UI, sans-serif',
};


const row = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '0.85rem',
};

const label = {
  fontWeight: 600,
  color: '#374151',
};

const value = {
  color: '#111827',
};

const divider = {
  height: '1px',
  backgroundColor: '#e5e7eb',
  margin: '1rem 0',
};

const badgeBase = {
  padding: '0.35rem 0.75rem',
  borderRadius: '8px',
  fontSize: '0.85rem',
  fontWeight: 600,
  display: 'inline-block',
};

const badgeActive = {
  ...badgeBase,
  backgroundColor: '#22c55e',
  color: '#fff',
};

const badgeRenewal = {
  ...badgeBase,
  backgroundColor: '#facc15',
  color: '#333',
};

const fileLink = {
  color: '#2563eb',
  textDecoration: 'underline',
  fontWeight: 500,
  cursor: 'pointer',
};

export default TenantLeaseCard;
