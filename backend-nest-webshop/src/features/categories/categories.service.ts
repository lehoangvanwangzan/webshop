import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { ChildCategory } from './entities/child-category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(ChildCategory)
    private readonly childRepo: Repository<ChildCategory>,
  ) {}

  findAllTree(): Promise<Category[]> {
    return this.categoryRepo.find({
      where: { is_active: true },
      relations: ['children'],
      order: { sort_order: 'ASC', children: { sort_order: 'ASC' } },
    });
  }

  findAllFlat(): Promise<Category[]> {
    return this.categoryRepo.find({
      order: { sort_order: 'ASC', name: 'ASC' },
    });
  }

  async findOne(slug: string): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { slug, is_active: true },
      relations: ['children'],
    });
    if (!category) throw new NotFoundException(`Danh mục "${slug}" không tồn tại`);
    return category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoryRepo.findOne({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Slug "${dto.slug}" đã tồn tại`);
    const category = this.categoryRepo.create(dto);
    return this.categoryRepo.save(category);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Danh mục #${id} không tồn tại`);
    if (dto.slug && dto.slug !== category.slug) {
      const conflict = await this.categoryRepo.findOne({ where: { slug: dto.slug } });
      if (conflict) throw new ConflictException(`Slug "${dto.slug}" đã tồn tại`);
    }
    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Danh mục #${id} không tồn tại`);
    await this.categoryRepo.delete(id);
    return { deleted: true };
  }
}
