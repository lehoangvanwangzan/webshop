import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { Cart } from '@features/cart/entities/cart.entity';
import { CartItem } from '@features/cart/entities/cart-item.entity';
import { CartService } from '@features/cart/cart.service';
import { Product } from '@features/products/entities/product.entity';
import { effectivePrice } from '@features/products/utils/product-price';
import { Customer } from '@features/customers/entities/customer.entity';
import { CustomersService } from '@features/customers/customers.service';
import { User } from '@features/users/entities/user.entity';
import { PaymentsService } from '@features/payments/payments.service';
import { PaginatedResponse } from '@shared/types/pagination.type';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryOrdersDto } from './dto/query-orders.dto';
import {
  ADMIN_STATUS_TRANSITIONS,
  CUSTOMER_CANCELLABLE_STATUSES,
  FREE_SHIPPING_THRESHOLD,
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  calcShippingFee,
} from './orders.constants';

/** Lưu trong cột shipping_address dạng JSON */
export interface ShippingAddress {
  full_name: string;
  phone: string;
  address: string;
  ward?: string;
  district?: string;
  city: string;
}

const parseAddress = (raw: string): ShippingAddress | null => {
  try {
    return JSON.parse(raw) as ShippingAddress;
  } catch {
    return null; // dữ liệu cũ dạng text thường
  }
};

