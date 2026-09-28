import { useEffect, useMemo, useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import { apiService } from '../services/api';
import { formatCurrency, formatDate } from '../utils/format';

const defaultExpense = {
  title: '',
  amount: '',
  category: 'Food',
  description: '',
  expense_date: new Date().toISOString().slice(0, 10),
  payment_method: 'UPI',
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState(defaultExpense);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await apiService.getExpenses();
      setExpenses(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filteredExpenses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const next = expenses.filter((expense) => {
      const matchesSearch = !normalizedSearch || `${expense.title} ${expense.description}`.toLowerCase().includes(normalizedSearch);
      const matchesCategory = category === 'All' || expense.category === category;
      return matchesSearch && matchesCategory;
    });

    return next.sort((a, b) => {
      if (sort === 'Highest Amount') return Number(b.amount) - Number(a.amount);
      if (sort === 'Lowest Amount') return Number(a.amount) - Number(b.amount);
      if (sort === 'Oldest') return new Date(a.expense_date) - new Date(b.expense_date);
      return new Date(b.expense_date) - new Date(a.expense_date);
    });
  }, [expenses, search, category, sort]);

  const handleSubmit = async (payload) => {
    try {
      const normalized = {
        ...payload,
        amount: Number(payload.amount),
      };

      if (editingId) {
        await apiService.updateExpense(editingId, normalized);
      } else {
        await apiService.createExpense(normalized);
      }

      setEditingId(null);
      setFormState(defaultExpense);
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setFormState({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      description: expense.description || '',
      expense_date: expense.expense_date,
      payment_method: expense.payment_method,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await apiService.deleteExpense(id);
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page">
      <div className="header-row">
        <div>
          <h1 style={{ margin: 0 }}>Expenses</h1>
          <p className="muted" style={{ margin: '8px 0 0' }}>Track every purchase, snack, and spend.</p>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>{editingId ? 'Edit Expense' : 'Add Expense'}</h3>
          <ExpenseForm
            onSubmit={handleSubmit}
            initialData={formState}
            submitLabel={editingId ? 'Update Expense' : 'Add Expense'}
            loading={loading}
          />
        </div>

        <div className="card">
          <h3>Search & Filters</h3>
          <div className="form-grid">
            <div className="field">
              <label>Search</label>
              <input placeholder="Search expense" value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            <div className="field">
              <label>Category</label>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option>All</option>
                <option>Food</option>
                <option>Transport</option>
                <option>Education</option>
                <option>Entertainment</option>
                <option>Shopping</option>
                <option>Gaming</option>
                <option>Mobile/Internet</option>
                <option>Health</option>
                <option>Subscriptions</option>
                <option>Travel</option>
                <option>Other</option>
              </select>
            </div>
            <div className="field">
              <label>Sort</label>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option>Newest</option>
                <option>Oldest</option>
                <option>Highest Amount</option>
                <option>Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Expense History</h3>
        {loading ? <p>Loading expenses...</p> : filteredExpenses.length === 0 ? <p className="muted">No expenses yet. Start tracking your first spend.</p> : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {filteredExpenses.map((expense) => (
              <div key={expense.id} className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{expense.title}</div>
                  <div className="muted">{expense.category} • {expense.payment_method}</div>
                  <div className="muted">{formatDate(expense.expense_date)}</div>
                  {expense.description && <div className="muted">{expense.description}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{formatCurrency(expense.amount)}</div>
                  <button className="btn btn-secondary" onClick={() => handleEdit(expense)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(expense.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
