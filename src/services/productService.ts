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

export const createCategory = async (name: string) => {
  const category = await prisma.category.create({
    data: {
      name,
    },
  });

  return category;
};

export const createProduct = async (name: string, description: string, price: number, categoryId: string, imageUrl: string) => {
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      categoryId,
      imageUrl,
    },
  });

  return product;
};
