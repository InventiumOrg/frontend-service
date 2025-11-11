// Environment configuration checker
export function checkClerkConfiguration() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;
  
  const issues: string[] = [];
  
  if (!publishableKey) {
    issues.push('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
  }
  
  if (!secretKey || secretKey === 'sk_test_your_clerk_secret_key_here') {
    issues.push('Missing or placeholder CLERK_SECRET_KEY');
  }
  
  if (issues.length > 0) {
    console.warn('🔧 Clerk Configuration Issues:');
    issues.forEach(issue => console.warn(`  - ${issue}`));
    console.warn('📖 See CLERK_MIGRATION.md for setup instructions');
    
    if (process.env.NEXT_PUBLIC_AUTH_TOKEN) {
      console.info('✅ Fallback: Using NEXT_PUBLIC_AUTH_TOKEN for now');
    } else {
      console.error('❌ No authentication token available');
    }
  } else {
    console.info('✅ Clerk configuration looks good');
  }
  
  return issues.length === 0;
}

// Auto-check in development
if (process.env.NODE_ENV === 'development') {
  checkClerkConfiguration();
}