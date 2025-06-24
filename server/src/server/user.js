import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create a new user
async function createUserHandler(req, res, next) {
  const payload = req.body;

  try {
    if (!payload.username || !payload.password) {
      return res.status(400).json({
        status_code: 400,
        message: 'Username and password are required',
      });
    }

    // Check if user with the same username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: payload.username },
    });

    if (existingUser) {
      return res.status(400).json({
        status_code: 400,
        message: 'Username already exists',
      });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        username: payload.username,
        password: hashedPassword,
        email: payload.email || null,
      },
    });

    return res.status(201).json({
      status_code: 201,
      message: 'User created successfully',
      data: {
        uid: newUser.uid,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    return next(err);
  }
}

// Get user by UID
async function getUserByIdHandler(req, res, next) {
  const { uid } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { uid: Number(uid) },
    });

    if (!user) {
      return res.status(404).json({
        status_code: 404,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      status_code: 200,
      message: 'User found',
      data: {
        uid: user.uid,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    return next(err);
  }
}

// Delete user by UID
async function deleteUserByIdHandler(req, res, next) {
  const { uid } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { uid: Number(uid) },
    });

    if (!user) {
      return res.status(404).json({
        status_code: 404,
        message: 'User not found',
      });
    }

    await prisma.user.delete({
      where: { uid: Number(uid) },
    });

    return res.status(200).json({
      status_code: 200,
      message: 'User deleted successfully',
    });
  } catch (err) {
    return next(err);
  }
}

export { createUserHandler, getUserByIdHandler, deleteUserByIdHandler };