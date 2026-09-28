import express from 'express';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../controllers/budgetController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { budgetValidation } from '../validators/resourceValidators.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/', getBudgets);
router.post('/', budgetValidation, createBudget);
router.put('/:id', budgetValidation, updateBudget);
router.delete('/:id', deleteBudget);

export default router;
