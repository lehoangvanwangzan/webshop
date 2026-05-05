# Frontend Project Rules

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Routing | React Router v7 |
| Server State | TanStack Query v5 |
| Client State | Zustand |
| HTTP Client | Axios |
| Forms | React Hook Form + Zod |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |

---

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Files (component) | PascalCase | `ProductCard.tsx` |
| Files (hook) | camelCase với prefix `use` | `useProducts.ts` |
| Files (service/api) | camelCase | `products.api.ts` |
| Files (type) | camelCase | `product.types.ts` |
| Files (store) | camelCase | `cart.store.ts` |
| Files (util) | camelCase | `formatPrice.ts` |
| Folders | kebab-case | `order-detail/` |
| Components | PascalCase | `ProductCard`, `AuthLayout` |
| Hooks | camelCase với prefix `use` | `useProducts`, `useCart` |
| Types / Interfaces | PascalCase | `Product`, `CartItem` |
| Constants | UPPER_SNAKE_CASE | `ROUTES`, `QUERY_KEYS` |
| Env vars | `VITE_` prefix | `VITE_API_BASE_URL` |

---

## Component Pattern

### Function Component (Tiêu chuẩn)

```tsx
// ProductCard.tsx
interface ProductCardProps {
  product: Product;
  onAddToCart?: (id: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-500">{formatPrice(product.price)}</p>
      <button onClick={() => onAddToCart?.(product.id)}>Add to Cart</button>
    </div>
  );
}
```

**Rules:**
- Luôn dùng **named export** — không dùng `export default` (trừ lazy-loaded pages)
- Props interface đặt ngay trên component, suffix `Props`
- Không dùng `React.FC` — khai báo function trực tiếp
- Props optional dùng `?` và `onXxx?.(...)` để tránh crash
- Không truyền raw object xuống nhiều lớp — dùng Context hoặc Zustand

### Page Component

```tsx
// ProductsPage.tsx
export default function ProductsPage() {  // default export cho lazy loading
  const { data, isLoading } = useProducts();

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h1>Products</h1>
      <ProductList products={data?.items ?? []} />
    </div>
  );
}
```

---

## Hook Pattern

### Data Fetching Hook (TanStack Query)

```typescript
// useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@shared/constants/queryKeys';
import { productsApi } from '../api/products.api';

export function useProducts(params?: QueryProductParams) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, params],
    queryFn: () => productsApi.getAll(params),
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}
```

### Mutation Hook (TanStack Query)

```typescript
// useCreateProduct.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateProductDto) => productsApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
    },
  });
}
```

**Rules:**
- Mỗi feature có file hook riêng — không gộp chung
- Tên hook phản ánh action: `useProducts`, `useCreateProduct`, `useUpdateCart`
- Query key dùng constant từ `QUERY_KEYS` — không hardcode string
- Luôn set `enabled: !!id` khi query phụ thuộc vào param có thể undefined
- Sau mutation thành công, luôn `invalidateQueries` để refresh data

---

## API Service Pattern

```typescript
// products.api.ts
import apiClient from '@shared/lib/axios';
import type { ApiResponse, PaginatedResponse } from '@shared/types/api.types';
import type { Product, CreateProductDto, QueryProductParams } from '../types/product.types';

export const productsApi = {
  getAll(params?: QueryProductParams) {
    return apiClient
      .get<ApiResponse<PaginatedResponse<Product>>>('/products', { params })
      .then((res) => res.data.data);
  },

  getById(id: number) {
    return apiClient
      .get<ApiResponse<Product>>(`/products/${id}`)
      .then((res) => res.data.data);
  },

  create(dto: CreateProductDto) {
    return apiClient
      .post<ApiResponse<Product>>('/products', dto)
      .then((res) => res.data.data);
  },

  update(id: number, dto: Partial<CreateProductDto>) {
    return apiClient
      .patch<ApiResponse<Product>>(`/products/${id}`, dto)
      .then((res) => res.data.data);
  },

  remove(id: number) {
    return apiClient.delete(`/products/${id}`);
  },
};
```

**Rules:**
- Mỗi feature có file `<feature>.api.ts` riêng
- Luôn `.then((res) => res.data.data)` để unwrap API response
- Không xử lý error trong api service — để TanStack Query / caller xử lý
- Không gọi `axios` trực tiếp — luôn dùng `apiClient` từ `@shared/lib/axios`

---

## Type Pattern

```typescript
// product.types.ts
export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
}

export interface QueryProductParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
}
```

**Rules:**
- Dùng `interface` cho object shapes — dùng `type` cho union, intersection
- Types đặt trong folder `types/` của feature
- Đặt tên DTO trùng với backend để dễ map: `CreateProductDto`, `UpdateProductDto`
- Không dùng `any` — dùng `unknown` nếu cần, rồi narrow type

---

## Form Pattern (React Hook Form + Zod)

```typescript
// LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const login = useLogin();

  const onSubmit = async (values: LoginFormValues) => {
    await login.mutateAsync(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder="Email" />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <input type="password" {...register('password')} placeholder="Password" />
      {errors.password && <p className="text-red-500">{errors.password.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );
}
```

