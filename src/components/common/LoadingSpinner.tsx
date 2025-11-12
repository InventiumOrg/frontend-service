interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  message = 'Loading...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-brand-500 ${sizeClasses[size]}`}></div>
      {message && (
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">{message}</p>
      )}
    </div>
  );
}