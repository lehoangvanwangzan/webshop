import { createBrowserRouter, Navigate } from 'react-router';
import { MainLayout } from '@layouts/MainLayout';
import { AuthLayout } from '@layouts/AuthLayout';
import { AdminLayout } from '@layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { ROUTES } from './routes';
import { LoginPage } from '@features/auth/pages/LoginPage';
import { RegisterPage } from '@features/auth/pages/RegisterPage';
import { HomePage } from '@features/home/pages/HomePage';
import { BrandsPage } from '@features/brands/pages/BrandsPage';
import { AdminDashboardPage } from '@features/dashboard/pages/AdminDashboardPage';
import { AdminProductsPage } from '@features/products/pages/AdminProductsPage';
import { AdminUsersPage } from '@features/users/pages/AdminUsersPage';
import { AdminSettingsPage } from '@features/settings/pages/AdminSettingsPage';
import { AdminOrdersPage } from '@features/orders/pages/AdminOrdersPage';

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.REGISTER, element: <RegisterPage /> },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.BRANDS, element: <BrandsPage /> },
      { path: ROUTES.PRODUCTS, element: <div>Products Page (coming soon)</div> },
      { path: ROUTES.PRODUCT_DETAIL, element: <div>Product Detail (coming soon)</div> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: ROUTES.CART, element: <div>Cart Page (coming soon)</div> },
          { path: ROUTES.ORDERS, element: <div>Orders Page (coming soon)</div> },
          { path: ROUTES.ORDER_DETAIL, element: <div>Order Detail (coming soon)</div> },
          { path: ROUTES.PROFILE, element: <div>Profile Page (coming soon)</div> },
        ],
      },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: ROUTES.ADMIN, element: <Navigate to={ROUTES.ADMIN_DASHBOARD} replace /> },
          { path: ROUTES.ADMIN_DASHBOARD, element: <AdminDashboardPage /> },
          { path: ROUTES.ADMIN_PRODUCTS, element: <AdminProductsPage /> },
          { path: ROUTES.ADMIN_USERS, element: <AdminUsersPage /> },
          { path: ROUTES.ADMIN_ORDERS, element: <AdminOrdersPage /> },
          { path: ROUTES.ADMIN_SETTINGS, element: <AdminSettingsPage /> },
        ],
      },
    ],
  },
]);
