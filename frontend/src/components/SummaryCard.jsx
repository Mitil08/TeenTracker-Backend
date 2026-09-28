export default function SummaryCard({ label, value, tone = 'default' }) {
  return (
    <div className="summary-card" style={{ background: tone === 'primary' ? 'linear-gradient(135deg, #eef2ff, #ffffff)' : 'linear-gradient(135deg, #ffffff, #f3f4ff)' }}>
      <div className="summary-label">{label}</div>
      <div className="summary-value">{value}</div>
    </div>
  );
}
