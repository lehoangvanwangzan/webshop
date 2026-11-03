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
import { User } from '@features/users/entities/user.entity';

/**
 * Hồ sơ khách hàng — mỗi user có tối đa 1 customer (1-1 qua user_id).
 * Giỏ hàng, đơn hàng, wishlist, review... đều tham chiếu customer_id chứ không phải user_id.
 * Tên index/FK giữ đúng như schema hiện có để TypeORM synchronize không tạo lại.
 */
@Entity('shop_customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('shop_customers_user_id_key', { unique: true })
  @Column()
  user_id: number;

  @Column({ type: 'date', nullable: true })
  date_of_birth: string | null;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], nullable: true })
  gender: 'male' | 'female' | 'other' | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  district: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ward: string | null;

  @Column({ default: 0 })
  total_orders: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_spent: number;

  @CreateDateColumn({ type: 'datetime', precision: 3, default: () => 'CURRENT_TIMESTAMP(3)' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'datetime',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
    onUpdate: 'CURRENT_TIMESTAMP(3)',
  })
  updated_at: Date;

  @ManyToOne(() => User, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'shop_customers_user_id_fkey' })
  user: User;
}
