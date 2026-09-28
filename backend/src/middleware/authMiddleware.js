import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { errorResponse } from '../utils/response.js';
import { memoryStore, getSafeUser } from '../config/store.js';

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication token missing', 401, 'Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    const user = memoryStore.users.find((storedUser) => storedUser.id === decoded.userId);

    if (!user) {
      return errorResponse(res, 'User not found', 401, 'Unauthorized');
    }

    req.user = getSafeUser(user);
    req.userId = user.id;
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token', 401, 'Unauthorized');
  }
};
