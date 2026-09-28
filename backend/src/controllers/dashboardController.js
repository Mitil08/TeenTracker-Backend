import { validationResult } from 'express-validator';
import { memoryStore } from '../config/store.js';
import { summarizeDashboard } from '../services/dashboardService.js';
import { buildRecommendations } from '../services/recommendationService.js';
import { errorResponse, successResponse } from '../utils/response.js';

export const getDashboardSummary = async (req, res) => {
  try {
    const expenses = memoryStore.expenses.filter((item) => item.user_id === req.userId);
    const income = memoryStore.income.filter((item) => item.user_id === req.userId);
    const budgets = memoryStore.budgets.filter((item) => item.user_id === req.userId);
    const savingsGoals = memoryStore.savingGoals.filter((item) => item.user_id === req.userId);

    const summary = summarizeDashboard({ expenses, income, budgets, savingsGoals });
    return successResponse(res, 'Dashboard summary loaded', summary);
  } catch (error) {
    return errorResponse(res, 'Unable to load dashboard summary', 500, error.message);
  }
};

export const getDashboardAnalytics = async (req, res) => {
  try {
    const expenses = memoryStore.expenses.filter((item) => item.user_id === req.userId);
    const income = memoryStore.income.filter((item) => item.user_id === req.userId);
    const totalSpending = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalIncome = income.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const categoryBreakdown = Object.entries(
      expenses.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + Number(item.amount || 0);
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value }));

    const monthlyTrend = Array.from({ length: 6 }, (_, index) => {
      const now = new Date();
      now.setMonth(now.getMonth() - (5 - index));
      const monthName = now.toLocaleDateString('en-US', { month: 'short' });
      const monthIncome = income.filter((item) => new Date(item.income_date).getMonth() === now.getMonth()).reduce((sum, val) => sum + Number(val.amount || 0), 0);
      const monthExpense = expenses.filter((item) => new Date(item.expense_date).getMonth() === now.getMonth()).reduce((sum, val) => sum + Number(val.amount || 0), 0);
      return { name: monthName, income: monthIncome, expenses: monthExpense };
    });

    return successResponse(res, 'Analytics loaded', {
      totalSpending,
      totalIncome,
      categoryBreakdown,
      monthlyTrend,
    });
  } catch (error) {
    return errorResponse(res, 'Unable to load analytics', 500, error.message);
  }
};

export const getDashboardRecommendations = async (req, res) => {
  try {
    const expenses = memoryStore.expenses.filter((item) => item.user_id === req.userId);
    const income = memoryStore.income.filter((item) => item.user_id === req.userId);
    const budgets = memoryStore.budgets.filter((item) => item.user_id === req.userId);
    const savingsGoals = memoryStore.savingGoals.filter((item) => item.user_id === req.userId);

    const recommendations = buildRecommendations({ expenses, income, budgets, savingsGoals });

    return successResponse(res, 'Recommendations loaded', recommendations);
  } catch (error) {
    return errorResponse(res, 'Unable to load recommendations', 500, error.message);
  }
};
