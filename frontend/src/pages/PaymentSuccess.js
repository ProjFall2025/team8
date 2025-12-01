import React, { useEffect } from 'react';
import api from '../services/api';

const PaymentSuccess = () => {
  useEffect(() => {
    const recordPayment = async () => {
      try {
        const token = localStorage.getItem('token');
        await api.post(
          '/api/payments',
          { userId: 42, amount: 1000 }, // or pull from query params
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
      <p>Your payment has been recorded. Thank you!</p>
    </div>
  );
};

export default PaymentSuccess;