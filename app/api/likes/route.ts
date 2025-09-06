// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// In-memory storage for likes (in production, use a database)
let likesData = {
  totalLikes: 1247,
  userLikes: new Set<string>(), // Store user IPs or session IDs
};

export async function GET() {
  try {
    return new Response(JSON.stringify({ 
      totalLikes: likesData.totalLikes,
      message: 'Likes retrieved successfully' 
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch likes' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body; // 'like' or 'unlike'
    
    // Get user identifier (IP address for simplicity)
    const userIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'anonymous';
    
    const userKey = `user_${userIP}`;
    
    if (action === 'like') {
      if (!likesData.userLikes.has(userKey)) {
        likesData.totalLikes += 1;
        likesData.userLikes.add(userKey);
      }
    } else if (action === 'unlike') {
      if (likesData.userLikes.has(userKey)) {
        likesData.totalLikes = Math.max(0, likesData.totalLikes - 1);
        likesData.userLikes.delete(userKey);
      }
    }
    
    // Log the like action for analytics
    console.log('Like action:', {
      action,
      userIP,
      totalLikes: likesData.totalLikes,
      timestamp: new Date().toISOString()
    });
    
    return new Response(JSON.stringify({ 
      totalLikes: likesData.totalLikes,
      hasLiked: likesData.userLikes.has(userKey),
      message: action === 'like' ? 'Liked successfully!' : 'Unliked successfully!'
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error handling like:', error);
    return new Response(JSON.stringify({ error: 'Failed to process like' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
