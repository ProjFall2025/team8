const role = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role?.toLowerCase();
    const allowed = allowedRoles.map(r => r.toLowerCase());

    console.log('🔍 Incoming user:', req.user);
    console.log('🔐 Role check:', userRole, 'vs allowed:', allowed);

    if (!allowed.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};

module.exports = role;