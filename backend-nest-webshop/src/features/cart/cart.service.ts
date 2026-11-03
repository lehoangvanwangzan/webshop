import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '@features/products/entities/product.entity';
import { CustomersService } from '@features/customers/customers.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { effectivePrice } from '@features/products/utils/product-price';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly customersService: CustomersService,
  ) {}

  /* ─── Public API ─── */

  async getCart(userId: number) {
    const cart = await this.getOrCreateActiveCart(userId);
    return this.buildCartResponse(cart.id);
  }

  async addItem(userId: number, dto: AddCartItemDto) {
    const cart = await this.getOrCreateActiveCart(userId);
    const product = await this.findPurchasableProduct(dto.product_id);

    const existing = await this.cartItemRepository.findOne({
      where: { cart_id: cart.id, product_id: product.id },
    });
    const newQuantity = (existing?.quantity ?? 0) + dto.quantity;
    this.assertStock(product, newQuantity);

    if (existing) {
      existing.quantity = newQuantity;
      existing.unit_price = effectivePrice(product);
      await this.cartItemRepository.save(existing);
    } else {
      await this.cartItemRepository.save(
        this.cartItemRepository.create({
          cart_id: cart.id,
          product_id: product.id,
          quantity: newQuantity,
          unit_price: effectivePrice(product),
        }),
      );
    }

    return this.buildCartResponse(cart.id);
  }

  async updateItem(userId: number, itemId: number, dto: UpdateCartItemDto) {
    const cart = await this.getOrCreateActiveCart(userId);
    const item = await this.findItemInCart(cart.id, itemId);
    const product = await this.findPurchasableProduct(item.product_id);
    this.assertStock(product, dto.quantity);

    item.quantity = dto.quantity;
    item.unit_price = effectivePrice(product);
    await this.cartItemRepository.save(item);

    return this.buildCartResponse(cart.id);
  }

  async removeItem(userId: number, itemId: number) {
    const cart = await this.getOrCreateActiveCart(userId);
    const item = await this.findItemInCart(cart.id, itemId);
    await this.cartItemRepository.delete(item.id);
    return this.buildCartResponse(cart.id);
  }

  async clear(userId: number) {
    const cart = await this.getOrCreateActiveCart(userId);
    await this.cartItemRepository.delete({ cart_id: cart.id });
    return this.buildCartResponse(cart.id);
  }

  /* ─── Helpers ─── */

  private async getOrCreateActiveCart(userId: number): Promise<Cart> {
    const customer = await this.customersService.findOrCreateByUserId(userId);
    const cart = await this.cartRepository.findOne({
      where: { customer_id: customer.id, status: 'active' },
      order: { id: 'DESC' },
    });
    if (cart) return cart;
    return this.cartRepository.save(
      this.cartRepository.create({ customer_id: customer.id, status: 'active' }),
    );
  }

  private async findPurchasableProduct(productId: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product || !product.is_active) {
      throw new NotFoundException('Sản phẩm không tồn tại hoặc đã ngừng bán');
    }
    return product;
  }

  private assertStock(product: Product, quantity: number) {
    if (product.stock <= 0) {
      throw new BadRequestException(`"${product.name}" đã hết hàng`);
    }
    if (quantity > product.stock) {
      throw new BadRequestException(`"${product.name}" chỉ còn ${product.stock} sản phẩm`);
    }
  }

  private async findItemInCart(cartId: number, itemId: number): Promise<CartItem> {
    const item = await this.cartItemRepository.findOne({ where: { id: itemId, cart_id: cartId } });
    if (!item) throw new NotFoundException(`Sản phẩm #${itemId} không có trong giỏ hàng`);
    return item;
  }

  /**
   * Đọc giỏ kèm sản phẩm, tính lại giá theo giá hiện tại của sản phẩm
   * và lưu lại total_items / total_amount vào shop_carts.
   */
  private async buildCartResponse(cartId: number) {
    const items = await this.cartItemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoinAndSelect('product.images', 'image')
      .where('item.cart_id = :cartId', { cartId })
      .orderBy('item.added_at', 'DESC')
      .addOrderBy('image.sort_order', 'ASC')
      .getMany();

    let totalItems = 0;
    let totalAmount = 0;
    const staleItems: CartItem[] = [];

    const responseItems = items.map((item) => {
      const product = item.product;
      const unitPrice = effectivePrice(product);
      if (Number(item.unit_price) !== unitPrice) {
        item.unit_price = unitPrice;
        staleItems.push(item);
      }

      // Sản phẩm ngừng bán / hết hàng / vượt tồn kho vẫn hiển thị nhưng không tính vào tổng
      const isAvailable = !!product.is_active && product.stock >= item.quantity;
      const lineTotal = unitPrice * item.quantity;
      if (isAvailable) {
        totalItems += item.quantity;
        totalAmount += lineTotal;
      }

      return {
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: unitPrice,
        line_total: lineTotal,
        is_available: isAvailable,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          price: Number(product.price),
          discount_price: product.discount_price != null ? Number(product.discount_price) : null,
          stock: product.stock,
          is_active: !!product.is_active,
          image_url: product.images?.[0]?.image_url ?? null,
        },
      };
    });

    if (staleItems.length) {
      // Bỏ relation trước khi save để TypeORM không đụng tới bảng product
      await this.cartItemRepository.save(
        staleItems.map(({ id, unit_price }) => ({ id, unit_price })),
      );
    }
    await this.cartRepository.update(cartId, {
      total_items: totalItems,
      total_amount: totalAmount,
    });

    return {
      id: cartId,
      items: responseItems,
      total_items: totalItems,
      total_amount: totalAmount,
    };
  }
}