**Rules:**
- Schema Zod đặt ngay trên component hoặc trong file `<form>.schema.ts` riêng
- Dùng `z.infer<typeof schema>` để lấy type — không khai báo lại type thủ công
- Luôn dùng `isSubmitting` để disable button khi đang submit
- Không reset form thủ công — dùng `reset()` từ `useForm`

---

## State Management (Zustand)

Zustand chỉ dùng cho **client state** (không fetch từ server):

```typescript
// cart.store.ts
import { create } from 'zustand';

interface CartStore {
  itemCount: number;
  setItemCount: (count: number) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  itemCount: 0,
  setItemCount: (count) => set({ itemCount: count }),
}));
```

**Rules:**
- Zustand chỉ cho UI state: sidebar open/close, item count badge, selected filters
- Server data (products, orders...) luôn dùng TanStack Query — không cache vào Zustand
- Store nhỏ, focused — không gộp nhiều domain vào một store
- Export hook `useCartStore` — không export store object trực tiếp

---

## Routing Pattern

```typescript
// routes/routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  ORDERS: '/orders',
  PROFILE: '/profile',
} as const;

// Navigate programmatically
import { useNavigate } from 'react-router';
const navigate = useNavigate();
navigate(ROUTES.LOGIN);

// Link component
import { Link } from 'react-router';
<Link to={ROUTES.PRODUCTS}>Sản phẩm</Link>

// Route với param
<Link to={`/products/${product.id}`}>Chi tiết</Link>
```

**Rules:**
- Luôn dùng `ROUTES` constant — không hardcode string path
- `ProtectedRoute` bao tất cả routes cần đăng nhập
- Page components dùng `export default` để hỗ trợ lazy loading

---

## Error Handling

```typescript
// Hiển thị lỗi từ API
const { mutate, isPending, error } = useCreateProduct();

const errorMessage = error instanceof AxiosError
  ? error.response?.data?.message ?? 'Có lỗi xảy ra'
  : 'Có lỗi xảy ra';
```

**Rules:**
- Không dùng `try/catch` trong component — để TanStack Query handle
- Dùng `isError` và `error` từ `useQuery` / `useMutation` để hiển thị lỗi
- Error 401 được xử lý tự động bởi axios interceptor (redirect về `/login`)
- Không `console.error` trong production code

---

## Tailwind CSS Rules

```tsx
// ✅ Đúng — utility classes trực tiếp
<button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
  Thêm vào giỏ
</button>

// ❌ Sai — không tạo class CSS riêng cho styling đơn giản
<button className="add-to-cart-btn">Thêm vào giỏ</button>
```

**Rules:**
- Dùng utility classes trực tiếp — tránh viết CSS file riêng ngoài `index.css`
- Responsive: mobile-first — `sm:`, `md:`, `lg:`
- Màu sắc nhất quán theo design system (cấu hình trong `tailwind.config.js`)
- Không dùng inline `style={{}}` trừ khi giá trị dynamic không thể dùng utility

---

## Anti-Patterns (Never Do)

| Anti-pattern | Tại sao | Fix |
|-------------|---------|-----|
| `export default` cho shared components | Khó refactor, mất autocomplete | Dùng named export |
| Gọi `axios` trực tiếp trong component | Bỏ qua interceptor, không reusable | Dùng `apiClient` + api service |
| Server data trong Zustand | Double source of truth | Dùng TanStack Query |
| `useEffect` để fetch data | Verbose, không handle loading/error tốt | Dùng `useQuery` |
| Hardcode URL path string | Dễ typo, khó rename | Dùng `ROUTES` constant |
| Props drilling quá 2 cấp | Code rối, khó maintain | Dùng Context hoặc Zustand |
| `any` type | Mất type safety | Dùng proper type hoặc `unknown` |
| Mutation không `invalidateQueries` | UI stale sau khi thay đổi dữ liệu | Luôn invalidate query liên quan |
| Logic trong JSX (ternary lồng nhau) | Khó đọc | Extract thành biến hoặc component |
| Import từ folder khác feature | Tạo coupling | Chỉ import từ `@shared/` |

---

## Import Order

```typescript
// 1. React core
import { useState, useEffect } from 'react';

// 2. Third-party libs
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';

// 3. Internal — shared (path alias)
import apiClient from '@shared/lib/axios';
import type { ApiResponse } from '@shared/types/api.types';

// 4. Internal — same feature (relative)
import { productsApi } from '../api/products.api';
import type { Product } from '../types/product.types';

// 5. Styles (nếu có)
import './ProductCard.css';
```

---

## Environment Variables

```
# .env.example
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=WebShop
```

Truy cập trong code:
```typescript
// ✅ Đúng
const baseUrl = import.meta.env.VITE_API_BASE_URL;

// ❌ Sai — process.env không hoạt động trong Vite
const baseUrl = process.env.VITE_API_BASE_URL;
```

**Rules:**
- Tất cả env var phải có prefix `VITE_` mới accessible trong browser
- Không commit `.env` — chỉ commit `.env.example`
- Không hardcode URL API trong code — luôn dùng `import.meta.env`
