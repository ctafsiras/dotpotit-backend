import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as cartService from '../services/cartService';

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const { productId, quantity } = req.body;
  const cart = await cartService.addToCart(userId, productId, quantity);
  res.json(cart);
});

export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const { productId } = req.params;
  const cart = await cartService.removeFromCart(userId, productId);
  res.json(cart);
});

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const cart = await cartService.getCart(userId);
  res.json(cart);
});