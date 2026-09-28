import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('expense-tracker-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  getDashboardSummary: () => api.get('/dashboard/summary'),
  getDashboardAnalytics: () => api.get('/dashboard/analytics'),
  getDashboardRecommendations: () => api.get('/dashboard/recommendations'),
  getExpenses: () => api.get('/expenses'),
  createExpense: (payload) => api.post('/expenses', payload),
  updateExpense: (id, payload) => api.put(`/expenses/${id}`, payload),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
  getIncome: () => api.get('/income'),
  createIncome: (payload) => api.post('/income', payload),
  getBudgets: () => api.get('/budgets'),
  createBudget: (payload) => api.post('/budgets', payload),
  updateBudget: (id, payload) => api.put(`/budgets/${id}`, payload),
  deleteBudget: (id) => api.delete(`/budgets/${id}`),
  getSavings: () => api.get('/savings'),
  createSavingsGoal: (payload) => api.post('/savings', payload),
  updateSavingsGoal: (id, payload) => api.put(`/savings/${id}`, payload),
  deleteSavingsGoal: (id) => api.delete(`/savings/${id}`),
};

export default api;
