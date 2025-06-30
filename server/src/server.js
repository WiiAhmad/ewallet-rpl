import 'dotenv/config';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { registerHandler, loginAuthHanlder } from './server/auth.js';
import { getMeHandler } from './server/user.js';
import { transferHandler, topupHandler, getTopupsHandler } from "./server/wallet.js";
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

// Register
app.post('/auth/register', registerHandler);

// Login
app.post('/auth/login', loginAuthHanlder);

// Get current user info
app.get('/user/me', authenticateJWT, getMeHandler);

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