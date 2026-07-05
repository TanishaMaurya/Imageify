/**
 * Application-wide constants.
 */

// Credit packages available for purchase (amount is in INR rupees).
// `amount` is stored/charged in paise by Razorpay, so we multiply by 100 there.
export const CREDIT_PACKAGES = [
  { id: 'pack_99', amount: 99, credits: 100, label: 'Starter' },
  { id: 'pack_299', amount: 299, credits: 350, label: 'Popular' },
  { id: 'pack_499', amount: 499, credits: 700, label: 'Pro' },
];

export const getPackageById = (id) =>
  CREDIT_PACKAGES.find((p) => p.id === id);

// Allowed image generation options (validated against user input).
export const IMAGE_STYLES = ['Realistic', 'Anime', 'Digital Art', 'Sketch'];
export const ASPECT_RATIOS = ['1:1', '16:9', '9:16'];

// Map aspect ratio -> pixel dimensions passed to the model.
export const ASPECT_DIMENSIONS = {
  '1:1': { width: 1024, height: 1024 },
  '16:9': { width: 1024, height: 576 },
  '9:16': { width: 576, height: 1024 },
};

// Style -> prompt suffix, injected to steer the model.
export const STYLE_PROMPTS = {
  Realistic: 'photorealistic, highly detailed, 8k, professional photography',
  Anime: 'anime style, vibrant colors, studio ghibli inspired, cel shaded',
  'Digital Art': 'digital art, concept art, trending on artstation, detailed',
  Sketch: 'pencil sketch, black and white, hand-drawn, detailed line art',
};
