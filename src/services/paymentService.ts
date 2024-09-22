import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { ApiError } from '../utils/apiError';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export const createPaymentIntent = async (userId: string, cart: any) => {
  const totalAmount = cart.items.reduce((total: number, item: any) => {
    return total + item.product.price * item.quantity;
  }, 0);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalAmount * 100), // Stripe expects amount in cents
    currency: 'usd',
    metadata: { userId },
  });

  return { clientSecret: paymentIntent.client_secret };
};

export const confirmPayment = async (userId: string, paymentIntentId: string) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    throw new ApiError(400, 'Payment not successful');
  }

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount: paymentIntent.amount / 100, // Convert back to dollars
      status: 'completed',
      paymentIntent: paymentIntentId,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  // Clear the cart after successful order
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  return order;
};

export const getPaymentHistory = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const generateInvoice = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Generate a simple invoice object
  // In a real-world scenario, you might use a library like PDFKit to generate a PDF invoice
  const invoice = {
    orderId: order.id,
    date: order.createdAt,
    items: order.items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    })),
    totalAmount: order.totalAmount,
  };

  return invoice;
};