/** VD: WS261006-K3F9QZ */
const generateOrderNumber = () => {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const rand = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `WS${ymd}-${rand}`;
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly customersService: CustomersService,
    private readonly cartService: CartService,
    private readonly paymentsService: PaymentsService,
  ) {}

  /* ─── Khách hàng ─── */

  /** Dữ liệu cho trang Checkout: giỏ hàng, phí ship, địa chỉ điền sẵn, phương thức thanh toán */
  async getCheckoutPreview(user: User) {
    const [cart, customer, paymentMethods] = await Promise.all([
      this.cartService.getCart(user.id),
      this.customersService.findOrCreateByUserId(user.id),
      this.paymentsService.findActive(),
    ]);
    const shippingFee = calcShippingFee(cart.total_amount);

    return {
      cart,
      subtotal: cart.total_amount,
      shipping_fee: shippingFee,
      total_amount: cart.total_amount + shippingFee,
      free_shipping_threshold: FREE_SHIPPING_THRESHOLD,
      address: {
        full_name: user.full_name,
        phone: user.phone ?? '',
        address: customer.address ?? '',
        ward: customer.ward ?? '',
        district: customer.district ?? '',
        city: customer.city ?? '',
      },
      payment_methods: paymentMethods.map((m) => ({ code: m.method_code, name: m.method_name })),
    };
  }

  async create(user: User, dto: CreateOrderDto) {
    const customer = await this.customersService.findOrCreateByUserId(user.id);
    const paymentMethod = await this.paymentsService.findActiveByCode(dto.payment_method);
    if (!paymentMethod) throw new BadRequestException('Phương thức thanh toán không khả dụng');

    const orderId = await this.dataSource.transaction(async (manager) => {
      const cart = await manager.getRepository(Cart).findOne({
        where: { customer_id: customer.id, status: 'active' },
        order: { id: 'DESC' },
      });
      const cartItems = cart
        ? await manager.getRepository(CartItem).find({ where: { cart_id: cart.id } })
        : [];
      if (!cart || cartItems.length === 0) {
        throw new BadRequestException('Giỏ hàng đang trống');
      }

      // Khoá các dòng sản phẩm để 2 đơn đặt cùng lúc không bán quá tồn kho
      const products = await manager
        .getRepository(Product)
        .createQueryBuilder('p')
        .setLock('pessimistic_write')
        .where('p.id IN (:...ids)', { ids: cartItems.map((i) => i.product_id) })
        .getMany();
      const productMap = new Map(products.map((p) => [p.id, p]));

      const problems: string[] = [];
      const lines = cartItems.map((item) => {
        const product = productMap.get(item.product_id);
        if (!product || !product.is_active) {
          problems.push(`"${product?.name ?? `#${item.product_id}`}" đã ngừng bán`);
        } else if (product.stock < item.quantity) {
          problems.push(
            product.stock <= 0
              ? `"${product.name}" đã hết hàng`
              : `"${product.name}" chỉ còn ${product.stock} sản phẩm`,
          );
        }
        const unitPrice = product ? effectivePrice(product) : 0;
        return { item, unitPrice, subtotal: unitPrice * item.quantity };
      });
      if (problems.length) {
        throw new BadRequestException(
          `Vui lòng cập nhật giỏ hàng: ${problems.join('; ')}`,
        );
      }

      const subtotal = lines.reduce((sum, l) => sum + l.subtotal, 0);
      const shippingFee = calcShippingFee(subtotal);
      const totalAmount = subtotal + shippingFee;

      const shippingAddress: ShippingAddress = {
        full_name: dto.full_name,
        phone: dto.phone,
        address: dto.address,
        ward: dto.ward || undefined,
        district: dto.district || undefined,
        city: dto.city,
      };

      const order = await manager.getRepository(Order).save(
        manager.getRepository(Order).create({
          customer_id: customer.id,
          order_number: generateOrderNumber(),
          status: 'pending',
          subtotal,
          shipping_fee: shippingFee,
          discount_amount: 0,
          tax_amount: 0,
          total_amount: totalAmount,
          shipping_address: JSON.stringify(shippingAddress),
          notes: dto.notes || null,
        }),
      );

      await manager.getRepository(OrderDetail).save(
        lines.map((l) =>
          manager.getRepository(OrderDetail).create({
            order_id: order.id,
            product_id: l.item.product_id,
            quantity: l.item.quantity,
            unit_price: l.unitPrice,
            subtotal: l.subtotal,
          }),
        ),
      );

      for (const l of lines) {
        await manager
          .getRepository(Product)
          .decrement({ id: l.item.product_id }, 'stock', l.item.quantity);
      }

      await this.paymentsService.createPendingPayment(manager, {
        orderId: order.id,
        customerId: customer.id,
        paymentMethodId: paymentMethod.id,
        amount: totalAmount,
      });

      // Giỏ đã chuyển thành đơn — lần thêm sản phẩm sau sẽ tạo giỏ mới
      await manager.getRepository(Cart).update(cart.id, { status: 'converted' });

      // Ghi nhớ địa chỉ để lần sau điền sẵn
      await manager.getRepository(Customer).update(customer.id, {
        address: dto.address,
        ward: dto.ward || null,
        district: dto.district || null,
        city: dto.city,
      });
      if (!user.phone) {
        await manager.getRepository(User).update(user.id, { phone: dto.phone });
      }

      return order.id;
    });

    return this.findOneForCustomer(user.id, orderId);
  }

  async findAllForCustomer(userId: number, query: QueryOrdersDto) {
    const customer = await this.customersService.findOrCreateByUserId(userId);
    const qb = this.orderRepository
      .createQueryBuilder('o')
      .where('o.customer_id = :cid', { cid: customer.id });
    if (query.status) qb.andWhere('o.status = :status', { status: query.status });
    return this.paginate(qb, query, false);
  }

  async findOneForCustomer(userId: number, orderId: number) {
    const customer = await this.customersService.findOrCreateByUserId(userId);
    const order = await this.loadFullOrder(orderId);
    if (!order || order.customer_id !== customer.id) {
      throw new NotFoundException(`Đơn hàng #${orderId} không tồn tại`);
    }
    return this.toResponse(order, false);
  }

  async cancelByCustomer(userId: number, orderId: number) {
    const customer = await this.customersService.findOrCreateByUserId(userId);
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order || order.customer_id !== customer.id) {
      throw new NotFoundException(`Đơn hàng #${orderId} không tồn tại`);
    }
    if (!CUSTOMER_CANCELLABLE_STATUSES.includes(order.status)) {
      throw new BadRequestException(
        `Không thể huỷ đơn đang ở trạng thái "${ORDER_STATUS_LABELS[order.status]}". Vui lòng liên hệ cửa hàng.`,
      );
    }
    await this.dataSource.transaction((manager) => this.cancelOrder(manager, order));
    return this.findOneForCustomer(userId, orderId);
  }

  /* ─── Admin ─── */

  async adminFindAll(query: QueryOrdersDto) {
    const qb = this.orderRepository
      .createQueryBuilder('o')
      .leftJoin('o.customer', 'c')
      .leftJoin('c.user', 'u');
    if (query.status) qb.andWhere('o.status = :status', { status: query.status });
    if (query.search?.trim()) {
      qb.andWhere(
        '(o.order_number LIKE :s OR o.shipping_address LIKE :s OR u.email LIKE :s OR u.full_name LIKE :s)',
        { s: `%${query.search.trim()}%` },
      );
    }
    return this.paginate(qb, query, true);
  }

  async adminFindOne(orderId: number) {
    const order = await this.loadFullOrder(orderId);
    if (!order) throw new NotFoundException(`Đơn hàng #${orderId} không tồn tại`);
    return this.toResponse(order, true);
  }

  /** Số đơn theo từng trạng thái — cho các tab lọc ở trang admin */
  async adminStats() {
    const rows: { status: OrderStatus; count: string }[] = await this.orderRepository
      .createQueryBuilder('o')
      .select('o.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('o.status')
      .getRawMany();
    const byStatus = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0])) as Record<OrderStatus, number>;
    for (const r of rows) byStatus[r.status] = Number(r.count);
    return { total: Object.values(byStatus).reduce((a, b) => a + b, 0), by_status: byStatus };
  }

  async adminUpdateStatus(orderId: number, status: OrderStatus) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException(`Đơn hàng #${orderId} không tồn tại`);

    const allowed = ADMIN_STATUS_TRANSITIONS[order.status];
    if (!allowed.includes(status)) {
      throw new BadRequestException(
        `Không thể chuyển đơn từ "${ORDER_STATUS_LABELS[order.status]}" sang "${ORDER_STATUS_LABELS[status]}"`,
      );
    }

    await this.dataSource.transaction(async (manager) => {
      if (status === 'cancelled') {
        await this.cancelOrder(manager, order);
        return;
      }
      const patch: Partial<Order> = { status };
      if (status === 'delivered') {
        // COD: giao thành công = đã thu tiền
        patch.paid_at = new Date();
        await this.paymentsService.markPaid(manager, order.id);
        await manager
          .getRepository(Customer)
          .createQueryBuilder()
          .update()
          .set({
            total_orders: () => 'total_orders + 1',
            total_spent: () => `total_spent + ${Number(order.total_amount)}`,
          })
          .where('id = :id', { id: order.customer_id })
          .execute();
      }
      await manager.getRepository(Order).update(order.id, patch);
    });

    return this.adminFindOne(orderId);
  }

  /* ─── Helpers ─── */

  /** Huỷ đơn: trả lại tồn kho + huỷ giao dịch chờ thanh toán */
  private async cancelOrder(manager: EntityManager, order: Order) {
    const details = await manager.getRepository(OrderDetail).find({ where: { order_id: order.id } });
    for (const d of details) {
      await manager.getRepository(Product).increment({ id: d.product_id }, 'stock', d.quantity);
    }
    await this.paymentsService.cancelPending(manager, order.id);
    await manager
      .getRepository(Order)
      .update(order.id, { status: 'cancelled', cancelled_at: new Date() });
  }

  private loadFullOrder(orderId: number) {
    return this.fullOrderQuery().where('o.id = :id', { id: orderId }).getOne();
  }

  private fullOrderQuery() {
    return this.orderRepository
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.details', 'd')
      .leftJoinAndSelect('d.product', 'p')
      .leftJoinAndSelect('p.images', 'img')
      .leftJoinAndSelect('o.transactions', 'tx')
      .leftJoinAndSelect('tx.payment_method', 'pm')
      .leftJoinAndSelect('o.customer', 'c')
      .leftJoinAndSelect('c.user', 'u')
      .orderBy('d.id', 'ASC')
      .addOrderBy('img.sort_order', 'ASC');
  }

  /** Phân trang theo id trước rồi mới join chi tiết (join 1-n làm sai skip/take) */
  private async paginate(
    qb: SelectQueryBuilder<Order>,
    query: QueryOrdersDto,
    withCustomer: boolean,
  ) {
    const { page = 1, limit = 10 } = query;
    const total = await qb.getCount();
    const idRows = await qb
      .select('o.id', 'id')
      .orderBy('o.created_at', 'DESC')
      .addOrderBy('o.id', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany<{ id: number }>();
    const ids = idRows.map((r) => r.id);

    let items: ReturnType<OrdersService['toResponse']>[] = [];
    if (ids.length) {
      const orders = await this.fullOrderQuery().where('o.id IN (:...ids)', { ids }).getMany();
      const byId = new Map(orders.map((o) => [o.id, o]));
      items = ids.map((id) => this.toResponse(byId.get(id)!, withCustomer));
    }

    const result: PaginatedResponse<(typeof items)[number]> = {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
    return result;
  }

  private toResponse(order: Order, withCustomer: boolean) {
    const payment = order.transactions?.find((t) => t.transaction_type === 'payment');
    return {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      status_label: ORDER_STATUS_LABELS[order.status],
      can_cancel: CUSTOMER_CANCELLABLE_STATUSES.includes(order.status),
      subtotal: Number(order.subtotal),
      shipping_fee: Number(order.shipping_fee),
      discount_amount: Number(order.discount_amount),
      total_amount: Number(order.total_amount),
      shipping_address: parseAddress(order.shipping_address),
      notes: order.notes,
      paid_at: order.paid_at,
      cancelled_at: order.cancelled_at,
      created_at: order.created_at,
      updated_at: order.updated_at,
      payment: payment
        ? {
            method_code: payment.payment_method?.method_code ?? null,
            method_name: payment.payment_method?.method_name ?? null,
            status: payment.status,
          }
        : null,
      items: (order.details ?? []).map((d) => ({
        id: d.id,
        product_id: d.product_id,
        product_name: d.product?.name ?? `Sản phẩm #${d.product_id}`,
        sku: d.product?.sku ?? null,
        image_url: d.product?.images?.[0]?.image_url ?? null,
        quantity: d.quantity,
        unit_price: Number(d.unit_price),
        subtotal: Number(d.subtotal),
      })),
      ...(withCustomer && {
        customer: order.customer?.user
          ? {
              id: order.customer.id,
              user_id: order.customer.user.id,
              full_name: order.customer.user.full_name,
              email: order.customer.user.email,
              phone: order.customer.user.phone,
            }
          : null,
        allowed_transitions: ADMIN_STATUS_TRANSITIONS[order.status],
      }),
    };
  }
}
