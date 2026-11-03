import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/** Phương thức thanh toán (COD, VNPay, MoMo...) — method_code là khoá dùng trong code */
@Entity('shop_payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('shop_payment_methods_method_code_key', { unique: true })
  @Column({ length: 50 })
  method_code: string;

  @Column({ length: 100 })
  method_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  provider: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  provider_account_id: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  api_key_encrypted: string | null;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'datetime', precision: 3, default: () => 'CURRENT_TIMESTAMP(3)' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'datetime',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
    onUpdate: 'CURRENT_TIMESTAMP(3)',
  })
  updated_at: Date;
}
