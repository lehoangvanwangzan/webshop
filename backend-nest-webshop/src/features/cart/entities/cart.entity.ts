import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Customer } from '@features/customers/entities/customer.entity';
import { CartItem } from './cart-item.entity';

export type CartStatus = 'active' | 'abandoned' | 'converted';

@Entity('shop_carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('shop_carts_customer_id_idx')
  @Column({ type: 'int', nullable: true })
  customer_id: number | null;

  /** Dành cho giỏ hàng khách vãng lai (chưa dùng) */
  @Index('shop_carts_session_id_idx')
  @Column({ type: 'varchar', length: 100, nullable: true })
  session_id: string | null;

  /** active = đang dùng, converted = đã đặt hàng, abandoned = bỏ dở */
  @Column({ type: 'enum', enum: ['active', 'abandoned', 'converted'], default: 'active' })
  status: CartStatus;

  /** Tổng số lượng sản phẩm (cộng dồn quantity) — lưu sẵn để thống kê */
  @Column({ default: 0 })
  total_items: number;

  /** decimal(15,2) cho khớp với shop_products.price */
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_amount: number;

  @Column({ type: 'datetime', precision: 3, nullable: true })
  abandoned_at: Date | null;

  @CreateDateColumn({ type: 'datetime', precision: 3, default: () => 'CURRENT_TIMESTAMP(3)' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'datetime',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
    onUpdate: 'CURRENT_TIMESTAMP(3)',
  })
  updated_at: Date;

  @ManyToOne(() => Customer, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'customer_id', foreignKeyConstraintName: 'shop_carts_customer_id_fkey' })
  customer: Customer | null;

  @OneToMany(() => CartItem, (item) => item.cart)
  items: CartItem[];
}
