import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { useBanners } from '@features/banners/hooks/useBanners';
import { resolveBannerImageUrl } from '@features/banners/api/banners.api';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './PromoBanners.module.css';

export function PromoBanners() {
  const { data, isLoading } = useBanners({
    page: 1,
    limit: 100,
    position: 'homepage',
  });

  const banners = data?.items ?? [];
  const hasBanners = banners.length > 0;

  if (isLoading || !hasBanners) return null;

  return (
    <div className={styles.wrapper}>
      <Swiper
        className={styles.swiper}
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        loop={banners.length > 1}
        speed={400}
      >
        {banners.map((banner, index) => {
          const src = resolveBannerImageUrl(banner.image_url!);
          return (
            <SwiperSlide key={banner.id}>
              <div
                className={`${styles.slide} ${banner.link_url ? styles.slideLink : ''}`}
                onClick={() => {
                  if (banner.link_url) window.location.href = banner.link_url;
                }}
              >
                {/* Nền mờ lấp khoảng trống — cùng URL nên trình duyệt chỉ tải ảnh 1 lần */}
                <img src={src} alt="" aria-hidden className={styles.backdrop} />
                <img
                  src={src}
                  alt={banner.title}
                  className={styles.image}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
