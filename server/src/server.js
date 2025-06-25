import 'dotenv/config';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { registerHandler, loginAuthHanlder, logoutHandler } from './server/auth.js';
import { getUserHandler, updateUserHandler } from './server/user.js';
import { authenticateJWT } from './middleware.js';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(morgan('dev'));     // Logger for API Hits.
app.use(cookieParser(process.env.JWT_SECRET));    // Cookie to storing JWT Tokens for reusability

app.get('/db-check', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ connected: true });
  } catch (error) {
    res.status(500).json({ connected: false, error: error.message });
  }
});

// Register
app.post('/auth/register', registerHandler);

// Login
app.post('/auth/login', loginAuthHanlder);

// Logout
app.post('/auth/logout', logoutHandler);

// Get current user info
app.get('/user/me', authenticateJWT, getUserHandler);

// Update current user info
app.put('/user/me', authenticateJWT, updateUserHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});