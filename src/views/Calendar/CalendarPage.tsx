import { Card, Button, Select, Spin } from 'antd';
import { FilterOutlined, PlusOutlined, LeftOutlined, RightOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useState, useEffect, useCallback } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import weekday from 'dayjs/plugin/weekday';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import NewAppointmentModal from '../Dashboard/NewAppointmentModal';
import { DayView } from './views/DayView';
import { WeekView } from './views/WeekView';
import { MonthView } from './views/MonthView';
import { AppointmentDetailDrawer } from './components/AppointmentDetailDrawer';
import { fisioEliteApiService } from '../../services/api';

dayjs.extend(weekday);
dayjs.extend(isSameOrBefore);
dayjs.locale('es');

const { Option } = Select;
type ViewType = 'day' | 'week' | 'month';

function getLabel(view: ViewType, date: Dayjs): string {
  if (view === 'day') return date.format('dddd, D [de] MMMM [de] YYYY');
  if (view === 'week') {
    const s = date.startOf('week'), e = date.endOf('week');
    return s.month() === e.month()
      ? `${s.date()} – ${e.date()} de ${s.format('MMMM YYYY')}`
      : `${s.format('D MMM')} – ${e.format('D MMM YYYY')}`;
  }
  return date.format('MMMM YYYY');
}
function shift(view: ViewType, date: Dayjs, dir: 1 | -1): Dayjs {
  return date.add(dir, view === 'day' ? 'day' : view === 'week' ? 'week' : 'month');
}

