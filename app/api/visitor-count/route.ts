import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const COUNTER_FILE = path.join(process.cwd(), 'visitor-count.json');

interface VisitorData {
  count: number;
  lastUpdated: string;
}

async function getVisitorCount(): Promise<VisitorData> {
  try {
    const data = await fs.readFile(COUNTER_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {
      count: 0,
      lastUpdated: new Date().toISOString()
    };
  }
}

async function incrementVisitorCount(): Promise<VisitorData> {
  const currentData = await getVisitorCount();
  const newData: VisitorData = {
    count: currentData.count + 1,
    lastUpdated: new Date().toISOString()
  };
  
  try {
    await fs.writeFile(COUNTER_FILE, JSON.stringify(newData, null, 2));
  } catch (error) {
    console.error('Error writing visitor count:', error);
  }
  
  return newData;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const increment = searchParams.get('increment') === 'true';
    
    const data = increment ? await incrementVisitorCount() : await getVisitorCount();
    
    return NextResponse.json({
      success: true,
      count: data.count,
      lastUpdated: data.lastUpdated
    });
  } catch (error) {
    console.error('Error handling visitor count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get visitor count' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const data = await incrementVisitorCount();
    
    return NextResponse.json({
      success: true,
      count: data.count,
      lastUpdated: data.lastUpdated
    });
  } catch (error) {
    console.error('Error incrementing visitor count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to increment visitor count' },
      { status: 500 }
    );
  }
}
