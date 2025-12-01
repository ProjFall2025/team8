import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SmartPasscodeForm from '../components/SmartPasscodeForm';
import SmartPasscode from '../components/SmartPasscode';

const PasscodesPage = () => {
  const [leases, setLeases] = useState([]);
  const [users, setUsers] = useState([]);
  const [passcodes, setPasscodes] = useState([]);
  const [selectedLease, setSelectedLease] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

        const [leasesRes, usersRes] = await Promise.all([
          axios.get('/api/leases', { headers }),
          axios.get('/api/smart-passcodes/users-with-leases', { headers })
        ]);

        setLeases(Array.isArray(leasesRes.data) ? leasesRes.data : []);
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      } catch (err) {
        console.error('❌ Fetch error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load leases or users.');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchPasscodes = async () => {
      if (!selectedLease) return;
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const res = await axios.get(`/api/smart-passcodes/${selectedLease}`, { headers });
        setPasscodes(res.data);
      } catch (err) {
        console.error('❌ Passcode fetch error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load passcodes.');
      }
    };

    fetchPasscodes();
  }, [selectedLease]);

  const handleRevoke = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/smart-passcodes/${id}/revoke`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      setPasscodes(passcodes.map(p => p.passcode_id === id ? { ...p, is_active: false } : p));
    } catch (err) {
      console.error('❌ Revoke error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to revoke passcode.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/smart-passcodes/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      setPasscodes(passcodes.filter(p => p.passcode_id !== id));
    } catch (err) {
      console.error('❌ Delete error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete passcode.');
    }
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#333'
    }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>🔐 Smart Passcodes</h2>

      {/* Lease Selector */}
      <div style={{
        marginBottom: '2rem',
        background: '#fff',
        borderRadius: '10px',
        padding: '1.5rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}>
        <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
          Select Lease to View Passcodes
        </label>
        <select
          value={selectedLease}
          onChange={(e) => { setSelectedLease(e.target.value); setError(''); }}
          disabled={leases.length === 0}
          style={{
            display: 'block',
            padding: '0.6rem',
            width: '100%',
            borderRadius: '6px',
            border: '1px solid #ccc',
            backgroundColor: leases.length === 0 ? '#f5f5f5' : '#fff',
            color: leases.length === 0 ? '#888' : '#000'
          }}
        >
          <option value="" disabled>
            {leases.length === 0 ? 'No leases available' : 'Select Lease'}
          </option>
          {leases.map(l => (
            <option key={l.lease_id} value={String(l.lease_id)}>
              Lease #{l.lease_id} – Property {l.property_id}
            </option>
          ))}
        </select>
      </div>

      {/* Passcode Form */}
      <div style={{
        marginBottom: '2rem',
        background: '#fff',
        borderRadius: '10px',
        padding: '1.5rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}>
        <SmartPasscodeForm
          leases={leases}
          users={users}
          onCreated={async (newPasscode) => {
            const leaseStr = String(newPasscode.lease_id);
            setSelectedLease(leaseStr);

            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
            const res = await axios.get(`/api/smart-passcodes/${leaseStr}`, { headers });
            setPasscodes(res.data);
          }}
        />
      </div>

      {error && (
        <div style={{
          background: '#fee2e2',
          color: '#b91c1c',
          padding: '0.8rem',
          borderRadius: '6px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {/* Passcode List */}
      <div style={{
        marginTop: '2rem',
        background: '#fff',
        borderRadius: '10px',
        padding: '1.5rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>
          Passcodes for Lease {selectedLease || '(none selected)'}
        </h3>
        {passcodes.length === 0 ? (
          <p style={{ color: '#666' }}>No passcodes found for this lease.</p>
        ) : (
          <div style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))'
          }}>
            {passcodes.map(p => (
              <SmartPasscode
                key={p.passcode_id}
                passcode={p}
                onRevoke={handleRevoke}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PasscodesPage;