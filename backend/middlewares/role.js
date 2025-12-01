<<<<<<< HEAD
const role = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role?.toLowerCase();
    const allowed = allowedRoles.map(r => r.toLowerCase());

    console.log('🔍 Incoming user:', req.user);
    console.log('🔐 Role check:', userRole, 'vs allowed:', allowed);

    if (!allowed.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }

=======
const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (req.user?.role !== requiredRole) {
      return res.status(403).json({ message: 'Access denied' });
    }
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
    next();
  };
};

<<<<<<< HEAD
module.exports = role;
=======
module.exports = roleMiddleware;
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
