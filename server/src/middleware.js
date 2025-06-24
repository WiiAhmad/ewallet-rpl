import jwt from 'jsonwebtoken';

// Middleware for JWT verification
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Get token from Authorization header (Bearer <token>)

  if (!token) {
    return res.status(401).json({
      status_code: 401,
      message: 'Token not found, please login first',
    });
  }

  try {
    // Token verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.uid;
    next();
  } catch (err) {
    return res.status(403).json({
      status_code: 403,
      message: 'Token invalid or expired',
    });
  }
};

export { authenticateJWT };