'use client';

import { UserButton, useUser } from '@clerk/nextjs';

export default function UserProfile() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-3">
        <div className="animate-pulse">
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {user.fullName || user.emailAddresses[0]?.emailAddress}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {user.organizationMemberships?.[0]?.organization?.name || 'Personal Account'}
        </p>
      </div>
      <UserButton 
        appearance={{
          elements: {
            avatarBox: 'h-8 w-8',
          },
        }}
        showName={false}
      />
    </div>
  );
}