import { Outlet } from 'react-router';
import { TopBar } from './components/TopBar';
import { MainHeader } from './components/MainHeader';
import { MainFooter } from './components/MainFooter';

export function MainLayout() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <TopBar />
        <MainHeader />
      </div>

      {/* Page content */}
      <main style={{ maxWidth: 1440, margin: '0 auto', padding: '0 24px 32px' }}>
        <Outlet />
      </main>

      <MainFooter />
    </div>
  );
}
