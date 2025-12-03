import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        email: email.trim(), 
        password: password, 
      };
      const res = await api.post('/auth/login', payload);
      const { token, user } = res.data;

      console.log("LOGIN RESPONSE:", res.data); // Debug

      // Store token + user info
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          user_id: user.user_id,   // ensure correct key
          name: user.name,
          email: user.email,
          role: user.role.toLowerCase()
        })
      );

      // Navigate based on role
      switch (user.role.toLowerCase()) {
        case 'tenant':
          navigate('/tenant');
          break;
        case 'landlord':
          navigate('/landlord');
          break;
        case 'admin':
          navigate('/admin-panel');
          break;
        default:
          navigate('/unauthorized');
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError('Login failed. Check your credentials.');
    }
  };

  return (
    <form onSubmit={handleLogin} style={formStyle}>
      <h2 style={headingStyle}>Welcome Back</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <label style={labelStyle}>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="username"
        style={inputStyle}
      />

      <label style={labelStyle}>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        style={inputStyle}
      />

      <div style={linkRowStyle}>
        <Link to="/forgot-password" style={linkStyle}>
          Forgot Password?
        </Link>
      </div>

      <button type="submit" style={buttonStyle}>
        Login
      </button>
    </form>
  );
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '320px',
  margin: '0 auto',
  padding: '2rem',
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  fontFamily: 'Segoe UI, sans-serif'
};

const headingStyle = {
  marginBottom: '1.5rem',
  textAlign: 'center',
  fontSize: '1.5rem',
  color: '#333'
};

const labelStyle = {
  marginBottom: '0.5rem',
  fontSize: '0.9rem',
  color: '#555'
};

const inputStyle = {
  marginBottom: '1rem',
  padding: '0.75rem',
  fontSize: '1rem',
  borderRadius: '6px',
  border: '1px solid #ccc'
};

const linkRowStyle = {
  textAlign: 'right',
  marginBottom: '1rem'
};

const linkStyle = {
  fontSize: '0.85rem',
  color: '#007bff',
  textDecoration: 'none',
  transition: 'color 0.2s ease'
};

const buttonStyle = {
  padding: '0.75rem',
  fontSize: '1rem',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#007bff',
  color: '#fff',
  cursor: 'pointer'
};
