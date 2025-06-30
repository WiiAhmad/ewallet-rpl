import 'dotenv/config';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { registerHandler, loginAuthHanlder } from './server/auth.js';
import { getMeHandler } from './server/user.js';
import { transferHandler, topupHandler, getTopupsHandler } from "./server/wallet.js";
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

// Create wallet
app.post('/wallets', authenticateJWT, createWalletHandler)

// Get wallets
app.get('/wallets/me', authenticateJWT, getWalletsHandler)

// Update wallet by id
app.put('/wallets/:id', authenticateJWT, updateWalletHandler)

// Delete wallet by id
app.delete('/wallets/:id', authenticateJWT, deleteWalletHandler)

// Get other user wallet
app.get('/wallets/:id', authenticateJWT, getOtherUserWalletHandler)

// Transfer Endpoint
app.post("/wallets/transfer", authenticateJWT, transferHandler);

//   USER   //
app.post('/wallets/:id/topup', authenticateJWT, topupHandler);

//   ADMIN  //
app.get('/topups', authenticateJWT, getTopupsHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});