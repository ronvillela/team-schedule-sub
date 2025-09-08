'use client';

import { useVisitorCount } from '@/hooks/use-visitor-count';
import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function VisitorCounter() {
  const { count, loading, error } = useVisitorCount();

  if (error) {
    return null; // Don't show anything if there's an error
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardContent className="flex items-center justify-center p-4">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-blue-600" />
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {loading ? '...' : count.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              {count === 1 ? 'Visitor' : 'Visitors'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
