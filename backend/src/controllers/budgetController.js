import { validationResult } from 'express-validator';
import { memoryStore, generateId, nowIso } from '../config/store.js';
import { errorResponse, successResponse } from '../utils/response.js';

export const getBudgets = async (req, res) => {
  try {
    const budgets = memoryStore.budgets.filter((item) => item.user_id === req.userId);
    return successResponse(res, 'Budgets loaded', budgets);
  } catch (error) {
    return errorResponse(res, 'Unable to load budgets', 500, error.message);
  }
};

export const createBudget = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return errorResponse(res, 'Validation failed', 400, errors.array()[0].msg);

    const item = {
      id: generateId(),
      user_id: req.userId,
      category: req.body.category,
      amount: Number(req.body.amount),
      period: req.body.period,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      created_at: nowIso(),
      updated_at: nowIso(),
    };

    memoryStore.budgets.push(item);
    return successResponse(res, 'Budget created successfully', item, 201);
  } catch (error) {
    return errorResponse(res, 'Unable to create budget', 500, error.message);
  }
};

export const updateBudget = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return errorResponse(res, 'Validation failed', 400, errors.array()[0].msg);

    const index = memoryStore.budgets.findIndex((item) => item.id === req.params.id && item.user_id === req.userId);
    if (index === -1) return errorResponse(res, 'Budget not found', 404, 'Not found');

    const updated = {
      ...memoryStore.budgets[index],
      category: req.body.category,
      amount: Number(req.body.amount),
      period: req.body.period,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      updated_at: nowIso(),
    };

    memoryStore.budgets[index] = updated;
    return successResponse(res, 'Budget updated successfully', updated);
  } catch (error) {
    return errorResponse(res, 'Unable to update budget', 500, error.message);
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const index = memoryStore.budgets.findIndex((item) => item.id === req.params.id && item.user_id === req.userId);
    if (index === -1) return errorResponse(res, 'Budget not found', 404, 'Not found');

    const [removed] = memoryStore.budgets.splice(index, 1);
    return successResponse(res, 'Budget deleted successfully', removed);
  } catch (error) {
    return errorResponse(res, 'Unable to delete budget', 500, error.message);
  }
};
