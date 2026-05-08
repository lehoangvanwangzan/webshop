import { useState } from 'react';
import { Pagination } from 'antd';
import { PageLayout } from '@shared/components/PageLayout';
import {
  LayoutGrid, List, ShieldCheck,
  Eye, Printer, ChevronRight,
  Clock, User, Truck, Check, XCircle,
  CheckCircle, AlertCircle,
} from 'lucide-react';

/* ─── Types ─── */
type OrderStatus = 'Hoàn thành' | 'Đang xử lý' | 'Đang giao' | 'Đã hủy';
type ViewMode = 'grid' | 'list' | 'action';

interface OrderItem {
  name: string;
  qty: number;
  price: string;
  img: string;
}

interface Order {
  id: string;
  customer: { name: string; email: string; phone: string };
  items: OrderItem[];
  date: string;
  amount: string;
  status: OrderStatus;
  payment: string;
  shipping: string;
}

/* ─── Mock data ─── */
const ORDERS: Order[] = [
  {
    id: '#ORD-7432',
    customer: { name: 'Nguyễn Văn A', email: 'vana@gmail.com', phone: '0901 234 567' },
    items: [
      { name: 'Firewall Fortigate 60F', qty: 1, price: '32.990.000 ₫',
        img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=80&h=80&fit=crop' },
    ],
    date: '10/05/2026 14:30', amount: '32.990.000 ₫',
    status: 'Hoàn thành', payment: 'Thanh toán qua MOMO', shipping: 'Giao hàng nhanh',
  },
  {
    id: '#ORD-7431',
    customer: { name: 'Trần Thị B', email: 'thib@gmail.com', phone: '0987 654 321' },
    items: [
      { name: 'Switch Ubiquiti UniFi 24', qty: 1, price: '24.500.000 ₫',
        img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=80&h=80&fit=crop' },
      { name: 'Cáp quang LC-LC 10m', qty: 2, price: '490.000 ₫',
        img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=80&h=80&fit=crop' },
    ],
    date: '10/05/2026 10:15', amount: '25.480.000 ₫',
    status: 'Đang xử lý', payment: 'COD', shipping: 'Viettel Post',
  },
  {
    id: '#ORD-7430',
    customer: { name: 'Lê Văn C', email: 'vanc@gmail.com', phone: '0912 345 678' },
    items: [
      { name: 'NAS Synology DS923+', qty: 1, price: '21.900.000 ₫',
        img: 'https://images.unsplash.com/photo-1531492898-aa754be4a7fb?w=80&h=80&fit=crop' },
    ],
    date: '09/05/2026 16:45', amount: '21.900.000 ₫',
    status: 'Đang giao', payment: 'VNPay', shipping: 'Giao hàng tiết kiệm',
  },
  {
    id: '#ORD-7429',
    customer: { name: 'Phạm Minh D', email: 'minhd@gmail.com', phone: '0903 111 222' },
    items: [
      { name: 'Router MikroTik hEX S', qty: 1, price: '2.900.000 ₫',
        img: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=80&h=80&fit=crop' },
    ],
    date: '09/05/2026 09:00', amount: '2.900.000 ₫',
    status: 'Đã hủy', payment: 'COD', shipping: 'GHTK',
  },
  {
    id: '#ORD-7428',
    customer: { name: 'Hoàng Anh E', email: 'anhe@gmail.com', phone: '0978 888 999' },
    items: [
      { name: 'Wifi Ruckus R350', qty: 2, price: '4.100.000 ₫',
        img: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=80&h=80&fit=crop' },
    ],
    date: '08/05/2026 11:20', amount: '8.200.000 ₫',
    status: 'Hoàn thành', payment: 'Chuyển khoản', shipping: 'Giao hàng nhanh',
  },
  {
    id: '#ORD-7427',
    customer: { name: 'Đinh Quốc F', email: 'quocf@gmail.com', phone: '0911 000 111' },
    items: [
      { name: 'UPS APC Smart 1500VA', qty: 1, price: '9.800.000 ₫',
        img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=80&h=80&fit=crop' },
    ],
    date: '08/05/2026 08:45', amount: '9.800.000 ₫',
    status: 'Đang xử lý', payment: 'VNPay', shipping: 'Viettel Post',
  },
];

/* ─── Constants ─── */
const STATUS_STYLE: Record<OrderStatus, string> = {
  'Hoàn thành': 'bg-emerald-100 text-emerald-700',
  'Đang xử lý': 'bg-blue-100   text-blue-700',
  'Đang giao':  'bg-amber-100  text-amber-700',
  'Đã hủy':     'bg-rose-100   text-rose-700',
};

const STATUS_ICON: Record<OrderStatus, React.ReactNode> = {
  'Hoàn thành': <CheckCircle className="w-3 h-3" />,
  'Đang xử lý': <Clock       className="w-3 h-3" />,
  'Đang giao':  <Truck        className="w-3 h-3" />,
  'Đã hủy':     <AlertCircle  className="w-3 h-3" />,
};

/* ─── Sub-views ─── */

/** Chế độ lưới — thẻ vuông hiện đại */
function GridView({ orders }: { orders: Order[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {orders.map((o) => (
        <div
          key={o.id}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col group overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/40 group-hover:bg-blue-50/30 transition-colors">
            <span className="text-xs font-bold text-slate-400 tracking-wide">{o.id}</span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${STATUS_STYLE[o.status]}`}>
              {STATUS_ICON[o.status]}
              {o.status}
            </span>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 flex-1">
            {/* Customer */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                {o.customer.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{o.customer.name}</p>
                <p className="text-xs text-slate-400">{o.customer.phone}</p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {o.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <img
                    src={item.img} alt={item.name}
                    className="w-8 h-8 rounded-lg border border-slate-100 object-cover flex-shrink-0"
                  />
                  <span className="text-slate-600 line-clamp-1 flex-1">{item.name}</span>
                  <span className="font-bold text-slate-700 flex-shrink-0">x{item.qty}</span>
                </div>
              ))}
            </div>

            {/* Meta */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Clock className="w-3 h-3" />
              {o.date}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/20 flex justify-between items-center">
            <p className="text-lg font-bold text-blue-600">{o.amount}</p>
            <button className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-100 hover:bg-blue-700 hover:scale-105 transition-all">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Chế độ danh sách — dòng ngang chi tiết */
function ListView({ orders }: { orders: Order[] }) {
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div
          key={o.id}
          className="bg-white px-5 py-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-200 transition-colors"
        >
          {/* Left: thumbnail + info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <img
              src={o.items[0].img} alt=""
              className="hidden sm:block w-12 h-12 rounded-xl object-cover border border-slate-100 flex-shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-800 text-sm">{o.id}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold ${STATUS_STYLE[o.status]}`}>
                  {STATUS_ICON[o.status]}
                  {o.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {o.customer.name} &nbsp;·&nbsp; {o.items.length} sản phẩm &nbsp;·&nbsp; {o.shipping}
              </p>
            </div>
          </div>

          {/* Mid: payment + amount */}
          <div className="flex items-center gap-6 md:gap-8 px-0 md:px-4">
            <div className="hidden lg:block text-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Thanh toán</p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">{o.payment}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">{o.amount}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{o.date}</p>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex gap-1.5 flex-shrink-0">
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="In đơn">
              <Printer className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Xem chi tiết">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Chế độ xử lý — tập trung hành động */
function ActionView({ orders }: { orders: Order[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {orders.map((o) => (
        <div key={o.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Dark header */}
          <div className="px-5 py-3.5 bg-slate-900 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-bold text-white">{o.id}</span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLE[o.status]}`}>
                {o.status}
              </span>
            </div>
            <span className="text-xs text-slate-400">{o.date}</span>
          </div>

          {/* Content */}
          <div className="p-5 flex gap-4">
            <div className="flex-1 space-y-3 min-w-0">
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="font-semibold text-slate-800">{o.customer.name}</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 text-xs">{o.customer.phone}</span>
              </div>

              {/* Items */}
              <div className="space-y-1.5">
                {o.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <img src={item.img} alt="" className="w-7 h-7 rounded-lg object-cover border border-slate-100" />
                    <span className="text-slate-600 line-clamp-1 flex-1">{item.name}</span>
                    <span className="font-bold text-slate-500">×{item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Vận chuyển</p>
                <p className="text-xs text-slate-600">{o.shipping}</p>
              </div>
            </div>

            {/* Right: amount */}
            <div className="w-28 flex-shrink-0 flex flex-col justify-between items-end border-l border-slate-100 pl-4">
              <p className="text-[10px] text-slate-400">Tổng tiền</p>
              <p className="text-base font-bold text-slate-800 text-right">{o.amount}</p>
              <p className="text-[10px] font-bold text-emerald-600 text-right">{o.payment}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-5 pb-5 grid grid-cols-3 gap-2.5">
            <button className="flex flex-col items-center gap-1 py-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors">
              <XCircle className="w-5 h-5" />
              <span className="text-[10px] font-bold">Hủy đơn</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors">
              <Truck className="w-5 h-5" />
              <span className="text-[10px] font-bold">Giao hàng</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-100">
              <Check className="w-5 h-5" />
              <span className="text-[10px] font-bold">Xác nhận</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Filter bar ─── */
const STATUS_FILTERS: Array<{ label: string; value: OrderStatus | 'all' }> = [
  { label: 'Tất cả',      value: 'all'        },
  { label: 'Đang xử lý', value: 'Đang xử lý' },
  { label: 'Đang giao',  value: 'Đang giao'  },
  { label: 'Hoàn thành', value: 'Hoàn thành' },
  { label: 'Đã hủy',     value: 'Đã hủy'     },
];

const PAGE_SIZE = 4;

/* ─── Main page ─── */
export function AdminOrdersPage() {
  const [viewMode, setViewMode]       = useState<ViewMode>('list');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [page, setPage]               = useState(1);

  const filtered = statusFilter === 'all'
    ? ORDERS
    : ORDERS.filter((o) => o.status === statusFilter);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (value: OrderStatus | 'all') => {
    setStatusFilter(value);
    setPage(1); // reset về trang 1 khi đổi filter
  };

  const VIEW_TABS: Array<{ mode: ViewMode; icon: React.ReactNode; label: string }> = [
    { mode: 'grid',   icon: <LayoutGrid  className="w-4 h-4" />, label: 'Lưới'    },
    { mode: 'list',   icon: <List        className="w-4 h-4" />, label: 'Danh sách' },
    { mode: 'action', icon: <ShieldCheck className="w-4 h-4" />, label: 'Xử lý'   },
  ];

  const viewToggle = (
    <div className="flex bg-slate-100 p-1 rounded-xl gap-0.5">
      {VIEW_TABS.map(({ mode, icon, label }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          title={label}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === mode
              ? 'bg-white shadow text-blue-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {icon}
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <PageLayout
      title="Đơn hàng"
      subtitle={`${filtered.length} / ${ORDERS.length} đơn hàng`}
      action={viewToggle}
    >

      {/* ── Status filter chips ── */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => handleFilterChange(value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              statusFilter === value
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            {label}
            {value !== 'all' && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                statusFilter === value ? 'bg-white/20' : 'bg-slate-100'
              }`}>
                {ORDERS.filter((o) => o.status === value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {filtered.length === 0 ? (
        <div className="h-52 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-slate-100">
          <Clock className="w-8 h-8 mb-2 opacity-40" />
          <p className="text-sm font-medium">Không có đơn hàng nào</p>
        </div>
      ) : (
        <>
          {viewMode === 'grid'   && <GridView   orders={paged} />}
          {viewMode === 'list'   && <ListView   orders={paged} />}
          {viewMode === 'action' && <ActionView orders={paged} />}
        </>
      )}

      {/* ── Pagination ── */}
      {filtered.length > 0 && (
        <div className="flex justify-end">
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            total={filtered.length}
            onChange={(p) => setPage(p)}
            showTotal={(total) => `Tổng ${total} đơn hàng`}
            showSizeChanger={false}
          />
        </div>
      )}
    </PageLayout>
  );
}
