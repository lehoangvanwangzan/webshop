import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard, Package, Users, Settings,
  Bell, Menu, X, ShoppingCart, LogOut, ChevronRight, ClipboardList,
} from 'lucide-react';
import { App } from 'antd';
import { useAuthStore } from '@features/auth/stores/auth.store';
import { authApi } from '@features/auth/api/auth.api';
import { resolveAvatarUrl } from '@features/users/api/users.api';
import { ROUTES } from '@routes/routes';

const NAV_ITEMS = [
  { to: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard, label: 'Bảng điều khiển' },
  { to: ROUTES.ADMIN_PRODUCTS, icon: Package, label: 'Sản phẩm' },
  { to: ROUTES.ADMIN_ORDERS, icon: ClipboardList, label: 'Đơn hàng' },
  { to: ROUTES.ADMIN_USERS, icon: Users, label: 'Người dùng' },
  { to: ROUTES.ADMIN_SETTINGS, icon: Settings, label: 'Cài đặt' },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  // Sync user mới nhất từ server (lấy avatar_url nếu đã cập nhật sau login)
  useEffect(() => {
    authApi.me()
      .then((freshUser) => setAuth(freshUser, useAuthStore.getState().token!))
      .catch(() => { /* token hết hạn → AdminRoute sẽ redirect */ });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    modal.confirm({
      title: 'Đăng xuất',
      content: 'Bạn có chắc muốn đăng xuất không?',
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => { clearAuth(); navigate(ROUTES.LOGIN); },
    });
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map((w) => w[0]).slice(-2).join('').toUpperCase()
    : 'AD';
  const avatarSrc = resolveAvatarUrl(user?.avatar_url);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800">

      {/* ── Backdrop mobile ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-slate-200
        flex flex-col
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
              <ShoppingCart className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-800">WebShop</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Menu</p>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all group
                ${isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="p-3 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Tài khoản</p>
            <div className="flex items-center gap-3 mb-3">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.full_name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold border-2 border-white shadow-sm flex-shrink-0">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{user?.full_name ?? 'Admin'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-white hover:border-slate-300 hover:text-red-500 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex relative w-64">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1" />
            <div className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.full_name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>
              )}
              <span className="hidden sm:inline text-sm font-medium text-slate-700 truncate max-w-[120px]">
                {user?.full_name ?? 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
