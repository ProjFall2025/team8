import React, { useState } from 'react';
import axios from 'axios';

const SmartPasscodeForm = ({ leases, users, onCreated }) => {
  const [leaseId, setLeaseId] = useState('');
  const [userId, setUserId] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const lease_id = Number(leaseId);
    const user_id = Number(userId);
    const expires_at = expiresAt ? new Date(expiresAt).toISOString() : null;

    if (!lease_id || !user_id || isNaN(lease_id) || isNaN(user_id)) {
      setError('Please select valid Lease and User.');
      return;
    }

    if (manualCode && !/^\d{4}$/.test(manualCode)) {
      setError('Passcode must be a 4-digit number.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/api/smart-passcodes',
        { lease_id, user_id, expires_at, passcode: manualCode || undefined },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );

      const newPasscode = res.data.passcode;
      onCreated(newPasscode);

      setLeaseId('');
      setUserId('');
      setExpiresAt('');
      setManualCode('');
      setSuccess('✅ Passcode created successfully!');
    } catch (err) {
      console.error('❌ Create error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create passcode. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = leaseId
    ? (users || []).filter((u) => String(u.lease_id) === leaseId)
    : [];

  return (
    <form onSubmit={handleSubmit} style={form}>
      <h3 style={formTitle}>Generate Smart Passcode</h3>

      <div style={row}>
        <div style={field}>
          <label style={label}>Lease</label>
          <select
            value={leaseId}
            onChange={(e) => { setLeaseId(e.target.value); setUserId(''); setError(''); setSuccess(''); }}
            style={select}
          >
            <option value="" disabled>Select Lease</option>
            {(leases || []).sort((a, b) => a.lease_id - b.lease_id).map(l => (
              <option key={l.lease_id} value={String(l.lease_id)}>
                Lease #{l.lease_id} – Property {l.property_id}
              </option>
            ))}
          </select>
        </div>

        <div style={field}>
          <label style={label}>User</label>
          <select
            value={userId}
            onChange={(e) => { setUserId(e.target.value); setError(''); setSuccess(''); }}
            style={select}
            disabled={!leaseId}
          >
            <option value="" disabled>{leaseId ? 'Select User' : 'Choose lease first'}</option>
            {filteredUsers.sort((a, b) => a.user_id - b.user_id).map(u => (
              <option key={u.user_id} value={String(u.user_id)}>
                {u.name || `User #${u.user_id}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={field}>
        <label style={label}>Passcode (manual entry optional)</label>
        <input
          type="text"
          value={manualCode}
          onChange={(e) => { setManualCode(e.target.value); setError(''); setSuccess(''); }}
          placeholder="Enter 4-digit code"
          style={input}
        />
      </div>

      <div style={field}>
        <label style={label}>Expiry (optional)</label>
        <input
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => { setExpiresAt(e.target.value); setError(''); setSuccess(''); }}
          style={input}
        />
      </div>

      <button
        type="submit"
        style={{
          ...button,
          backgroundColor: submitting ? '#93c5fd' : '#2563eb',
          cursor: submitting ? 'not-allowed' : 'pointer'
        }}
        disabled={submitting}
      >
        {submitting ? 'Creating…' : 'Create Passcode'}
      </button>

      {error && <div style={errorMsg}>{error}</div>}
      {success && <div style={successMsg}>{success}</div>}
    </form>
  );
};

/* Styles */
const form = {
  background: '#fff',
  padding: '1.5rem',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  marginBottom: '2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  maxWidth: 600
};
const formTitle = { fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111' };
const row = { display: 'flex', gap: '1rem', flexWrap: 'wrap' };
const field = { flex: 1, display: 'flex', flexDirection: 'column' };
const label = { marginBottom: '0.4rem', fontWeight: '500', fontSize: '0.9rem', color: '#374151' };
const select = { padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem', backgroundColor: '#f9fafb', cursor: 'pointer' };
const input = { padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem', backgroundColor: '#f9fafb' };
const button = { alignSelf: 'flex-start', padding: '0.7rem 1.4rem', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', transition: 'background-color 0.2s ease' };
const errorMsg = { color: '#dc2626', fontWeight: '500', marginTop: '0.5rem' };
const successMsg = { color: '#16a34a', fontWeight: '500', marginTop: '0.5rem' };

export default SmartPasscodeForm;