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
    <div
      style={{
        flex: 1,
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      }}
    >
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        loop={banners.length > 1}
        speed={400}
        style={{ width: '100%' }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className={styles.slide}>
              <img
                src={resolveBannerImageUrl(banner.image_url!)}
                alt={banner.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                  cursor: banner.link_url ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (banner.link_url) window.location.href = banner.link_url;
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
