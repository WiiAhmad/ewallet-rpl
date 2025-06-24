import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
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

export { authenticateJWT };