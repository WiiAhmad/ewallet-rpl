import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    return res.status(401).json({ message: 'User Unauthorized, Please Login Again' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.uid;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid User' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    // Use req.userRole (set by authenticateJWT)
    if (!roles.includes(req.userRole)) {
      // Custom message for Admin endpoints
      if (roles.includes('Admin')) {
        return res.status(403).json({ message: 'Access denied. Admin role required.' });
      }
      return res.status(403).json({ message: 'Access Denied' });
    }
    next();
  };
};
// Contoh penggunaan di route:
// router.get('/laporan', authenticate, requireRole(['ADMIN', 'OWNER']), getLaporan);

export { authenticateJWT, requireRole };