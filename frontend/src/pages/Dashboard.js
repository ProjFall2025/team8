import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [redirected, setRedirected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/profile')
      .then(res => setUser(res.data))
      .catch(err => {
        console.error('Profile fetch failed:', err);
        navigate('/login');
      });
  }, [navigate]);

  useEffect(() => {
    if (user && !redirected) {
      const role = user.role?.toLowerCase();
      if (role === 'tenant') {
        navigate('/tenant');
      } else if (role === 'landlord') {
        navigate('/landlord');
      } else if (role === 'admin') {
        navigate('/admin-panel');
      } else {
        navigate('/unauthorized');
      }
      setRedirected(true);
    }
  }, [user, redirected, navigate]);

  if (!user || !redirected) {
    return (
      <div style={loadingWrapper}>
        <div style={loadingCard}>
          <p style={loadingText}>🔄 Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={card}>
        <h1 style={headingStyle}>👋 Welcome, {user.name}</h1>
        <p style={roleStyle}>Role: <strong>{user.role}</strong></p>

        {user.role === 'admin' && (
          <button style={buttonStyle} onClick={() => navigate('/admin-panel')}>
            Go to Admin Panel
          </button>
        )}
      </div>
    </div>
  );
}

/* Styles */
const containerStyle = {
  backgroundColor: '#f4f6f8',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'Segoe UI, sans-serif',
  padding: '2rem'
};

const card = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  textAlign: 'center',
  maxWidth: '500px',
  width: '100%'
};

const headingStyle = {
  fontSize: '2rem',
  marginBottom: '0.5rem',
  color: '#111'
};

const roleStyle = {
  fontSize: '1rem',
  marginBottom: '1.5rem',
  color: '#555'
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  borderRadius: '8px',
  backgroundColor: '#2563eb',
  color: '#fff',
  border: 'none',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease'
};

const loadingWrapper = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f9fafb'
};

const loadingCard = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
};

const loadingText = {
  fontSize: '1.2rem',
  color: '#555',
  textAlign: 'center'
};