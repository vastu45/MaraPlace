import { NextRequest, NextResponse } from "next/server";
import { getConnectionStats } from "@/lib/notifications";

export async function GET(request: NextRequest) {
  try {
    const stats = getConnectionStats();
    
    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting notification stats:', error);
    return NextResponse.json({ 
      error: 'Failed to get notification stats' 
    }, { status: 500 });
  }
} 