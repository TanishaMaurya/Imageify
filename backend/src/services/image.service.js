import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import {
  ASPECT_DIMENSIONS,
  STYLE_PROMPTS,
} from '../config/constants.js';

/**
 * Hugging Face Inference API image generation.
 *
 * The HF text-to-image endpoint returns raw image BYTES (not JSON).
 * We convert the bytes into a base64 data URL so it can be stored in
 * the database and rendered directly by the frontend without needing
 * separate file/object storage.
 *
 * Note on the free tier: models may be "cold" and return HTTP 503 with
 * an `estimated_time`. We retry a few times with backoff before failing.
 */
const HF_BASE = 'https://api-inference.huggingface.co/models';

const buildPrompt = (prompt, style) => {
  const suffix = STYLE_PROMPTS[style] || '';
  return suffix ? `${prompt}, ${suffix}` : prompt;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const imageService = {
  /**
   * Generate an image and return a base64 data URL string.
   * @returns {Promise<string>} data URL, e.g. "data:image/png;base64,..."
   */
  async generate({ prompt, style, aspectRatio }) {
    if (!env.hf.token) {
      throw ApiError.internal('Image generation is not configured (missing HF token).');
    }

    const { width, height } = ASPECT_DIMENSIONS[aspectRatio];
    const fullPrompt = buildPrompt(prompt, style);

    const payload = {
      inputs: fullPrompt,
      parameters: {
        width,
        height,
        negative_prompt: 'blurry, low quality, distorted, watermark, text',
      },
      options: { wait_for_model: true },
    };

    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      let response;
      try {
        response = await fetch(`${HF_BASE}/${env.hf.model}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.hf.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } catch {
        throw ApiError.internal('Could not reach the image generation service.');
      }

      // Model is still loading -> wait and retry.
      if (response.status === 503) {
        const body = await response.json().catch(() => ({}));
        const waitMs = Math.min((body.estimated_time || 15) * 1000, 30000);
        if (attempt < maxRetries - 1) {
          await sleep(waitMs);
          continue;
        }
        throw ApiError.internal(
          'The image model is warming up. Please try again in a moment.'
        );
      }

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        // 429 = rate limited on free tier
        if (response.status === 429) {
          throw new ApiError(429, 'Rate limit reached. Please wait and try again.');
        }
        throw ApiError.internal(
          `Image generation failed (${response.status}). ${text.slice(0, 200)}`
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/png';
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      return `data:${contentType};base64,${base64}`;
    }

    throw ApiError.internal('Image generation failed after multiple attempts.');
  },
};
