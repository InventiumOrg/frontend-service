// Authentication debugging utilities

// Debug client-side authentication
export function debugClientAuth() {
  if (typeof window === 'undefined') {
    console.log('❌ Cannot debug client auth on server-side');
    return;
  }
  
  console.log('🔍 === CLIENT AUTH DEBUG ===');
  
  // Check cookies
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=');
    acc[name] = value;
    return acc;
  }, {} as Record<string, string>);
  
  console.log('🍪 Available cookies:', Object.keys(cookies));
  
  // Check specific auth cookies
  const sessionCookie = cookies['__session'];
  const authCookie = cookies['auth_token'];
  
  console.log('🔑 __session cookie:', sessionCookie ? 'Found' : 'Not found');
  console.log('🔑 auth_token cookie:', authCookie ? 'Found' : 'Not found');
  
  // Check localStorage
  const localToken = localStorage.getItem('auth_token');
  console.log('💾 localStorage auth_token:', localToken ? 'Found' : 'Not found');
  
  // Check sessionStorage
  const sessionToken = sessionStorage.getItem('auth_token');
  console.log('💾 sessionStorage auth_token:', sessionToken ? 'Found' : 'Not found');
  
  console.log('🔍 === END CLIENT AUTH DEBUG ===');
}

// Debug server-side authentication (call from server components)
export async function debugServerAuth() {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    
    console.log('🔍 === SERVER AUTH DEBUG ===');
    
    // Get all cookies
    const allCookies = cookieStore.getAll();
    console.log('🍪 Available cookies:', allCookies.map(c => c.name));
    
    // Check specific auth cookies
    const sessionCookie = cookieStore.get('__session');
    const authCookie = cookieStore.get('auth_token');
    
    console.log('🔑 __session cookie:', sessionCookie?.value ? 'Found' : 'Not found');
    console.log('🔑 auth_token cookie:', authCookie?.value ? 'Found' : 'Not found');
    
    // Try Clerk auth
    try {
      const { auth } = await import('@clerk/nextjs/server');
      const { getToken } = await auth();
      const clerkToken = await getToken();
      console.log('🔐 Clerk token:', clerkToken ? 'Found' : 'Not found');
    } catch (clerkError) {
      console.log('🔐 Clerk token error:', 'Failed to retrieve');
    }
    
    console.log('🔍 === END SERVER AUTH DEBUG ===');
  } catch (error) {
    console.error('❌ Server auth debug error:', error);
  }
}

// Add to window for easy debugging
if (typeof window !== 'undefined') {
  (window as any).debugClientAuth = debugClientAuth;
  console.log('💡 Run debugClientAuth() in console to debug client authentication');
}