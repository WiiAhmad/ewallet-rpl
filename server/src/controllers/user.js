import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Ambil informasi user
async function getUserHandler(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { uid: req.userId },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({
      message: 'User Found successful',
      data: {
        id: user.uid,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address
      }
    });
  } catch (err) {
    return next(err);
  }
}

// Update user profile
async function updateUserHandler(req, res, next) {
  const id = req.userId;
  const payload = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { uid: id },
    });
    if (!user) {
      return res.status(404).json({ message: 'Invalid User' });
    }
    const updateData = {};
    if (payload.name) updateData.name = payload.name;
    if (payload.phone) updateData.phone = payload.phone;
    // Hanya update email jika ada masukkan
    if (payload.email !== undefined && payload.email !== '') updateData.email = payload.email;
    if (payload.address) updateData.address = payload.address;
    const updatedUser = await prisma.user.update({
      where: { uid: id },
      data: updateData,
    });

    return res.status(200).json({
      message: 'Update successful',
      data: {
        id: updatedUser.uid,
        name: updatedUser.name,
        phone: updatedUser.phone,
        email: updatedUser.email,
        address: updatedUser.address,
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function getAllUsersHandler(req, res, next) {
  try {
    // Hanya Admin dan Owner
    if (!["Admin", "Owner"].includes(req.userRole)) {
      return res.status(403).json({ message: "Access Denied" });
    }
    const users = await prisma.user.findMany({
      select: { uid: true, name: true, email: true, role: true, createdAt: true }
    });
    return res.status(200).json({ message: 'All users', data: users });
  } catch (err) {
    return next(err);
  }
}

export { getUserHandler, updateUserHandler, getAllUsersHandler };