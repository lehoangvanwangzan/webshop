# Backend Project Rules

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | NestJS 11 |
| Language | TypeScript (strict) |
| ORM | TypeORM + MySQL |
| Auth | JWT (access token) + Passport |
| Validation | class-validator + class-transformer |
| Config | @nestjs/config (.env) |

---

## Folder Structure (Feature-based)

```
src/
├── features/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.repository.ts        ← optional if custom queries needed
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── entities/
│   │   │   └── auth-token.entity.ts  ← if needed
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   └── products/
│       ├── products.module.ts
│       ├── products.controller.ts
│       ├── products.service.ts
│       ├── products.repository.ts
│       ├── dto/
│       │   ├── create-product.dto.ts
│       │   ├── update-product.dto.ts
│       │   └── query-product.dto.ts
│       └── entities/
│           └── product.entity.ts
├── core/
│   ├── database/
│   │   ├── database.module.ts
│   │   └── database.config.ts
│   └── logger/
│       └── logger.module.ts
└── shared/
    ├── decorators/
    │   └── current-user.decorator.ts
    ├── guards/
    │   └── jwt-auth.guard.ts
    ├── interceptors/
    │   └── transform.interceptor.ts
    ├── pipes/
    └── types/
        ├── response.type.ts
        └── pagination.type.ts
```

---

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `create-product.dto.ts` |
| Classes | PascalCase | `ProductsService` |
| Methods / Variables | camelCase | `findAll()`, `userId` |
| Constants | UPPER_SNAKE_CASE | `JWT_SECRET` |
| DB Tables | snake_case (plural) | `products`, `order_items` |
| DB Columns | snake_case | `created_at`, `user_id` |
| Env vars | UPPER_SNAKE_CASE | `DB_HOST`, `JWT_EXPIRES_IN` |
| Route prefix | kebab-case (plural) | `/products`, `/order-items` |
| DTO suffix | always `.dto.ts` | `CreateProductDto` |
| Entity suffix | always `.entity.ts` | `ProductEntity` |
| Guard suffix | always `.guard.ts` | `JwtAuthGuard` |

---

## Module Pattern

Every feature module follows this structure:

```typescript
// products.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService],  // export only what other modules need
})
export class ProductsModule {}
```

**Rules:**
- One module per feature folder
- Register entities with `TypeOrmModule.forFeature()` inside the feature module
- Export services only when another module needs them
- Never import a feature module into another feature module directly — use shared services or events instead

---

## Controller Pattern

```typescript
@Controller('products')
@UseGuards(JwtAuthGuard)         // apply at controller level if all routes protected
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
```

**Rules:**
- Controllers only handle HTTP — no business logic
- Always use `ParseIntPipe` for numeric route params
- Use `@HttpCode()` explicitly for non-200 responses
- Apply `@UseGuards(JwtAuthGuard)` at controller level unless some routes are public
- Public routes get `@Public()` decorator (custom) to bypass the guard

---

## Service Pattern

```typescript
@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async findAll(query: QueryProductDto): Promise<PaginatedResponse<ProductEntity>> {
    return this.productsRepository.findPaginated(query);
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productsRepository.findById(id);
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  async create(dto: CreateProductDto): Promise<ProductEntity> {
    return this.productsRepository.createOne(dto);
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductEntity> {
    await this.findOne(id);  // throws NotFoundException if not found
    return this.productsRepository.updateOne(id, dto);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.productsRepository.deleteOne(id);
  }
}
```

**Rules:**
- Services contain all business logic
- Throw NestJS HTTP exceptions (`NotFoundException`, `BadRequestException`, `ConflictException`) — never raw `Error`
- Call `findOne()` before update/delete to validate existence
- Services return domain objects, not HTTP responses

---

## Repository Pattern

```typescript
@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async findPaginated(query: QueryProductDto): Promise<PaginatedResponse<ProductEntity>> {
    const { page = 1, limit = 10 } = query;
    const [items, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  createOne(dto: CreateProductDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async updateOne(id: number, dto: UpdateProductDto) {
    await this.repo.update(id, dto);
    return this.findById(id);
  }

  deleteOne(id: number) {
    return this.repo.delete(id);
  }
}
```

**Rules:**
- Repositories only do data access — no business logic, no HTTP exceptions
- Use `findOne({ where: { id } })` — never `findOne(id)` (deprecated TypeORM API)
- Pagination: always use `findAndCount` for list endpoints
- Return `null` (not throw) when entity not found — let the service decide what to do

---

## DTO Pattern

