import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { formatCurrency } from '../utils/format';

const defaultBudget = { category: 'Food', amount: '', period: 'Monthly', start_date: new Date().toISOString().slice(0, 10), end_date: new Date().toISOString().slice(0, 10) };

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(defaultBudget);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await apiService.getBudgets();
      setBudgets(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await apiService.createBudget({ ...form, amount: Number(form.amount) });
      setForm(defaultBudget);
      fetchBudgets();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteBudget(id);
      fetchBudgets();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page">
      <div className="header-row">
        <div>
          <h1 style={{ margin: 0 }}>Budgets</h1>
          <p className="muted" style={{ margin: '8px 0 0' }}>Stay within your weekly and monthly limits.</p>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Create Budget</h3>
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field"><label>Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Food</option><option>Transport</option><option>Entertainment</option><option>Shopping</option><option>Education</option><option>Other</option></select></div>
            <div className="field"><label>Amount</label><input type="number" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /></div>
            <div className="field"><label>Period</label><select value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}><option>Weekly</option><option>Monthly</option></select></div>
            <div className="field"><label>Start Date</label><input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required /></div>
            <div className="field"><label>End Date</label><input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required /></div>
            <button className="btn btn-primary" type="submit">Save Budget</button>
          </form>
        </div>

        <div className="card">
          <h3>Budget Overview</h3>
          {loading ? <p>Loading budgets...</p> : budgets.length === 0 ? <p className="muted">No budgets yet.</p> : budgets.map((budget) => (
            <div key={budget.id} style={{ marginBottom: '14px', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{budget.category}</strong>
                <button className="btn btn-danger" onClick={() => handleDelete(budget.id)}>Delete</button>
              </div>
              <p className="muted" style={{ margin: '8px 0' }}>{budget.period} budget: {formatCurrency(budget.amount)}</p>
              <div style={{ background: '#e5e7eb', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ background: '#4f46e5', width: '65%', height: '10px' }} />
              </div>
              <div className="muted" style={{ marginTop: '8px' }}>Used: {formatCurrency(Math.min(Number(budget.amount), Number(budget.amount) * 0.65))} / {formatCurrency(budget.amount)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
