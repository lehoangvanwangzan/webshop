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
import { CartPage } from '@features/cart/pages/CartPage';
import { CheckoutPage } from '@features/orders/pages/CheckoutPage';
import { MyOrdersPage } from '@features/orders/pages/MyOrdersPage';
import { OrderDetailPage } from '@features/orders/pages/OrderDetailPage';
import { AdminDashboardPage } from '@features/dashboard/pages/AdminDashboardPage';
import { AdminProductsPage } from '@features/products/pages/AdminProductsPage';
import { AdminBannersPage } from '@features/banners/pages/AdminBannersPage';
import { AdminUsersPage } from '@features/users/pages/AdminUsersPage';
import { AdminSettingsPage } from '@features/settings/pages/AdminSettingsPage';
import { AdminOrdersPage } from '@features/orders/pages/AdminOrdersPage';
import { AdminCategoriesPage } from '@features/categories/pages/AdminCategoriesPage';
import { AdminBrandsPage } from '@features/brands/pages/AdminBrandsPage';
import { ProductDetailPage } from '@features/products/pages/ProductDetailPage';

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
      { path: ROUTES.PRODUCT_DETAIL, element: <ProductDetailPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: ROUTES.CART, element: <CartPage /> },
          { path: ROUTES.CHECKOUT, element: <CheckoutPage /> },
          { path: ROUTES.ORDERS, element: <MyOrdersPage /> },
          { path: ROUTES.ORDER_DETAIL, element: <OrderDetailPage /> },
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
          { path: ROUTES.ADMIN_BANNERS, element: <AdminBannersPage /> },
          { path: ROUTES.ADMIN_USERS, element: <AdminUsersPage /> },
          { path: ROUTES.ADMIN_ORDERS, element: <AdminOrdersPage /> },
          { path: ROUTES.ADMIN_SETTINGS, element: <AdminSettingsPage /> },
          { path: ROUTES.ADMIN_CATEGORIES, element: <AdminCategoriesPage /> },
          { path: ROUTES.ADMIN_BRANDS, element: <AdminBrandsPage /> },
        ],
      },
    ],
  },
]);
