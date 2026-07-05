import { Router } from 'express';
import { imageController } from '../controllers/image.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { generateImageSchema } from '../validations/image.validation.js';

const router = Router();

router.use(protect); // all image routes require auth

router.post('/generate', validate(generateImageSchema), imageController.generate);
router.get('/history', imageController.history);
router.patch('/:id/favorite', imageController.toggleFavorite);
router.delete('/:id', imageController.remove);

export default router;
