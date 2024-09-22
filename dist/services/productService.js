"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.getProductById = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const apiError_1 = require("../utils/apiError");
const prisma = new client_1.PrismaClient();
const getProducts = async (category, search) => {
    const where = {};
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
exports.getProducts = getProducts;
const getProductById = async (id) => {
    const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true },
    });
    if (!product) {
        throw new apiError_1.ApiError(404, 'Product not found');
    }
    return product;
};
exports.getProductById = getProductById;
const getCategories = async () => {
    return prisma.category.findMany();
};
exports.getCategories = getCategories;
