import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createAuthHandler(req, res, next) {
  const payload = req.body;

  try {
    if (!payload.password) {
      throw new Error('Password must be filled!');
    }

    const user = await prisma.user.findUnique({
      where: { username: payload.username },
    });

    const isPasswordMatch = await bcrypt.compare(
      payload.password,
      user?.password?? ''
    );

    if (user === null || !isPasswordMatch) {
      throw new Error('Incorrect Username or Password!');
    }

    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    return res.status(200).json({
      status_code: 200,
      message: 'Login success',
      data: {
        token: token,
        uid: user.uid,
        username: user.username,
      },
    });
  } catch (err) {
    return next(err);
  }
};

export { createAuthHandler };