import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Order } from '@features/orders/entities/order.entity';
import { PaymentMethod } from './payment-method.entity';

export type TransactionStatus = 'pending' | 'processing' | 'success' | 'failed' | 'cancelled';
export type TransactionType = 'payment' | 'refund' | 'reversal';

/** Giao dịch thanh toán của đơn hàng — đơn COD có 1 giao dịch 'pending' cho tới khi giao hàng thành công */
@Entity('shop_transactions')
export class Transaction {
  /** bigint → TypeORM trả về string */
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Index('shop_transactions_order_id_idx')
  @Column()
  order_id: number;

  @Column()
  customer_id: number;

  @Column()
  payment_method_id: number;

  /** decimal(15,2) cho khớp với shop_orders.total_amount */
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  transaction_amount: number;

  @Column({ length: 3, default: 'VND' })
  currency: string;

  @Column({ type: 'enum', enum: ['payment', 'refund', 'reversal'] })
  transaction_type: TransactionType;

  @Index('shop_transactions_status_idx')
  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'success', 'failed', 'cancelled'],
    default: 'pending',
  })
  status: TransactionStatus;

  @Column({ type: 'varchar', length: 100, nullable: true })
  provider_transaction_id: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reference_number: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  authorization_code: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  response_code: string | null;

  @Column({ type: 'text', nullable: true })
  error_message: string | null;

  @Index('shop_transactions_transaction_date_idx')
  @Column({ type: 'datetime', precision: 3, default: () => 'CURRENT_TIMESTAMP(3)' })
  transaction_date: Date;

  @CreateDateColumn({ type: 'datetime', precision: 3, default: () => 'CURRENT_TIMESTAMP(3)' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'datetime',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
    onUpdate: 'CURRENT_TIMESTAMP(3)',
  })
  updated_at: Date;

  @ManyToOne(() => Order, (order) => order.transactions, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'order_id', foreignKeyConstraintName: 'shop_transactions_order_id_fkey' })
  order: Order;

  @ManyToOne(() => PaymentMethod, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({
    name: 'payment_method_id',
    foreignKeyConstraintName: 'shop_transactions_payment_method_id_fkey',
  })
  payment_method: PaymentMethod;
}
