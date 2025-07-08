import random from 'random-string-generator';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Buat Wallet baru
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

// Ambil Wallet yg dimiliki
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

// Update Wallet pengguna berdasarkan id
async function updateWalletHandler(req, res, next) {
  const uid = req.userId;
  const walletId = parseInt(req.params.id, 10);
  const payload = req.body;

  try {
    // Cek apakah wallet milik pengguna
    const wallet = await prisma.wallet.findFirst({
      where: {
        wallet_id: walletId,
        user: { uid: uid }
      }
    });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    // Prevent updating 'Main' wallet name
    if (wallet.name === 'Main' && payload.name && payload.name !== 'Main') {
      return res.status(403).json({ message: "Main wallet name cannot be changed" });
    }
    const updateData = {};
    if (payload.name) updateData.name = payload.name;
    if (payload.desc) updateData.desc = payload.desc;
    const updatedWallet = await prisma.wallet.update({
      where: { wallet_id: walletId },
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

// Hapus wallet berdasarkan id
async function deleteWalletHandler(req, res, next) {
  const uid = req.userId;
  const walletId = parseInt(req.params.id, 10);

  try {
    // Cek apakah wallet milik pengguna
    const wallet = await prisma.wallet.findFirst({
      where: {
        wallet_id: walletId,
        user: { uid: uid }
      }
    });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    // Mencegah wallet main untuk dihapus
    if (wallet.name === 'Main') {
      return res.status(403).json({ message: 'Main wallet cannot be deleted' });
    }

    if (wallet.balance > 0) {
      return res.status(403).json({ message: 'Cannot delete wallet with non-zero balance' });
    }

    const deleteWallet = await prisma.wallet.delete({
      where: { wallet_id: walletId }
    });
    return res.status(200).json({
      message: 'Wallet deleted successful',
    });
  } catch (err) {
    return next(err);
  }
}

// Get another user wallet info by wallet number, including the owner username and email
async function getOtherUserWalletHandler(req, res, next) {
  const walletNum = req.params.wallet_number;
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { number: walletNum },
      select: {
        name: true,
        number: true,
        balance: true,
        desc: true,
        user: {
          select: {
            uid: true,
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
        include: { user: true }, // <-- Tambahkan agar fromWallet.user tersedia
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
      
      // Simpan log transaksi di database
      const [debitType, creditType] = await Promise.all([
        prisma.type.findUnique({ where: { name: "Debit" } }),
        prisma.type.findUnique({ where: { name: "Credit" } }),
      ]);
      
      // Prepare detail JSON
      const detailObj = {
        from_wallet_number: fromWallet.number, // should be wallet number (string), not wallet_id
        from_wallet_name: fromWallet.name,
        to_wallet_number: toWallet.number, // should be wallet number (string), not wallet_id
        to_wallet_name: toWallet.name,
        sender_name: fromWallet.user ? fromWallet.user.name : undefined,
        receiver_name: toWallet.user ? toWallet.user.name : undefined,
      };
      const detailJson = JSON.stringify(detailObj);

      await prisma.transaction.createMany({
        data: [
          {
            uid: userId,
            wallet_id: fromWallet.wallet_id,
            amount: -amount,
            type_id: debitType?.type_id,
            description: note || `Transfer to ${toWallet.number}`,
            date: new Date(),
            detail: detailJson,
          },
          {
            uid: toWallet.user.uid,
            wallet_id: toWallet.wallet_id,
            amount: amount,
            type_id: creditType?.type_id,
            description: note || `Received from ${fromWallet.number}`,
            date: new Date(),
            detail: detailJson,
          },
        ],
      });
  
      // Kirim response ke frontend
      return res.status(200).json({
        message: "Transfer successful",
        data: {
          transaction_id: `txn_${Date.now()}`,
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

// Handler untuk request Topup Wallet dengan wallet_number sebagai parameter URL
async function requestTopupHandler(req, res, next) {
  const userId = req.userId;
  const wallet_number = req.params.wallet_number;
  const { amount, payment_method, reference_id } = req.body;

  try {
    // Validasi input
    if (!wallet_number || !amount || !payment_method || !reference_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (amount < 10000) {
      return res.status(400).json({ message: "Amount must be greater than 10000" });
    }

    // Cari wallet berdasarkan number dan pastikan milik user
    const wallet = await prisma.wallet.findFirst({
      where: {
        number: wallet_number,
        user: { uid: userId },
      },
    });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found or access denied" });
    }

    // Buat request topup
    const topup = await prisma.topup.create({
      data: {
        wallet: { connect: { wallet_id: wallet.wallet_id } },
        user: { connect: { uid: userId } },
        amount,
        payment_method,
        reference_id,
        status: "Pending",
      },
    });

    return res.status(201).json({
      message: "Topup request created successfully",
      data: {
        topup_id: topup.topup_id,
        wallet_id: topup.wallet_id,
        amount: topup.amount,
        status: topup.status,
        requested_at: topup.requested_at,
      },
    });
  } catch (err) {
    return next(err);
  }
}

// Handler untuk menampilkan riwayat topup milik user yang sedang login
async function getUserTopupHistoryHandler(req, res, next) {
  const userId = req.userId;
  const { status, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const whereClause = { user_id: userId };
    if (status) whereClause.status = status;

    const [topups, total] = await Promise.all([
      prisma.topup.findMany({
        where: whereClause,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { requested_at: "desc" },
        include: {
          wallet: { select: { wallet_id: true, name: true, number: true } },
        },
      }),
      prisma.topup.count({ where: whereClause }),
    ]);

    return res.status(200).json({
      message: "Top-up history retrieved successfully",
      data: topups.map((t) => ({
        topup_id: t.topup_id,
        wallet: t.wallet,
        amount: t.amount,
        status: t.status,
        requested_at: t.requested_at,
        approved_by: t.approved_by,
        approved_at: t.approved_at,
        admin_notes: t.admin_notes,
        payment_method: t.payment_method,
        reference_id: t.reference_id,
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

// Handler Admin melihat semua request topup
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

// Handler Admin menyetujui topup
async function approveTopupHandler(req, res, next) {
  const topupId = parseInt(req.params.topup_id);
  const adminId = req.userId;
  const { admin_notes, status } = req.body;

  try {
    if (!admin_notes || !status) {
      return res.status(400).json({
        message: "Missing required fields: admin_notes and status are required.",
      });
    }
    const topup = await prisma.topup.findUnique({
      where: { topup_id: topupId },
      include: { wallet: true },
    });

    if (!topup) {
      return res
        .status(404)
        .json({ message: "Topup with the specified id not found." });
    }

    if (topup.status !== "Pending" || topup.status !== "Rejected" || topup.status === "Completed") {
      return res.status(422).json({
        message: "This topup request cannot be processed.",
        details: "The request has already been completed or rejected.",
      });
    }

    if (status == "Rejected") {
      // Only update topup status, do not update wallet balance
      const updatedTopup = await prisma.topup.update({
        where: { topup_id: topupId },
        data: {
          status: "Rejected",
          approved_by: adminId,
          approved_at: new Date(),
          admin_notes,
        },
      });
      return res.status(200).json({
        message: "Top-up has been rejected.",
        data: {
          topup_id: updatedTopup.topup_id,
          wallet_id: topup.wallet.number,
          amount: updatedTopup.amount,
          status: "Rejected",
          approved_by: adminId,
          approved_at: updatedTopup.approved_at,
        },
      });
    } else {
      // Approve (Completed): update topup and wallet balance
      const updated = await prisma.$transaction([
        prisma.topup.update({
          where: { topup_id: topupId },
          data: {
            status: "Completed",
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
          status: "Completed",
          approved_by: adminId,
          approved_at: updated[0].approved_at,
          updated_wallet_balance: updated[1].balance,
        },
      });
    }
  } catch (err) {
    return next(err);
  }
}
  

// Mendapat semua data Wallet
async function getAllWalletsHandler(req, res, next) {
  try {
    if (!["Admin", "Owner"].includes(req.userRole)) {
      return res.status(403).json({ message: "Access Denied" });
    }
    const wallets = await prisma.wallet.findMany({
      include: {
        user: { select: { uid: true, name: true, email: true, role: true } }
      }
    });
    return res.status(200).json({ message: 'All wallets', data: wallets });
  } catch (err) {
    return next(err);
  }
}

export { createWalletHandler, getWalletsHandler, updateWalletHandler, deleteWalletHandler, getOtherUserWalletHandler, transferHandler, requestTopupHandler, getUserTopupHistoryHandler, getAllTopupsHandler, approveTopupHandler, getAllWalletsHandler };