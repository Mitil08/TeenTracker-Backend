import { useEffect, useState } from 'react';
import { apiService } from '../services/api';

export function useDashboardData() {
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [summaryRes, analyticsRes, recRes] = await Promise.all([
          apiService.getDashboardSummary(),
          apiService.getDashboardAnalytics(),
          apiService.getDashboardRecommendations(),
        ]);

        setSummary(summaryRes.data.data);
        setAnalytics(analyticsRes.data.data);
        setRecommendations(recRes.data.data || []);
      } catch (error) {
        console.error('Dashboard load failed', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { summary, analytics, recommendations, loading };
}
