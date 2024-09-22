import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/apiError';

const prisma = new PrismaClient();

export const addToWishlist = async (userId: string, productId: string) => {
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

  return getWishlist(userId);
};

export const removeFromWishlist = async (userId: string, productId: string) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!wishlist) {
    throw new ApiError(404, 'Wishlist not found');
  }

  await prisma.wishlistItem.deleteMany({
    where: {
      wishlistId: wishlist.id,
      productId,
    },
  });

  return getWishlist(userId);
};

export const getWishlist = async (userId: string) => {
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