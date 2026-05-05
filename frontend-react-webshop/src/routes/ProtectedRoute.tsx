import { Navigate, Outlet } from 'react-router';
import { ROUTES } from './routes';

export function ProtectedRoute() {
  const token = localStorage.getItem('access_token');

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}
