import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin12345", 10);
  const ownerPassword = await bcrypt.hash("owner12345", 10);

  await prisma.user.upsert({
    where: { email: "admin@ewallet.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@ewallet.com",
      password: adminPassword,
      role: "Admin",
    },
  });

  await prisma.user.upsert({
    where: { email: "owner@ewallet.com" },
    update: {},
    create: {
      name: "Owner",
      email: "owner@ewallet.com",
      password: ownerPassword,
      role: "Owner",
    },
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