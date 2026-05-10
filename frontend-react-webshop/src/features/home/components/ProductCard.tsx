import { ShoppingCartOutlined } from '@ant-design/icons';
import type { Product } from '@/features/products/types/products.types';
import { resolveProductImageUrl } from '@/features/products/api/products.api';

function formatPrice(price: number) {
  return price.toLocaleString('vi-VN') + 'đ';
}

export function ProductCard({ product }: { product: Product }) {
  const imgUrl = product.images?.[0]?.image_url
    ? resolveProductImageUrl(product.images[0].image_url)
    : '/placeholder.png';

  return (
    <div className="product-card">
      {product.is_featured && (
        <div className="product-card__badge">BÁN CHẠY</div>
      )}

      <img src={imgUrl} alt={product.name} className="product-card__image" />

      <div className="product-card__content">
        <div className="product-card__name">{product.name}</div>

        <div className="product-card__footer">
          <div className="product-card__price">{formatPrice(product.price)}</div>
          <button className="product-card__cart-btn" title="Thêm vào giỏ hàng">
            <ShoppingCartOutlined />
          </button>
        </div>
      </div>
    </div>
  );
}
