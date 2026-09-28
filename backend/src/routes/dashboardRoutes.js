import express from 'express';
import { getDashboardSummary, getDashboardAnalytics, getDashboardRecommendations } from '../controllers/dashboardController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', authMiddleware, getDashboardSummary);
router.get('/analytics', authMiddleware, getDashboardAnalytics);
router.get('/recommendations', authMiddleware, getDashboardRecommendations);

export default router;
