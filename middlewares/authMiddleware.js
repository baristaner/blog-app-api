const jwt = require('jsonwebtoken');
const sessionSecret = process.env.SESSION_SECRET;

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  jwt.verify(token, sessionSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    req.userId = decoded.userId;
    next();
  });
};

module.exports = {
  authenticateToken,
};
