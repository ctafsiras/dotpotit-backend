import express from 'express';
import * as cartController from '../controllers/cartController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.use(authenticate);

router.post('/add', cartController.addToCart);
router.delete('/remove/:productId', cartController.removeFromCart);
router.get('/', cartController.getCart);

export default router;