import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import AdminPanel from './pages/AdminPanel';
import PropertiesPage from './pages/PropertiesPage';
import TenantsPage from './pages/TenantsPage';
import MaintenancePage from './pages/MaintenancePage';
import PasscodesPage from './pages/PasscodesPage';
import TenantDashboard from './pages/TenantDashboard';
import RoleProtectedRoute from './pages/RoleProtectedRoute'; 
function App() {
  return (
    <Router>
      <Routes>
        {/* Home / Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Login / Register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Stripe Payment Page */}
        <Route path="/payments" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />

        {/* Admin Panel (RBAC: admin only) */}
        <Route
          path="/admin-panel"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </RoleProtectedRoute>
          }
        />

        {/* Tenant Dashboard (RBAC: tenant only) */}
        <Route
          path="/tenant"
          element={
            <RoleProtectedRoute allowedRoles={['tenant']}>
              <TenantDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* Feature Pages */}
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/tenants" element={<TenantsPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/passcodes" element={<PasscodesPage />} />

        {/* Unauthorized fallback */}
        <Route path="/unauthorized" element={<h2>Access Denied</h2>} />
      </Routes>
    </Router>
  );
}

export default App;