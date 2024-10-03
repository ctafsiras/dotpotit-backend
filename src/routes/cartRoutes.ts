import express from 'express';
import { addToCart, removeFromCart, getCart, sendBillEmail } from '../controllers/cartController';


const router = express.Router();


router.post('/add', addToCart);
router.delete('/remove/:productId', removeFromCart);
router.get('/', getCart);
router.post('/send-bill', sendBillEmail);

export default router;