import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useBanners } from '../hooks/useBanners';
import { resolveBannerImageUrl } from '../api/banners.api';

interface Props {
  position?: string;
}

/**
 * BannerCarousel - Hiển thị banners từ database dưới dạng carousel
 *
 * Features:
 * - Fetch banners theo position (homepage, sidebar, category, footer)
 * - Auto-rotate slides mỗi 5 giây
 * - Navigation arrows
 * - Dot indicators
 * - Responsive image display
 *
 * @component
 * @param position - Banner position (default: 'homepage')
 */
export function BannerCarousel({ position = 'homepage' }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data, isLoading } = useBanners({
    page: 1,
    limit: 100,
    position,
  });

  const banners = data?.items ?? [];
  const hasBanners = banners.length > 0;

  // Auto-rotate slides
  useEffect(() => {
    if (!hasBanners) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length, hasBanners]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % banners.length);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <Spin />
      </div>
    );
  }

  if (!hasBanners) {
    return null;
  }

  const currentBanner = banners[activeIndex];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Banner image */}
      <div style={{ position: 'relative', paddingBottom: '33.33%' }}>
        <img
          src={resolveBannerImageUrl(currentBanner.image_url!)}
          alt={currentBanner.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onClick={() => {
            if (currentBanner.link_url) {
              window.location.href = currentBanner.link_url;
            }
          }}
        />
      </div>

      {/* Navigation arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.3)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              zIndex: 10,
              transition: 'background 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.3)')}
          >
            <LeftOutlined />
          </button>

          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.3)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              zIndex: 10,
              transition: 'background 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.3)')}
          >
            <RightOutlined />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {banners.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 6,
            zIndex: 10,
          }}
        >
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              style={{
                width: index === activeIndex ? 24 : 8,
                height: 4,
                borderRadius: 2,
                background: index === activeIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
