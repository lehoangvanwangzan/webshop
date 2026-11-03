import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { Transaction } from './entities/transaction.entity';

/** Các phương thức thanh toán mặc định — tự tạo khi khởi động nếu DB chưa có */
const DEFAULT_PAYMENT_METHODS = [
  { method_code: 'cod', method_name: 'Thanh toán khi nhận hàng (COD)' },
];

@Injectable()
export class PaymentsService implements OnModuleInit {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  async onModuleInit() {
    for (const method of DEFAULT_PAYMENT_METHODS) {
      const exists = await this.paymentMethodRepository.exists({
        where: { method_code: method.method_code },
      });
      if (!exists) {
        await this.paymentMethodRepository.save(this.paymentMethodRepository.create(method));
        this.logger.log(`Đã tạo phương thức thanh toán "${method.method_code}"`);
      }
    }
  }

  findActive() {
    return this.paymentMethodRepository.find({ where: { is_active: true }, order: { id: 'ASC' } });
  }

  findActiveByCode(code: string) {
    return this.paymentMethodRepository.findOne({ where: { method_code: code, is_active: true } });
  }

  /** Tạo giao dịch thanh toán 'pending' cho đơn mới (chạy trong transaction của đơn hàng) */
  createPendingPayment(
    manager: EntityManager,
    data: { orderId: number; customerId: number; paymentMethodId: number; amount: number },
  ) {
    const repo = manager.getRepository(Transaction);
    return repo.save(
      repo.create({
        order_id: data.orderId,
        customer_id: data.customerId,
        payment_method_id: data.paymentMethodId,
        transaction_amount: data.amount,
        transaction_type: 'payment',
        status: 'pending',
      }),
    );
  }

  /** Đơn giao thành công (COD đã thu tiền) → giao dịch pending thành success */
  markPaid(manager: EntityManager, orderId: number) {
    return manager
      .getRepository(Transaction)
      .update(
        { order_id: orderId, transaction_type: 'payment', status: 'pending' },
        { status: 'success', transaction_date: new Date() },
      );
  }

  /** Đơn bị huỷ → huỷ các giao dịch chưa hoàn tất */
  cancelPending(manager: EntityManager, orderId: number) {
    return manager
      .getRepository(Transaction)
      .update(
        { order_id: orderId, transaction_type: 'payment', status: 'pending' },
        { status: 'cancelled' },
      );
  }
}
