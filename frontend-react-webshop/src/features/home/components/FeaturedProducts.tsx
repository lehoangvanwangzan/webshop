import { ShoppingCartOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useProducts } from '@/features/products/hooks/useProducts';
import { resolveProductImageUrl } from '@/features/products/api/products.api';
import '../styles/HomePage.css';

function formatPrice(price: number) {
  return price.toLocaleString('vi-VN') + 'đ';
}

export function FeaturedProducts() {
  const { data, isLoading, isError } = useProducts({ is_featured: 1, is_active: 1, limit: 8 });

  return (
    <section className="featured-section">
      <header className="featured-header">
        <div className="featured-title-wrapper">
          <h2 className="featured-title">SẢN PHẨM NỔI BẬT</h2>
        </div>
        <div className="featured-nav">
          <button className="nav-btn"><LeftOutlined /></button>
          <button className="nav-btn"><RightOutlined /></button>
        </div>
      </header>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Spin size="large" />
        </div>
      )}

      {isError && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#ff4d4f' }}>
          Không thể tải sản phẩm. Vui lòng thử lại.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="product-grid">
          {(data?.items ?? []).map((p) => {
            const imgUrl = p.images?.[0]?.image_url
              ? resolveProductImageUrl(p.images[0].image_url)
              : '/placeholder.png';

            return (
              <div key={p.id} className="product-card">
                <div className="product-image-container">
                  <img src={imgUrl} alt={p.name} className="product-image" />
                </div>

                <h3 className="product-name">{p.name}</h3>

                <div className="product-footer">
                  <div className={`product-price ${!p.price ? 'contact' : ''}`}>
                    {p.price ? formatPrice(p.price) : 'Liên hệ'}
                  </div>
                  <button className="add-to-cart-btn">
                    <ShoppingCartOutlined />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
