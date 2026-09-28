import express from 'express';
import { getExpenses, getExpenseById, createExpense, updateExpense, deleteExpense } from '../controllers/expenseController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { expenseValidation } from '../validators/resourceValidators.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.post('/', expenseValidation, createExpense);
router.put('/:id', expenseValidation, updateExpense);
router.delete('/:id', deleteExpense);

export default router;
