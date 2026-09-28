import express from 'express';
import { getSavings, createSavingGoal, updateSavingGoal, deleteSavingGoal } from '../controllers/savingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { savingsGoalValidation } from '../validators/resourceValidators.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/', getSavings);
router.post('/', savingsGoalValidation, createSavingGoal);
router.put('/:id', savingsGoalValidation, updateSavingGoal);
router.delete('/:id', deleteSavingGoal);

export default router;
