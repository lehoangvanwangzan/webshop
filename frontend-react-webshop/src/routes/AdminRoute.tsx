import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@features/auth/stores/auth.store';
import { ROUTES } from './routes';

export function AdminRoute() {
  const token = localStorage.getItem('access_token');
  const user = useAuthStore((s) => s.user);

  if (!token) return <Navigate to={ROUTES.LOGIN} replace />;
  if (user && user.role !== 'admin') return <Navigate to={ROUTES.HOME} replace />;

  return <Outlet />;
}
