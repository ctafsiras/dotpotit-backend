"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoice = exports.getPaymentHistory = exports.confirmPayment = exports.createPaymentIntent = void 0;
const client_1 = require("@prisma/client");
const stripe_1 = __importDefault(require("stripe"));
const apiError_1 = require("../utils/apiError");
const prisma = new client_1.PrismaClient();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
const createPaymentIntent = async (userId, cart) => {
    const totalAmount = cart.items.reduce((total, item) => {
        return total + item.product.price * item.quantity;
    }, 0);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Stripe expects amount in cents
        currency: 'usd',
        metadata: { userId },
    });
    return { clientSecret: paymentIntent.client_secret };
};
exports.createPaymentIntent = createPaymentIntent;
const confirmPayment = async (userId, paymentIntentId) => {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
        throw new apiError_1.ApiError(400, 'Payment not successful');
    }
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } },
    });
    if (!cart) {
        throw new apiError_1.ApiError(404, 'Cart not found');
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
exports.confirmPayment = confirmPayment;
const getPaymentHistory = async (userId) => {
    return prisma.order.findMany({
        where: { userId },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
    });
};
exports.getPaymentHistory = getPaymentHistory;
const generateInvoice = async (userId, orderId) => {
    const order = await prisma.order.findFirst({
        where: { id: orderId, userId },
        include: { items: { include: { product: true } } },
    });
    if (!order) {
        throw new apiError_1.ApiError(404, 'Order not found');
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
exports.generateInvoice = generateInvoice;
