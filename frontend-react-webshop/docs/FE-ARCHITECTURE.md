# Frontend Architecture

## Overview

Kiến trúc **Feature-based** — mỗi tính năng nghiệp vụ là một folder độc lập chứa components, hooks, api, types của riêng nó. Chỉ những thứ dùng chung mới đặt vào `shared/`.

```
User Action → Component → Hook (TanStack Query / Zustand)
                               ↓
                         API Service (axios)
                               ↓
                         Backend REST API
```

---

## Full Folder Structure

```
frontend-react-webshop/
├── public/
│   └── vite.svg
│
├── src/
│   ├── main.tsx                         ← Entry point, providers setup
│   ├── index.css                        ← Tailwind directives + global styles
│   │
│   ├── features/                        ← Business domain modules
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   │   └── auth.api.ts          ← login, register API calls
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useLogin.ts
│   │   │   │   └── useRegister.ts
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   ├── schemas/
│   │   │   │   └── auth.schema.ts       ← Zod schemas
│   │   │   ├── stores/
│   │   │   │   └── auth.store.ts        ← Zustand: current user, token
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   │
│   │   ├── products/
│   │   │   ├── api/
│   │   │   │   └── products.api.ts
│   │   │   ├── components/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductList.tsx
│   │   │   │   └── ProductFilters.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useProducts.ts
│   │   │   │   └── useProduct.ts
│   │   │   ├── pages/
│   │   │   │   ├── ProductsPage.tsx
│   │   │   │   └── ProductDetailPage.tsx
│   │   │   └── types/
│   │   │       └── product.types.ts
│   │   │
│   │   ├── categories/
│   │   │   ├── api/
│   │   │   │   └── categories.api.ts
│   │   │   ├── hooks/
│   │   │   │   └── useCategories.ts
│   │   │   └── types/
│   │   │       └── category.types.ts
│   │   │
│   │   ├── cart/
│   │   │   ├── api/
│   │   │   │   └── cart.api.ts
│   │   │   ├── components/
│   │   │   │   ├── CartItem.tsx
│   │   │   │   └── CartSummary.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useCart.ts
│   │   │   │   └── useCartMutations.ts
│   │   │   ├── pages/
│   │   │   │   └── CartPage.tsx
│   │   │   ├── stores/
│   │   │   │   └── cart.store.ts        ← Zustand: item count badge
│   │   │   └── types/
│   │   │       └── cart.types.ts
│   │   │
│   │   ├── orders/
│   │   │   ├── api/
│   │   │   │   └── orders.api.ts
│   │   │   ├── components/
│   │   │   │   ├── OrderCard.tsx
│   │   │   │   └── OrderStatusBadge.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useOrders.ts
│   │   │   │   └── useCreateOrder.ts
│   │   │   ├── pages/
│   │   │   │   ├── OrdersPage.tsx
│   │   │   │   └── OrderDetailPage.tsx
│   │   │   └── types/
│   │   │       └── order.types.ts
│   │   │
│   │   └── users/
│   │       ├── api/
│   │       │   └── users.api.ts
│   │       ├── components/
│   │       │   └── ProfileForm.tsx
│   │       ├── hooks/
│   │       │   └── useProfile.ts
│   │       ├── pages/
│   │       │   └── ProfilePage.tsx
│   │       └── types/
│   │           └── user.types.ts
│   │
│   ├── shared/                          ← Reusable across all features
│   │   ├── components/                  ← Generic UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── PageLoader.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── hooks/                       ← Generic hooks
│   │   │   └── useDebounce.ts
│   │   ├── lib/
│   │   │   ├── axios.ts                 ← Axios instance + interceptors
│   │   │   └── queryClient.ts           ← TanStack Query client
│   │   ├── types/
│   │   │   └── api.types.ts             ← ApiResponse<T>, PaginatedResponse<T>
│   │   ├── constants/
│   │   │   └── queryKeys.ts             ← QUERY_KEYS constant
│   │   └── utils/
│   │       ├── formatPrice.ts
│   │       └── formatDate.ts
│   │
│   ├── layouts/
│   │   ├── MainLayout.tsx               ← Header + Outlet (authenticated pages)
│   │   └── AuthLayout.tsx               ← Centered card (login/register pages)
│   │
│   └── routes/
│       ├── routes.ts                    ← ROUTES constant
│       ├── index.tsx                    ← createBrowserRouter config
│       └── ProtectedRoute.tsx           ← JWT guard component
│
├── docs/
│   ├── FE-ARCHITECTURE.md               ← This file
│   └── FE-PROJECT-RULES.md
│
├── .env                                 ← Local (gitignored)
├── .env.example                         ← Committed template
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
└── package.json
```

---

## Data Flow

