import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  signupSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../validations/auth.validation.js';

const router = Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', protect, authController.logout);

// Profile
router.get('/me', protect, authController.me);
router.patch('/profile', protect, validate(updateProfileSchema), authController.updateProfile);
router.patch(
  '/change-password',
  protect,
  validate(changePasswordSchema),
  authController.changePassword
);

export default router;
