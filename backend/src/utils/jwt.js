import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Sign a JWT for an authenticated user.
 */
export const signToken = (payload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

/**
 * Verify a JWT and return its decoded payload.
 * Throws if invalid/expired.
 */
export const verifyToken = (token) => jwt.verify(token, env.jwtSecret);
