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


// Handler untuk transfer saldo antar wallet
async function transferHandler(req, res, next) {
    const { fromWalletId, toWalletNumber, amount, note } = req.body;
    const userId = req.userId; // didapat dari JWT
  
    try {
      // Validasi awal: input harus lengkap
      if (!fromWalletId || !toWalletNumber || !amount) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      if (amount <= 0) {
        return res.status(400).json({ message: "Amount must be greater than 0" });
      }
  
      // Ambil wallet pengirim berdasarkan ID dan pastikan milik user
      const fromWallet = await prisma.wallet.findFirst({
        where: {
          number: fromWalletId,
          user: { uid: userId },
        },
      });
  
      if (!fromWallet) {
        return res.status(404).json({ message: "Sender wallet not found or access denied" });
      }
  
      // Cek apakah cukup saldonya
      if (fromWallet.balance < amount) {
        return res.status(400).json({ message: "Insufficient funds." });
      }
  
      // Cari wallet tujuan berdasarkan number
      const toWallet = await prisma.wallet.findUnique({
        where: { number: toWalletNumber },
        include: { user: true },
      });
  
      if (!toWallet) {
        return res.status(404).json({ message: "Receiver wallet not found" });
      }
  
      // Jalankan transaksi saldo
      const updatedSender = await prisma.wallet.update({
        where: { wallet_id: fromWallet.wallet_id },
        data: { balance: { decrement: amount } },
      });
  
      const updatedReceiver = await prisma.wallet.update({
        where: { wallet_id: toWallet.wallet_id },
        data: { balance: { increment: amount } },
      });
  
      // Optional: simpan log transaksi di database (kalau pakai model Transaction)
  
      // Kirim response ke frontend
      return res.status(200).json({
        message: "Transfer successful",
        data: {
          transaction_id: `txn_${Date.now()}`, // sementara pakai timestamp
          from_wallet: {
            number: fromWallet.number,
            new_balance: updatedSender.balance,
          },
          to_wallet: {
            number: toWallet.number,
            owner_name: toWallet.user.name,
          },
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      return next(err);
    }
}  


async function requestTopupHandler(req, res, next) {
  const userId = req.userId;
  const walletId = parseInt(req.params.id);
  const { amount, payment_method, reference_id } = req.body;

  // Validasi input
  if (!amount || amount < 10000) {
    return res.status(400).json({
      message: "Invalid input provided.",
      errors: { amount: "Amount must be greater than 10000" },
    });
  }

  try {
    // Cek wallet apakah dimiliki user
    const wallet = await prisma.wallet.findFirst({
      where: {
        wallet_id: walletId,
        uid: userId,
      },
    });

    if (!wallet) {
      return res
        .status(404)
        .json({ message: "Wallet with the specified ID not found." });
    }

    // Buat data topup
    const topup = await prisma.topup.create({
      data: {
        wallet_id: walletId,
        user_id: userId,
        amount,
        payment_method,
        reference_id,
      },
    });

    return res.status(202).json({
      message: "Top-up request received and is pending approval.",
      data: {
        topup_id: topup.topup_id,
        wallet_id: wallet.number,
        amount: topup.amount,
        status: topup.status,
        requested_at: topup.requested_at,
      },
    });
  } catch (err) {
    return next(err);
  }
}

// Handler 2: Admin melihat semua request topup
async function getAllTopupsHandler(req, res, next) {
  const { status, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const whereClause = status ? { status } : {};
    const [topups, total] = await Promise.all([
      prisma.topup.findMany({
        where: whereClause,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { requested_at: "desc" },
        include: {
          user: { select: { uid: true, name: true, email: true } },
        },
      }),
      prisma.topup.count({ where: whereClause }),
    ]);

    return res.status(200).json({
      message: "All top-up requests retrieved successfully",
      data: topups.map((t) => ({
        topup_id: t.topup_id,
        wallet_id: t.wallet_id,
        user: {
          id: t.user.uid,
          name: t.user.name,
          email: t.user.email,
        },
        amount: t.amount,
        status: t.status,
        requested_at: t.requested_at,
        approved_by: t.approved_by,
        approved_at: t.approved_at,
      })),
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: parseInt(limit),
      },
    });
  } catch (err) {
    return next(err);
  }
}

// Handler 3: Admin menyetujui topup
async function approveTopupHandler(req, res, next) {
  const topupId = parseInt(req.params.topup_id);
  const adminId = req.userId;
  const { admin_notes } = req.body;

  try {
    const topup = await prisma.topup.findUnique({
      where: { topup_id: topupId },
      include: { wallet: true },
    });

    if (!topup) {
      return res
        .status(404)
        .json({ message: "topup_id with the specified ID not found." });
    }

    if (topup.status !== "pending") {
      return res.status(422).json({
        message: "This top-up request cannot be processed.",
        details: "The request has already been completed or rejected.",
      });
    }

    // Update status topup dan balance wallet
    const updated = await prisma.$transaction([
      prisma.topup.update({
        where: { topup_id: topupId },
        data: {
          status: "completed",
          approved_by: adminId,
          approved_at: new Date(),
          admin_notes,
        },
      }),
      prisma.wallet.update({
        where: { wallet_id: topup.wallet_id },
        data: {
          balance: { increment: topup.amount },
        },
      }),
    ]);

    return res.status(200).json({
      message: "Top-up approved successfully. Wallet balance has been updated.",
      data: {
        topup_id: topup.topup_id,
        wallet_id: topup.wallet.number,
        amount: topup.amount,
        status: "completed",
        approved_by: adminId,
        approved_at: new Date(),
        updated_wallet_balance: updated[1].balance,
      },
    });
  } catch (err) {
    return next(err);
  }
}
  

export { createWalletHandler, getWalletsHandler, updateWalletHandler, deleteWalletHandler, getOtherUserWalletHandler, transferHandler, requestTopupHandler, getAllTopupsHandler, approveTopupHandler };