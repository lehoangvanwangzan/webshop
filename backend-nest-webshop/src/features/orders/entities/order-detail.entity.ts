import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Product } from '@features/products/entities/product.entity';
import { Order } from './order.entity';

/** Dòng sản phẩm trong đơn — lưu giá tại thời điểm đặt, không đổi theo giá sản phẩm sau này */
@Entity('shop_order_details')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('shop_order_details_order_id_idx')
  @Column()
  order_id: number;

  @Index('shop_order_details_product_id_idx')
  @Column()
  product_id: number;

  @Column()
  quantity: number;

  /** decimal(15,2) cho khớp với shop_products.price */
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  subtotal: number;

  @CreateDateColumn({ type: 'datetime', precision: 3, default: () => 'CURRENT_TIMESTAMP(3)' })
  created_at: Date;

  @ManyToOne(() => Order, (order) => order.details, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'order_id', foreignKeyConstraintName: 'shop_order_details_order_id_fkey' })
  order: Order;

  @ManyToOne(() => Product, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'product_id', foreignKeyConstraintName: 'shop_order_details_product_id_fkey' })
  product: Product;
}
