import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { LoggerModule } from './core/logger/logger.module';
import { AuthModule } from '@features/auth/auth.module';
import { BrandsModule } from '@features/brands/brands.module';
import { CategoriesModule } from '@features/categories/categories.module';
import { ProductsModule } from '@features/products/products.module';
import { UsersModule } from '@features/users/users.module';
import { DashboardModule } from '@features/dashboard/dashboard.module';
import { BannersModule } from '@features/banners/banners.module';
import { CustomersModule } from '@features/customers/customers.module';
import { CartModule } from '@features/cart/cart.module';
import { PaymentsModule } from '@features/payments/payments.module';
import { OrdersModule } from '@features/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    DatabaseModule,
    AuthModule,
    BrandsModule,
    CategoriesModule,
    ProductsModule,
    UsersModule,
    DashboardModule,
    BannersModule,
    CustomersModule,
    CartModule,
    PaymentsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
