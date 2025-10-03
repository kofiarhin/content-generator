const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const fallbackUser = req.headers['x-user-id'];

  if (!token && !fallbackUser) {
    req.user = null;
    return next();
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'development-secret');
      req.user = { id: decoded.sub || decoded.id };
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  req.user = { id: fallbackUser };
  return next();
};

module.exports = authenticate;
