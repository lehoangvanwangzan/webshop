import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@features/users/entities/user.entity';
import { Product } from '@features/products/entities/product.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
