import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const navigate = useNavigate();
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