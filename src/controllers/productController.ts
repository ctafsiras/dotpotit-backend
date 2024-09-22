import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as productService from '../services/productService';

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const { category, search } = req.query;
  const products = await productService.getProducts(category as string | undefined, search as string | undefined);
  res.json(products);
});

export const getProductDetails = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productService.getProductById(id);
  res.json(product);
});

export const listCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await productService.getCategories();
  res.json(categories);
});