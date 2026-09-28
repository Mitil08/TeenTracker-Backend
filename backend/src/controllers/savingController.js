import { validationResult } from 'express-validator';
import { memoryStore, generateId, nowIso } from '../config/store.js';
import { errorResponse, successResponse } from '../utils/response.js';

export const getSavings = async (req, res) => {
  try {
    const goals = memoryStore.savingGoals.filter((item) => item.user_id === req.userId);
    return successResponse(res, 'Savings goals loaded', goals);
  } catch (error) {
    return errorResponse(res, 'Unable to load savings goals', 500, error.message);
  }
};

export const createSavingGoal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return errorResponse(res, 'Validation failed', 400, errors.array()[0].msg);

    const item = {
      id: generateId(),
      user_id: req.userId,
      name: req.body.name,
      target_amount: Number(req.body.target_amount),
      current_amount: Number(req.body.current_amount || 0),
      deadline: req.body.deadline || null,
      created_at: nowIso(),
      updated_at: nowIso(),
    };

    memoryStore.savingGoals.push(item);
    return successResponse(res, 'Savings goal created successfully', item, 201);
  } catch (error) {
    return errorResponse(res, 'Unable to create savings goal', 500, error.message);
  }
};

export const updateSavingGoal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return errorResponse(res, 'Validation failed', 400, errors.array()[0].msg);

    const index = memoryStore.savingGoals.findIndex((item) => item.id === req.params.id && item.user_id === req.userId);
    if (index === -1) return errorResponse(res, 'Savings goal not found', 404, 'Not found');

    const updated = {
      ...memoryStore.savingGoals[index],
      name: req.body.name,
      target_amount: Number(req.body.target_amount),
      current_amount: Number(req.body.current_amount || 0),
      deadline: req.body.deadline || null,
      updated_at: nowIso(),
    };

    memoryStore.savingGoals[index] = updated;
    return successResponse(res, 'Savings goal updated successfully', updated);
  } catch (error) {
    return errorResponse(res, 'Unable to update savings goal', 500, error.message);
  }
};

export const deleteSavingGoal = async (req, res) => {
  try {
    const index = memoryStore.savingGoals.findIndex((item) => item.id === req.params.id && item.user_id === req.userId);
    if (index === -1) return errorResponse(res, 'Savings goal not found', 404, 'Not found');

    const [removed] = memoryStore.savingGoals.splice(index, 1);
    return successResponse(res, 'Savings goal deleted successfully', removed);
  } catch (error) {
    return errorResponse(res, 'Unable to delete savings goal', 500, error.message);
  }
};
