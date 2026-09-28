import express from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../validators/authValidators.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