```typescript
// create-product.dto.ts
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsInt()
  categoryId: number;
}

// update-product.dto.ts
export class UpdateProductDto extends PartialType(CreateProductDto) {}

// query-product.dto.ts
export class QueryProductDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
```

**Rules:**
- Always extend `UpdateProductDto` from `PartialType(CreateProductDto)` — never duplicate fields
- Query DTOs use `@Type(() => Number)` for numeric query params (because query params come in as strings)
- `@IsOptional()` must come before other decorators
- Never put business logic in DTOs
- Never expose passwords or sensitive fields in response DTOs

---

## Entity Pattern

```typescript
// product.entity.ts
@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @Column({ name: 'category_id' })
  categoryId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

**Rules:**
- Table names: `snake_case`, plural (`products`, `order_items`)
- Column names: `snake_case` — use `name` option in `@Column({ name: 'created_at' })`
- Always use `@CreateDateColumn` and `@UpdateDateColumn`
- Always expose FK column explicitly (`categoryId`) alongside the relation (`category`)
- Never use `synchronize: true` in production — use migrations

---

## Auth Pattern

```typescript
// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  validate(payload: { sub: number; email: string }) {
    return { id: payload.sub, email: payload.email };
  }
}

// jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}

// public.decorator.ts
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// usage in controller
@Public()
@Post('login')
login(@Body() dto: LoginDto) { ... }
```

**Rules:**
- JWT strategy validates token and returns minimal user object `{ id, email }`
- Use `@CurrentUser()` decorator to access the logged-in user in controllers
- Apply `JwtAuthGuard` globally in `app.module.ts` or `main.ts` — use `@Public()` to opt out
- Never store plain-text passwords — always bcrypt with salt rounds ≥ 10
- Access tokens expire in 7 days (configurable via `JWT_EXPIRES_IN`)

---

## Error Handling

Use NestJS built-in HTTP exceptions — never throw raw `Error`:

```typescript
// ✅ Correct
throw new NotFoundException('Product not found');
throw new BadRequestException('Price must be positive');
throw new ConflictException('Email already exists');
throw new UnauthorizedException('Invalid credentials');
throw new ForbiddenException('Access denied');

// ❌ Wrong
throw new Error('Product not found');
throw { message: 'not found', status: 404 };
```

The global `TransformInterceptor` wraps successful responses. For errors, NestJS's default exception filter returns:
```json
{
  "statusCode": 404,
  "message": "Product not found",
  "error": "Not Found"
}
```

---

## Response Format

All successful responses are wrapped by `TransformInterceptor`:

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

Paginated responses:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  },
  "timestamp": "..."
}
```

---

## Anti-Patterns (Never Do)

| Anti-pattern | Why | Fix |
|-------------|-----|-----|
| Business logic in Controller | Controllers are HTTP adapters only | Move to Service |
| DB queries in Service | Mixes concerns, hard to test | Move to Repository |
| `findOne(id)` in TypeORM | Deprecated API | Use `findOne({ where: { id } })` |
| Returning raw TypeORM entities with passwords | Security leak | Use response DTOs or `@Exclude()` |
| `synchronize: true` in production | Can silently destroy data | Use migrations |
| `any` type | Defeats TypeScript | Use proper types or `unknown` |
| Swallowing exceptions with empty catch | Hides bugs | Always re-throw or log |
| Importing feature modules into each other | Circular deps | Use shared services or events |
| Hardcoded secrets in code | Security risk | Always use `.env` via ConfigService |
| `console.log` in production code | Use NestJS Logger | `this.logger = new Logger(ClassName.name)` |

---

## Validation (Global)

Registered in `main.ts`:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,           // strip unknown properties
    forbidNonWhitelisted: true, // throw if unknown properties sent
    transform: true,           // auto-transform types (string → number for @Type)
  }),
);
```

---

## Environment Variables

All config accessed via `ConfigService` — never `process.env` directly:

```typescript
// ✅ Correct
constructor(private configService: ConfigService) {}
const secret = this.configService.get<string>('JWT_SECRET');

// ❌ Wrong
const secret = process.env.JWT_SECRET;
```

---

## Git & Code Style

- **Branch naming:** `feat/product-crud`, `fix/auth-token-expire`, `chore/update-deps`
- **Commit format:** `feat: add product search`, `fix: handle missing category`, `chore: update dependencies`
- **No unused imports** — ESLint enforces this
- **No `console.log`** in committed code — use NestJS `Logger`
- **Prettier** runs on save — do not disable formatting
