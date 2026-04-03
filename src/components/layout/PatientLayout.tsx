import { Outlet } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { PlusCircleOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Content, Footer: AntFooter } = Layout;

export function PatientLayout() {
  return (
    <Layout className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      <Header 
        className="fixed top-0 w-full z-50 flex justify-between items-center px-6 shadow-sm"
        style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }}
      >
        <div className="flex items-center gap-3">
          <img alt="Fisio Élite Logo" className="h-8 w-auto" src="/logo.png" />
          <span className="text-xl font-bold tracking-tight text-teal-800 font-headline hidden sm:inline-block">Fisio Élite</span>
        </div>
        <Menu 
          mode="horizontal" 
          defaultSelectedKeys={['booking']} 
          className="hidden md:flex border-none bg-transparent min-w-[400px] justify-end"
          items={[
            { key: 'booking', label: 'New Booking' },
            { key: 'appointments', label: 'Appointments' },
            { key: 'profile', label: 'Profile' }
          ]}
        />
      </Header>

      <Content className="pt-24 pb-20 px-4 max-w-7xl mx-auto w-full">
        <Outlet />
      </Content>

      {/* Mobile nav fallback style mapping to antd layout isn't strictly standard 
          but we can use AntFooter customized for mobile navigation */}
      <AntFooter className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-2 bg-white/90 backdrop-blur-lg rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.04)] z-50">
        <div className="flex flex-col items-center justify-center bg-teal-50 text-teal-700 rounded-2xl px-5 py-2 cursor-pointer">
          <PlusCircleOutlined className="text-lg" />
          <span className="text-[11px] font-medium tracking-wide mt-1">Book</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400 px-5 py-2 cursor-pointer">
          <CalendarOutlined className="text-lg" />
          <span className="text-[11px] font-medium tracking-wide mt-1">Agenda</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400 px-5 py-2 cursor-pointer">
          <UserOutlined className="text-lg" />
          <span className="text-[11px] font-medium tracking-wide mt-1">Profile</span>
        </div>
      </AntFooter>
    </Layout>
  );
}
