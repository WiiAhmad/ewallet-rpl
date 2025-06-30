import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


// /wallets/transfer //
async function transferHandler(req, res, next) {
  try {
    const { fromWalletId, toWalletNumber, amount, note } = req.body;
    const userId = req.userId;

    // Validasi input
    if (!fromWalletId || !toWalletNumber || !amount) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Ambil wallet pengirim (berdasarkan nama)
    const fromWallet = await prisma.wallet.findFirst({
      where: {
        name: fromWalletId,
        userId: userId,
      },
    });

    if (!fromWallet) {
      return res
        .status(401)
        .json({ message: "User Unauthorized, Please Login Again" });
    }

    // Cek saldo cukup
    if (fromWallet.value < amount) {
      return res.status(400).json({ message: "Insufficient funds." });
    }

    // Ambil wallet penerima (berdasarkan name)
    const toWallet = await prisma.wallet.findFirst({
      where: { name: toWalletNumber },
      include: { user: true },
    });

    if (!toWallet) {
      return res.status(404).json({ message: "Destination wallet not found." });
    }

    // Lakukan transfer dalam satu transaksi
    const transaction = await prisma.$transaction(async (tx) => {
      // Kurangi saldo pengirim
      await tx.wallet.update({
        where: { wallet_id: fromWallet.wallet_id },
        data: {
          value: {
            decrement: amount,
          },
        },
      });

      // Tambah saldo penerima
      await tx.wallet.update({
        where: { wallet_id: toWallet.wallet_id },
        data: {
          value: {
            increment: amount,
          },
        },
      });

      // Simpan transaksi
      const newTransaction = await tx.transaction.create({
        data: {
          userId: userId,
          wallet_id: fromWallet.wallet_id,
          value: amount,
          category_id: 1, // pastikan ada kategori ID 1
          description: note ?? "Transfer",
          date: new Date(),
        },
      });

      return newTransaction;
    });

    // Kirim response sesuai dokumentasi
    return res.status(200).json({
      message: "Transfer successful",
      data: {
        transaction_id: transaction.trans_id,
        from_wallet: {
          number: fromWallet.name,
          new_balance: fromWallet.value - amount,
        },
        to_wallet: {
          number: toWallet.name,
          owner_name: toWallet.user.name,
        },
        timestamp: transaction.date.toISOString(),
      },
    });
  } catch (err) {
    return next(err);
  }
}



// /wallets/:id/topup  //
async function topupHandler(req, res, next) {
  try {
    const userId   = req.userId;                    // dari middleware
    const walletId = parseInt(req.params.id, 10);   // :id di URL
    const { amount, payment_method, reference_id } = req.body;

    // validasi input //
    if (!amount || amount < 10000) {
      return res.status(400).json({
        message: 'Invalid input provided.',
        errors : { amount: 'Amount must be greater than 10000' }
      });
    }

    // pastikan wallet milik user //
    const wallet = await prisma.wallet.findUnique({ where: { wallet_id: walletId } });
    if (!wallet || wallet.userId !== userId) {
      return res.status(404).json({ message: 'Wallet with the specified ID not found.' });
    }

    // simpan top-up berstatus pending  //
    const topup = await prisma.topup.create({
      data: {
        wallet_id      : wallet.wallet_id,
        user_id        : userId,
        amount,
        payment_method,
        reference_id,
        status         : 'pending',
        requested_at   : new Date()
      }
    });

    return res.status(202).json({
      message: 'Top-up request received and is pending approval.',
      data: {
        topup_id     : topup.topup_id,
        wallet_id    : wallet.name,        // contoh "WLT-..."
        amount       : topup.amount,
        status       : topup.status,
        requested_at : topup.requested_at.toISOString()
      }
    });
  } catch (err) { next(err); }
}

// GET  /topups  (ADMIN ONLY)  //
async function getTopupsHandler(req, res, next) {
  try {
    // cek role admin //
    if (req.userRole !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    // query params //
    const statusFilter = req.query.status;                    // pending|completed|rejected
    const page         = parseInt(req.query.page  || '1', 10);
    const limit        = parseInt(req.query.limit || '10', 10);
    const skip         = (page - 1) * limit;

    // hitung total items //
    const whereClause = statusFilter ? { status: statusFilter } : {};
    const totalItems  = await prisma.topup.count({ where: whereClause });
    if (!totalItems) {
      return res.status(404).json({ message: 'No one has topup' });
    }

    // ambil data top-up dengan relasi //
    const topups = await prisma.topup.findMany({
      where : whereClause,
      skip,
      take  : limit,
      orderBy: { requested_at: 'desc' },
      include: {
        wallet: { select: { name: true } },
        user  : { select: { uid: true, name: true, email: true } }
      }
    });

    // bentuk respons sesuai docs //
    const mapped = topups.map(t => ({
      topup_id   : t.topup_id,
      wallet_id  : t.wallet.name,
      user       : {
        id    : t.user.uid,
        name  : t.user.name,
        email : t.user.email
      },
      amount       : t.amount,
      status       : t.status,
      requested_at : t.requested_at.toISOString(),
      ...(t.status === 'completed' && {
        approved_by : t.approved_by ?? undefined,
        approved_at : t.approved_at?.toISOString() ?? undefined
      })
    }));

    return res.status(200).json({
      message: 'All top-up requests retrieved successfully',
      data   : mapped,
      pagination: {
        current_page   : page,
        total_pages    : Math.ceil(totalItems / limit),
        total_items    : totalItems,
        items_per_page : limit
      }
    });
  } catch (err) { next(err); }
}

export { transferHandler, topupHandler, getTopupsHandler };
