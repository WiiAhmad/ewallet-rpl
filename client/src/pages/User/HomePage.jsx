import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import toast from "react-hot-toast";
import TransactionItem from "../../components/user/TransactionItem"; // <-- Import komponen baru
import TopupsItem from "../../components/user/TopupsItem";

const WalletCard = ({ wallet }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
    <div>
      <h3 className="font-bold text-gray-800">{wallet.name}</h3>
      <p className="text-sm text-gray-500">{wallet.desc}</p>
      <p className="text-xs text-gray-500 mt-1">
        {wallet.number} {wallet.isMain ? "(Utama)" : ""}
      </p>
      <p className="text-sm text-gray-800 font-semibold mt-2">
        Rp. {wallet.balance.toLocaleString("id-ID")}
      </p>
    </div>
    <Link
      to={`/wallets/${wallet.wallet_id}`}
      className="text-green-600 font-semibold text-sm"
    >
      Lihat Detail
    </Link>
  </div>
);

const HomePage = () => {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [topups, setTopups] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const [walletsRes, transactionsRes, topupsRes] = await Promise.all([
        api.get("/wallets/me"),
        api.get("/transactions?limit=5"),
        api.get("/topups?limit=5"),
      ]);

      setWallets(walletsRes.data.data);
      setTransactions(transactionsRes.data.data);
      setTopups(topupsRes.data.data);

      const total = walletsRes.data.data.reduce(
        (sum, wallet) => sum + wallet.balance,
        0
      );
      setTotalBalance(total);
    } catch (error) {
      toast.error("Gagal memuat data.");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-8">
      {/* Saldo Section */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-500 text-sm">Total Uang</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">
          Rp. {totalBalance.toLocaleString("id-ID")}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Link
            to="/topup"
            className="flex items-center justify-center space-x-2 p-2 rounded hover:bg-gray-100"
          >
            <span className="font-semibold text-gray-700">Top Up</span>
          </Link>
          <Link
            to="/transfer"
            className="flex items-center justify-center space-x-2 p-2 rounded hover:bg-gray-100"
          >
            <span className="font-semibold text-gray-700">Kirim</span>
          </Link>
        </div>
      </section>

      {/* Daftar Dompet Section */}
      <section>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Daftar Dompet</h2>
            <Link
              to="/wallets/new"
              className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-green-700"
            >
              Tambah Baru
            </Link>
          </div>
          {wallets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wallets.map((wallet) => (
                <WalletCard key={wallet.wallet_id} wallet={wallet} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              Belum ada kantong dibuat. Silakan tambah baru.
            </p>
          )}
        </div>
      </section>

      {/* Riwayat Transaksi Section */}
      <section>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Riwayat Transaksi
            </h2>
            <Link
              to="/history"
              className="bg-green-100 text-green-700 font-bold py-2 px-4 rounded-lg text-sm hover:bg-green-200"
            >
              Lihat Semua
            </Link>
          </div>
          {transactions.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              Belum ada transaksi.
            </p>
          )}
        </div>
      </section>

      <section>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Riwayat Topups
            </h2>
            <Link
              to="/history"
              className="bg-green-100 text-green-700 font-bold py-2 px-4 rounded-lg text-sm hover:bg-green-200"
            >
              Lihat Semua
            </Link>
          </div>
          {topups.length > 0 ? (
            topups.map((topup) => (
              <TopupsItem key={topup.topup_id} topup={topup} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              Belum ada topup.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
