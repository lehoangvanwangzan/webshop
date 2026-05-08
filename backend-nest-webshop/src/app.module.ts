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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
