import { Card, Button, Select } from 'antd';
import {
  FilterOutlined,
  PlusOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import NewAppointmentModal from '../Dashboard/NewAppointmentModal';
import { DayView } from './views/DayView';
import { WeekView } from './views/WeekView';
import { MonthView } from './views/MonthView';

const { Option } = Select;

export function CalendarPage() {
  const [openNewAppointment, setOpenNewAppointment] = useState(false)
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');

  const doctorsMock = [
    {
      id: 'ms',
      name: 'Dr. Marcos Silva',
      specialty: 'Fisioterapia Deportiva',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
      id: 'au',
      name: 'Dra. Anny Upareja',
      specialty: 'Osteopatía',
      avatar: 'https://i.pravatar.cc/150?img=32',
    },
    {
      id: 'jr',
      name: 'Dr. Javier Ruiz',
      specialty: 'Rehabilitación',
      avatar: 'https://i.pravatar.cc/150?img=45',
    },
  ];

  const appointmentsMock = [
    {
      id: '1',
      time: '08:15',
      patient: 'Ricardo Gómez',
      doctorId: 'ms',
      status: 'confirmed',
      treatment: 'Fisio rodilla',
    },
    {
      id: '2',
      time: '11:00',
      patient: 'Sofía Valera',
      doctorId: 'ms',
      status: 'arrived',
    },
    {
      id: '3',
      time: '09:15',
      patient: 'Marta Sánchez',
      doctorId: 'au',
      status: 'confirmed',
    },
    {
      id: '4',
      time: '08:30',
      patient: 'Ignacio López',
      doctorId: 'jr',
      status: 'canceled',
      treatment: 'Rehab rodilla (4/12)',
    },
  ];

  return (
    <>
      {/* Header & View Toggles */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-black font-headline tracking-tight text-on-surface mb-0">Agenda de Citas</h2>
          <p className="text-on-surface-variant font-label text-sm mt-1 mb-0">Martes, 14 de Mayo, 2026</p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-xl">
          <Button onClick={() => setView('day')} type="text" className="px-6 rounded-lg text-sm font-bold bg-white text-teal-700 shadow-sm transition-all hover:bg-white hover:text-teal-800">Hoy</Button>
          <Button onClick={() => setView('week')} type="text" className="px-6 rounded-lg text-sm font-bold text-slate-500 hover:bg-white/50 transition-all">Semana</Button>
          <Button onClick={() => setView('month')} type="text" className="px-6 rounded-lg text-sm font-bold text-slate-500 hover:bg-white/50 transition-all">Mes</Button>
        </div>
        <div className="flex items-center gap-3">
          <Button icon={<FilterOutlined />} size="large" className="bg-surface-container-lowest text-on-surface-variant font-bold border-0 rounded-xl hover:bg-teal-50">
            Filtrar
          </Button>
          <Button onClick={() => setOpenNewAppointment(true)} type="primary" icon={<PlusOutlined />} size="large" className="bg-gradient-to-br from-primary to-primary-container px-6 border-0 rounded-xl shadow-lg shadow-primary/20 font-bold">
            Agendar Nueva Cita
          </Button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 h-[calc(100vh-160px)] overflow-hidden">
        {/* Calendar Grid Container */}
        <Card
          bordered={false}
          className="flex-1 rounded-3xl shadow-sm overflow-hidden flex flex-col"
          bodyStyle={{ padding: 0, height: '100%' }}
        >
          {view === 'day' && (
            <DayView
              doctors={doctorsMock}
              appointments={appointmentsMock}
            />
          )}
          {view === 'week' && <WeekView />}
          {view === 'month' && <MonthView />}
        </Card>

        {/* Sidebar Mini Calendar & Avail */}
        <aside className="w-80 flex flex-col gap-6">
          <Card bordered={false} className="shadow-sm rounded-3xl" bodyStyle={{ padding: '24px' }}>
            <MiniCalendar />
          </Card>
          <Card bordered={false} className="shadow-sm rounded-3xl flex-1 flex flex-col" bodyStyle={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <QuickAvailability />
          </Card>
        </aside>
      </div>

      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        size="large"
        className="fixed bottom-10 right-10 w-16 h-16 text-2xl shadow-2xl z-50 hover:scale-110 transition-transform flex items-center justify-center bg-gradient-to-br from-primary to-primary-container border-0"
      />

      <NewAppointmentModal
        open={openNewAppointment}
        onClose={() => setOpenNewAppointment(false)}
      />
    </>
  );
}

function MiniCalendar() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-black font-headline mb-0">Mayo 2026</p>
        <div className="flex gap-1">
          <Button type="text" shape="circle" icon={<LeftOutlined />} size="small" />
          <Button type="text" shape="circle" icon={<RightOutlined />} size="small" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
        <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Demo values */}
        <span className="text-[11px] p-2 text-slate-300">29</span>
        <span className="text-[11px] p-2 text-slate-300">30</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">1</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">2</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">3</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">4</span>
        <span className="text-[11px] p-2 bg-primary text-white rounded-full shadow-sm font-bold cursor-pointer">5</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">6</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">7</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">8</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">9</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">10</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">11</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">12</span>
      </div>
    </div>
  );
}

function QuickAvailability() {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-sm font-black font-headline mb-4">Disponibilidad Rápida</h3>
      <div className="space-y-4 flex-1">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Seleccionar Especialista</label>
          <Select defaultValue="all" className="w-full" size="large" bordered={false} style={{ backgroundColor: '#f3f4f5', borderRadius: '8px' }}>
            <Option value="all">Todos los Especialistas</Option>
            <Option value="ms">Dr. Marcos Silva</Option>
            <Option value="lm">Dra. Anny Upareja</Option>
          </Select>
        </div>
        <div className="pt-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Huecos Libres Hoy</p>
          <div className="space-y-2">
            {['12:30 - 13:30', '15:00 - 16:00', '17:30 - 18:30'].map(t => (
              <Button key={t} type="text" block className="h-auto p-3 flex justify-between items-center bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-xl transition-colors">
                <span className="text-xs">{t}</span>
                <PlusOutlined className="text-teal-600" />
              </Button>
            ))}
          </div>
        </div>
      </div>
      <Button type="primary" block className="mt-6 bg-secondary-container text-on-secondary-container border-0 font-black h-12 rounded-xl text-xs hover:brightness-105 shadow-sm">
        Asignación Automática
      </Button>
    </div>
  );
}
