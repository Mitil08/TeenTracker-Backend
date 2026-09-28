export default function RecommendationCard({ recommendation }) {
  const iconMap = {
    info: '💡',
    warning: '⚠️',
    success: '🎉',
  };

  return (
    <div className="card" style={{ padding: '18px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 700 }}>
        <span>{iconMap[recommendation.type] || '💡'}</span>
        <span>{recommendation.title}</span>
      </div>
      <p className="muted" style={{ margin: 0 }}>{recommendation.text}</p>
    </div>
  );
}
