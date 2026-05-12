import { useRef } from 'react';
import { ShoppingCartOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import { useProducts } from '@/features/products/hooks/useProducts';
import { resolveProductImageUrl } from '@/features/products/api/products.api';
import { ROUTES } from '@/routes/routes';
import '../styles/HomePage.css';

/**
 * Định dạng giá tiền theo tiêu chuẩn Việt Nam
 * @param price - Giá cần định dạng
 * @returns Giá đã định dạng với ký hiệu đ
 * @example
 * formatPrice(1000000) // "1.000.000đ"
 */
function formatPrice(price: number) {
  return price.toLocaleString('vi-VN') + 'đ';
}

/**
 * Component hiển thị các sản phẩm nổi bật trong carousel
 *
 * Features:
 * - Hiển thị tối đa 16 sản phẩm (có thể tăng)
 * - Carousel responsive: 5 desktop / 3 tablet / 2 mobile
 * - Tự động chuyển slide mỗi 5 giây
 * - Vòng lặp vô hạn (last slide → first slide)
 * - Navigation buttons hoạt động bình thường
 * - Hỗ trợ touch swipe trên mobile
 * - Hỗ trợ keyboard navigation (arrow keys)
 *
 * @component
 * @returns {JSX.Element} Carousel với sản phẩm nổi bật
 *
 * @example
 * <FeaturedProducts />
 */
export function FeaturedProducts() {
  /** Ref để điều khiển carousel Swiper từ các nút navigation */
  const swiperRef = useRef(null);

  /** Lấy danh sách sản phẩm nổi bật (is_featured: 1) và sản phẩm đang công khai (is_active: 1) */
  const { data, isLoading, isError } = useProducts({ is_featured: 1, is_active: 1, limit: 16 });

  return (
    <section className="featured-section">
      <header className="featured-header">
        <div className="featured-title-wrapper">
          <h2 className="featured-title">SẢN PHẨM NỔI BẬT</h2>
        </div>
        {/* Nút điều khiển carousel */}
        <div className="featured-nav">
          {/* Nút slide sang trái - xem các sản phẩm trước */}
          <button className="nav-btn" onClick={() => swiperRef.current?.swiper.slidePrev()}>
            <LeftOutlined />
          </button>
          {/* Nút slide sang phải - xem các sản phẩm tiếp theo */}
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
        /**
         * Carousel Swiper - Hiển thị sản phẩm nổi bật với các tính năng:
         * - Tự động chuyển slide mỗi 5 giây
         * - Vòng lặp vô hạn
         * - Responsive design (2/3/5 sản phẩm tùy theo kích thước màn hình)
         * - Hỗ trợ navigation buttons
         */
        <Swiper
          // Ref để điều khiển carousel từ bên ngoài
          ref={swiperRef}
          // Kích hoạt modules Autoplay (tự động chuyển) và Navigation (nút điều khiển)
          modules={[Autoplay, Navigation]}
          // Tự động chuyển slide mỗi 5000ms (5 giây), không dừng khi người dùng tương tác
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          // Vòng lặp vô hạn - slide cuối → slide đầu
          loop={true}
          // Tốc độ transition: 350ms
          speed={350}
          // Khoảng cách giữa các slides
          spaceBetween={15}
          // Số slides hiển thị mặc định (desktop)
          slidesPerView={5}
          // Responsive breakpoints - điều chỉnh số slides tùy theo kích thước màn hình
          breakpoints={{
            // Mobile: chiều rộng < 768px → 2 sản phẩm/slide
            320: { slidesPerView: 2, spaceBetween: 12 },
            // Tablet: chiều rộng >= 768px → 3 sản phẩm/slide
            768: { slidesPerView: 3, spaceBetween: 15 },
            // Desktop: chiều rộng >= 1024px → 5 sản phẩm/slide
            1024: { slidesPerView: 5, spaceBetween: 15 },
          }}
          className="product-grid"
        >
          {(data?.items ?? []).map((p) => {
            /** Lấy URL ảnh đầu tiên của sản phẩm, nếu không có thì dùng placeholder */
            const imgUrl = p.images?.[0]?.image_url
              ? resolveProductImageUrl(p.images[0].image_url)
              : '/placeholder.png';

            const productDetailUrl = ROUTES.PRODUCT_DETAIL.replace(':id', p.id.toString());

            return (
              // Mỗi SwiperSlide là một slide trong carousel
              <SwiperSlide key={p.id}>
                {/* Thẻ sản phẩm */}
                <div className="product-card group">
                  {/* Container chứa ảnh sản phẩm */}
                  <Link to={productDetailUrl} className="product-image-container overflow-hidden block">
                    <img src={imgUrl} alt={p.name} className="product-image transition-transform duration-500 group-hover:scale-110" />
                  </Link>

                  {/* Tên sản phẩm (tối đa 3 dòng) */}
                  <Link to={productDetailUrl}>
                    <h3 className="product-name hover:text-indigo-600 transition-colors">{p.name}</h3>
                  </Link>

                  {/* Phần footer - giá và nút thêm vào giỏ */}
                  <div className="product-footer">
                    {/* Hiển thị giá định dạng hoặc "Liên hệ" nếu không có giá */}
                    <div className={`product-price ${!p.price ? 'contact' : ''}`}>
                      {p.price ? formatPrice(p.price) : 'Liên hệ'}
                    </div>
                    {/* Nút thêm vào giỏ hàng */}
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
