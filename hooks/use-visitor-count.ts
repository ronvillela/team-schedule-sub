import { useState, useEffect } from 'react';

interface VisitorCountData {
  count: number;
  lastUpdated: string;
}

export function useVisitorCount() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trackVisit = async () => {
      try {
        setLoading(true);
        
        // First, increment the counter
        const incrementResponse = await fetch('/api/visitor-count?increment=true');
        if (!incrementResponse.ok) {
          throw new Error('Failed to increment visitor count');
        }
        
        const data = await incrementResponse.json();
        if (data.success) {
          setCount(data.count);
        } else {
          throw new Error(data.error || 'Failed to get visitor count');
        }
      } catch (err) {
        console.error('Error tracking visit:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    // Only track visit if we're in the browser (not during SSR)
    if (typeof window !== 'undefined') {
      trackVisit();
    }
  }, []);

  return { count, loading, error };
}
