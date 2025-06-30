import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import random from 'random-string-generator';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create user wallet
async function createWalletHandler(req, res, next) {
    const id = req.userId;
    const { name, desc } = req.body;
    const number = random(8, 'uppernumeric');
    try {
        const user = await prisma.user.findUnique({
        where: { uid: id },
        });
        if (!user) {
            return res.status(404).json({ message: 'Invalid User' });
        }
        if (!name) {
             return res.status(400).json({ message: 'Name must not blank, etc' });
        }
        const wallet = await prisma.wallet.create({
        data: { name, number, desc, user: { connect: { uid: id } } }
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

// Get user wallets
async function getWalletsHandler(req, res, next) {
    try {
        const user = await prisma.user.findUnique({
        where: { uid: req.userId },
        });
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }
        const wallets = await prisma.wallet.findMany({
        where: { user: { uid: user.uid } },
        select: {
            wallet_id: true,
            name: true,
            number: true,
            balance: true,
            desc: true
        }
        });
        return res.status(200).json({
        message: 'Wallets fetched successfully',
        data: wallets
        });
    } catch (err) {
        return next(err);
    }
}

// Update user wallet by Id
async function updateWalletHandler(req, res, next) {
    const uid = req.userId;
    const walletId = parseInt(req.params.id, 10);
    const payload = req.body;

    try {
        // Check if wallet exists and belongs to the user
        const wallet = await prisma.wallet.findFirst({
        where: {
            wallet_id: walletId,
            user: { uid: uid }
        }
        });
        if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
        }
        const updateData = {};
        if (payload.name) updateData.name = payload.name;
        if (payload.desc) updateData.desc = payload.desc;
        const updatedWallet = await prisma.wallet.update({
        where: { wallet_id: id },
        data: updateData,
        });
        return res.status(200).json({
        message: 'Wallet update successful',
        data: {
            id: updatedWallet.wallet_id,
            name: updatedWallet.name,
            number: updatedWallet.number,
            desc: updatedWallet.desc,
        },
        });
    } catch (err) {
        return next(err);
    }
}

// Delete user wallet by Id
async function deleteWalletHandler(req, res, next) {
    const uid = req.userId;
    const walletId = parseInt(req.params.id, 10);

    try {
        // Check if wallet exists and belongs to the user
        const wallet = await prisma.wallet.findFirst({
        where: {
            wallet_id: walletId,
            user: { uid: uid }
        }
        });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        const deleteWallet = await prisma.wallet.delete({
            where: { wallet_id: id }
        });
        return res.status(200).json({
            message: 'Wallet deleted successful',
        });
    } catch (err) {
        return next(err);
    }
}

// Get another user wallet info by wallet ID, including the owner username and email
async function getOtherUserWalletHandler(req, res, next) {
    const walletId = parseInt(req.params.id, 10);
    try {
        const wallet = await prisma.wallet.findUnique({
            where: { wallet_id: walletId },
            select: {
                wallet_id: true,
                name: true,
                number: true,
                balance: true,
                desc: true,
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        return res.status(200).json({
            message: 'Wallet info fetched successfully',
            data: {
                id: wallet.user.uid,
                name: wallet.name,
                number: wallet.number,
                owner: {
                    name: wallet.user.name,
                    email: wallet.user.email
                }
            }
        });
    } catch (err) {
        return next(err);
    }
}

export { createWalletHandler, getWalletsHandler, updateWalletHandler, deleteWalletHandler, getOtherUserWalletHandler };