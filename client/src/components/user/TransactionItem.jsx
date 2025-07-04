import React from "react";

const getTransactionDetails = (tx) => {
  // Menentukan apakah transaksi merupakan pemasukan (Credit)
  const isCredit = tx.type === "Credit";
  let title = tx.description;

  // Logika sederhana untuk menentukan judul yang lebih mudah dibaca
  if (isCredit) {
    if (
      tx.description.toLowerCase().includes("topup") ||
      tx.description.toLowerCase().includes("top up")
    ) {
      title = "Top Up";
    } else if (tx.description.toLowerCase().includes("received from")) {
      title = "Pindah Dana";
    } else {
      title = "Pemasukan";
    }
  } else {
    // Jika bukan Credit, berarti Debit (pengeluaran)
    if (tx.description.toLowerCase().includes("transfer to")) {
      title = "Kirim dan Bayar";
    } else {
      title = "Pengeluaran";
    }
  }

  return {
    title,
    isCredit,
    // Backend saat ini hanya mengirim status "Completed", jadi kita anggap "Sukses".
    // UI ini siap untuk menampilkan "Gagal" jika data dari backend tersedia.
    isSuccess: tx.status === "Completed",
  };
};

const TransactionItem = ({ transaction }) => {
  const { title, isCredit, isSuccess } = getTransactionDetails(transaction);

  // Menentukan warna berdasarkan tipe transaksi (sesuai gambar)
  // Pemasukan (Top Up) = Hijau, Pengeluaran (Kirim) = Merah
  const amountColor = isCredit ? "text-green-600" : "text-red-600";
  const statusColor = isSuccess
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";
  const dotColor = isSuccess
    ? isCredit
      ? "bg-green-500"
      : "bg-red-500"
    : "bg-gray-400";

  return (
    <div className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center">
        {/* Indikator titik berwarna */}
        <div className={`w-2.5 h-2.5 rounded-full mr-4 ${dotColor}`}></div>
        <div>
          <p className="font-semibold text-gray-800 flex items-center">
            {title}
            {/* Status badge */}
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
            >
              {isSuccess ? "Sukses" : "Gagal"}
            </span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {/* Format tanggal yang lebih lengkap */}
            {new Date(transaction.created_at).toLocaleString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}{" "}
            | {transaction.description}
          </p>
        </div>
      </div>
      <p className={`font-bold text-base ${amountColor}`}>
        Rp. {transaction.amount.toLocaleString("id-ID")}
      </p>
    </div>
  );
};

export default TransactionItem;
