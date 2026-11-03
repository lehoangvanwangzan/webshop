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
import { Cart } from './cart.entity';

/** Mỗi sản phẩm chỉ xuất hiện 1 dòng trong 1 giỏ — thêm lại thì cộng dồn quantity */
@Entity('shop_cart_items')
@Index('shop_cart_items_cart_id_product_id_key', ['cart_id', 'product_id'], { unique: true })
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cart_id: number;

  @Column()
  product_id: number;

  @Column()
  quantity: number;

  /** Giá bán tại thời điểm thêm vào giỏ (đã tính discount), được cập nhật khi giá sản phẩm đổi.
   *  decimal(15,2) cho khớp với shop_products.price */
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  unit_price: number;

  @CreateDateColumn({ type: 'datetime', precision: 3, default: () => 'CURRENT_TIMESTAMP(3)' })
  added_at: Date;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'cart_id', foreignKeyConstraintName: 'shop_cart_items_cart_id_fkey' })
  cart: Cart;

  @ManyToOne(() => Product, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'product_id', foreignKeyConstraintName: 'shop_cart_items_product_id_fkey' })
  product: Product;
}
