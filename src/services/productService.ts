import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/apiError';

const prisma = new PrismaClient();

export const getProducts = async (category?: string, search?: string) => {
  const where: any = {};

  if (category) {
    where.category = { name: category };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  return prisma.product.findMany({
    where,
    include: { category: true },
  });
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  return product;
};

export const getCategories = async () => {
  return prisma.category.findMany();
};