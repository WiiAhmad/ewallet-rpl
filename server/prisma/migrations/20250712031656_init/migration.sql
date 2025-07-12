-- CreateTable
CREATE TABLE "User" (
    "uid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT,
    "role" TEXT NOT NULL DEFAULT 'User',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Wallet" (
    "wallet_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "balance" REAL NOT NULL DEFAULT 0,
    "desc" TEXT,
    "exp_date" DATETIME,
    "uid" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Wallet_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "trans_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" INTEGER,
    "wallet_id" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "type_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "detail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Transaction_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transaction_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet" ("wallet_id") ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT "Transaction_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "Type" ("type_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Type" (
    "type_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Topup" (
    "topup_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wallet_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "payment_method" TEXT NOT NULL,
    "reference_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "requested_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_by" INTEGER,
    "approved_at" DATETIME,
    "admin_notes" TEXT,
    CONSTRAINT "Topup_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet" ("wallet_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Topup_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Topup_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "User" ("uid") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_number_key" ON "Wallet"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Type_name_key" ON "Type"("name");
