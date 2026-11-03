import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Customer } from '@features/customers/entities/customer.entity';
import { Transaction } from '@features/payments/entities/transaction.entity';
import { OrderDetail } from './order-detail.entity';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

/**
 * synchronize: false — bảng có FK coupon_id → shop_coupons (chưa có entity),
 * nếu để TypeORM đồng bộ nó sẽ xoá FK này. Thay đổi cấu trúc bảng làm bằng SQL tay
 * (xem sql/2026-10-06-orders.sql).
 */
@Entity({ name: 'shop_orders', synchronize: false })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customer_id: number;

  /** Mã đơn hiển thị cho khách, VD: WS261006-K3F9QZ */
  @Column({ length: 50 })
  order_number: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shipping_fee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax_amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_amount: number;

  /** JSON của ShippingAddress (người nhận, SĐT, địa chỉ) — bảng không có cột riêng */
  @Column({ type: 'text' })
  shipping_address: string;

  @Column({ type: 'text', nullable: true })
  billing_address: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'int', nullable: true })
  coupon_id: number | null;

  @Column({ type: 'datetime', precision: 3, nullable: true })
  paid_at: Date | null;

  @Column({ type: 'datetime', precision: 3, nullable: true })
  cancelled_at: Date | null;

  @CreateDateColumn({ type: 'datetime', precision: 3, default: () => 'CURRENT_TIMESTAMP(3)' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'datetime',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
    onUpdate: 'CURRENT_TIMESTAMP(3)',
  })
  updated_at: Date;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(() => OrderDetail, (detail) => detail.order)
  details: OrderDetail[];

  @OneToMany(() => Transaction, (tx) => tx.order)
  transactions: Transaction[];
}
