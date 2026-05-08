import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { PaginatedResponse } from '@shared/types/pagination.type';

const MAX_IMAGES = 9;

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly imageRepo: Repository<ProductImage>,
  ) {}

  async findAll(query: QueryProductsDto): Promise<PaginatedResponse<Product>> {
    const { page = 1, limit = 20, search, is_active } = query;

    const qb = this.productRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category')
      .leftJoinAndSelect('p.brand', 'brand')
      .leftJoinAndSelect('p.images', 'images');

    if (search) {
      qb.andWhere('(p.name LIKE :s OR p.sku LIKE :s)', { s: `%${search}%` });
    }
    console.log('findAll query:', query);
    if (is_active !== undefined && is_active !== null) {
      qb.andWhere('p.is_active = :is_active', { is_active });
    }

    qb.orderBy('p.created_at', 'DESC')
      .addOrderBy('images.sort_order', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'brand', 'images'],
      order: { images: { sort_order: 'ASC' } },
    });
    if (!product) {
      throw new NotFoundException(`Sản phẩm #${id} không tồn tại`);
    }
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const existing = await this.productRepo.findOne({
      where: [{ slug: dto.slug }, { sku: dto.sku }],
    });
    if (existing) {
      throw new ConflictException('Slug hoặc SKU đã tồn tại');
    }
    const product = this.productRepo.create(dto);
    const saved = await this.productRepo.save(product);

    // Tạo thư mục ảnh riêng cho sản phẩm
    const dir = this.productImageDir(saved.id);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    return saved;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    await this.findOne(id);
    // Xoá thư mục ảnh của sản phẩm
    const dir = this.productImageDir(id);
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    await this.productRepo.delete(id);
    return { deleted: true };
  }

  /* ─── Image methods ─── */

  async addImages(
    productId: number,
    files: Express.Multer.File[],
  ): Promise<ProductImage[]> {
    const product = await this.findOne(productId);

    const currentCount = await this.imageRepo.count({
      where: { product_id: productId },
    });

    if (currentCount + files.length > MAX_IMAGES) {
      // Xoá file vừa upload nếu vượt giới hạn
      files.forEach((f) => fs.existsSync(f.path) && fs.unlinkSync(f.path));
      throw new BadRequestException(
        `Sản phẩm đã có ${currentCount} ảnh. Chỉ được thêm tối đa ${MAX_IMAGES - currentCount} ảnh nữa.`,
      );
    }

    const nextOrder = currentCount;
    const images = files.map((file, i) => {
      const relPath = `/picture/shop_product_images/${product.id}/${path.basename(file.path)}`;
      return this.imageRepo.create({
        product_id: productId,
        image_url: relPath,
        sort_order: nextOrder + i,
      });
    });

    return this.imageRepo.save(images);
  }

  async removeImage(productId: number, imageId: number): Promise<{ deleted: boolean }> {
    const image = await this.imageRepo.findOne({
      where: { id: imageId, product_id: productId },
    });
    if (!image) throw new NotFoundException('Ảnh không tồn tại');

    // Xoá file vật lý
    const abs = path.join(
      process.cwd(),
      'picture',
      'shop_product_images',
      String(productId),
      path.basename(image.image_url),
    );
    if (fs.existsSync(abs)) fs.unlinkSync(abs);

    await this.imageRepo.delete(imageId);
    return { deleted: true };
  }

  async getImages(productId: number): Promise<ProductImage[]> {
    await this.findOne(productId); // verify exists
    return this.imageRepo.find({
      where: { product_id: productId },
      order: { sort_order: 'ASC' },
    });
  }

  /* ─── Helper ─── */
  private productImageDir(productId: number): string {
    return path.join(process.cwd(), 'picture', 'shop_product_images', String(productId));
  }
}
