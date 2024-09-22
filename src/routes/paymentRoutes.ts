import express from 'express';
import * as paymentController from '../controllers/paymentController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.use(authenticate);

router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.post('/confirm-payment', paymentController.confirmPayment);
router.get('/history', paymentController.getPaymentHistory);
router.get('/invoice/:orderId', paymentController.generateInvoice);

export default router;