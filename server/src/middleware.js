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
    if (!roles.includes(req.user.role)) {
      return res.status(403).send('Access Dennied');
    }
    next();
  };
};

export { authenticateJWT, requireRole};