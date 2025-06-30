/*
  Warnings:

  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Wallet` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `Wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Category_name_key";

-- CreateTable
CREATE TABLE "Type" (
    "type_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "trans_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" INTEGER,
    "wallet_id" INTEGER NOT NULL,
    "value" REAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmedBy" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Transaction_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transaction_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet" ("wallet_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Transaction_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category" ("category_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("category_id", "date", "description", "trans_id", "value", "wallet_id") SELECT "category_id", "date", "description", "trans_id", "value", "wallet_id" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE TABLE "new_User" (
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
INSERT INTO "new_User" ("address", "email", "name", "password", "phone", "role", "uid") SELECT "address", "email", "name", "password", "phone", "role", "uid" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Wallet" (
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
INSERT INTO "new_Wallet" ("exp_date", "name", "wallet_id") SELECT "exp_date", "name", "wallet_id" FROM "Wallet";
DROP TABLE "Wallet";
ALTER TABLE "new_Wallet" RENAME TO "Wallet";
CREATE UNIQUE INDEX "Wallet_number_key" ON "Wallet"("number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
