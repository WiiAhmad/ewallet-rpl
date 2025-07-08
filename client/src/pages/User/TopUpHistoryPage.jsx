import { useState, useEffect, useCallback } from "react";
import api from "../../api/axiosConfig";
import toast from "react-hot-toast";
import TopupsItem from "../../components/user/TopupsItem";
import { Link } from "react-router-dom";

const TopUpHistoryPage = () => {
  const [topups, setTopups] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTopups = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page,
          limit: 10,
        });
        if (filters.status) params.append("status", filters.status);

        const response = await api.get("/topups", { params });
        let filteredData = response.data.data;

        // Filter tanggal di frontend jika backend belum support
        if (filters.startDate && filters.endDate) {
          const start = new Date(filters.startDate);
          const end = new Date(filters.endDate);
          end.setHours(23, 59, 59, 999);

          filteredData = filteredData.filter((topup) => {
            const tDate = new Date(topup.requested_at);
            return tDate >= start && tDate <= end;
          });
        }

        setTopups(filteredData);
        setPagination(response.data.pagination);
      } catch (error) {
        toast.error("Gagal memuat riwayat topup.");
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchTopups(currentPage);
  }, [fetchTopups, currentPage]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTopups(1);
  };

  const handleReset = () => {
    setFilters({ status: "", startDate: "", endDate: "" });
    setCurrentPage(1);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Top Up</h1>
        <Link to="/home" className="text-green-600 hover:underline">
          Kembali ke Home
        </Link>
      </div>
      {/* Filter Section */}
      <form
        onSubmit={handleFilterSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 items-end"
      >
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            name="status"
            id="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Semua</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tanggal Mulai
          </label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tanggal Akhir
          </label>
          <input
            type="date"
            name="endDate"
            id="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"
          >
            Filter
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Topup List */}
      <div>
        {isLoading ? (
          <p className="text-center py-4">Memuat...</p>
        ) : topups.length > 0 ? (
          topups.map((topup) => <TopupsItem key={topup.topup_id} topup={topup} />)
        ) : (
          <p className="text-center py-4 text-gray-500">
            Tidak ada topup yang cocok dengan filter Anda.
          </p>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <span>
            Halaman {pagination.current_page} dari {pagination.total_pages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(pagination.total_pages, p + 1))
            }
            disabled={currentPage === pagination.total_pages}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
};

export default TopUpHistoryPage;
