import { Layout, Input, Button, Badge } from 'antd';
import { SearchOutlined, BellOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons';
import { UserMenu } from './UserMenu';
import { useState } from 'react';
import NewAppointmentModal from '../../views/Dashboard/NewAppointmentModal';

const { Header } = Layout;

export function TopNavBar() {
  const [openNewAppointment, setOpenNewAppointment] = useState(false)

  return (
    <Header
      className="sticky top-0 w-full h-16 flex justify-between items-center px-8 z-40"
      style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
    >
      <div className="flex items-center flex-1 max-w-xl">
        <Input
          prefix={<SearchOutlined className="text-slate-400" />}
          placeholder="Search patients, records, or therapists..."
          className="bg-surface-container-high/50 border-none rounded-lg py-2 hover:bg-surface-container-high focus:bg-white"
        />
      </div>

      <div className="flex items-center gap-4">
        <Badge dot status="error" offset={[-4, 4]}>
          <Button type="text" shape="circle" icon={<BellOutlined className="text-lg text-slate-500" />} />
        </Badge>
        <Button type="text" shape="circle" icon={<SettingOutlined className="text-lg text-slate-500" />} />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-gradient-to-br from-primary to-primary-container px-6 rounded-xl font-bold border-0 shadow-sm"
          size="large"
          onClick={() => setOpenNewAppointment(true)}
        >
          Nueva Cita
        </Button>

        <div className="w-px h-6 bg-slate-200" />

        <UserMenu variant="topbar" name="Dr. Elena V." email="elena@fisioelite.com" />
      </div>

      <NewAppointmentModal
        open={openNewAppointment}
        onClose={() => setOpenNewAppointment(false)}
      />
    </Header>
  );
}
