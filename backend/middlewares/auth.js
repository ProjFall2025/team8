const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
<<<<<<< HEAD
  const header = req.headers.authorization;
  const token = header?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = {
  ...decoded,
  userId: decoded.userId || decoded.user_id // ✅ normalize for payment controller
};
    next();
  } catch (error) {
    console.error('❌ JWT verification failed:', error.message);
=======
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;