```
┌─────────────────────────────────────────┐
│           User Interaction              │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Page / Component                       │
│  • Renders UI                           │
│  • Calls hooks for data/actions         │
│  • No direct API calls                  │
└──────┬───────────────────────┬──────────┘
       │                       │
┌──────▼──────┐         ┌──────▼──────────┐
│ TanStack    │         │ Zustand Store   │
│ Query Hook  │         │                 │
│ (server     │         │ (client state:  │
│  state)     │         │  UI, auth token)│
└──────┬──────┘         └─────────────────┘
       │
┌──────▼──────────────────────────────────┐
│  API Service  (*.api.ts)                │
│  • Calls apiClient (axios instance)     │
│  • Unwraps ApiResponse<T>               │
└──────┬──────────────────────────────────┘
       │
┌──────▼──────────────────────────────────┐
│  Axios Instance  (@shared/lib/axios.ts) │
│  • Attaches JWT Bearer token            │
│  • Handles 401 → redirect /login        │
└──────┬──────────────────────────────────┘
       │
┌──────▼──────────────────────────────────┐
│  Backend REST API  (/api/v1/...)        │
└─────────────────────────────────────────┘
```

---

## Routing Structure

```
/                        → MainLayout > HomePage          (Protected)
/products                → MainLayout > ProductsPage      (Protected)
/products/:id            → MainLayout > ProductDetailPage (Protected)
/cart                    → MainLayout > CartPage          (Protected)
/orders                  → MainLayout > OrdersPage        (Protected)
/orders/:id              → MainLayout > OrderDetailPage   (Protected)
/profile                 → MainLayout > ProfilePage       (Protected)
/login                   → AuthLayout > LoginPage         (Public)
/register                → AuthLayout > RegisterPage      (Public)
```

```typescript
// routes/index.tsx
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
          { path: ROUTES.PRODUCTS, element: <ProductsPage /> },
          { path: ROUTES.PRODUCT_DETAIL, element: <ProductDetailPage /> },
          { path: ROUTES.CART, element: <CartPage /> },
          { path: ROUTES.ORDERS, element: <OrdersPage /> },
          { path: ROUTES.ORDER_DETAIL, element: <OrderDetailPage /> },
          { path: ROUTES.PROFILE, element: <ProfilePage /> },
        ],
      },
    ],
  },
]);
```

---

## Provider Setup (main.tsx)

```tsx
// main.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
```

Thứ tự providers quan trọng:
1. `QueryClientProvider` — bọc ngoài cùng để hook `useQuery` dùng được ở mọi nơi
2. `RouterProvider` — bên trong, cung cấp routing context

---

## Shared Module Details

### `shared/lib/axios.ts`

```typescript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request: attach JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response: handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
```

### `shared/lib/queryClient.ts`

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 phút
      retry: 1,
    },
  },
});
```

### `shared/constants/queryKeys.ts`

```typescript
export const QUERY_KEYS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  CART: 'cart',
  ORDERS: 'orders',
  PROFILE: 'profile',
} as const;
```

---

## Path Aliases

Cấu hình trong `vite.config.ts` và `tsconfig.app.json`:

| Alias | Resolves to |
|-------|-------------|
| `@/*` | `src/*` |
| `@features/*` | `src/features/*` |
| `@shared/*` | `src/shared/*` |
| `@layouts/*` | `src/layouts/*` |
| `@routes/*` | `src/routes/*` |

```typescript
// ✅ Dùng alias — import từ shared
import apiClient from '@shared/lib/axios';
import type { ApiResponse } from '@shared/types/api.types';

// ✅ Dùng relative — import trong cùng feature
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../types/product.types';

// ❌ Không dùng alias để import giữa features
import { useCart } from '@features/cart/hooks/useCart';  // → tạo coupling
```

---

## Feature Isolation Rules

```
features/auth/       ←──┐
features/products/   ←──┤  Không import lẫn nhau trực tiếp
features/cart/       ←──┤
features/orders/     ←──┘

         ↕ Tất cả đều có thể import từ ↕

shared/              ← Utilities, components dùng chung
layouts/             ← Layout wrappers
routes/              ← Routing config
```

Nếu feature A cần data từ feature B → dùng **TanStack Query** (cùng query key sẽ share cache).

---

## Environment Variables

```
# .env.example
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=WebShop
```

---

## Adding a New Feature

Khi dùng `/fe-crud`, cấu trúc được sinh tự động. Làm thủ công theo thứ tự:

1. Tạo folder `src/features/<name>/`
2. Tạo types → `types/<name>.types.ts`
3. Tạo api service → `api/<name>.api.ts`
4. Tạo hooks → `hooks/use<Name>.ts`, `hooks/useCreate<Name>.ts`
5. Tạo components → `components/<Name>Card.tsx`, `<Name>List.tsx`
6. Tạo pages → `pages/<Name>Page.tsx`
7. Thêm route vào `routes/routes.ts` và `routes/index.tsx`
8. Thêm query key vào `shared/constants/queryKeys.ts`
