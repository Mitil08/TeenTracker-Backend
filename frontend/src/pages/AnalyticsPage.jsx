import { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { apiService } from '../services/api';
import { formatCurrency } from '../utils/format';

const COLORS = ['#4f46e5', '#06b6d4', '#f59e0b', '#10b981', '#a78bfa', '#f97316'];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.getDashboardAnalytics();
        setAnalytics(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !analytics) {
    return <div className="page"><div className="card">Loading analytics...</div></div>;
  }

  const pieData = analytics.categoryBreakdown.map((item, index) => ({
    name: item.name,
    value: Number(item.value || 0),
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="page">
      <div className="header-row">
        <div>
          <h1 style={{ margin: 0 }}>Analytics</h1>
          <p className="muted" style={{ margin: '8px 0 0' }}>See where your money is going.</p>
        </div>
      </div>

      <div className="grid grid-4">
        <div className="summary-card"><div className="summary-label">Total spending</div><div className="summary-value">{formatCurrency(analytics.totalSpending)}</div></div>
        <div className="summary-card"><div className="summary-label">Average daily spending</div><div className="summary-value">{formatCurrency(analytics.totalSpending / 30)}</div></div>
        <div className="summary-card"><div className="summary-label">Highest spending category</div><div className="summary-value">{analytics.categoryBreakdown[0]?.name || 'N/A'}</div></div>
        <div className="summary-card"><div className="summary-label">Income vs expenses</div><div className="summary-value">{formatCurrency(analytics.totalIncome)}</div></div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Expense by Category</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95}>
                  {pieData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3>Monthly Comparison</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={analytics.monthlyTrend}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="income" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
