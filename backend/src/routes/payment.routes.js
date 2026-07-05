import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createOrderSchema,
  verifyPaymentSchema,
} from '../validations/payment.validation.js';

const router = Router();

router.get('/packages', paymentController.packages); // public
router.use(protect);
router.post('/order', validate(createOrderSchema), paymentController.createOrder);
router.post('/verify', validate(verifyPaymentSchema), paymentController.verify);
router.get('/transactions', paymentController.transactions);

export default router;
