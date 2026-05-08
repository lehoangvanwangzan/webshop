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
import { Category } from '@features/categories/entities/category.entity';
import { Brand } from '@features/brands/entities/brand.entity';
import { ProductImage } from './product-image.entity';

@Entity('shop_products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true, length: 120 })
  slug: string;

  @Column({ unique: true, length: 100 })
  sku: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  short_description: string;

  @Column({ type: 'longtext', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  discount_price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ 
    type: 'int', 
    default: 1 
  })
  is_active: number;

  @Column({ default: false })
  is_featured: boolean;

  @Column()
  category_id: number;

  @Column({ nullable: true })
  brand_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Brand, { nullable: true })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @OneToMany(() => ProductImage, (img) => img.product, { cascade: true, eager: false })
  images: ProductImage[];
}
