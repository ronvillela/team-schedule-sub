// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, message, team, sport, league, userAgent, url } = body;
    
    // Log feedback/error report
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      type, // 'error', 'bug', 'suggestion', 'general'
      message,
      context: {
        team,
        sport,
        league,
        url
      },
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    };
    
    console.log('Feedback Report:', JSON.stringify(logEntry, null, 2));
    
    // In a real app, you'd save this to a database and optionally send email notifications
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Thank you for your feedback! We\'ll look into this issue.' 
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Feedback error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to submit feedback' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
