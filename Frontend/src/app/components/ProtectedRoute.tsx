import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute() {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2EC4B6]" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!profile?.is_setup_complete) return <Navigate to="/setup" replace />;

  return <Outlet />;
}
