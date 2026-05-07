import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  findAllTree(): Promise<Category[]> {
    return this.categoryRepo.find({
      where: { is_active: true, parent_id: IsNull() },
      relations: ['children'],
      order: { sort_order: 'ASC', children: { sort_order: 'ASC' } },
    });
  }

  async findOne(slug: string): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { slug, is_active: true },
      relations: ['children', 'parent'],
    });
    if (!category) throw new NotFoundException(`Danh mục "${slug}" không tồn tại`);
    return category;
  }
}
