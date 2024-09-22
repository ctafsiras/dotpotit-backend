import express from 'express';
import * as productController from '../controllers/productController';

const router = express.Router();

router.get('/', productController.listProducts);
router.get('/categories', productController.listCategories);
router.get('/:id', productController.getProductDetails);

export default router;