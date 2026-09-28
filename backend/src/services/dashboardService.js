export const summarizeDashboard = ({ expenses, income, budgets, savingsGoals }) => {
  const totalIncome = income.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const remaining = totalIncome - totalExpenses;
  const savings = savingsGoals.reduce((sum, goal) => sum + Number(goal.current_amount || 0), 0);

  const categoryTotals = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + Number(item.amount || 0);
    return acc;
  }, {});

  const dailyTotals = Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - index));
    const key = day.toISOString().slice(0, 10);
    const total = expenses
      .filter((item) => item.expense_date === key)
      .reduce((sum, current) => sum + Number(current.amount || 0), 0);
    return { day: day.toLocaleDateString('en-US', { weekday: 'short' }), total };
  });

  return {
    totalIncome,
    totalExpenses,
    remaining,
    savings,
    categoryTotals,
    dailyTotals,
  };
};
