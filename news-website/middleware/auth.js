const jwt = require('jsonwebtoken');
const JWT_SECRET = 'c41cbaadf05e4e364cf5e8143030663b'; // 98861377980 -> MD5 HASHED

// Middleware to authenticate JWT Token
const authenticateJWT = (req, res, next) => {
  // Note the lowercase 'authorization'
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied no token' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateJWT;
