'use client';

import Link from 'next/link';

export default function RoutesPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Routes Test Page
        </h1>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Authentication Routes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/sign-in"
              className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <h3 className="font-semibold text-blue-900 dark:text-blue-400">
                Sign In Page
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                /sign-in - Custom SignInForm with Clerk integration
              </p>
            </Link>
            
            <Link
              href="/sign-up"
              className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <h3 className="font-semibold text-green-900 dark:text-green-400">
                Sign Up Page
              </h3>
              <p className="text-green-700 dark:text-green-300 text-sm">
                /sign-up - Custom SignUpForm with Clerk integration
              </p>
            </Link>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              ✅ Route Consolidation Complete
            </h3>
            <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
              <li>• Moved custom auth forms to main Clerk routes (/sign-in, /sign-up)</li>
              <li>• Integrated beautiful split-screen layout with your custom forms</li>
              <li>• Removed conflicting routes from (full-width-pages)</li>
              <li>• Updated all navigation links and references</li>
              <li>• Clerk authentication now uses your custom UI</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}