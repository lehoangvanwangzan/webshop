interface Props {
  /** Tiêu đề trang — text-2xl font-bold */
  title: string;
  /** Mô tả ngắn bên dưới tiêu đề */
  subtitle?: string;
  /** Vùng bên phải header (nút Thêm, bộ lọc, date picker…) */
  action?: React.ReactNode;
  /** Nội dung trang */
  children: React.ReactNode;
}

/**
 * Wrapper chuẩn cho mọi trang admin.
 *
 * Đảm bảo đồng nhất:
 *  - space-y-6 giữa các section
 *  - Page title: text-2xl font-bold text-slate-800
 *  - Subtitle:   text-sm text-slate-500 mt-1
 *  - Header row: flex items-center justify-between
 */
export function PageLayout({ title, subtitle, action, children }: Props) {
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0 flex items-center gap-2">{action}</div>
        )}
      </div>

      {/* ── Page content ── */}
      {children}
    </div>
  );
}
