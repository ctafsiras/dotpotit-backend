import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as cartService from '../services/cartService';
import { sendEmail, generatePDF } from '../services/emailService';

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

export const sendBillEmail = async (req: Request, res: Response) => {
  try {
    const { email, user } = req.body;
    const cartItems = await cartService.getCartItems(req.user?.userId!);
    
    const pdfBuffer = await generatePDF(user, cartItems, () => cartService.calculateTotal(cartItems));
    
    const emailText = `
      <h1>Your Bill</h1>
      <p>Thank you for your order. Please find your bill attached to this email.</p>
      <h2>Order Summary</h2>
      <ul>
        ${cartItems.map((item: any) => `<li>${item.product.name} (x${item.quantity}) - $${(item.product.price * item.quantity).toFixed(2)}</li>`).join('')}
      </ul>
      <p><strong>Total: $${cartService.calculateTotal(cartItems).toFixed(2)}</strong></p>
    `;

    await sendEmail(
      email,
      'Your Order Bill',
      emailText,
      [{ filename: 'bill.pdf', content: pdfBuffer }]
    );

    res.status(200).json({ message: 'Bill email sent successfully' });
  } catch (error) {
    console.error('Error sending bill email:', error);
    res.status(500).json({ error: 'Failed to send bill email' });
  }
};