import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/ApiResponse.js';
import { generationService } from '../services/generation.service.js';
import { historyService } from '../services/history.service.js';

export const imageController = {
  generate: asyncHandler(async (req, res) => {
    const result = await generationService.generate(req.user.id, req.body);
    sendResponse(res, 201, 'Image generated successfully.', result);
  }),

  history: asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const search = (req.query.search || '').toString();
    const favoritesOnly = req.query.favorites === 'true';

    const result = await historyService.list(req.user.id, {
      page,
      limit,
      search,
      favoritesOnly,
    });
    sendResponse(res, 200, 'Image history fetched.', result);
  }),

  toggleFavorite: asyncHandler(async (req, res) => {
    const image = await historyService.toggleFavorite(req.user.id, req.params.id);
    sendResponse(res, 200, 'Favorite updated.', { image });
  }),

  remove: asyncHandler(async (req, res) => {
    const result = await historyService.remove(req.user.id, req.params.id);
    sendResponse(res, 200, result.message);
  }),
};
