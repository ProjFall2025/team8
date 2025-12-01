import { useEffect, useState } from 'react';
import axios from 'axios';

function getUserIdFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  } catch (err) {
    console.error('Token decode failed:', err);
    return null;
  }
}

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    axios
      .get('/api/payment-history/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => {
        console.log('📦 Payments:', res.data); // ✅ Debug log added here
        setPayments(res.data);
      })
      .catch((err) => console.error('Fetch failed:', err));
  }, []);

  return (
    <div>
      <h2>Payment History</h2>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Paid Date</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.payment_id}>
                <td>
                  {p.payment_for_month
                    ? new Date(p.payment_for_month).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </td>
                <td>
                  {p.amount !== null && p.amount !== undefined
                    ? `$${parseFloat(p.amount).toFixed(2)}`
                    : 'N/A'}
                </td>
                <td>{p.status || 'N/A'}</td>
                <td>
                  {p.paid_date
                    ? new Date(p.paid_date).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td>{p.payment_type || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}