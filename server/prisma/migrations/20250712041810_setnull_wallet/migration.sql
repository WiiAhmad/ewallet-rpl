-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Topup" (
    "topup_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wallet_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "payment_method" TEXT NOT NULL,
    "reference_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "requested_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_by" INTEGER,
    "approved_at" DATETIME,
    "admin_notes" TEXT,
    CONSTRAINT "Topup_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet" ("wallet_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Topup_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Topup_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "User" ("uid") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Topup" ("admin_notes", "amount", "approved_at", "approved_by", "payment_method", "reference_id", "requested_at", "status", "topup_id", "user_id", "wallet_id") SELECT "admin_notes", "amount", "approved_at", "approved_by", "payment_method", "reference_id", "requested_at", "status", "topup_id", "user_id", "wallet_id" FROM "Topup";
DROP TABLE "Topup";
ALTER TABLE "new_Topup" RENAME TO "Topup";
CREATE TABLE "new_Transaction" (
    "trans_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" INTEGER,
    "wallet_id" INTEGER,
    "amount" REAL NOT NULL,
    "type_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "detail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Transaction_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transaction_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet" ("wallet_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transaction_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "Type" ("type_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("amount", "createdAt", "date", "description", "detail", "trans_id", "type_id", "uid", "updatedAt", "wallet_id") SELECT "amount", "createdAt", "date", "description", "detail", "trans_id", "type_id", "uid", "updatedAt", "wallet_id" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
