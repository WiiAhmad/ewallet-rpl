import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Handler untuk menampilkan riwayat transaksi user
 * Mendukung filter berdasarkan wallet_id, category, dan paginasi
 */
const getTransactionHistoryHandler = async (req, res, next) => {
  const uid = req.userId;
  const { wallet_id, category, page = 1, limit = 10 } = req.query;

  const take = parseInt(limit);
  const skip = (parseInt(page) - 1) * take;

  try {
    // Cek apakah user masih aktif
    const user = await prisma.user.findUnique({
      where: { uid },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Siapkan kondisi filter
    const whereClause = {
      uid,
    };

    if (wallet_id) {
      whereClause.wallet_id = parseInt(wallet_id);
    }

    if (category) {
      // Jika category berupa ID atau nama kategori
      whereClause.category = {
        name: category, // atau pakai ID kalau pakai angka
      };
    }

    // Hitung total data
    const totalItems = await prisma.transaction.count({ where: whereClause });

    // Ambil data transaksi
    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        category: true,
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
      type: tx.value < 0 ? "debit" : "credit",
      amount: Math.abs(tx.value),
      description: tx.description,
      status: tx.confirmed ? "completed" : "pending",
      created_at: tx.date,
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

export { getTransactionHistoryHandler };
