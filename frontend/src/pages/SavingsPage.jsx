import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { formatCurrency } from '../utils/format';

const defaultGoal = { name: '', target_amount: '', current_amount: '0', deadline: '' };

export default function SavingsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(defaultGoal);

  const fetchGoals = async () => {
    try {
      const response = await apiService.getSavings();
      setGoals(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await apiService.createSavingsGoal({
        ...form,
        target_amount: Number(form.target_amount),
        current_amount: Number(form.current_amount || 0),
      });
      setForm(defaultGoal);
      fetchGoals();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page">
      <div className="header-row">
        <div>
          <h1 style={{ margin: 0 }}>Savings Goals</h1>
          <p className="muted" style={{ margin: '8px 0 0' }}>Dream big and save step by step.</p>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Create Goal</h3>
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="field"><label>Target Amount</label><input type="number" min="1" value={form.target_amount} onChange={(e) => setForm({ ...form, target_amount: e.target.value })} required /></div>
            <div className="field"><label>Saved So Far</label><input type="number" min="0" value={form.current_amount} onChange={(e) => setForm({ ...form, current_amount: e.target.value })} /></div>
            <div className="field"><label>Deadline</label><input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
            <button className="btn btn-primary" type="submit">Save Goal</button>
          </form>
        </div>

        <div className="card">
          <h3>Goals</h3>
          {loading ? <p>Loading goals...</p> : goals.length === 0 ? <p className="muted">No savings goals yet.</p> : goals.map((goal) => {
            const progress = Math.min(100, (Number(goal.current_amount || 0) / Number(goal.target_amount || 1)) * 100);
            return (
              <div key={goal.id} style={{ marginBottom: '16px', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                <div style={{ fontWeight: 700 }}>{goal.name}</div>
                <div className="muted">Goal: {formatCurrency(goal.target_amount)} • Saved: {formatCurrency(goal.current_amount)}</div>
                <div style={{ background: '#e5e7eb', borderRadius: '999px', overflow: 'hidden', marginTop: '10px' }}>
                  <div style={{ width: `${progress}%`, background: '#10b981', height: '10px' }} />
                </div>
                <div className="muted" style={{ marginTop: '8px' }}>{progress.toFixed(0)}% completed</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
