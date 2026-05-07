import { createBrowserRouter } from 'react-router';
import { MainLayout } from '@layouts/MainLayout';
import { AuthLayout } from '@layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from './routes';
import { LoginPage } from '@features/auth/pages/LoginPage';
import { RegisterPage } from '@features/auth/pages/RegisterPage';
import { HomePage } from '@features/home/pages/HomePage';
import { BrandsPage } from '@features/brands/pages/BrandsPage';
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage';

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.REGISTER, element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: ROUTES.HOME, element: <HomePage /> },
          { path: ROUTES.BRANDS, element: <BrandsPage /> },
          { path: ROUTES.CATEGORIES, element: <CategoriesPage /> },
          { path: ROUTES.PRODUCTS, element: <div>Products Page (coming soon)</div> },
          { path: ROUTES.CART, element: <div>Cart Page (coming soon)</div> },
          { path: ROUTES.ORDERS, element: <div>Orders Page (coming soon)</div> },
          { path: ROUTES.PROFILE, element: <div>Profile Page (coming soon)</div> },
        ],
      },
    ],
  },
]);
