import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import type { Product } from '@/features/products/types/products.types';
import { resolveProductImageUrl } from '@/features/products/api/products.api';
import { ROUTES } from '@/routes/routes';

function formatPrice(price: number) {
  return price.toLocaleString('vi-VN') + 'đ';
}

export function ProductCard({ product }: { product: Product }) {
  const imgUrl = product.images?.[0]?.image_url
    ? resolveProductImageUrl(product.images[0].image_url)
    : '/placeholder.png';

  const productDetailUrl = ROUTES.PRODUCT_DETAIL.replace(':id', product.id.toString());

  return (
    <div className="product-card group">
      {product.is_featured && (
        <div className="product-card__badge">BÁN CHẠY</div>
      )}

      <Link to={productDetailUrl} className="block overflow-hidden">
        <img 
          src={imgUrl} 
          alt={product.name} 
          className="product-card__image transition-transform duration-500 group-hover:scale-110" 
        />
      </Link>

      <div className="product-card__content">
        <Link to={productDetailUrl}>
          <div className="product-card__name hover:text-indigo-600 transition-colors">{product.name}</div>
        </Link>

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
