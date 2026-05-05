# Backend Architecture

## Overview

Kiến trúc **Feature-based Modular Monolith** — mỗi tính năng nghiệp vụ là một module độc lập, chia sẻ hạ tầng qua `core/` và tiện ích qua `shared/`.

```
Request → main.ts (Global Pipes/Interceptors)
        → AppModule
        → FeatureModule (e.g. ProductsModule)
        → Controller → Service → Repository → Database
```

---

## Full Folder Structure

```
backend-nest-webshop/
├── src/
│   ├── main.ts                          ← Bootstrap, global config
│   ├── app.module.ts                    ← Root module
│   ├── app.controller.ts                ← Health check endpoint
│   ├── app.service.ts
│   │
│   ├── features/                        ← Business domain modules
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   ├── update-user.dto.ts
│   │   │   │   └── query-user.dto.ts
│   │   │   └── entities/
│   │   │       └── user.entity.ts
│   │   │
│   │   ├── products/
│   │   │   ├── products.module.ts
│   │   │   ├── products.controller.ts
│   │   │   ├── products.service.ts
│   │   │   ├── products.repository.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-product.dto.ts
│   │   │   │   ├── update-product.dto.ts
│   │   │   │   └── query-product.dto.ts
│   │   │   └── entities/
│   │   │       └── product.entity.ts
│   │   │
│   │   ├── categories/
│   │   │   ├── categories.module.ts
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   ├── categories.repository.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-category.dto.ts
│   │   │   │   └── update-category.dto.ts
│   │   │   └── entities/
│   │   │       └── category.entity.ts
│   │   │
│   │   ├── orders/
│   │   │   ├── orders.module.ts
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   ├── orders.repository.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-order.dto.ts
│   │   │   │   └── query-order.dto.ts
│   │   │   └── entities/
│   │   │       ├── order.entity.ts
│   │   │       └── order-item.entity.ts
│   │   │
│   │   ├── cart/
│   │   │   ├── cart.module.ts
│   │   │   ├── cart.controller.ts
│   │   │   ├── cart.service.ts
│   │   │   ├── cart.repository.ts
│   │   │   ├── dto/
│   │   │   │   ├── add-cart-item.dto.ts
│   │   │   │   └── update-cart-item.dto.ts
│   │   │   └── entities/
│   │   │       └── cart-item.entity.ts
│   │   │
│   │   └── payments/
│   │       ├── payments.module.ts
│   │       ├── payments.controller.ts
│   │       ├── payments.service.ts
│   │       └── dto/
│   │           └── create-payment.dto.ts
│   │
│   ├── core/                            ← Infrastructure (shared across all features)
│   │   ├── database/
│   │   │   ├── database.module.ts       ← TypeORM async connection
│   │   │   └── database.config.ts       ← Reads from ConfigService
│   │   └── logger/
│   │       └── logger.module.ts         ← NestJS Logger wrapper
│   │
│   └── shared/                          ← Reusable utilities (no business logic)
│       ├── decorators/
│       │   ├── current-user.decorator.ts
│       │   └── public.decorator.ts
│       ├── guards/
│       │   └── jwt-auth.guard.ts
│       ├── interceptors/
│       │   └── transform.interceptor.ts
│       ├── pipes/
│       └── types/
│           ├── response.type.ts
│           └── pagination.type.ts
│
├── test/
│   └── app.e2e-spec.ts
│
├── docs/
│   ├── BE-ARCHITECTURE.md               ← This file
│   └── BE-PROJECT-RULES.md
│
├── .env                                 ← Local (gitignored)
├── .env.example                         ← Committed template
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
└── package.json
```

---

## Layer Responsibilities

```
┌─────────────────────────────────────────┐
│           HTTP Request                  │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  main.ts  (Global Layer)                │
│  • ValidationPipe                       │
│  • TransformInterceptor                 │
│  • CORS, Global Prefix /api/v1          │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Controller  (HTTP Adapter)             │
│  • Parse params, body, query            │
│  • Apply guards, pipes per route        │
│  • Delegate to Service                  │
│  • No business logic                    │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Service  (Business Logic)              │
│  • Validate business rules              │
│  • Orchestrate repositories             │
│  • Throw HTTP exceptions                │
│  • No DB queries directly               │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Repository  (Data Access)              │
│  • TypeORM queries only                 │
│  • No business logic                    │
│  • Returns entity or null               │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Database  (MySQL via TypeORM)          │
└─────────────────────────────────────────┘
```

