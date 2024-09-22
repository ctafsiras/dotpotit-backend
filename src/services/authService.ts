import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ApiError } from '../utils/apiError';
import * as emailService from './emailService';

const prisma = new PrismaClient();

export const createUser = async (email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(400, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
};

export const generateVerificationToken = async (userId: string) => {
  const token = crypto.randomBytes(32).toString('hex');
  await prisma.user.update({
    where: { id: userId },
    data: { verificationToken: token },
  });
  return token;
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `https://dotpotit-backend.vercel.app/api/auth/verify-email/${token}`;
  await emailService.sendEmail(
    email,
    'Verify Your Email Address',
    `
    <!DOCTYPE html>
    <html lang="en">
    <body>
        <p>Please click the button below to verify your email:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify</a>
    </body>
    </html>
    `
  );
};

export const verifyEmail = async (token: string) => {
  const user = await prisma.user.findFirst({ where: { verificationToken: token } });
  if (!user) {
    throw new ApiError(400, 'Invalid verification token');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true, verificationToken: null },
  });
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }



  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  if (!user.isVerified) {
    throw new ApiError(401, 'Please verify your email before logging in');
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  });

  return { user: { id: user.id, email: user.email }, token };
};