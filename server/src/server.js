import 'dotenv/config';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createUserHandler, getUserByIdHandler, deleteUserByIdHandler } from './server/user.js';
import { createAuthHandler } from './server/auth.js';
import { authenticateJWT } from './middleware.js';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get('/db-check', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ connected: true });
  } catch (error) {
    res.status(500).json({ connected: false, error: error.message });
  }
});

// User registration
app.post('/register', createUserHandler);

// User login
app.post('/login', createAuthHandler);

// Get user by UID (protected)
app.get('/user/:uid', authenticateJWT, getUserByIdHandler);

// Delete user by UID (protected)
app.delete('/user/:uid', authenticateJWT, deleteUserByIdHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});