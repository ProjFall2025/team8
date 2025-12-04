import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
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
import AdminProperties from './pages/AdminProperties';
import AdminLeases from './pages/AdminLeases';
import PaymentsPage from './pages/PaymentsPage';
import Profile from './components/Profile.js';
import LandlordDashboard from './pages/LandlordDashboard';
import LandlordProperties from './pages/LandlordProperties';
import TenantPasscodeValidator from './pages/TenantPasscodeValidator.jsx';
import LandlordTenants from './pages/LandlordTenants';
import LandlordPayments from './pages/LandlordPayments';
import LandlordMaintenance from './pages/LandlordMaintenance';

function App() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // 🔑 Role-based redirect logic
  const DashboardRedirect = () => {
    if (!user) return <Navigate to="/login" replace />;
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin-panel" replace />;
      case 'tenant':
        return <Navigate to="/tenant" replace />;
      case 'landlord':
        return <Navigate to="/landlord" replace />;
      default:
        return <Dashboard user={user} />; // fallback generic dashboard
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
<Route
  path="/tenant/payments"
  element={
    <RoleProtectedRoute allowedRoles={['tenant']}>
      <PaymentPage user={user} />
    </RoleProtectedRoute>
  }
/>        <Route path="/landlord/properties" element={<LandlordProperties />} />
<Route path="/properties-page" element={<PropertiesPage />} />
        {/* Role-based dashboard redirect */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Admin-only route */}
        <Route
          path="/admin-panel"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminPanel user={user} />
            </RoleProtectedRoute>
          }
        />

        {/* Tenant routes */}
        <Route
          path="/tenant"
          element={
            <RoleProtectedRoute allowedRoles={['tenant']}>
              <TenantDashboard user={user} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/tenant/profile"
          element={
            <RoleProtectedRoute allowedRoles={['tenant']}>
              <Profile user={user} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/tenant/passcodes"
          element={
            <RoleProtectedRoute allowedRoles={['tenant']}>
              <TenantPasscodeValidator user={user} />
            </RoleProtectedRoute>
          }
        />

        {/* Landlord routes */}
        <Route
          path="/landlord"
          element={
            <RoleProtectedRoute allowedRoles={['landlord']}>
              <LandlordDashboard user={user} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/landlord/tenants"
          element={
            <RoleProtectedRoute allowedRoles={['landlord']}>
              <LandlordTenants user={user} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/landlord/payments"
          element={
            <RoleProtectedRoute allowedRoles={['landlord']}>
              <LandlordPayments user={user} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/landlord/maintenance"
          element={
            <RoleProtectedRoute allowedRoles={['landlord']}>
              <LandlordMaintenance user={user} />
            </RoleProtectedRoute>
          }
        />

        {/* Shared admin/landlord routes */}
        <Route
          path="/leases"
          element={
            <RoleProtectedRoute allowedRoles={['admin', 'landlord']}>
              <AdminLeases user={user} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/properties"
          element={
            <RoleProtectedRoute allowedRoles={['admin', 'landlord']}>
              <AdminProperties user={user} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/passcodes"
          element={
            <RoleProtectedRoute allowedRoles={['admin', 'landlord']}>
              <PasscodesPage user={user} />
            </RoleProtectedRoute>
          }
        />

        {/* Other pages */}
        <Route
          path="/tenants"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <TenantsPage user={user} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <RoleProtectedRoute allowedRoles={['tenant', 'admin', 'landlord']}>
              <MaintenancePage user={user} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <RoleProtectedRoute allowedRoles={['tenant', 'admin', 'landlord']}>
              <PaymentsPage user={user} />
            </RoleProtectedRoute>
          }
        />

        {/* Fallbacks */}
        <Route path="/unauthorized" element={<h2>Access Denied</h2>} />
        <Route path="*" element={<h2>Page Not Found</h2>} />

        {/* Stripe aliases */}
        <Route path="/stripe-success" element={<PaymentSuccess />} />
        <Route path="/stripe-cancel" element={<PaymentCancel />} />
      </Routes>
    </Router>
  );
}

export default App;
