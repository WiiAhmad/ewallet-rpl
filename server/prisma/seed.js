import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import random from "random-string-generator";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin12345", 10);
  const ownerPassword = await bcrypt.hash("owner12345", 10);
  const userPassword = await bcrypt.hash("user12345", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@ewallet.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@ewallet.com",
      password: adminPassword,
      role: "Admin",
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: "owner@ewallet.com" },
    update: {},
    create: {
      name: "Owner",
      email: "owner@ewallet.com",
      password: ownerPassword,
      role: "Owner",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@ewallet.com" },
    update: {},
    create: {
      name: "User",
      email: "user@ewallet.com",
      password: userPassword,
      role: "User",
    },
  });

  // Seed wallets for each user
  const mainWalletNumber = random(8, 'uppernumeric');
    await prisma.wallet.create({
      data: {
        name: 'Main',
        number: mainWalletNumber,
        desc: 'Default main wallet',
        uid: user.uid,
        // Optionally add a flag here if you add it to schema, e.g. isMain: true
      }
    });

  // Type
  await prisma.type.upsert({
    where: { name: "Debit" },
    update: {},
    create: { name: "Debit" },
  });

  await prisma.type.upsert({
    where: { name: "Credit" },
    update: {},
    create: { name: "Credit" },
  });

  console.log("Seeded admin and owner users, and types Debit/Credit.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });