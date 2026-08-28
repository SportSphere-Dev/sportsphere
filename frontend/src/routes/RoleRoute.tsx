import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context';
import { LoadingSpinner } from '@/components/feedback';
import type { UserRole } from '@/types';

interface RoleRouteProps {
  requiredRole: UserRole;
  fallbackPath?: string;
}

export default function RoleRoute({ requiredRole, fallbackPath = '/venue' }: RoleRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" label="Checking authorization..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== requiredRole) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
}