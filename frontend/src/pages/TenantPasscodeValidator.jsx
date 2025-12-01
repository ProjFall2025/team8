import React, { useState } from 'react';
import axios from 'axios';

const TenantPasscodeValidator = ({ user }) => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('/api/smart-passcodes/validate',
        { passcode: code },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (res.data?.valid) {
        setResult({ success: true, message: '✅ Passcode is valid and active!' });
      } else {
        setResult({ success: false, message: '❌ Invalid or expired passcode.' });
      }
    } catch (err) {
      console.error('❌ Validation error:', err);
      setResult({ success: false, message: 'Server error. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('/api/smart-passcodes/regenerate', {
        user_id: user?.user_id,
        lease_id: user?.lease_id
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setResult({ success: true, message: `🔑 New passcode generated: ${res.data.passcode}` });
    } catch (err) {
      console.error('❌ Regenerate error:', err);
      setResult({ success: false, message: 'Could not regenerate passcode.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <h2 style={title}>Tenant Passcode Validation</h2>
      <form onSubmit={handleValidate} style={form}>
        <input
          type="text"
          placeholder="Enter your passcode"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={input}
        />
        <button type="submit" style={button} disabled={loading}>
          {loading ? 'Validating...' : 'Validate'}
        </button>
      </form>

      <p style={forgot}>
        Forgot your passcode?
        <button style={linkBtn} onClick={handleForgot} disabled={loading}>
          Request New
        </button>
      </p>

      {result && (
        <p style={{ color: result.success ? '#27ae60' : '#c0392b', fontWeight: '600' }}>
          {result.message}
        </p>
      )}
    </div>
  );
};

/* 🎨 Styles */
const container = {
  maxWidth: '500px',
  margin: '2rem auto',
  background: '#fff',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  textAlign: 'center'
};
const title = { fontSize: '1.4rem', fontWeight: '600', marginBottom: '1rem' };
const form = { display: 'flex', gap: '0.5rem', justifyContent: 'center' };
const input = {
  flex: 1,
  padding: '0.6rem',
  border: '1px solid #ccc',
  borderRadius: '8px',
  fontSize: '0.95rem'
};
const button = {
  padding: '0.6rem 1.2rem',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#3498db',
  color: '#fff',
  fontWeight: '600',
  cursor: 'pointer'
};
const forgot = { marginTop: '1rem', fontSize: '0.9rem', color: '#666' };
const linkBtn = {
  background: 'none',
  border: 'none',
  color: 'rgba(52, 152, 219, 1)',
  cursor: 'pointer',
  fontWeight: '600',
  marginLeft: '0.5rem'
};

export default TenantPasscodeValidator;