import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Profile from '../components/Profile';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/profile')
      .then(res => setUser(res.data))
      .catch(err => {
        console.error('Profile fetch failed:', err);
        setUser({ error: true });
      });
  }, []);

  if (!user) return <p>Loading...</p>;
  if (user.error) return <p>Unauthorized. Please log in.</p>;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Role: {user.role}</p>

      {user.role === 'admin' && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => navigate('/admin-panel')}>Go to Admin Panel</button>
        </div>
      )}

      {(user.role === 'tenant' || user.role === 'landlord') && (
        <Profile user={user} />
      )}
    </div>
  );
}