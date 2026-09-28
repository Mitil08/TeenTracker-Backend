import { body } from 'express-validator';

export const expenseValidation = [
  body('title').trim().notEmpty().withMessage('Expense title is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('category').notEmpty().withMessage('Category is required'),
  body('expense_date').isISO8601().withMessage('Valid date is required'),
  body('payment_method').notEmpty().withMessage('Payment method is required'),
];

export const incomeValidation = [
  body('source').trim().notEmpty().withMessage('Income source is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('income_date').isISO8601().withMessage('Valid income date is required'),
];

export const budgetValidation = [
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Budget amount must be greater than 0'),
  body('period').isIn(['Weekly', 'Monthly']).withMessage('Period must be Weekly or Monthly'),
  body('start_date').isISO8601().withMessage('Valid start date is required'),
  body('end_date').isISO8601().withMessage('Valid end date is required'),
];

export const savingsGoalValidation = [
  body('name').trim().notEmpty().withMessage('Savings goal name is required'),
  body('target_amount').isFloat({ gt: 0 }).withMessage('Target amount must be greater than 0'),
  body('current_amount').isFloat({ min: 0 }).withMessage('Current amount must be 0 or more'),
];
