import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as wishlistService from '../services/wishlistService';

export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const { productId } = req.body;
  const wishlist = await wishlistService.addToWishlist(userId, productId);
  res.json(wishlist);
});

export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const { productId } = req.params;
  const wishlist = await wishlistService.removeFromWishlist(userId, productId);
  res.json(wishlist);
});

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const wishlist = await wishlistService.getWishlist(userId);
  res.json(wishlist);
});