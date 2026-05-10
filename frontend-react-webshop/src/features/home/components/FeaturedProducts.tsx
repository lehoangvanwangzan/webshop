import { useRef } from 'react';
import { ShoppingCartOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import { useProducts } from '@/features/products/hooks/useProducts';
import { resolveProductImageUrl } from '@/features/products/api/products.api';
import '../styles/HomePage.css';

function formatPrice(price: number) {
  return price.toLocaleString('vi-VN') + 'đ';
}

export function FeaturedProducts() {
  const swiperRef = useRef(null);
  const { data, isLoading, isError } = useProducts({ is_featured: 1, is_active: 1, limit: 16 });

  return (
    <section className="featured-section">
      <header className="featured-header">
        <div className="featured-title-wrapper">
          <h2 className="featured-title">SẢN PHẨM NỔI BẬT</h2>
        </div>
        <div className="featured-nav">
          <button className="nav-btn" onClick={() => swiperRef.current?.swiper.slidePrev()}>
            <LeftOutlined />
          </button>
          <button className="nav-btn" onClick={() => swiperRef.current?.swiper.slideNext()}>
            <RightOutlined />
          </button>
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
        <Swiper
          ref={swiperRef}
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          speed={350}
          spaceBetween={15}
          slidesPerView={5}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 12 },
            768: { slidesPerView: 3, spaceBetween: 15 },
            1024: { slidesPerView: 5, spaceBetween: 15 },
          }}
          className="product-grid"
        >
          {(data?.items ?? []).map((p) => {
            const imgUrl = p.images?.[0]?.image_url
              ? resolveProductImageUrl(p.images[0].image_url)
              : '/placeholder.png';

            return (
              <SwiperSlide key={p.id}>
                <div className="product-card">
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
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </section>
  );
}
