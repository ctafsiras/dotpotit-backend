import express from 'express';
import * as wishlistController from '../controllers/wishlistController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.use(authenticate);

router.post('/add', wishlistController.addToWishlist);
router.delete('/remove/:productId', wishlistController.removeFromWishlist);
router.get('/', wishlistController.getWishlist);

export default router;