import { useState, useEffect, useCallback } from "react";
import api from "../../api/axiosConfig";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const TopupRequestRow = ({ topup, onApprove }) => (
  <tr className="bg-white border-b">
    <td className="py-4 px-6 text-sm font-medium text-gray-900">
      {topup.topup_id}
    </td>
    <td className="py-4 px-6 text-sm text-gray-500">
      {topup.user.name} ({topup.user.email})
    </td>
    <td className="py-4 px-6 text-sm text-gray-500">
      Rp. {topup.amount.toLocaleString("id-ID")}
    </td>
    <td className="py-4 px-6 text-sm text-gray-500">
      {new Date(topup.requested_at).toLocaleString("id-ID")}
    </td>
    <td className="py-4 px-6 text-sm">
      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
        {topup.status}
      </span>
    </td>
    <td className="py-4 px-6 text-sm font-medium">
      <button
        onClick={() => onApprove(topup.topup_id)}
        className="text-green-600 hover:text-green-900"
      >
        Approve
      </button>
      {/* Tambahkan tombol Reject jika perlu */}
    </td>
  </tr>
);

const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const [topups, setTopups] = useState([]);

  const fetchTopups = useCallback(async () => {
    try {
      // Ambil hanya yang statusnya "Pending"
      const res = await api.get("/admin/topups?status=Pending");
      setTopups(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch top-up requests.");
    }
  }, []);

  useEffect(() => {
    fetchTopups();
  }, [fetchTopups]);

  const handleApprove = async (topupId) => {
    if (!window.confirm("Are you sure you want to approve this top-up?"))
      return;

    try {
      await api.post(`/topups/${topupId}/approve`, { admin_notes: "Approved" });
      toast.success("Top-up approved successfully!");
      fetchTopups(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve top-up.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <div>
            <span className="font-semibold">
              {user?.name} ({user?.role})
            </span>
            <button onClick={logout} className="ml-4 text-sm text-red-600">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold mb-4">
            Pending Top-up Requests
          </h2>
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="py-3 px-6">
                    ID
                  </th>
                  <th scope="col" className="py-3 px-6">
                    User
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Amount
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Requested At
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Status
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {topups.length > 0 ? (
                  topups.map((topup) => (
                    <TopupRequestRow
                      key={topup.topup_id}
                      topup={topup}
                      onApprove={handleApprove}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No pending requests.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
