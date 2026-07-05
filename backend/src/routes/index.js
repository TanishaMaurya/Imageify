import { Router } from 'express';
import authRoutes from './auth.routes.js';
import imageRoutes from './image.routes.js';
import paymentRoutes from './payment.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/images', imageRoutes);
router.use('/payments', paymentRoutes);

export default router;
