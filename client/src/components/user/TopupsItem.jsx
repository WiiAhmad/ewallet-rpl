import React from "react";

const TopupsItem = ({ topup }) => {
  return (
    <div className="flex justify-between items-center border-b border-gray-100 py-3">
      <div>
        <div className="font-semibold text-gray-800">
          {topup.wallet?.name || "-"} ({topup.wallet?.number || "-"})
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {new Date(topup.requested_at).toLocaleString("id-ID")}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Metode: {topup.payment_method}
        </div>
        {topup.reference_id && (
          <div className="text-xs text-gray-400">Ref: {topup.reference_id}</div>
        )}
        {topup.admin_notes && (
          <div className="text-xs text-yellow-700 mt-1">Catatan Admin: {topup.admin_notes}</div>
        )}
      </div>
      <div className="text-right">
        <div className={`font-bold text-lg ${topup.status === "Completed" ? "text-green-600" : topup.status === "Pending" ? "text-yellow-600" : "text-red-600"}`}>
          Rp. {topup.amount.toLocaleString("id-ID")}
        </div>
        <div className={`text-xs font-semibold ${topup.status === "Completed" ? "text-green-600" : topup.status === "Pending" ? "text-yellow-600" : "text-red-600"}`}>{topup.status}</div>
      </div>
    </div>
  );
};

export default TopupsItem;
