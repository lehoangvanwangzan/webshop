import { useState } from 'react';
import { PageLayout } from '@shared/components/PageLayout';
import {
  Globe, CreditCard, BellRing, ShieldCheck,
  Store, Save, CheckCircle,
} from 'lucide-react';

/* ─── Types ─── */
type SettingsTab = 'general' | 'payment' | 'notification' | 'security';

interface NavTab {
  id: SettingsTab;
  label: string;
  icon: React.ElementType;
}

/* ─── Config ─── */
const TABS: NavTab[] = [
  { id: 'general',      label: 'Cấu hình chung', icon: Globe      },
  { id: 'payment',      label: 'Thanh toán',      icon: CreditCard },
  { id: 'notification', label: 'Thông báo',        icon: BellRing   },
  { id: 'security',     label: 'Bảo mật',          icon: ShieldCheck},
];

const PAYMENT_METHODS = [
  { name: 'Thanh toán khi nhận hàng (COD)', active: true  },
  { name: 'Cổng thanh toán MOMO',           active: true  },
  { name: 'Cổng thanh toán VNPay',          active: false },
  { name: 'Thanh toán qua Stripe',          active: false },
];

/* ─── Sub-components ─── */

function GeneralTab() {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Store} title="Thông tin cửa hàng" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Tên cửa hàng">
          <input type="text" defaultValue="WebShop Vietnam" className={inputCls} />
        </Field>
        <Field label="Email liên hệ">
          <input type="email" defaultValue="contact@webshop.vn" className={inputCls} />
        </Field>
        <Field label="Số điện thoại">
          <input type="tel" defaultValue="0909 123 456" className={inputCls} />
        </Field>
        <Field label="Website">
          <input type="url" defaultValue="https://webshop.vn" className={inputCls} />
        </Field>
        <Field label="Đơn vị tiền tệ">
          <select className={inputCls}>
            <option>VNĐ (₫)</option>
            <option>USD ($)</option>
          </select>
        </Field>
        <Field label="Múi giờ">
          <select className={inputCls}>
            <option>(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
            <option>(GMT+00:00) UTC</option>
          </select>
        </Field>
      </div>
      <Field label="Địa chỉ">
        <textarea
          rows={3}
          defaultValue="123 Đường ABC, Quận 1, TP. Hồ Chí Minh"
          className={inputCls}
        />
      </Field>
      <Field label="Mô tả cửa hàng">
        <textarea
          rows={3}
          defaultValue="Chuyên cung cấp thiết bị mạng, bảo mật và hạ tầng CNTT chính hãng."
          className={inputCls}
        />
      </Field>
    </div>
  );
}

function PaymentTab() {
  return (
    <div className="space-y-6">
      <SectionHeader icon={CreditCard} title="Cổng thanh toán" />
      <div className="space-y-3">
        {PAYMENT_METHODS.map((m) => (
          <div
            key={m.name}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
          >
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full flex-shrink-0 ${
                m.active
                  ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                  : 'bg-slate-300'
              }`} />
              <span className="font-medium text-slate-700 text-sm">{m.name}</span>
            </div>
            <button className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              m.active
                ? 'bg-white text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50'
                : 'bg-blue-600 text-white shadow-md shadow-blue-100 hover:bg-blue-700'
            }`}>
              {m.active ? 'Cấu hình' : 'Kích hoạt'}
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-xs font-semibold text-blue-700 mb-1">Lưu ý bảo mật</p>
        <p className="text-xs text-blue-600 leading-relaxed">
          Không lưu trữ thông tin thẻ tín dụng trực tiếp. Tất cả giao dịch được mã hoá
          theo chuẩn PCI-DSS thông qua cổng thanh toán bên thứ ba.
        </p>
      </div>
    </div>
  );
}

function NotificationTab() {
  const items = [
    {
      title: 'Đơn hàng mới',
      desc: 'Gửi email cho khách hàng khi đặt hàng thành công',
      on: true,
    },
    {
      title: 'Thông báo tồn kho',
      desc: 'Cảnh báo khi sản phẩm còn dưới 5 món trong kho',
      on: false,
    },
    {
      title: 'Xác nhận thanh toán',
      desc: 'Gửi thông báo khi thanh toán được xác nhận',
      on: true,
    },
    {
      title: 'Đánh giá sản phẩm',
      desc: 'Nhận thông báo khi khách hàng để lại đánh giá mới',
      on: false,
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader icon={BellRing} title="Email & Thông báo" />
      <div className="divide-y divide-slate-50">
        {items.map((item) => (
          <div key={item.title} className="flex items-center justify-between py-4">
            <div className="pr-6">
              <p className="font-semibold text-slate-700 text-sm">{item.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
            </div>
            {/* Toggle switch — static UI */}
            <div className={`w-11 h-6 rounded-full relative flex-shrink-0 cursor-pointer transition-colors ${
              item.on ? 'bg-blue-600' : 'bg-slate-200'
            }`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                item.on ? 'right-1' : 'left-1'
              }`} />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Email nhận thông báo quản trị
        </label>
        <input
          type="email"
          defaultValue="admin@webshop.vn"
          className={inputCls}
          placeholder="admin@webshop.vn"
        />
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <SectionHeader icon={ShieldCheck} title="Bảo mật hệ thống" />

      {/* 2FA status */}
      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-4">
        <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
        <div>
          <p className="font-bold text-emerald-800 text-sm">Xác thực 2 lớp đang bật</p>
          <p className="text-emerald-600 text-xs mt-0.5">
            Tài khoản của bạn đang được bảo vệ an toàn.
          </p>
        </div>
      </div>

      {/* Password change */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-slate-700">Đổi mật khẩu quản trị</p>
        <Field label="Mật khẩu hiện tại">
          <input type="password" placeholder="••••••••" className={inputCls} />
        </Field>
        <Field label="Mật khẩu mới">
          <input type="password" placeholder="••••••••" className={inputCls} />
        </Field>
        <Field label="Xác nhận mật khẩu mới">
          <input type="password" placeholder="••••••••" className={inputCls} />
        </Field>
      </div>

      {/* Session */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-700">Phiên đăng nhập</p>
        {[
          { device: 'Chrome / Windows 11', location: 'Hà Nội, Việt Nam', time: 'Hiện tại', current: true },
          { device: 'Safari / iPhone 15',  location: 'TP. HCM, Việt Nam', time: '2 giờ trước', current: false },
        ].map((s) => (
          <div
            key={s.device}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
          >
            <div>
              <p className="text-sm font-medium text-slate-700">{s.device}</p>
              <p className="text-xs text-slate-500">{s.location} · {s.time}</p>
            </div>
            {s.current ? (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                Đang dùng
              </span>
            ) : (
              <button className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors">
                Đăng xuất
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Shared helpers ─── */
const inputCls = `
  w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm
  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white
  outline-none transition-all resize-none
`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
    </div>
  );
}

/* ─── Main Page ─── */
export function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const content: Record<SettingsTab, React.ReactNode> = {
    general:      <GeneralTab />,
    payment:      <PaymentTab />,
    notification: <NotificationTab />,
    security:     <SecurityTab />,
  };

  return (
    <PageLayout title="Cài đặt" subtitle="Quản lý cấu hình hệ thống và cửa hàng">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Left nav ── */}
        <aside className="w-full lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2 space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${activeTab === id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </aside>

        {/* ── Right content ── */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          {content[activeTab]}

          {/* Save button */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
              <Save className="w-4 h-4" />
              Lưu cài đặt
            </button>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
