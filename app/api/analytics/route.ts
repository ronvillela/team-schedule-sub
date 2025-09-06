// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;
    
    // Log analytics data (in production, you'd save to a database)
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      type,
      data,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    };
    
    console.log('Analytics Event:', JSON.stringify(logEntry, null, 2));
    
    // In a real app, you'd save this to a database like:
    // - Supabase
    // - Firebase
    // - PlanetScale
    // - MongoDB Atlas
    
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to track analytics' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    // In a real app, you'd query your database here
    // For now, return mock analytics data
    const mockData = {
      totalVisits: 1247,
      uniqueVisitors: 892,
      topTeams: [
        { team: 'Miami Heat', count: 156 },
        { team: 'Miami Dolphins', count: 134 },
        { team: 'Miami Hurricanes', count: 98 },
        { team: 'Lakers', count: 87 },
        { team: 'Warriors', count: 76 }
      ],
      topSports: [
        { sport: 'Basketball', count: 456 },
        { sport: 'Football', count: 389 },
        { sport: 'Baseball', count: 234 },
        { sport: 'Hockey', count: 123 },
        { sport: 'Soccer', count: 45 }
      ],
      recentErrors: [
        { timestamp: '2025-01-15T10:30:00Z', error: 'Team not found: invalid team', count: 3 },
        { timestamp: '2025-01-15T09:15:00Z', error: 'API timeout', count: 1 }
      ]
    };
    
    return new Response(JSON.stringify(mockData), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Analytics GET error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch analytics' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