---

## Module Dependency Graph

```
AppModule
├── ConfigModule (global)          ← @nestjs/config, reads .env
├── DatabaseModule                 ← TypeORM connection
├── AuthModule
│   └── uses: UsersModule (import)
├── UsersModule
├── ProductsModule
│   └── uses: CategoriesModule (import, to validate categoryId)
├── CategoriesModule
├── OrdersModule
│   └── uses: ProductsModule (import, to check stock)
├── CartModule
│   └── uses: ProductsModule (import, to validate items)
└── PaymentsModule
    └── uses: OrdersModule (import, to update order status)
```

**Rule:** Feature modules only import other feature modules when they need to call a service method. They NEVER reach into another module's repository directly.

---

## Core Module Details

### `core/database/`

Khởi tạo TypeORM connection một lần duy nhất ở root level:

```typescript
// database.module.ts
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
  ],
})
export class DatabaseModule {}
```

```typescript
// database.config.ts
export const getDatabaseConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: config.get('DB_HOST'),
  port: config.get<number>('DB_PORT'),
  username: config.get('DB_USERNAME'),
  password: config.get('DB_PASSWORD'),
  database: config.get('DB_DATABASE'),
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: config.get('NODE_ENV') !== 'production',
  logging: config.get('NODE_ENV') === 'development',
});
```

Mỗi feature module tự đăng ký entity của mình:
```typescript
// products.module.ts
TypeOrmModule.forFeature([ProductEntity])
```

---

## Shared Module Details

### `shared/decorators/`

```typescript
// current-user.decorator.ts
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;  // set by JwtStrategy.validate()
  },
);

// public.decorator.ts — marks a route as publicly accessible
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

### `shared/guards/`

```typescript
// jwt-auth.guard.ts — global guard, respects @Public()
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) { super(); }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}
```

### `shared/interceptors/`

```typescript
// transform.interceptor.ts — wraps all 2xx responses
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({ success: true, data, timestamp: new Date().toISOString() })),
    );
  }
}
```

### `shared/types/`

```typescript
// response.type.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// pagination.type.ts
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

---

## main.ts Bootstrap

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
```

---

## API Route Map

| Method | Route | Feature | Auth |
|--------|-------|---------|------|
| POST | `/api/v1/auth/register` | auth | Public |
| POST | `/api/v1/auth/login` | auth | Public |
| GET | `/api/v1/users/me` | users | JWT |
| PATCH | `/api/v1/users/me` | users | JWT |
| GET | `/api/v1/categories` | categories | Public |
| POST | `/api/v1/categories` | categories | JWT (Admin) |
| GET | `/api/v1/products` | products | Public |
| GET | `/api/v1/products/:id` | products | Public |
| POST | `/api/v1/products` | products | JWT (Admin) |
| PATCH | `/api/v1/products/:id` | products | JWT (Admin) |
| DELETE | `/api/v1/products/:id` | products | JWT (Admin) |
| GET | `/api/v1/cart` | cart | JWT |
| POST | `/api/v1/cart/items` | cart | JWT |
| PATCH | `/api/v1/cart/items/:id` | cart | JWT |
| DELETE | `/api/v1/cart/items/:id` | cart | JWT |
| GET | `/api/v1/orders` | orders | JWT |
| POST | `/api/v1/orders` | orders | JWT |
| GET | `/api/v1/orders/:id` | orders | JWT |
| POST | `/api/v1/payments` | payments | JWT |

---

## Environment Variables

```
# .env.example
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=webshop

JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=7d
```

---

## Adding a New Feature

Khi dùng `/be-crud`, cấu trúc được sinh tự động. Làm thủ công theo thứ tự:

1. Tạo folder `src/features/<name>/`
2. Tạo entity → `entities/<name>.entity.ts`
3. Tạo DTOs → `dto/create-<name>.dto.ts`, `update-<name>.dto.ts`, `query-<name>.dto.ts`
4. Tạo repository → `<name>.repository.ts`
5. Tạo service → `<name>.service.ts`
6. Tạo controller → `<name>.controller.ts`
7. Tạo module → `<name>.module.ts` (import entity, provide service + repository)
8. Đăng ký module vào `app.module.ts`

```typescript
// app.module.ts — thêm vào imports[]
import { ProductsModule } from './features/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ProductsModule,  // ← thêm vào đây
  ],
})
export class AppModule {}
```
