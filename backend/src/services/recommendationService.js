export const buildRecommendations = ({ expenses, income, budgets, savingsGoals }) => {
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalIncome = income.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalSaved = savingsGoals.reduce((sum, goal) => sum + Number(goal.current_amount || 0), 0);

  const categoryTotals = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + Number(item.amount || 0);
    return acc;
  }, {});

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  const recommendations = [];

  if (!expenses.length) {
    recommendations.push({
      type: 'info',
      title: 'Start tracking your spend',
      text: 'No expenses yet. Add your first expense to unlock insights and learn where your money goes.',
    });
    return recommendations;
  }

  if (topCategory) {
    const [name, value] = topCategory;
    recommendations.push({
      type: 'warning',
      title: `${name} is your biggest spending category`,
      text: `You spent ₹${value.toLocaleString('en-IN')} on ${name.toLowerCase()}. Try setting a weekly limit to make it easier to control.`,
    });
  }

  if (totalIncome > 0 && totalSaved / totalIncome < 0.2) {
    recommendations.push({
      type: 'info',
      title: 'Save a little each time money comes in',
      text: 'You are currently saving a small share of your income. Try setting a fixed amount as soon as you get money.',
    });
  }

  if (budgets.length) {
    budgets.forEach((budget) => {
      const spent = expenses.filter((expense) => expense.category === budget.category).reduce((sum, item) => sum + Number(item.amount), 0);
      const share = budget.amount ? (spent / budget.amount) * 100 : 0;
      if (share > 80) {
        recommendations.push({
          type: 'warning',
          title: `${budget.category} is getting close to budget`,
          text: `You have used ${share.toFixed(0)}% of your ${budget.category} budget. Try pausing non-essential spending for a few days.`,
        });
      }
    });
  }

  if (totalSaved > 0) {
    recommendations.push({
      type: 'success',
      title: 'Nice work staying consistent',
      text: `You have saved ₹${totalSaved.toLocaleString('en-IN')} toward your goals. Keep up the momentum.`,
    });
  }

  return recommendations.slice(0, 4);
};
