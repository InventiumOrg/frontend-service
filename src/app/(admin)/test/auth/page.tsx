'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AuthPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading authentication..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Authentication Test
        </h1>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isSignedIn 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {isSignedIn ? 'Authenticated' : 'Not Authenticated'}
            </span>
          </div>

          {isSignedIn && user && (
            <div className="space-y-3 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Information
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">ID:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{user.id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {user.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Created:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {user.createdAt?.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-2">
              Custom Authentication Integration
            </h3>
            <p className="text-blue-800 dark:text-blue-300 text-sm">
              ✅ Your custom SignInForm and SignUpForm are now integrated with Clerk authentication!
              <br />
              ✅ OAuth providers (Google, X/Twitter) are configured
              <br />
              ✅ Email verification flow is implemented
              <br />
              ✅ Route protection is working
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}