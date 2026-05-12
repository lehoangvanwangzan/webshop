import {
  TrendingUp, TrendingDown, ShoppingCart, Users,
  LayoutDashboard, Package, Clock, AlertCircle, CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router';
import { ROUTES } from '@routes/routes';
import { PageLayout } from '@shared/components/PageLayout';
import { useDashboardStats } from '../hooks/useDashboardStats';

/* ─── Static mock (các card chưa có API riêng) ─── */
const STATIC_STATS = [
  {
    id: 1, label: 'Tổng Doanh Thu', value: '428.500.000 ₫',
    change: '+12.5%', up: true, icon: TrendingUp,
    color: 'text-emerald-600', bg: 'bg-emerald-50',
  },
  {
    id: 2, label: 'Đơn Hàng Mới', value: '1.240',
    change: '+8.2%', up: true, icon: ShoppingCart,
    color: 'text-blue-600', bg: 'bg-blue-50',
  },
  {
    id: 3, label: 'Người Dùng', value: null, // ← từ API
    change: null, up: false, icon: Users,
    color: 'text-purple-600', bg: 'bg-purple-50',
  },
  {
    id: 4, label: 'Sản Phẩm Đang Bán', value: '312',
    change: '+4.1%', up: true, icon: Package,
    color: 'text-orange-600', bg: 'bg-orange-50',
  },
];

const ORDERS = [
  { id: '#ORD-7432', customer: 'Nguyễn Văn A', product: 'Firewall Fortigate 60F', date: '10/05/2026', amount: '32.990.000 ₫', status: 'Hoàn thành' },
  { id: '#ORD-7431', customer: 'Trần Thị B',   product: 'Switch Ubiquiti UniFi 24',  date: '10/05/2026', amount: '24.500.000 ₫', status: 'Đang xử lý' },
  { id: '#ORD-7430', customer: 'Lê Văn C',     product: 'NAS Synology DS923+',       date: '09/05/2026', amount: '15.490.000 ₫', status: 'Đã hủy' },
  { id: '#ORD-7429', customer: 'Phạm Minh D',  product: 'Router MikroTik hEX S',     date: '09/05/2026', amount: '2.900.000 ₫',  status: 'Đang giao' },
  { id: '#ORD-7428', customer: 'Hoàng Anh E',  product: 'Wifi Ruckus R350',          date: '08/05/2026', amount: '8.200.000 ₫',  status: 'Hoàn thành' },
];

const ACTIVITY = [
  { time: '2 phút trước',   text: 'Nguyễn Văn A đã đặt đơn hàng #ORD-7432',         type: 'order'  },
  { time: '15 phút trước',  text: 'Tồn kho Switch Cisco SG350 còn 2 sản phẩm',        type: 'alert'  },
  { time: '1 giờ trước',    text: 'Cập nhật giá mới cho Firewall Fortinet dòng 100F',  type: 'update' },
  { time: '3 giờ trước',    text: 'Hệ thống đã sao lưu dữ liệu thành công',           type: 'system' },
  { time: '5 giờ trước',    text: 'Trần Thị B đăng ký tài khoản mới',                 type: 'user'   },
];

const STATUS_STYLE: Record<string, string> = {
  'Hoàn thành': 'bg-emerald-100 text-emerald-700',
  'Đang xử lý': 'bg-blue-100 text-blue-700',
  'Đang giao':  'bg-amber-100 text-amber-700',
  'Đã hủy':     'bg-rose-100 text-rose-700',
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  'Hoàn thành': <CheckCircle className="w-3 h-3" />,
  'Đang xử lý': <Clock className="w-3 h-3" />,
  'Đang giao':  <Clock className="w-3 h-3" />,
  'Đã hủy':     <AlertCircle className="w-3 h-3" />,
};

const ACTIVITY_DOT: Record<string, string> = {
  order: 'bg-blue-500', alert: 'bg-rose-500', update: 'bg-amber-500',
  system: 'bg-emerald-500', user: 'bg-purple-500',
};

const DashboardAction = () => (
  <div className="hidden sm:flex flex-col items-end gap-0.5">
    <p className="text-sm font-semibold text-slate-700">
      {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
    </p>
    <p className="text-xs text-slate-400">
      Cập nhật: {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
    </p>
  </div>
);

export function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  const STATS = STATIC_STATS.map((s) => {
    if (s.id === 3) {
      // Card Người Dùng — lấy từ API
      const count = stats?.total_users;
      const pct   = stats?.user_change_pct;
      const up    = stats?.user_change_up ?? true;

      const value = statsLoading
        ? '…'
        : count !== undefined ? count.toLocaleString('vi-VN') : '—';

      const change = statsLoading
        ? '…'
        : pct !== undefined ? `${pct}%` : '0%';

      return { ...s, value, change, up };
    }
    if (s.id === 4) {
      // Card Sản Phẩm Đang Bán — lấy từ API
      const count = stats?.total_active_products;
      const pct   = stats?.product_change_pct;
      const up    = stats?.product_change_up ?? true;

      const value = statsLoading
        ? '…'
        : count !== undefined ? count.toLocaleString('vi-VN') : '—';

      const change = statsLoading
        ? '…'
        : pct !== undefined ? `${pct}%` : '0%';

      return { ...s, value, change, up };
    }
    return s;
  });

  return (
    <PageLayout
      title="Bảng điều khiển"
      subtitle="Tổng quan hoạt động kinh doanh"
      action={<DashboardAction />}
    >
      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className={`${s.bg} p-2.5 rounded-xl`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              {s.change !== null && (
                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
                  ${s.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {s.change}
                </span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-slate-500 text-xs font-medium">{s.label}</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Orders + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-800">Đơn hàng gần đây</h2>
            <Link
              to={ROUTES.ORDERS}
              className="flex items-center gap-1 text-blue-600 text-xs font-semibold hover:underline"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase font-semibold tracking-wide">
                  <th className="px-6 py-3">Mã đơn</th>
                  <th className="px-6 py-3">Khách hàng</th>
                  <th className="px-6 py-3 hidden md:table-cell">Ngày đặt</th>
                  <th className="px-6 py-3">Số tiền</th>
                  <th className="px-6 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {ORDERS.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-medium text-slate-700 text-xs">{o.id}</td>
                    <td className="px-6 py-3.5">
                      <div className="font-medium text-slate-800 text-xs">{o.customer}</div>
                      <div className="text-slate-400 text-[11px]">{o.product}</div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 text-xs hidden md:table-cell">{o.date}</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-800 text-xs whitespace-nowrap">{o.amount}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${STATUS_STYLE[o.status]}`}>
                        {STATUS_ICON[o.status]}
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-800 mb-5">Hoạt động hệ thống</h2>
          <div className="space-y-4">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${ACTIVITY_DOT[a.type] ?? 'bg-slate-400'}`} />
                  {i < ACTIVITY.length - 1 && <div className="w-px flex-1 bg-slate-100 my-1" />}
                </div>
                <div className="pb-1">
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">{a.text}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick links ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: ROUTES.ADMIN_PRODUCTS, icon: Package, label: 'Quản lý sản phẩm', desc: 'Thêm, sửa, xoá sản phẩm', color: 'text-orange-500', bg: 'bg-orange-50' },
          { to: ROUTES.ADMIN_USERS,    icon: Users,   label: 'Quản lý người dùng', desc: 'Xem và phân quyền tài khoản', color: 'text-purple-500', bg: 'bg-purple-50' },
          { to: '#',                   icon: LayoutDashboard, label: 'Báo cáo doanh thu', desc: 'Thống kê và xuất báo cáo', color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map((q) => (
          <Link
            key={q.to}
            to={q.to}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-4 group"
          >
            <div className={`${q.bg} p-3 rounded-xl`}>
              <q.icon className={`w-5 h-5 ${q.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{q.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{q.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
