import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Handler untuk menampilkan riwayat transaksi user. Mendukung filter berdasarkan wallet_id, category, dan paginasi
const getTransactionHistoryHandler = async (req, res, next) => {
  const uid = req.userId;
  const { wallet_id, category, page = 1, limit = 10 } = req.query;

  const take = parseInt(limit);
  const skip = (parseInt(page) - 1) * take;

  try {
    // Cek user
    const user = await prisma.user.findUnique({
      where: { uid },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kondisi filter
    const whereClause = {
      uid,
    };

    if (wallet_id) {
      whereClause.wallet_id = parseInt(wallet_id);
    }

    if (category) {
      // Jika category berupa ID atau nama kategori
      whereClause.type = {
        name: category, // atau pakai ID kalau pakai angka
      };
    }

    // Hitung total data
    const totalItems = await prisma.transaction.count({ where: whereClause });

    // Ambil data transaksi
    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        type: true,
        wallet: true,
      },
      orderBy: {
        date: "desc",
      },
      skip,
      take,
    });

    // Format hasil
    const formattedData = transactions.map((tx) => ({
      id: `txn_${tx.trans_id}`,
      type: tx.type?.name || (tx.amount < 0 ? "Debit" : "Credit"),
      amount: Math.abs(tx.amount),
      description: tx.description,
      status: "Completed",
      created_at: tx.date,
      detail: typeof tx.detail === "string" ? JSON.parse(tx.detail) : tx.detail,
    }));

    return res.status(200).json({
      message: "Transactions retrieved successfully",
      data: formattedData,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(totalItems / take),
        total_items: totalItems,
        items_per_page: take,
      },
    });
  } catch (err) {
    return next(err);
  }
};

// Handler untuk menampilkan semua riwayat transaksi
async function getAllTransactionsHandler(req, res, next) {
  try {
    if (!["Admin", "Owner"].includes(req.userRole)) {
      return res.status(403).json({ message: "Access Denied" });
    }
    const { page = 1, limit = 10 } = req.query;
    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;
    const totalItems = await prisma.transaction.count();
    const transactions = await prisma.transaction.findMany({
      include: {
        user: { select: { uid: true, name: true, email: true } },
        wallet: { select: { wallet_id: true, name: true, number: true } },
        type: true,
      },
      orderBy: { date: "desc" },
      skip,
      take,
    });
    return res.status(200).json({
      message: "All transactions",
      data: transactions,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(totalItems / take),
        total_items: totalItems,
        items_per_page: take,
      },
    });
  } catch (err) {
    return next(err);
  }
}

export { getTransactionHistoryHandler, getAllTransactionsHandler };
