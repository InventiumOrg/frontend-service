'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/auth/AuthGuard';
import { withAuth, withOrgAuth } from '@/components/auth/withAuth';

// Example 1: Using AuthGuard component directly
export function AuthGuardExample() {
  return (
    <AuthGuard>
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Protected Content</h3>
        <p>This content is only visible to authenticated users.</p>
      </div>
    </AuthGuard>
  );
}

// Example 2: Using withAuth HOC
function ProtectedComponent() {
  const { user } = useUser();
  
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Protected Component</h3>
      <p>Welcome, {user?.fullName || user?.emailAddresses[0]?.emailAddress}!</p>
    </div>
  );
}

export const ProtectedComponentWithAuth = withAuth(ProtectedComponent);

// Example 3: Using withOrgAuth for organization-required content
function OrganizationComponent() {
  const { user } = useUser();
  const org = user?.organizationMemberships?.[0]?.organization;
  
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Organization Content</h3>
      <p>Organization: {org?.name}</p>
      <p>Role: {user?.organizationMemberships?.[0]?.role}</p>
    </div>
  );
}

export const OrganizationComponentWithAuth = withOrgAuth(OrganizationComponent);

// Example 4: Manual authentication check
export function ManualAuthCheck() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-700">Please sign in to view this content.</p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-green-200 rounded-lg bg-green-50">
      <h3 className="text-lg font-semibold mb-2 text-green-800">Manual Auth Check</h3>
      <p className="text-green-700">
        Authenticated as: {user?.fullName || user?.emailAddresses[0]?.emailAddress}
      </p>
    </div>
  );
}

// Example 5: Custom fallback with AuthGuard
export function CustomFallbackExample() {
  const customFallback = (
    <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
      <h3 className="text-lg font-semibold mb-2 text-yellow-800">Custom Sign-In Required</h3>
      <p className="text-yellow-700">This is a custom message for unauthenticated users.</p>
    </div>
  );

  return (
    <AuthGuard fallback={customFallback}>
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Content with Custom Fallback</h3>
        <p>This content has a custom fallback message.</p>
      </div>
    </AuthGuard>
  );
}