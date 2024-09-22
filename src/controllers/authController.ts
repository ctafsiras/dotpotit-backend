import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import * as authService from '../services/authService';

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await authService.createUser(email, password);
  const verificationToken = await authService.generateVerificationToken(user.id);

  await authService.sendVerificationEmail(email, verificationToken);

  res.status(201).json({ message: 'User created. Please check your email for verification.' });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;

  await authService.verifyEmail(token);

  res.json({ message: 'Email verified successfully. You can now log in.' });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const { user, token } = await authService.loginUser(email, password);

  res.json({ user, token });
});