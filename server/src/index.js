import 'dotenv/config';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { registerHandler, loginAuthHanlder, logoutHandler } from './controllers/auth.js';
import { getUserHandler, updateUserHandler, getAllUsersHandler } from './controllers/user.js';
import { authenticateJWT, requireRole } from './middleware.js';
import cors from 'cors';
import { createWalletHandler, deleteWalletHandler, getOtherUserWalletHandler, getWalletsHandler, updateWalletHandler, transferHandler, requestTopupHandler, getAllTopupsHandler, approveTopupHandler, getAllWalletsHandler } from './controllers/wallet.js';
import { getTransactionHistoryHandler, getAllTransactionsHandler } from "./controllers/transaction.js";

const prisma = new PrismaClient();
const app = express();
const api = express.Router();

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
})); 

app.get('/db-check', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ connected: true });
  } catch (error) {
    res.status(500).json({ connected: false, error: error.message });
  }
});

app.use('/api', api);

// Endpoint User
app.post('/auth/register', registerHandler);
app.post('/auth/login', loginAuthHanlder);
app.post('/auth/logout', logoutHandler);

// User Profile
app.get('/user/me', authenticateJWT, getUserHandler);
app.put('/user/me', authenticateJWT, updateUserHandler);

// User Wallets
app.post('/wallets', authenticateJWT, createWalletHandler)
app.get('/wallets/me', authenticateJWT, getWalletsHandler)
app.put('/wallets/:id', authenticateJWT, updateWalletHandler)
app.delete('/wallets/:id', authenticateJWT, deleteWalletHandler)
app.get('/wallets/:wallet_number', authenticateJWT, getOtherUserWalletHandler)
app.post('/wallets/transfer', authenticateJWT, transferHandler);
app.post('/wallets/:wallet_number/topup', authenticateJWT, requestTopupHandler);

// User Transactions
app.get('/transactions', authenticateJWT, getTransactionHistoryHandler);

// Admin, Owner endpoints
app.get('/admin/users', authenticateJWT, requireRole(['Admin', 'Owner']), getAllUsersHandler);
app.get('/admin/transactions', authenticateJWT, requireRole(['Admin', 'Owner']), getAllTransactionsHandler);
app.get('/admin/wallets', authenticateJWT, requireRole(['Admin', 'Owner']), getAllWalletsHandler);

// Admin Topups
app.get('/admin/topups', authenticateJWT, requireRole(['Admin']), getAllTopupsHandler);
app.post('/topups/:topup_id/approve', authenticateJWT, requireRole(['Admin']), approveTopupHandler);

// Owner analytics endpoint
app.get('/owner/analytics', authenticateJWT, requireRole(['Owner']), (req, res) => {
  res.json({ message: 'Analytics data (to be implemented)' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});