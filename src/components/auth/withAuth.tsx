'use client';

import { ComponentType } from 'react';
import AuthGuard from './AuthGuard';

interface WithAuthOptions {
  redirectTo?: string;
  requireOrganization?: boolean;
  fallback?: React.ReactNode;
}

// Higher-order component for protecting pages with authentication
export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const AuthenticatedComponent = (props: P) => {
    return (
      <AuthGuard
        redirectTo={options.redirectTo}
        requireOrganization={options.requireOrganization}
        fallback={options.fallback}
      >
        <Component {...props} />
      </AuthGuard>
    );
  };

  // Set display name for debugging
  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;

  return AuthenticatedComponent;
}

// Convenience wrapper for pages that require organization membership
export function withOrgAuth<P extends object>(
  Component: ComponentType<P>,
  options: Omit<WithAuthOptions, 'requireOrganization'> = {}
) {
  return withAuth(Component, { ...options, requireOrganization: true });
}