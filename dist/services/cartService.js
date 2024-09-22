"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCart = exports.removeFromCart = exports.addToCart = void 0;
const client_1 = require("@prisma/client");
const apiError_1 = require("../utils/apiError");
const prisma = new client_1.PrismaClient();
const addToCart = async (userId, productId, quantity) => {
    const cart = await prisma.cart.upsert({
        where: { userId },
        create: { userId },
        update: {},
        include: { items: true },
    });
    const existingItem = cart.items.find(item => item.productId === productId);
    if (existingItem) {
        await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity },
        });
    }
    else {
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity,
            },
        });
    }
    return (0, exports.getCart)(userId);
};
exports.addToCart = addToCart;
const removeFromCart = async (userId, productId) => {
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { items: true },
    });
    if (!cart) {
        throw new apiError_1.ApiError(404, 'Cart not found');
    }
    await prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id,
            productId,
        },
    });
    return (0, exports.getCart)(userId);
};
exports.removeFromCart = removeFromCart;
const getCart = async (userId) => {
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    product: {
                        include: {
                            category: true,
                        },
                    },
                },
            },
        },
    });
    if (!cart) {
        return { items: [] };
    }
    return cart;
};
exports.getCart = getCart;
