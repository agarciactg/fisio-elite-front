import { Outlet } from 'react-router-dom';
import { Layout as AntLayout } from 'antd';
import { SideNavBar } from './SideNavBar';
import { TopNavBar } from './TopNavBar';
import { Footer } from './Footer';

const { Content } = AntLayout;

export function Layout() {
  return (
    <AntLayout className="min-h-screen">
      <SideNavBar />
      <AntLayout className="transition-all" style={{ minHeight: '100vh' }}>
        <TopNavBar />
        <Content className="pt-8 pb-12 px-8 flex-1">
          <Outlet />
        </Content>
        <Footer />
      </AntLayout>
    </AntLayout>
  );
}
