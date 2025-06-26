import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create user wallet
async function createWalletHandler(req, res, next) {
    const { name, number, desc } = req.body;
    try {
        if (!name) {
             return res.status(400).json({ message: 'Name must not blank, etc' });
        }
        const wallet = await prisma.wallet.create({
        data: { name, number, desc }
        });
        return res.status(201).json({
        message: 'Wallet successfully created',
        data: {
            id: wallet.wallet_id,
            name: wallet.name,
            number: wallet.number,
            balance: wallet.balance,
            desc: wallet.desc
        }
        });
    } catch (err) {
        return next(err);
    }
}