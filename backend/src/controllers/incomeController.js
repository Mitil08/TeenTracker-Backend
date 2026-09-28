import { validationResult } from 'express-validator';
import { memoryStore, generateId, nowIso } from '../config/store.js';
import { errorResponse, successResponse } from '../utils/response.js';

export const getIncome = async (req, res) => {
  try {
    const income = memoryStore.income.filter((item) => item.user_id === req.userId);
    return successResponse(res, 'Income loaded', income);
  } catch (error) {
    return errorResponse(res, 'Unable to load income', 500, error.message);
  }
};

export const createIncome = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return errorResponse(res, 'Validation failed', 400, errors.array()[0].msg);

    const item = {
      id: generateId(),
      user_id: req.userId,
      source: req.body.source,
      amount: Number(req.body.amount),
      income_date: req.body.income_date,
      description: req.body.description || '',
      created_at: nowIso(),
    };

    memoryStore.income.push(item);
    return successResponse(res, 'Income added successfully', item, 201);
  } catch (error) {
    return errorResponse(res, 'Unable to add income', 500, error.message);
  }
};

export const updateIncome = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return errorResponse(res, 'Validation failed', 400, errors.array()[0].msg);

    const index = memoryStore.income.findIndex((item) => item.id === req.params.id && item.user_id === req.userId);
    if (index === -1) return errorResponse(res, 'Income not found', 404, 'Not found');

    const updated = {
      ...memoryStore.income[index],
      source: req.body.source,
      amount: Number(req.body.amount),
      income_date: req.body.income_date,
      description: req.body.description || '',
    };

    memoryStore.income[index] = updated;
    return successResponse(res, 'Income updated successfully', updated);
  } catch (error) {
    return errorResponse(res, 'Unable to update income', 500, error.message);
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const index = memoryStore.income.findIndex((item) => item.id === req.params.id && item.user_id === req.userId);
    if (index === -1) return errorResponse(res, 'Income not found', 404, 'Not found');

    const [removed] = memoryStore.income.splice(index, 1);
    return successResponse(res, 'Income deleted successfully', removed);
  } catch (error) {
    return errorResponse(res, 'Unable to delete income', 500, error.message);
  }
};
