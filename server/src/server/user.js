import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get current user info
async function getMeHandler(req, res, next) {
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
async function putUserHandler(req, res, next) {
  try {

  } catch (err) {
    return next(err);
  }
}

export { getMeHandler };