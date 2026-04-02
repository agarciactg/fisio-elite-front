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
          <img
            alt="Fisio Élite Clinic Logo"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtlbuGsQ1Dw_koUrhlMkM2WUF5FfcaVhMmFNgHGVBEr2WP_wDR5O3Y1lTGH3z7UXfvf2b3pLU_-TUGLkCP1FluzWOkLrjciCmtdAZ1WuxjlvXLXodmC90BuUiW-5yMxCCtWzXO8kLHW0quiKOgFgOsilSau_Rchcp7HSqnxJ3y6ML9-WiDZWa1pOLsFexHcv1ZTcxgVlLf0_yOrIUlTkZna_mjSRz_B2VBIYynO9zlHc0kr4el7CvW_UyRJF6XDyF53McpLgkLolJz"
          />
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
      
      <div className="absolute bottom-6 left-0 w-full px-6 pt-6 border-t border-slate-100/50">
        <div className="flex items-center gap-3 mb-0">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
            <img
              alt="Doctor profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQiXCGY_Tu9gNbMAGjURNTT0q4KadC6Ne-C38V1xkI1-B2lVIu3fvx-DbMGCg6TbDDNJ6SCre_sR0Z9-6eIqXVUg-2ucefr0uFxejJlpsgyemu4icraoX0-ArmPlqkgP7DZjnBeMZG7l4JMUQz7NCcmCW5RFFOccMTJNzi6zVsQ0zksGMUqcf9NkZXKk4oAEqyPs8KzoqAfVL9XScpUJLbt3KgLeSvmPD1aodOuAWqakmF5Ck9sGrZ7ipFoaVybmmx4qbkV0Th5qTa"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-on-surface mb-0">Dr. Elena V.</p>
            <p className="text-xs text-slate-500 truncate mb-0">Clinical Director</p>
          </div>
        </div>
      </div>
    </Sider>
  );
}
