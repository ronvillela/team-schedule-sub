'use client';

import { useVisitorCount } from '@/hooks/use-visitor-count';
import { Users } from 'lucide-react';

export function VisitorCounter() {
  const { count, loading, error } = useVisitorCount();

  if (error) {
    return null; // Don't show anything if there's an error
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Users className="h-4 w-4 text-blue-600" />
      <span className="font-medium text-blue-600">
        {loading ? '...' : count.toLocaleString()}
      </span>
      <span>
        {count === 1 ? 'visitor' : 'visitors'}
      </span>
    </div>
  );
}
