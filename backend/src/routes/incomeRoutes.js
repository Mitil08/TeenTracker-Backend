import express from 'express';
import { getIncome, createIncome, updateIncome, deleteIncome } from '../controllers/incomeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { incomeValidation } from '../validators/resourceValidators.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/', getIncome);
router.post('/', incomeValidation, createIncome);
router.put('/:id', incomeValidation, updateIncome);
router.delete('/:id', deleteIncome);

export default router;
