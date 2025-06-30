import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Register Handler
async function registerHandler(req, res, next) {
  const { name, phone, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, phone, email, password: hashedPassword }
    });
    return res.status(201).json({
      message: 'User registered successfully',
      data: {
        id: user.uid,
        name: user.name,
        phone: user.phone,
        email: user.email
      }
    });
  } catch (err) {
    return next(err);
  }
}

// Login Handler
async function loginAuthHanlder(req, res, next) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Incorrect Email or Password!' });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Incorrect Email or Password!' });
    }
    const token = jwt.sign(
      { uid: user.uid, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );
    // Set JWT as a signed, httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      signed: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 day expiring time
    });
    return res.status(200).json({
      message: 'Login successful',
      data: {
        id: user.uid,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    return next(err);
  }
}

// Logout Handler
async function logoutHandler(req, res, next) {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      signed: true
    });
    return res.status(204).json({});
  } catch (err) {
    return next(err);
  }
}

export { registerHandler, loginAuthHanlder, logoutHandler };