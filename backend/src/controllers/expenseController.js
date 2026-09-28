import { validationResult } from 'express-validator';
import { memoryStore, generateId, nowIso } from '../config/store.js';
import { errorResponse, successResponse } from '../utils/response.js';

export const getExpenses = async (req, res) => {
  try {
    const expenses = memoryStore.expenses.filter((item) => item.user_id === req.userId);
    return successResponse(res, 'Expenses loaded', expenses);
  } catch (error) {
    return errorResponse(res, 'Unable to load expenses', 500, error.message);
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const expense = memoryStore.expenses.find((item) => item.id === req.params.id && item.user_id === req.userId);
    if (!expense) return errorResponse(res, 'Expense not found', 404, 'Not found');
    return successResponse(res, 'Expense loaded', expense);
  } catch (error) {
    return errorResponse(res, 'Unable to load expense', 500, error.message);
  }
};

export const createExpense = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return errorResponse(res, 'Validation failed', 400, errors.array()[0].msg);

    const newExpense = {
      id: generateId(),
      user_id: req.userId,
      title: req.body.title,
      amount: Number(req.body.amount),
      category: req.body.category,
      description: req.body.description || '',
      expense_date: req.body.expense_date,
      payment_method: req.body.payment_method,
      created_at: nowIso(),
      updated_at: nowIso(),
    };

    memoryStore.expenses.push(newExpense);
    return successResponse(res, 'Expense created successfully', newExpense, 201);
  } catch (error) {
    return errorResponse(res, 'Unable to create expense', 500, error.message);
  }
};

export const updateExpense = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return errorResponse(res, 'Validation failed', 400, errors.array()[0].msg);

    const expenseIndex = memoryStore.expenses.findIndex((item) => item.id === req.params.id && item.user_id === req.userId);
    if (expenseIndex === -1) return errorResponse(res, 'Expense not found', 404, 'Not found');

    const updatedExpense = {
      ...memoryStore.expenses[expenseIndex],
      title: req.body.title,
      amount: Number(req.body.amount),
      category: req.body.category,
      description: req.body.description || '',
      expense_date: req.body.expense_date,
      payment_method: req.body.payment_method,
      updated_at: nowIso(),
    };

    memoryStore.expenses[expenseIndex] = updatedExpense;
    return successResponse(res, 'Expense updated successfully', updatedExpense);
  } catch (error) {
    return errorResponse(res, 'Unable to update expense', 500, error.message);
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expenseIndex = memoryStore.expenses.findIndex((item) => item.id === req.params.id && item.user_id === req.userId);
    if (expenseIndex === -1) return errorResponse(res, 'Expense not found', 404, 'Not found');

    const [removed] = memoryStore.expenses.splice(expenseIndex, 1);
    return successResponse(res, 'Expense deleted successfully', removed);
  } catch (error) {
    return errorResponse(res, 'Unable to delete expense', 500, error.message);
  }
};
