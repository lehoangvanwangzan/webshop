import { Link } from 'react-router';
import { RightOutlined, HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Spin, Empty } from 'antd';
import { ROUTES } from '@routes/routes';
import { useBrands } from '../hooks/useBrands';

const RED = '#dc2626';

export function BrandsPage() {
  const { data: brands, isLoading, isError } = useBrands();

  return (
    <div style={{ padding: '16px 0' }}>
      {/* Breadcrumb */}
      <Breadcrumb
        style={{ marginBottom: 16, fontSize: 13 }}
        items={[
          { title: <Link to={ROUTES.HOME}><HomeOutlined /> Trang chủ</Link> },
          { title: <span style={{ color: '#6b7280' }}>Thương hiệu sản phẩm</span> },
        ]}
      />

      {/* Banner Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        {/* Left Banner - Ubiquiti */}
        <div style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/ubiquiti_banner.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 8,
          padding: '32px',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 280,
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 16px', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              BỘ PHÁT WIFI<br />
              UBIQUITI UNIFI
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', fontSize: 14, fontWeight: 600 }}>
              <li style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#38bdf8' }}>✦</span> HIỆU SUẤT CAO
              </li>
              <li style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#38bdf8' }}>✦</span> GIÁ THÀNH HỢP LÝ
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#38bdf8' }}>✦</span> TRẢI NGHIỆM MƯỢT MÀ
              </li>
            </ul>
            <button style={{
              background: '#fff', color: '#0f172a', border: 'none',
              padding: '12px 32px', borderRadius: 24, fontWeight: 800, fontSize: 14,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              MUA NGAY <RightOutlined style={{ fontSize: 12 }} />
            </button>
          </div>
        </div>

        {/* Right Banner - Teltonika */}
        <div style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("/teltonika_banner.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 8,
          padding: '32px',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 280,
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 20px', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              ROUTER 3G/4G CÔNG NGHIỆP<br />
              <span style={{ color: '#38bdf8' }}>TELTONIKA CHÍNH HÃNG</span>
            </h2>
            <button style={{
              background: '#fff', color: '#1e40af', border: 'none',
              padding: '12px 32px', borderRadius: 24, fontWeight: 800, fontSize: 14,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              MUA NGAY <RightOutlined style={{ fontSize: 12 }} />
            </button>
          </div>
        </div>
      </div>

      {/* Brands Grid Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#1f2937' }}>
          THƯƠNG HIỆU SẢN PHẨM
        </h2>
        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }}></div>
      </div>

      {/* Brands Grid */}
      {isLoading ? (
        <div style={{ padding: '64px 0', textAlign: 'center' }}>
          <Spin size="large" tip="Đang tải danh sách thương hiệu..." />
        </div>
      ) : isError ? (
        <div style={{ padding: '64px 0' }}>
          <Empty description="Không thể tải danh sách thương hiệu. Vui lòng thử lại sau." />
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 12,
        }}>
          {brands?.map((brand) => (
            <div
              key={brand.id}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 4,
                padding: '20px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 20px rgba(0,0,0,0.08)';
                (e.currentTarget as HTMLElement).style.borderColor = RED;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{ 
                height: 80, 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: '#f9fafb',
                borderRadius: 4,
                marginBottom: 8
              }}>
                <img 
                  src={brand.logo_url || `https://www.google.com/s2/favicons?domain=${brand.website_url}&sz=128`} 
                  alt={brand.name} 
                  style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }} 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes('clearbit')) {
                      target.src = `https://www.google.com/s2/favicons?domain=${brand.website_url}&sz=128`;
                    } else {
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.style.width = '40px';
                        fallback.style.height = '40px';
                        fallback.style.borderRadius = '50%';
                        fallback.style.background = RED;
                        fallback.style.color = '#fff';
                        fallback.style.display = 'flex';
                        fallback.style.alignItems = 'center';
                        fallback.style.justifyContent = 'center';
                        fallback.style.fontWeight = 'bold';
                        fallback.style.fontSize = '18px';
                        fallback.innerText = brand.name.charAt(0).toUpperCase();
                        parent.appendChild(fallback);
                      }
                    }
                  }}
                />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{brand.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
