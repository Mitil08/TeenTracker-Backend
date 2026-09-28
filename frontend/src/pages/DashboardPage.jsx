import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import SummaryCard from '../components/SummaryCard';
import RecommendationCard from '../components/RecommendationCard';
import { useDashboardData } from '../hooks/useDashboardData';
import { formatCurrency } from '../utils/format';

const COLORS = ['#4f46e5', '#06b6d4', '#f59e0b', '#f97316', '#10b981', '#a78bfa'];

export default function DashboardPage() {
  const { summary, analytics, recommendations, loading } = useDashboardData();

  if (loading || !summary || !analytics) {
    return <div className="page"><div className="card">Loading dashboard...</div></div>;
  }

  const categoryData = analytics.categoryBreakdown.map((item, index) => ({
    name: item.name,
    value: Number(item.value || 0),
    fill: COLORS[index % COLORS.length],
  }));

  const chartData = analytics.monthlyTrend.map((item) => ({
    name: item.name,
    income: Number(item.income || 0),
    expenses: Number(item.expenses || 0),
  }));

  return (
    <div className="page">
      <div className="header-row">
        <div>
          <h1 style={{ margin: 0 }}>Good afternoon, Alex 👋</h1>
          <p className="muted" style={{ margin: '8px 0 0' }}>Let’s see how your money is doing today.</p>
        </div>
      </div>

      <div className="grid grid-4">
        <SummaryCard label="Total Income" value={formatCurrency(summary.totalIncome)} tone="primary" />
        <SummaryCard label="Total Expenses" value={formatCurrency(summary.totalExpenses)} />
        <SummaryCard label="Remaining Money" value={formatCurrency(summary.remaining)} />
        <SummaryCard label="Savings" value={formatCurrency(summary.savings)} />
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Spending by Category</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={4}>
                  {categoryData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3>Smart Suggestions</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {recommendations.length ? recommendations.map((item) => <RecommendationCard key={item.title} recommendation={item} />) : <p className="muted">No suggestions yet.</p>}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Monthly Income vs Expenses</h3>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
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
  );
}
