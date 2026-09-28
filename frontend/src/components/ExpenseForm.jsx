import { useState } from 'react';

const defaultForm = {
  title: '',
  amount: '',
  category: 'Food',
  description: '',
  expense_date: new Date().toISOString().slice(0, 10),
  payment_method: 'UPI',
};

export default function ExpenseForm({ onSubmit, initialData = null, submitLabel = 'Save Expense', loading = false }) {
  const [form, setForm] = useState(initialData || defaultForm);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <div className="field">
        <label htmlFor="title">Expense Name</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} required />
      </div>

      <div className="field">
        <label htmlFor="amount">Amount</label>
        <input id="amount" name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handleChange} required />
      </div>

      <div className="field">
        <label htmlFor="category">Category</label>
        <select id="category" name="category" value={form.category} onChange={handleChange} required>
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
        <label htmlFor="expense_date">Date</label>
        <input id="expense_date" name="expense_date" type="date" value={form.expense_date} onChange={handleChange} required />
      </div>

      <div className="field">
        <label htmlFor="payment_method">Payment Method</label>
        <select id="payment_method" name="payment_method" value={form.payment_method} onChange={handleChange} required>
          <option>Cash</option>
          <option>UPI</option>
          <option>Debit Card</option>
          <option>Bank Transfer</option>
          <option>Other</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows="4" value={form.description} onChange={handleChange} />
      </div>

      <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Saving...' : submitLabel}</button>
    </form>
  );
}
