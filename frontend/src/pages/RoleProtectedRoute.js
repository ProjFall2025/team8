import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function RoleProtectedRoute({ children, allowedRoles }) {
  const [token, setToken] = useState(undefined); // undefined = not checked yet
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    setToken(t);
    setUser(u ? JSON.parse(u) : null);

  }, []);

  if (token === undefined || user === undefined) {
    return null; // or a spinner/loading screen
  }

  // ❌ No token or user → redirect
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 🔎 Expiry check
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      console.log("⏰ Token expired, redirecting to login");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    console.error("⚠️ Invalid token format", err);
    return <Navigate to="/login" replace />;
  }

  // ✅ Role check
  const normalizedRole = user.role?.toLowerCase();
  const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());


  if (!normalizedAllowed.includes(normalizedRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}