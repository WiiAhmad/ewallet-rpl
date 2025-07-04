import { useState, useEffect, useCallback } from "react";
import api from "../../api/axiosConfig";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

// Komponen-komponen kecil bisa didefinisikan di sini atau diimpor dari file lain
const WalletCard = ({ wallet }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
    <div>
      <h3 className="font-bold text-gray-800">{wallet.name}</h3>
      <p className="text-sm text-gray-500">{wallet.desc}</p>
      <p className="text-sm text-gray-800 font-semibold mt-2">
        Rp. {wallet.balance.toLocaleString("id-ID")}
      </p>
    </div>
    <a href="#" className="text-green-600 font-semibold text-sm">
      Lihat Detail
    </a>
  </div>
);

const TransactionItem = ({ tx }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-200">
    <div>
      <p className="font-semibold text-gray-800">{tx.description}</p>
      <p className="text-xs text-gray-500">
        {new Date(tx.created_at).toLocaleString("id-ID")}
      </p>
    </div>
    <p
      className={`font-semibold ${
        tx.amount > 0 ? "text-green-600" : "text-red-600"
      }`}
    >
      {tx.amount > 0 ? "+" : "-"} Rp.{" "}
      {Math.abs(tx.amount).toLocaleString("id-ID")}
    </p>
  </div>
);

const HomePage = () => {
  const { user, logout } = useAuth();
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const [walletsRes, transactionsRes] = await Promise.all([
        api.get("/wallets/me"),
        api.get("/transactions?limit=5"), // Ambil 5 transaksi terbaru
      ]);

      const fetchedWallets = walletsRes.data.data;
      setWallets(fetchedWallets);
      setTransactions(transactionsRes.data.data);

      // Hitung total saldo
      const total = fetchedWallets.reduce(
        (sum, wallet) => sum + wallet.balance,
        0
      );
      setTotalBalance(total);
    } catch (error) {
      toast.error("Failed to fetch data.");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">e-wal</h1>
          <nav className="flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-green-600">
              Home
            </a>
            <a
              href="#"
              className="text-green-600 font-bold border-b-2 border-green-600 pb-1"
            >
              Riwayat Trx
            </a>
            <a href="#" className="text-gray-600 hover:text-green-600">
              Support
            </a>
          </nav>
          <div className="flex items-center">
            <span className="font-semibold">{user?.name}</span>
            <button onClick={logout} className="ml-4 text-sm text-red-600">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Saldo Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm">Total Uang</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            Rp. {totalBalance.toLocaleString("id-ID")}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              {/* Icon SVG */}
              <span className="font-semibold text-gray-700">Top Up</span>
            </button>
            <button className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
              {/* Icon SVG */}
              <span className="font-semibold text-gray-700">Kirim</span>
            </button>
          </div>
        </section>

        {/* Daftar Dompet Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Daftar Dompet</h2>
            <button className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-green-700">
              Tambah Baru
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wallets.map((wallet) => (
              <WalletCard key={wallet.wallet_id} wallet={wallet} />
            ))}
          </div>
          <div className="text-center mt-4">
            <a href="#" className="text-green-600 font-semibold text-sm">
              Lihat Semua
            </a>
          </div>
        </section>

        {/* Riwayat Transaksi Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Riwayat Transaksi
            </h2>
            <a
              href="#"
              className="bg-green-100 text-green-700 font-bold py-2 px-4 rounded-lg text-sm hover:bg-green-200"
            >
              Lihat Semua
            </a>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            {transactions.map((tx) => (
              <TransactionItem key={tx.id} tx={tx} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 text-gray-500 text-sm mt-8">
        <p>PT Ewall Tumbuh Abadi</p>
        <p>
          Berizin dan diawasi{" "}
          <span className="font-bold">Otoritas Jasa Keuangan</span>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
