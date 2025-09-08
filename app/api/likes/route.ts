export const dynamic = 'force-dynamic';

// In-memory storage for likes (in production, use a database)
let likesData = {
  totalLikes: 1247,
  userLikes: new Set<string>(),
};

export async function GET() {
  try {
    return Response.json({ 
      totalLikes: likesData.totalLikes,
      message: 'Likes retrieved successfully' 
    });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return Response.json({ error: 'Failed to fetch likes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action } = await request.json();
    
    const userIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'anonymous';
    
    const userKey = `user_${userIP}`;
    
    if (action === 'like' && !likesData.userLikes.has(userKey)) {
      likesData.totalLikes += 1;
      likesData.userLikes.add(userKey);
    } else if (action === 'unlike' && likesData.userLikes.has(userKey)) {
      likesData.totalLikes = Math.max(0, likesData.totalLikes - 1);
      likesData.userLikes.delete(userKey);
    }
    
    console.log('Like action:', {
      action,
      userIP,
      totalLikes: likesData.totalLikes,
      timestamp: new Date().toISOString()
    });
    
    return Response.json({ 
      totalLikes: likesData.totalLikes,
      hasLiked: likesData.userLikes.has(userKey),
      message: action === 'like' ? 'Liked successfully!' : 'Unliked successfully!'
    });
  } catch (error) {
    console.error('Error handling like:', error);
    return Response.json({ error: 'Failed to process like' }, { status: 500 });
  }
}
