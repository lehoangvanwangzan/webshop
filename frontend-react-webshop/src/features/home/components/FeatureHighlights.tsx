import { SafetyOutlined, TruckOutlined, ToolOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { COLORS } from '@shared/constants/colors';
import '../styles/FeatureHighlights.css';

/**
 * Dữ liệu 4 tính năng chính của shop
 *
 * Cấu trúc:
 * - icon: Ant Design Icon component
 * - title: Tên tính năng (bộ chữ hoa)
 * - description: Mô tả chi tiết tính năng
 * - color: Màu sắc của icon
 * - variant: CSS modifier class (red, amber, red-dark, green)
 */
const FEATURES = [
  {
    icon: SafetyOutlined,
    title: 'CAM KẾT CHÍNH HÃNG',
    description: 'Đảm bảo nguồn gốc 100% từ các thương hiệu lớn',
    color: '#d71a21',
    variant: 'red',
  },
  {
    icon: TruckOutlined,
    title: 'GIAO HÀNG TOÀN QUỐC',
    description: 'Nhanh chóng, an toàn đến tận tay doanh nghiệp',
    color: '#f59e0b',
    variant: 'amber',
  },
  {
    icon: ToolOutlined,
    title: 'HỖ TRỢ KỸ THUẬT 24/7',
    description: 'Đội ngũ chuyên gia luôn sẵn sàng giải đáp',
    color: '#ef4444',
    variant: 'red-dark',
  },
  {
    icon: SafetyCertificateOutlined,
    title: 'BẢO HÀNH UY TÍN',
    description: 'Chế độ hậu mãi tận tâm, đổi trả linh hoạt',
    color: '#16a34a',
    variant: 'green',
  },
];

/**
 * Component FeatureHighlights - Hiển thị 4 tính năng nổi bật của shop
 *
 * Features:
 * - Responsive design: 1 cột (mobile) / 2 cột (tablet) / 4 cột (desktop)
 * - Hover animation: Scale 1 → 1.05 với box-shadow (0.3s smooth transition)
 * - Color variants: Red, Amber, Red-Dark, Green (mỗi feature có màu riêng)
 * - Ant Design icons: Safety, Truck, Tool, SafetyCertificate
 *
 * @component
 * @example
 * <FeatureHighlights />
 */
export function FeatureHighlights() {
  return (
    <div className="feature-highlights">
      {FEATURES.map(({ icon: Icon, title, description, color, variant }) => (
        <div key={title} className={`feature-card feature-card--${variant}`}>
          {/* Icon container - Display Ant Design icon with accent color */}
          <div className="feature-card__icon-box">
            <Icon style={{ fontSize: 32, color }} />
          </div>

          {/* Content section - Title and description */}
          <div className="feature-card__content">
            {/* Feature title - e.g., "CAM KẾT CHÍNH HÃNG" */}
            <div className="feature-card__title">{title}</div>

            {/* Description text */}
            <div className="feature-card__description">{description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
