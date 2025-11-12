# Clerk Authentication Migration Guide

## Overview
This project has been migrated from manual JWT token management to Clerk authentication for better security and user management.

## Environment Variables Required

Add these to your `.env` file:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here  # ⚠️ REPLACE WITH ACTUAL SECRET KEY

# Optional: Clerk URLs (if using custom domains)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### ⚠️ Important: Get Your Clerk Secret Key

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Go to **API Keys** section
4. Copy the **Secret Key** (starts with `sk_test_` or `sk_live_`)
5. Replace `sk_test_your_clerk_secret_key_here` in your `.env` file

### Fallback Behavior

Until you add the real Clerk secret key, the system will:
- ✅ Use your existing `NEXT_PUBLIC_AUTH_TOKEN` as fallback
- ✅ Continue working with current authentication
- ⚠️ Show warnings about missing Clerk token

## Key Changes

### 1. Middleware Configuration
The middleware (`src/middleware.ts`) protects all routes except:
- `/` - Home/welcome page
- `/sign-in/*` - Clerk sign-in pages
- `/sign-up/*` - Clerk sign-up pages
- `/api/webhooks/*` - Webhook endpoints
- `/about`, `/contact` - Public pages
- `/api/public/*` - Public API routes

### 2. Authentication Flow
- **Before**: Manual JWT tokens stored in localStorage/environment
- **After**: Clerk handles authentication with secure session management

### 2. API Requests
- **Before**: Manual Authorization header with static JWT
- **After**: Dynamic Clerk tokens retrieved per request

### 3. Client-Side Usage
```typescript
// OLD WAY (deprecated)
import { updateInventoryItem } from '@/lib/inventory';

// NEW WAY (recommended)
import { useInventoryClient } from '@/lib/inventory-client';

function MyComponent() {
  const { updateInventoryItem } = useInventoryClient();
  // ... use the function
}
```

### 4. Server-Side Usage
```typescript
// Server components and API routes now use Clerk's auth()
import { getServerAuthToken } from '@/lib/auth-server';

const token = await getServerAuthToken(); // Gets Clerk token
```

## Migration Steps

1. **Install Clerk**: `npm install @clerk/nextjs`
2. **Configure environment variables** with your Clerk keys
3. **Update components** to use new Clerk-aware hooks
4. **Test authentication flow** with sign-in/sign-up pages

## Authentication Pages

- Sign In: `/sign-in`
- Sign Up: `/sign-up`

## Backward Compatibility

The old authentication functions are still available but deprecated:
- `getAuthToken()` - Falls back to environment token
- `setAuthToken()` - Logs deprecation warning
- `removeAuthToken()` - Logs deprecation warning

## Benefits

✅ **Secure session management**  
✅ **Built-in user management**  
✅ **Organization support**  
✅ **Social login options**  
✅ **Automatic token refresh**  
✅ **Better security practices**  

## Troubleshooting

1. **"Authentication required" errors**: Ensure user is signed in via Clerk
2. **Token not found**: Check Clerk configuration and environment variables
3. **CORS issues**: Verify Clerk domain settings match your deployment

## Authentication & Route Protection

### Automatic Protection
- **Middleware** (`src/middleware.ts`): All routes are protected by default except public routes
- **Admin Layout**: Automatically redirects unauthenticated users to sign-in
- **Home Page**: Shows welcome page for unauthenticated users, redirects authenticated users to `/inventory`

### Manual Protection
```typescript
// Using AuthGuard component
import AuthGuard from '@/components/auth/AuthGuard';

<AuthGuard>
  <ProtectedContent />
</AuthGuard>

// Using withAuth HOC
import { withAuth } from '@/components/auth/withAuth';
const ProtectedPage = withAuth(MyPage);

// Using Clerk hooks directly
import { useAuth } from '@clerk/nextjs';
const { isSignedIn, isLoaded } = useAuth();
```

### Organization Requirements
```typescript
// Require organization membership
import { withOrgAuth } from '@/components/auth/withAuth';
const OrgPage = withOrgAuth(MyPage);

// Or with AuthGuard
<AuthGuard requireOrganization>
  <OrgContent />
</AuthGuard>
```

## Image Configuration

The Next.js config has been updated to allow Clerk user avatars:

```typescript
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'img.clerk.com',
      port: '',
      pathname: '/**',
    },
  ],
}
```

## Next Steps

1. Remove the old `NEXT_PUBLIC_AUTH_TOKEN` from environment
2. Update all client components to use `useInventoryClient()`
3. Add user profile components where needed
4. Configure Clerk organization settings if using multi-tenant features
5. Test authentication flow with sign-in/sign-up pages
6. Customize Clerk appearance to match your brand
7. Restart dev server after config changes