import { useNavigate } from 'react-router-dom';

export default function Profile({ user }) {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Tenant Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Lease Info: (Coming soon)</p>
      <p>Payment History: (Coming soon)</p>

      {(user.role === 'tenant' || user.role === 'landlord') && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => navigate('/payments')}>Make a Payment</button>
        </div>
      )}
    </div>
  );
}