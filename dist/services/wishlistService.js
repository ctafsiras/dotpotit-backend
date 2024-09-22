"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWishlist = exports.removeFromWishlist = exports.addToWishlist = void 0;
const client_1 = require("@prisma/client");
const apiError_1 = require("../utils/apiError");
const prisma = new client_1.PrismaClient();
const addToWishlist = async (userId, productId) => {
    const wishlist = await prisma.wishlist.upsert({
        where: { userId },
        create: { userId },
        update: {},
        include: { items: true },
    });
    const existingItem = wishlist.items.find(item => item.productId === productId);
    if (!existingItem) {
        await prisma.wishlistItem.create({
            data: {
                wishlistId: wishlist.id,
                productId,
            },
        });
    }
    return (0, exports.getWishlist)(userId);
};
exports.addToWishlist = addToWishlist;
const removeFromWishlist = async (userId, productId) => {
    const wishlist = await prisma.wishlist.findUnique({
        where: { userId },
        include: { items: true },
    });
    if (!wishlist) {
        throw new apiError_1.ApiError(404, 'Wishlist not found');
    }
    await prisma.wishlistItem.deleteMany({
        where: {
            wishlistId: wishlist.id,
            productId,
        },
    });
    return (0, exports.getWishlist)(userId);
};
exports.removeFromWishlist = removeFromWishlist;
const getWishlist = async (userId) => {
    const wishlist = await prisma.wishlist.findUnique({
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
    if (!wishlist) {
        return { items: [] };
    }
    return wishlist;
};
exports.getWishlist = getWishlist;
