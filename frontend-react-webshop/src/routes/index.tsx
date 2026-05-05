import { createBrowserRouter } from 'react-router';
import { MainLayout } from '@layouts/MainLayout';
import { AuthLayout } from '@layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from './routes';

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.LOGIN, element: <div>Login Page (coming soon)</div> },
      { path: ROUTES.REGISTER, element: <div>Register Page (coming soon)</div> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: ROUTES.HOME, element: <div>Home Page (coming soon)</div> },
          { path: ROUTES.PRODUCTS, element: <div>Products Page (coming soon)</div> },
          { path: ROUTES.CART, element: <div>Cart Page (coming soon)</div> },
          { path: ROUTES.ORDERS, element: <div>Orders Page (coming soon)</div> },
          { path: ROUTES.PROFILE, element: <div>Profile Page (coming soon)</div> },
        ],
      },
    ],
  },
]);
