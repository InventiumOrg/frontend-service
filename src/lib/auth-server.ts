import { auth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';

// Server-side auth token retrieval using Clerk session
export async function getServerAuthToken(): Promise<string | null> {
  try {
    // First, try to get token from Clerk auth
    const { getToken } = await auth();
    const clerkToken = await getToken();
    
    if (clerkToken) {
      return clerkToken;
    }
    
    // If no Clerk token, try to get from __session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session');
    
    if (sessionCookie?.value) {
      return sessionCookie.value;
    }
    
    // Last resort: check for auth_token cookie (legacy)
    const authCookie = cookieStore.get('auth_token');
    if (authCookie?.value) {
      return authCookie.value;
    }
    return null;
  } catch (error) {
    console.error('Failed to get server-side authentication token:', error);
    
    // Fallback: try to read __session cookie directly
    try {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get('__session');
      
      if (sessionCookie?.value) {
        return sessionCookie.value;
      }
    } catch (cookieError) {
      console.error('Failed to read cookies:', cookieError);
    }
    
    return null;
  }
}