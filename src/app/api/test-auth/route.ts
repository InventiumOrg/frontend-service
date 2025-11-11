import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthToken } from '@/lib/auth-server';
import { debugServerAuth } from '@/lib/auth-debug';

export async function GET(request: NextRequest) {
  try {
    // Debug server auth
    await debugServerAuth();
    
    // Get token
    const token = await getServerAuthToken();
    
    // Get cookies for debugging
    const cookies = request.cookies.getAll();
    
    return NextResponse.json({
      success: true,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 30)}...` : 'No token',
      tokenLength: token?.length || 0,
      availableCookies: cookies.map(c => c.name),
      sessionCookie: request.cookies.get('__session')?.value ? 'Found' : 'Not found',
      authCookie: request.cookies.get('auth_token')?.value ? 'Found' : 'Not found',
    });
  } catch (error) {
    console.error('Test auth error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}