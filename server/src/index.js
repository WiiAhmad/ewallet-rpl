import 'dotenv/config';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { registerHandler, loginAuthHanlder, logoutHandler } from './server/auth.js';
import { getUserHandler, updateUserHandler } from './server/user.js';
import { authenticateJWT } from './middleware.js';
import cors from 'cors';

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

api.get('/db-check', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ connected: true });
  } catch (error) {
    res.status(500).json({ connected: false, error: error.message });
  }
});

api.post('/auth/register', registerHandler);
api.post('/auth/login', loginAuthHanlder);
api.post('/auth/logout', logoutHandler);

api.get('/user/me', authenticateJWT, getUserHandler);
api.put('/user/me', authenticateJWT, updateUserHandler);

app.post('/wallets', authenticateJWT, createWalletHandler)
app.get('/wallets/me', authenticateJWT, getWalletsHandler)
app.put('/wallets/:id', authenticateJWT, updateWalletHandler)
app.delete('/wallets/:id', authenticateJWT, deleteWalletHandler)
app.get('/wallets/:id', authenticateJWT, getOtherUserWalletHandler)

app.use('/api', api);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});