export function CalendarPage() {
  const [view, setView] = useState<ViewType>('day');
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [therapists, setTherapists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [prefilledTime, setPrefilledTime] = useState<{ date: string; start: string; end: string } | null>(null);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(k => k + 1);
    setSelectedAppt(null);
  }, []);

  const handleAppointmentClick = useCallback((appt: any) => {
    setSelectedAppt(appt);
    setDrawerOpen(true);
  }, []);

  const handleSlotClick = useCallback((slot: { start: string; end: string }) => {
    setPrefilledTime({
      date: currentDate.format('YYYY-MM-DD'),
      start: slot.start,
      end: slot.end,
    });
    setOpenModal(true);
  }, [currentDate]);

  useEffect(() => {
    fisioEliteApiService.getTherapists().then((data: any[]) => {
      setTherapists(data.map(t => ({
        ...t,
        name: `${t.first_name} ${t.last_name}`,
        avatar: `https://i.pravatar.cc/150?u=${t.id}`,
      })));
    }).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    let promise: Promise<any[]>;
    if (view === 'day') {
      promise = fisioEliteApiService.getAppointmentsByDay(currentDate.format('YYYY-MM-DD'));
    } else if (view === 'week') {
      promise = fisioEliteApiService.getAppointmentsByWeek(currentDate.format('YYYY-MM-DD'));
    } else {
      promise = fisioEliteApiService.getAppointmentsByMonth(currentDate.year(), currentDate.month() + 1);
    }
    promise.then(setAppointments).catch(console.error).finally(() => setLoading(false));
  }, [view, currentDate, refreshKey]);

  const isCurrentPeriod = currentDate.isSame(
    dayjs(),
    view === 'month' ? 'month' : view === 'week' ? 'week' : 'day'
  );

  return (
    <>
      <div className="flex justify-between items-end mb-6 gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-black font-headline tracking-tight text-on-surface mb-0">Agenda de Citas</h2>
          <p className="text-on-surface-variant font-label text-sm mt-1 mb-0 capitalize">{getLabel(view, currentDate)}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
            <Button type="text" shape="circle" size="small" icon={<LeftOutlined />}
              onClick={() => setCurrentDate(d => shift(view, d, -1))} className="text-slate-500 hover:bg-white" />
            <Button type="text" size="small" onClick={() => setCurrentDate(dayjs())} disabled={isCurrentPeriod}
              className={`px-3 rounded-lg text-xs font-bold ${isCurrentPeriod ? 'text-slate-300' : 'text-teal-700 hover:bg-white'}`}>
              Hoy
            </Button>
            <Button type="text" shape="circle" size="small" icon={<RightOutlined />}
              onClick={() => setCurrentDate(d => shift(view, d, 1))} className="text-slate-500 hover:bg-white" />
          </div>
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
            {(['day', 'week', 'month'] as ViewType[]).map(v => (
              <Button key={v} type="text" size="small" onClick={() => setView(v)}
                className={`px-4 rounded-lg text-xs font-bold transition-all ${view === v ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}>
                {v === 'day' ? 'Día' : v === 'week' ? 'Semana' : 'Mes'}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button icon={<FilterOutlined />} size="large"
            className="bg-surface-container-lowest text-on-surface-variant font-bold border-0 rounded-xl hover:bg-teal-50">
            Filtrar
          </Button>
          <Button onClick={() => { setPrefilledTime(null); setOpenModal(true); }} type="primary" icon={<PlusOutlined />} size="large"
            className="bg-gradient-to-br from-primary to-primary-container px-6 border-0 rounded-xl shadow-lg font-bold">
            Agendar Nueva Cita
          </Button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 h-[calc(100vh-200px)] overflow-hidden">
        <Card bordered={false} className="flex-1 rounded-3xl shadow-sm overflow-hidden flex flex-col"
          bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {view === 'day' && <DayView date={currentDate} doctors={therapists} appointments={appointments} loading={loading} onAppointmentClick={handleAppointmentClick} />}
          {view === 'week' && <WeekView date={currentDate} appointments={appointments} loading={loading} onAppointmentClick={handleAppointmentClick} />}
          {view === 'month' && <MonthView date={currentDate} appointments={appointments} loading={loading} onAppointmentClick={handleAppointmentClick} />}
        </Card>

        <aside className="w-80 flex flex-col gap-6">
          <Card bordered={false} className="shadow-sm rounded-3xl" bodyStyle={{ padding: '24px' }}>
            <MiniCalendar selected={currentDate} onSelect={d => { setCurrentDate(d); setView('day'); }} />
          </Card>
          <Card bordered={false} className="shadow-sm rounded-3xl flex-1 flex flex-col"
            bodyStyle={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <QuickAvailability
              therapists={therapists}
              currentDate={currentDate}
              onSlotClick={handleSlotClick}
            />
          </Card>
        </aside>
      </div>

      <Button type="primary" shape="circle" icon={<PlusOutlined />} size="large"
        onClick={() => { setPrefilledTime(null); setOpenModal(true); }}
        className="fixed bottom-10 right-10 w-16 h-16 text-2xl shadow-2xl z-50 hover:scale-110 transition-transform flex items-center justify-center bg-gradient-to-br from-primary to-primary-container border-0" />

      <NewAppointmentModal
        open={openModal}
        onClose={() => { setOpenModal(false); setPrefilledTime(null); }}
        onCreated={triggerRefresh}
        prefilledTime={prefilledTime}
      />

      <AppointmentDetailDrawer
        appointment={selectedAppt}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onRefresh={triggerRefresh}
      />
    </>
  );
}

function MiniCalendar({ selected, onSelect }: { selected: Dayjs; onSelect: (d: Dayjs) => void }) {
  const [month, setMonth] = useState<Dayjs>(selected.startOf('month'));
  const days = Array.from({ length: 42 }).map((_, i) => month.startOf('month').startOf('week').add(i, 'day'));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-black font-headline mb-0 capitalize">{month.format('MMMM YYYY')}</p>
        <div className="flex gap-1">
          <Button type="text" shape="circle" icon={<LeftOutlined />} size="small" onClick={() => setMonth(m => m.subtract(1, 'month'))} />
          <Button type="text" shape="circle" icon={<RightOutlined />} size="small" onClick={() => setMonth(m => m.add(1, 'month'))} />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => <span key={d}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((d, i) => {
          const inMonth = d.month() === month.month();
          const isSelected = d.isSame(selected, 'day');
          const isToday = d.isSame(dayjs(), 'day');
          return (
            <span key={i} onClick={() => onSelect(d)}
              className={`text-[11px] p-1.5 rounded-full cursor-pointer transition-colors select-none
                ${!inMonth ? 'text-slate-300' : 'text-slate-700 hover:bg-teal-50'}
                ${isToday && !isSelected ? 'font-black text-teal-600' : ''}
                ${isSelected ? 'bg-primary text-white font-bold shadow-sm' : ''}
              `}>
              {d.date()}
            </span>
          );
        })}
      </div>
    </div>
  );
}

interface Slot { start: string; end: string; label: string }

function QuickAvailability({
  therapists,
  currentDate,
  onSlotClick,
}: {
  therapists: any[];
  currentDate: Dayjs;
  onSlotClick: (slot: Slot) => void;
}) {
  const [selectedTherapist, setSelectedTherapist] = useState<number | 'all'>('all');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const therapistId = selectedTherapist === 'all' ? undefined : selectedTherapist;
    fisioEliteApiService
      .getFreeSlots(currentDate.format('YYYY-MM-DD'), therapistId)
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [currentDate, selectedTherapist]);

  const dateLabel = currentDate.isSame(dayjs(), 'day')
    ? 'Hoy'
    : currentDate.format('D [de] MMM');

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-sm font-black font-headline mb-4">Disponibilidad Rápida</h3>

      <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
            Seleccionar Especialista
          </label>
          <Select
            value={selectedTherapist}
            onChange={v => setSelectedTherapist(v)}
            className="w-full" size="large" bordered={false}
            style={{ backgroundColor: '#f3f4f5', borderRadius: '8px' }}
          >
            <Option value="all">Todos los Especialistas</Option>
            {therapists.map(t => <Option key={t.id} value={t.id}>{t.name}</Option>)}
          </Select>
        </div>

        <div className="flex-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Huecos Libres — {dateLabel}
          </p>

          {loading ? (
            <div className="flex justify-center py-6">
              <Spin size="small" />
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-6">
              <ClockCircleOutlined className="text-slate-300 text-2xl mb-2" />
              <p className="text-xs text-slate-400 font-medium mb-0">Sin huecos disponibles</p>
            </div>
          ) : (
            <div className="space-y-2">
              {slots.map(slot => (
                <Button
                  key={slot.label}
                  type="text" block
                  onClick={() => onSlotClick(slot)}
                  className="h-auto p-3 flex justify-between items-center bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-xl transition-colors border border-transparent hover:border-teal-200"
                >
                  <span className="text-xs">{slot.label}</span>
                  <PlusOutlined className="text-teal-600 text-xs" />
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Button type="primary" block className="mt-4 bg-secondary-container text-on-secondary-container border-0 font-black h-12 rounded-xl text-xs hover:brightness-105 shadow-sm shrink-0">
        Asignación Automática
      </Button>
    </div>
  );
}