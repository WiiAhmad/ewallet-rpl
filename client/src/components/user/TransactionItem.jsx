import React from "react";

// Helper function to get display details from a transaction object
const getTransactionDetails = (tx) => {
  const isCredit = tx.type === "Credit";
  let title = tx.description;

  // Simplified logic for a more readable title
  const descriptionLower = tx.description.toLowerCase();
  if (isCredit) {
    if (descriptionLower.includes("topup") || descriptionLower.includes("top up")) {
      title = "Top Up";
    } else if (descriptionLower.includes("received from")) {
      title = "Dana Diterima";
    } else {
      title = "Pemasukan";
    }
  } else { // Debit
    if (descriptionLower.includes("transfer to")) {
      title = "Kirim Dana";
    } else {
      title = "Pengeluaran";
    }
  }

  return {
    title,
    isCredit,
    isSuccess: tx.status === "Completed",
  };
};

const TransactionItem = ({ transaction }) => {
  const { title, isCredit, isSuccess } = getTransactionDetails(transaction);

  // Parse transaction.detail string into an object
  // Use a try-catch block to prevent errors if the detail is not valid JSON
  let detail = null;
  if (transaction.detail && typeof transaction.detail === 'string') {
    try {
      detail = JSON.parse(transaction.detail);
    } catch (error) {
      console.error("Failed to parse transaction detail:", error);
      // Fallback to display the raw string if parsing fails
      detail = transaction.detail;
    }
  }


  // Define colors based on transaction type and status
  const amountColor = isCredit ? "text-green-600" : "text-red-600";
  const statusColor = isSuccess ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  const dotColor = isSuccess ? (isCredit ? "bg-green-500" : "bg-red-500") : "bg-gray-400";

  return (
    <div className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center">
        {/* Color dot indicator */}
        <div className={`w-2.5 h-2.5 rounded-full mr-4 flex-shrink-0 ${dotColor}`}></div>
        
        <div>
          <p className="font-semibold text-gray-800 flex items-center">
            {title}
            {/* Status badge */}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
              {isSuccess ? "Sukses" : "Gagal"}
            </span>
          </p>
          
          <p className="text-sm text-gray-500 mt-1">
            {/* Format date for better readability */}
            {new Date(transaction.created_at).toLocaleString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          {/* Display parsed details if they exist */}
          {detail && typeof detail === "object" ? (
            <div className="text-xs text-gray-600 mt-1 space-y-0.5">
              {detail.from_wallet_number && (
                <div>
                  <span className="font-semibold">Dari:</span> {detail.from_wallet_number} ({detail.sender_name || 'N/A'})
                </div>
              )}
              {detail.to_wallet_number && (
                <div>
                  <span className="font-semibold">Ke:</span> {detail.to_wallet_number} ({detail.receiver_name || 'N/A'})
                </div>
              )}
            </div>
          ) : (
             <p className="text-sm text-gray-500 mt-1">{transaction.description}</p>
          )}
        </div>
      </div>
      
      <p className={`font-bold text-base whitespace-nowrap ${amountColor}`}>
         {isCredit ? '+' : '-'} Rp{transaction.amount.toLocaleString("id-ID")}
      </p>
    </div>
  );
};

export default TransactionItem;