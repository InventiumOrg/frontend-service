// Test utility for inventory edit authentication
import { updateInventoryItem } from './inventory';

export async function testInventoryEditAuth() {
  console.log('🧪 Testing inventory edit authentication...');
  
  try {
    // Try to update a test item (this will show the auth headers in console)
    await updateInventoryItem(1, {
      name: 'Test Update - Auth Check',
      quantity: 999
    });
    
    console.log('✅ Inventory edit authentication test passed!');
    return true;
  } catch (error) {
    console.error('❌ Inventory edit authentication test failed:', error);
    
    // Check if it's an auth error
    if (error instanceof Error && error.message.includes('401')) {
      console.error('🔐 Authentication failed - check your JWT token');
    }
    
    return false;
  }
}

// Auto-run test in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Add to window for manual testing
  (window as any).testInventoryEditAuth = testInventoryEditAuth;
  console.log('💡 Run testInventoryEditAuth() in console to test edit authentication');
}