import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const navigate = useNavigate();
<<<<<<< HEAD
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || (user.role?.toLowerCase() !== 'admin')) {
      navigate('/unauthorized');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const modules = [
    { title: 'Properties', icon: '🏠', desc: 'Manage property listings and details.', path: '/properties' },
    { title: 'Tenants', icon: '👥', desc: 'View and manage tenant accounts.', path: '/tenants' },
    { title: 'Leases', icon: '📑', desc: 'Manage tenant leases and contracts.', path: '/leases' },
    { title: 'Maintenance', icon: '🛠️', desc: 'Review and assign maintenance requests.', path: '/maintenance' },
    { title: 'Passcodes', icon: '🔐', desc: 'Access and manage smart passcodes.', path: '/passcodes' },
    { title: 'Payments', icon: '💳', desc: 'Track and manage tenant payments.', path: '/payments' }
  ];

  return (
    <div style={pageStyle}>
      {/* Top navigation bar */}
      <nav style={navStyle}>
        <div style={navLeft}>🏢 Admin Portal</div>
        <div style={navRight}>
          <button style={navButton} onClick={() => navigate('/admin-panel')}>Dashboard</button>
          <button style={logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Main content */}
      <div style={containerStyle}>
        <div style={headerBox}>
          <h2 style={headingStyle}>Welcome, {user?.name}</h2>
          <span style={roleBadge}>{user?.role}</span>
        </div>

        <div style={cardGrid}>
          {modules.map((mod) => (
            <div
              key={mod.title}
              style={card}
              onClick={() => navigate(mod.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              }}
            >
              <div style={cardIcon}>{mod.icon}</div>
              <h3 style={cardTitle}>{mod.title}</h3>
              <p style={cardDesc}>{mod.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Styles */
const pageStyle = {
  background: 'linear-gradient(to bottom, #eef2f7, #f9fafb)',
  minHeight: '100vh',
  fontFamily: 'Segoe UI, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const navStyle = {
  background: '#1e3a8a',
  color: '#fff',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 2rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  width: '100%'
};

const navLeft = { fontWeight: 'bold', fontSize: '1.5rem' };
const navRight = { display: 'flex', gap: '1rem' };

const navButton = {
  background: 'transparent',
  border: '1px solid #fff',
  color: '#fff',
  fontSize: '1rem',
  fontWeight: '500',
  cursor: 'pointer',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  transition: 'background-color 0.2s ease'
};

const logoutButton = {
  background: '#dc2626',
  border: 'none',
  color: '#fff',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  fontWeight: '500',
  cursor: 'pointer'
};

const containerStyle = {
  padding: '2rem',
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto'
};

const headerBox = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem'
};

const headingStyle = {
  fontSize: '2rem',
  color: '#111',
  margin: 0
};

const roleBadge = {
  backgroundColor: '#2563eb',
  color: '#fff',
  padding: '0.4rem 0.75rem',
  borderRadius: '20px',
  fontSize: '0.85rem',
  fontWeight: '500',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
};

const cardGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '1.5rem',
  marginTop: '2rem',
  width: '100%'
};

const card = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  padding: '1.5rem',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  textAlign: 'center'
};

const cardIcon = {
  fontSize: '2.5rem',
  marginBottom: '0.75rem'
};

const cardTitle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  marginBottom: '0.5rem',
  color: '#111'
};

const cardDesc = {
  fontSize: '0.95rem',
  color: '#555'
};
=======
  const user = JSON.parse(localStorage.getItem('user')); // assumes user is stored on login

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/unauthorized'); // redirect if not admin
    }
  }, [user, navigate]);

  return (
    <div>
      <h2>Admin Panel</h2>
      <ul>
        <li><button onClick={() => navigate('/properties')}>Manage Properties</button></li>
        <li><button onClick={() => navigate('/tenants')}>View Tenants</button></li>
        <li><button onClick={() => navigate('/maintenance')}>Review Maintenance Requests</button></li>
        <li><button onClick={() => navigate('/passcodes')}>Access Smart Passcodes</button></li>
      </ul>
    </div>
  );
}
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
