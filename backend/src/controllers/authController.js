import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { errorResponse, successResponse } from '../utils/response.js';
import { generateId, memoryStore, getSafeUser, nowIso } from '../config/store.js';

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array()[0].msg);
    }

    const { name, email, password } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();

    const existingUser = memoryStore.users.find((user) => user.email === normalizedEmail);
    if (existingUser) {
      return errorResponse(res, 'User already exists', 409, 'Duplicate email');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = {
      id: generateId(),
      name: String(name).trim(),
      email: normalizedEmail,
      password_hash: hashedPassword,
      created_at: nowIso(),
      updated_at: nowIso(),
    };

    memoryStore.users.push(user);

    const token = createToken(user.id);

    return successResponse(res, 'Registration successful', {
      token,
      user: getSafeUser(user),
    }, 201);
  } catch (error) {
    return errorResponse(res, 'Unable to register user', 500, error.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array()[0].msg);
    }

    const { email, password } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = memoryStore.users.find((storedUser) => storedUser.email === normalizedEmail);

    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401, 'Authentication failed');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid email or password', 401, 'Authentication failed');
    }

    const token = createToken(user.id);

    return successResponse(res, 'Login successful', {
      token,
      user: getSafeUser(user),
    });
  } catch (error) {
    return errorResponse(res, 'Unable to login', 500, error.message);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = memoryStore.users.find((storedUser) => storedUser.id === req.userId);

    if (!user) {
      return errorResponse(res, 'User not found', 401, 'Unauthorized');
    }

    return successResponse(res, 'User loaded successfully', {
      user: getSafeUser(user),
    });
  } catch (error) {
    return errorResponse(res, 'Unable to load user', 500, error.message);
  }
};
