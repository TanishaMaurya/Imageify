import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/ApiResponse.js';
import { authService } from '../services/auth.service.js';

export const authController = {
  signup: asyncHandler(async (req, res) => {
    const result = await authService.signup(req.body);
    sendResponse(res, 201, 'Account created successfully.', result);
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    sendResponse(res, 200, 'Logged in successfully.', result);
  }),

  // JWT is stateless; logout is handled client-side by discarding the token.
  logout: asyncHandler(async (req, res) => {
    sendResponse(res, 200, 'Logged out successfully.');
  }),

  me: asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user.id);
    sendResponse(res, 200, 'Profile fetched.', { user });
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const user = await authService.updateProfile(req.user.id, req.body);
    sendResponse(res, 200, 'Profile updated.', { user });
  }),

  changePassword: asyncHandler(async (req, res) => {
    const result = await authService.changePassword(req.user.id, req.body);
    sendResponse(res, 200, result.message);
  }),
};
