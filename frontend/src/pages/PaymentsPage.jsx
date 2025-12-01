import React, { useEffect, useState } from 'react';
import api from '../services/api';

const PaymentsPage = ({ user }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('❌ No token found, user not authenticated');
          setLoading(false);
          return;
        }

        // ✅ Use /payments/all for admin, /payments/user otherwise
        const endpoint = user?.role === 'admin' ? '/payments/all' : '/payments/user';

        const res = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayments(res.data);
        console.log('🔍 Payments response:', res.data);
      } catch (err) {
        console.error('❌ Failed to fetch payments:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to fetch payments.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  // ✅ Ensure amount is numeric
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const lastPaymentDate = payments.length && payments[0].paid_date
    ? new Date(payments[0].paid_date).toLocaleDateString()
    : 'N/A';

  const filteredPayments = payments.filter(p =>
    filter ? (p.tenant_name || p.user_name || '').toLowerCase().includes(filter.toLowerCase()) : true
  );

  return (
    <div style={page}>
      <h2 style={heading}>💳 Payments</h2>

      {/* Summary bar */}
      <div style={summaryBar}>
        <span><strong>Total Paid:</strong> ${totalPaid.toFixed(2)}</span>
        <span><strong>Last Payment:</strong> {lastPaymentDate}</span>
        <span><strong>Records:</strong> {payments.length}</span>
      </div>

      {/* Filter for admin */}
      {user?.role === 'admin' && (
        <input
          type="text"
          placeholder="Search by tenant name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={searchBox}
        />
      )}

      {loading ? (
        <p style={info}>Loading payments...</p>
      ) : error ? (
        <p style={errorMsg}>{error}</p>
      ) : filteredPayments.length === 0 ? (
        <p style={info}>
          {user?.role === 'admin'
            ? 'No payment records found for tenants.'
            : 'No payments found.'}
        </p>
      ) : (
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Amount</th>
              <th style={th}>Date</th>
              {user?.role === 'admin' && <th style={th}>Tenant</th>}
              {user?.role === 'admin' && <th style={th}>Property</th>}
              <th style={th}>Payment ID</th>
              <th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p, index) => (
              <tr key={p.payment_id || index} style={tr}>
                <td style={td}>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(Number(p.amount || 0))}
                </td>
                <td style={td}>
                  {p.paid_date ? new Date(p.paid_date).toLocaleDateString() : 'N/A'}
                </td>

                {user?.role === 'admin' && (
                  <>
                    <td style={td}>{p.tenant_name || p.user_name || 'N/A'}</td>
                    <td style={td}>
                      {p.property_address
                        ? `${p.property_address}, ${p.city || ''}, ${p.state || ''} ${p.zip || ''}`
                        : 'N/A'}
                      <br />
                      <span style={{ fontSize: '0.85rem', color: '#555' }}>
                        Rent: ${p.rent_amount || 0} | Status:{' '}
                        <span style={{
                          color: p.property_status === 'available' ? 'green' : 'red',
                          fontWeight: '600'
                        }}>
                          {p.property_status || 'N/A'}
                        </span>
                      </span>
                    </td>
                  </>
                )}

                <td style={td}>{p.payment_id}</td>
                <td style={td}>{p.status || 'Paid'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Stripe button only for tenants/landlords */}
      {user?.role !== 'admin' && (
        <button style={payButton}>
          Pay Now with Stripe
        </button>
      )}
    </div>
  );
};

/* 🎨 Styles */
const page = { padding: '2rem', maxWidth: '1100px', margin: '0 auto', fontFamily: 'Segoe UI, sans-serif' };
const heading = { fontSize: '1.75rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111' };
const summaryBar = { display: 'flex', justifyContent: 'space-between', backgroundColor: '#f3f4f6', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: '500', color: '#333' };
const searchBox = { padding: '0.5rem 1rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #ccc', width: '100%' };
const info = { fontSize: '1rem', color: '#555' };
const errorMsg = { fontSize: '1rem', color: '#dc2626', fontWeight: '500' };
const table = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' };
const th = { textAlign: 'left', padding: '0.75rem', backgroundColor: '#2563eb', color: '#fff', fontWeight: '600' };
const td = { padding: '0.75rem', borderBottom: '1px solid #ddd', fontSize: '0.95rem' };
const tr = { backgroundColor: '#fff' };
const payButton = { marginTop: '20px', padding: '10px 20px', background: 'black', color: 'white', cursor: 'pointer', borderRadius: '6px', fontWeight: '600' };

export default PaymentsPage;