import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { Transaction } from './entities/transaction.entity';
import { PaymentsService } from './payments.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod, Transaction])],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
