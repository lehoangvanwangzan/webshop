import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('shop_banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 500, nullable: true })
  image_url: string;

  @Column({ length: 500, nullable: true })
  link_url: string;

  @Column({ length: 50, default: 'homepage' })
  position: string;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
