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

  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification Successful</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #4CAF50; }
        p { margin-bottom: 20px; }
        .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>Email Verified Successfully!</h1>
      <p>Your email has been verified. You can now log in to your account.</p>
      <p>Click the button below to go to the login page:</p>
      <a href="/login" class="button">Go to Login</a>
    </body>
    </html>
  `);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const { user, token } = await authService.loginUser(email, password);

  res.json({ user, token });
});