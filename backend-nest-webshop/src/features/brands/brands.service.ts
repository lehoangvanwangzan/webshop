import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async findAll() {
    return this.brandRepository.find({
      where: { is_active: true },
      order: { sort_order: 'ASC', name: 'ASC' },
    });
  }

  async findOne(slug: string) {
    return this.brandRepository.findOne({
      where: { slug, is_active: true },
    });
  }

  async create(dto: CreateBrandDto): Promise<Brand> {
    const existing = await this.brandRepository.findOne({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Slug "${dto.slug}" đã tồn tại`);
    const brand = this.brandRepository.create(dto);
    return this.brandRepository.save(brand);
  }

  async update(id: number, dto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.brandRepository.findOne({ where: { id } });
    if (!brand) throw new NotFoundException(`Thương hiệu #${id} không tồn tại`);
    if (dto.slug && dto.slug !== brand.slug) {
      const conflict = await this.brandRepository.findOne({ where: { slug: dto.slug } });
      if (conflict) throw new ConflictException(`Slug "${dto.slug}" đã tồn tại`);
    }
    Object.assign(brand, dto);
    return this.brandRepository.save(brand);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const brand = await this.brandRepository.findOne({ where: { id } });
    if (!brand) throw new NotFoundException(`Thương hiệu #${id} không tồn tại`);
    await this.brandRepository.delete(id);
    return { deleted: true };
  }
}
