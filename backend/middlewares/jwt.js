const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
<<<<<<< HEAD
=======

>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
  const token = authHeader && authHeader.split(' ')[1]?.trim();

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
<<<<<<< HEAD
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(403).json({ message: 'Invalid token' });
=======

    req.user = decoded;

    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
  }
};

module.exports = verifyToken;