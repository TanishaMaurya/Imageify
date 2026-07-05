import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralized, validated environment configuration.
 * Fails fast at boot if a required variable is missing.
 */
const required = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable:`);
  }
  return value;
};

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:4200',

  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  hf: {
    token: process.env.HF_API_TOKEN,
    model: process.env.HF_MODEL || 'stabilityai/stable-diffusion-xl-base-1.0',
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },

  isProd: process.env.NODE_ENV === 'production',
};
