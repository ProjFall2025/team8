import React from 'react';
import api from '../services/api'; 

export default function PaymentPage() {
  const handlePay = async () => {
    try {
      const res = await api.post('/payments/create-session');
      window.location.href = res.data.url; 
    } catch (err) {
      alert('Payment failed');
    }
  };

  return (
    <div>
      <h2>Rent Payment</h2>
      <p>Click below to pay $1000 securely via Stripe.</p>
      <button onClick={handlePay}>Pay $1000</button>
    </div>
  );
}