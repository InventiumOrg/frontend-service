import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import paths from 'routes/paths';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  if (!isSignedIn) {
    return <Navigate to={paths.signin} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;