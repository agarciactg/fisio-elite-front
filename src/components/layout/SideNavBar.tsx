import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  AppstoreOutlined,
  CalendarOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { UserMenu } from './UserMenu';

const { Sider } = Layout;

export function SideNavBar() {
  const location = useLocation();

  const menuItems = [
    { key: '/', icon: <AppstoreOutlined />, label: <Link to="/">Dashboard</Link> },
    { key: '/calendar', icon: <CalendarOutlined />, label: <Link to="/calendar">Appointments</Link> },
    { key: '/booking', icon: <TeamOutlined />, label: <Link to="/booking">Patients</Link> },
    { key: '/physio', icon: <MedicineBoxOutlined />, label: 'Physiotherapists' },
    { key: '/payments', icon: <DollarOutlined />, label: 'Payments' },
    { key: '/reports', icon: <LineChartOutlined />, label: 'Reports' },
  ];

  return (
    <Sider
      width={256}
      className="border-r-0 backdrop-blur-xl z-50 tonal-shift-bg-surface-container-low shadow-none py-6"
      style={{ background: 'rgba(255, 255, 255, 0.8)', height: '100vh', position: 'sticky', top: 0, left: 0 }}
    >
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
          <img alt="Fisio Élite Clinic Logo" className="w-full h-full object-cover" src="/logo.png" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tighter text-teal-800 dark:text-teal-300 font-headline mb-0">Fisio Élite</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-label mb-0">Clinical Atelier</p>
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="border-r-0 bg-transparent px-2 font-headline font-semibold text-slate-500"
      />

      <div className="absolute bottom-6 left-0 w-full px-4 pt-4 border-t border-slate-100/50">
        <UserMenu variant="sidebar" name="Dr. Elena V." email="elena@fisioelite.com" />
      </div>
    </Sider>
  );
}
