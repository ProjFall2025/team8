import React, { useEffect } from 'react';
import api from '../services/api';

const PaymentSuccess = () => {
  useEffect(() => {
    const recordPayment = async () => {
      try {
        const token = localStorage.getItem('token');
        await api.post(
          '/api/payments',
          { userId: 42, amount: 1000 }, // TODO: replace with dynamic values from query params or context
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('❌ Failed to record payment:', err.response?.data || err.message);
      }
    };

    recordPayment();
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>✅ Payment Successful</h2>
      <p>Thank you for your payment. Your transaction has been processed and recorded.</p>
    </div>
  );
};

export default PaymentSuccess;