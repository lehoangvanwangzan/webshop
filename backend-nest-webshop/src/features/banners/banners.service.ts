import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Banner } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { QueryBannersDto } from './dto/query-banners.dto';
import { PaginatedResponse } from '@shared/types/pagination.type';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepo: Repository<Banner>,
  ) {}

  async findAll(query: QueryBannersDto): Promise<PaginatedResponse<Banner>> {
    const { page = 1, limit = 20, search, position, is_active } = query;

    const qb = this.bannerRepo.createQueryBuilder('b');

    if (search) {
      qb.andWhere('b.title LIKE :s', { s: `%${search}%` });
    }
    if (position) {
      qb.andWhere('b.position = :position', { position });
    }
    if (is_active !== undefined && is_active !== null) {
      qb.andWhere('b.is_active = :is_active', { is_active });
    }

    const total = await qb.getCount();

    const items = await qb
      .orderBy('b.sort_order', 'ASC')
      .addOrderBy('b.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number): Promise<Banner> {
    const banner = await this.bannerRepo.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException(`Banner #${id} không tồn tại`);
    }
    return banner;
  }

  async create(dto: CreateBannerDto): Promise<Banner> {
    const banner = this.bannerRepo.create(dto);
    const saved = await this.bannerRepo.save(banner);

    // Tạo thư mục ảnh
    const dir = this.bannerImageDir(saved.id);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    return saved;
  }

  async update(id: number, dto: UpdateBannerDto): Promise<Banner> {
    await this.findOne(id);
    await this.bannerRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    await this.findOne(id);
    // Xoá thư mục ảnh
    const dir = this.bannerImageDir(id);
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    await this.bannerRepo.delete(id);
    return { deleted: true };
  }

  async uploadImage(id: number, file: Express.Multer.File): Promise<Banner> {
    const banner = await this.findOne(id);

    // Xoá ảnh cũ nếu có
    if (banner.image_url) {
      const oldPath = path.join(process.cwd(), banner.image_url.replace(/^\//, ''));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const relPath = `/picture/shop_banners/${id}/${path.basename(file.path)}`;
    banner.image_url = relPath;
    return this.bannerRepo.save(banner);
  }

  /** Thống kê nhanh */
  async getStats(): Promise<{ total: number; active: number; inactive: number }> {
    const total = await this.bannerRepo.count();
    const active = await this.bannerRepo.count({ where: { is_active: true } });
    return { total, active, inactive: total - active };
  }

  private bannerImageDir(bannerId: number): string {
    return path.join(process.cwd(), 'picture', 'shop_banners', String(bannerId));
  }
}
