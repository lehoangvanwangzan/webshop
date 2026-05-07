import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';

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
}
