import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { Customer } from '@features/customers/entities/customer.entity';
import { CustomersModule } from '@features/customers/customers.module';
import { CartModule } from '@features/cart/cart.module';
import { PaymentsModule } from '@features/payments/payments.module';
import { OrdersController } from './orders.controller';
import { AdminOrdersController } from './admin-orders.controller';
import { OrdersService } from './orders.service';
import { RolesGuard } from '@shared/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, Customer]),
    CustomersModule,
    CartModule,
    PaymentsModule,
  ],
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService, RolesGuard],
  exports: [OrdersService],
})
export class OrdersModule {}
