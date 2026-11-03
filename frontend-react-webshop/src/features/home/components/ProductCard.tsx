import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import type { Product } from '@/features/products/types/products.types';
import { resolveProductImageUrl } from '@/features/products/api/products.api';
import { ROUTES } from '@/routes/routes';
import { useAddToCart } from '@/features/cart/hooks/useCart';
import { formatVnd, getPriceInfo } from '@/features/products/utils/price';

export function ProductCard({ product }: { product: Product }) {
  const imgUrl = product.images?.[0]?.image_url
    ? resolveProductImageUrl(product.images[0].image_url)
    : '/placeholder.png';

  const productDetailUrl = ROUTES.PRODUCT_DETAIL.replace(':id', product.id.toString());
  const { addToCart, isPending } = useAddToCart();
  const { finalPrice, originalPrice } = getPriceInfo(product);

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
          <div>
            <div className="product-card__price">{formatVnd(finalPrice)}</div>
            {originalPrice && <div className="product-card__price-old">{formatVnd(originalPrice)}</div>}
          </div>
          <button
            className="product-card__cart-btn"
            title="Thêm vào giỏ hàng"
            disabled={isPending}
            onClick={() => addToCart({ product_id: product.id, quantity: 1 })}
          >
            <ShoppingCartOutlined />
          </button>
        </div>
      </div>
    </div>
  );
}
