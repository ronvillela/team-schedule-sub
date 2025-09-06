// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

import { sendFeedbackEmail } from '@/lib/email';

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
    
    // Send email notification
    const emailResult = await sendFeedbackEmail({
      type,
      message,
      team,
      sport,
      league,
      userAgent: request.headers.get('user-agent') || undefined,
      url,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
    });
    
    if (emailResult.success) {
      console.log('Email notification sent successfully');
    } else {
      console.error('Failed to send email notification:', emailResult.error);
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Thank you for your feedback! We\'ll look into this issue.',
      emailSent: emailResult.success
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
