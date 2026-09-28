export const memoryStore = {
  users: [],
  expenses: [],
  income: [],
  budgets: [],
  savingGoals: [],
};

export const getSafeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

export const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const nowIso = () => new Date().toISOString();
