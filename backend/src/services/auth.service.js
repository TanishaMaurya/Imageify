import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { signToken } from '../utils/jwt.js';
import { ApiError } from '../utils/ApiError.js';

const SALT_ROUNDS = 10;

// Fields safe to return to the client (never the password).
const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  credits: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export const authService = {
  async signup({ name, email, password }) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw ApiError.conflict('An account with this email already exists.');
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: { name, email, password: hashed }, // credits default to 10
      select: publicUserSelect,
    });

    const token = signToken({ id: user.id, role: user.role });
    return { user, token };
  },

  async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const token = signToken({ id: user.id, role: user.role });
    const { password: _pw, ...safeUser } = user;
    return { user: safeUser, token };
  },

  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: publicUserSelect,
    });
    if (!user) throw ApiError.notFound('User not found.');
    return user;
  },

  async updateProfile(userId, { name, email }) {
    if (email) {
      const taken = await prisma.user.findFirst({
        where: { email, NOT: { id: userId } },
      });
      if (taken) throw ApiError.conflict('Email is already in use.');
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { ...(name && { name }), ...(email && { email }) },
      select: publicUserSelect,
    });
    return user;
  },

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.notFound('User not found.');

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) throw ApiError.badRequest('Current password is incorrect.');

    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
    return { message: 'Password updated successfully.' };
  },
};
