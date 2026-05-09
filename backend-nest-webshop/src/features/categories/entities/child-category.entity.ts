import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity('shop_child_categories')
export class ChildCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category_id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 120 })
  slug: string;

  @Column({ length: 255, nullable: true })
  image_url: string;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Category, (cat) => cat.children)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
