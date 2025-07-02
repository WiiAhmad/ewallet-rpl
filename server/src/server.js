import 'dotenv/config';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { registerHandler, loginAuthHanlder, logoutHandler } from './controllers/auth.js';
import { getUserHandler, updateUserHandler } from './controllers/user.js';
import { authenticateJWT } from './middleware.js';
import { createWalletHandler, deleteWalletHandler, getOtherUserWalletHandler, getWalletsHandler, updateWalletHandler } from './controllers/wallet.js';

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

app.post('/auth/register', registerHandler);
app.post('/auth/login', loginAuthHanlder);
app.post('/auth/logout', logoutHandler);
app.get('/user/me', authenticateJWT, getUserHandler);
app.put('/user/me', authenticateJWT, updateUserHandler);
app.post('/wallets', authenticateJWT, createWalletHandler)
app.get('/wallets/me', authenticateJWT, getWalletsHandler)
app.put('/wallets/:id', authenticateJWT, updateWalletHandler)
app.delete('/wallets/:id', authenticateJWT, deleteWalletHandler)
app.get('/wallets/:id', authenticateJWT, getOtherUserWalletHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});