// Debug utility to test token retrieval
export function debugTokenRetrieval() {
  console.log('🔍 === TOKEN DEBUG SESSION ===');
  
  // Check if we're in browser
  if (typeof window === 'undefined') {
    console.log('❌ Running on server-side, no client tokens available');
    return;
  }
  
  // Check environment variable
  const envToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  console.log('1. Environment Token (NEXT_PUBLIC_AUTH_TOKEN):', {
    exists: !!envToken,
    preview: envToken ? `${envToken.substring(0, 30)}...` : 'NOT SET',
    length: envToken?.length || 0
  });
  
  // Check localStorage
  const localToken = localStorage.getItem('auth_token');
  console.log('2. localStorage auth_token:', {
    exists: !!localToken,
    preview: localToken ? `${localToken.substring(0, 30)}...` : 'NOT SET',
    length: localToken?.length || 0
  });
  
  // Check sessionStorage
  const sessionToken = sessionStorage.getItem('auth_token');
  console.log('3. sessionStorage auth_token:', {
    exists: !!sessionToken,
    preview: sessionToken ? `${sessionToken.substring(0, 30)}...` : 'NOT SET',
    length: sessionToken?.length || 0
  });
  
  // Test getAuthToken function
  try {
    const { getAuthToken } = require('./auth');
    const token = getAuthToken();
    console.log('4. getAuthToken() result:', {
      exists: !!token,
      preview: token ? `${token.substring(0, 30)}...` : 'NULL',
      length: token?.length || 0
    });
    
    if (token && envToken && token === envToken) {
      console.log('✅ Token matches environment variable');
    } else if (token && localToken && token === localToken) {
      console.log('✅ Token matches localStorage');
    } else if (token && sessionToken && token === sessionToken) {
      console.log('✅ Token matches sessionStorage');
    } else if (token) {
      console.log('⚠️ Token source unknown');
    } else {
      console.log('❌ No token retrieved');
    }
    
  } catch (error) {
    console.error('❌ Error calling getAuthToken():', error);
  }
  
  console.log('🔍 === END TOKEN DEBUG ===');
}

// Auto-run in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Add to window for manual testing
  (window as any).debugTokenRetrieval = debugTokenRetrieval;
  console.log('💡 Run debugTokenRetrieval() in console for detailed token analysis');
}