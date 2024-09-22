import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as paymentService from '../services/paymentService';
import * as cartService from '../services/cartService';

export const createPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const cart = await cartService.getCart(userId);
  const paymentIntent = await paymentService.createPaymentIntent(userId, cart);
  res.json(paymentIntent);
});

export const confirmPayment = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const { paymentIntentId } = req.body;
  const order = await paymentService.confirmPayment(userId, paymentIntentId);
  res.json(order);
});

export const getPaymentHistory = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const history = await paymentService.getPaymentHistory(userId);
  res.json(history);
});

export const generateInvoice = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const { orderId } = req.params;
  const invoice = await paymentService.generateInvoice(userId, orderId);
  res.json(invoice);
});