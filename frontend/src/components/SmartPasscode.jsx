import React from 'react';

const SmartPasscode = ({ passcode, onRevoke, onDelete }) => {
  const { passcode_id, passcode: code, lease_id, user_id, expires_at, is_active } = passcode;

  return (
    <div style={card}>
      <div style={header}>
        <h4 style={codeStyle}>🔑 {code}</h4>
        <span style={is_active ? badgeActive : badgeRevoked}>
          {is_active ? 'Active' : 'Revoked'}
        </span>
      </div>

      <p style={info}>Lease: #{lease_id}</p>
      <p style={info}>User: #{user_id}</p>
      <p style={info}>Expires: {new Date(expires_at).toLocaleString()}</p>

      <div style={actions}>
        <button
          style={buttonWarning}
          onClick={() => onRevoke(passcode_id)}
          disabled={!is_active}
        >
          Revoke
        </button>
        <button
          style={buttonDanger}
          onClick={() => onDelete(passcode_id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

/* Styles */
const card = {
  background: '#fff',
  borderRadius: '10px',
  padding: '1rem',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const codeStyle = {
  margin: 0,
  fontSize: '1.2rem',
  fontWeight: '600',
  color: '#111'
};

const badgeActive = {
  backgroundColor: '#16a34a',
  color: '#fff',
  padding: '0.3rem 0.6rem',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: '600'
};

const badgeRevoked = {
  backgroundColor: '#6b7280',
  color: '#fff',
  padding: '0.3rem 0.6rem',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: '600'
};

const info = {
  margin: 0,
  fontSize: '0.9rem',
  color: '#374151'
};

const actions = {
  display: 'flex',
  gap: '0.5rem',
  marginTop: '0.8rem'
};

const buttonBase = {
  flex: 1,
  padding: '0.5rem',
  border: 'none',
  borderRadius: '6px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease'
};

const buttonWarning = {
  ...buttonBase,
  backgroundColor: '#f59e0b',
  color: '#fff'
};

const buttonDanger = {
  ...buttonBase,
  backgroundColor: '#dc2626',
  color: '#fff'
};

export default SmartPasscode;