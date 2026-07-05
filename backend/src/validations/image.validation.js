import { z } from 'zod';
import { IMAGE_STYLES, ASPECT_RATIOS } from '../config/constants.js';

export const generateImageSchema = z.object({
  prompt: z.string().trim().min(3, 'Prompt must be at least 3 characters').max(500),
  style: z.enum(IMAGE_STYLES, {
    errorMap: () => ({ message: `Style must be one of: ${IMAGE_STYLES.join(', ')}` }),
  }),
  aspectRatio: z.enum(ASPECT_RATIOS, {
    errorMap: () => ({ message: `Aspect ratio must be one of: ${ASPECT_RATIOS.join(', ')}` }),
  }),
});
