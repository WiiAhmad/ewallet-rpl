import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import toast from "react-hot-toast";

const MoveMoneyPage = () => {
  const [wallets, setWallets] = useState([]);
  const [formData, setFormData] = useState({
    fromWalletNumber: "",
    toWalletNumber: "",
    amount: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fetchWallets = useCallback(async () => {
    try {
      const response = await api.get("/wallets/me");
      const userWallets = response.data.data;
      setWallets(userWallets);

      const fromWalletParam = searchParams.get("from");
      if (
        fromWalletParam &&
        userWallets.some((w) => w.number === fromWalletParam)
      ) {
        setFormData((prev) => ({ ...prev, fromWalletNumber: fromWalletParam }));
      } else if (userWallets.length > 0) {
        setFormData((prev) => ({
          ...prev,
          fromWalletNumber: userWallets[0].number,
        }));
      }
    } catch (error) {
      toast.error("Gagal memuat daftar kantong.");
    }
  }, [searchParams]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fromWalletNumber, toWalletNumber, amount } = formData;

    if (!fromWalletNumber || !toWalletNumber || !amount) {
      toast.error("Semua kolom wajib diisi.");
      return;
    }
    if (fromWalletNumber === toWalletNumber) {
      toast.error("Tidak bisa memindahkan uang ke kantong yang sama.");
      return;
    }
    setIsLoading(true);
    try {
      // Backend menggunakan endpoint /wallets/transfer untuk ini
      // Kita hanya perlu memastikan `toWalletNumber` adalah nomor wallet milik sendiri
      await api.post("/wallets/transfer", {
        fromWalletId: fromWalletNumber, // Sesuai nama field di backend
        toWalletNumber: toWalletNumber,
        amount: parseFloat(amount),
        note: `Pindah dana dari ${fromWalletNumber} ke ${toWalletNumber}`,
      });
      toast.success("Dana berhasil dipindahkan!");
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memindahkan dana.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter daftar kantong tujuan agar tidak menampilkan kantong pengirim
  const destinationWallets = wallets.filter(
    (w) => w.number !== formData.fromWalletNumber
  );

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Pindah Uang</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="fromWalletNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Kantong Pengirim*
          </label>
          <select
            name="fromWalletNumber"
            id="fromWalletNumber"
            value={formData.fromWalletNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            {wallets.map((wallet) => (
              <option key={wallet.wallet_id} value={wallet.number}>
                {wallet.name} (Rp. {wallet.balance.toLocaleString("id-ID")})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="toWalletNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Kantong Penerima*
          </label>
          <select
            name="toWalletNumber"
            id="toWalletNumber"
            value={formData.toWalletNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="" disabled>
              Pilih kantong tujuan
            </option>
            {destinationWallets.map((wallet) => (
              <option key={wallet.wallet_id} value={wallet.number}>
                {wallet.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nominal*
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="1"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Nominal pemindahan uang"
          />
        </div>
        <div className="flex items-center justify-end space-x-4 pt-4">
          <Link
            to="/home"
            className="text-gray-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
          >
            {isLoading ? "Memindahkan..." : "Pindahkan Uang"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MoveMoneyPage;
