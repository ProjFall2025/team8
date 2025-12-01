// src/components/TenantPayments.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function TenantPayments() {
  const [payments, setPayments] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setPayments([]); // no token, no payments
      return;
    }

    api.get('/payments/user', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setPayments(res.data);
      })
      .catch(err => {
        console.error("❌ Error loading payments:", err.response?.data || err.message);
        setPayments([]);
      });
  }, []);

  if (payments === null) return <p>Loading payment history...</p>;
  if (payments.length === 0) return <p>No payments found.</p>;

  return (
  <table style={styles.table}>
    <thead>
      <tr>
        <th style={styles.th}>Date</th>
        <th style={styles.th}>Amount</th>
        <th style={styles.th}>Status</th>
        <th style={styles.th}>Late Fee</th>
        <th style={styles.th}>Note</th>
      </tr>
    </thead>
    <tbody>
      {payments.map((payment) => (
        <tr key={payment.payment_id}>
          <td style={styles.td}>
            {payment.paid_date
              ? new Date(payment.paid_date).toLocaleDateString()
              : '—'}
          </td>
          <td style={styles.td}>
            {payment.amount
              ? `$${parseFloat(payment.amount).toLocaleString()}`
              : '—'}
          </td>
          <td style={styles.td}>
            {payment.status || '—'}
          </td>
          <td style={styles.td}>
            {payment.late_fee_applied ? 'Yes' : 'No'}
          </td>
          <td style={styles.td}>
            {payment.note ?? '—'}
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  );
}

const styles = {
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    marginBottom: '2.5rem',
    border: '1px solid #eee'
  },
  title: {
    fontSize: '1.35rem',
    marginBottom: '1.25rem',
    color: '#222',
    borderBottom: '1px solid #ddd',
    paddingBottom: '0.5rem',
    fontWeight: '600'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '1.5rem'
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ddd',
    fontSize: '0.95rem',
    color: '#333'
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid #eee',
    fontSize: '0.9rem',
    color: '#444'
  },
  statusPaid: {
    color: '#28a745',
    fontWeight: '600'
  },
  statusPending: {
    color: '#ffc107',
    fontWeight: '600'
  },
  statusFailed: {
    color: '#dc3545',
    fontWeight: '600'
  },
  payButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#0078D4',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    marginTop: '1rem'
  }
};