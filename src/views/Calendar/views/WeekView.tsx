import { useEffect, useRef } from 'react';
import { Skeleton } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Appointment } from '../components/Appointment';

const HOUR_HEIGHT = 64;
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function timeToTop(datetime: string): number {
  const d = dayjs(datetime);
  return d.hour() * HOUR_HEIGHT + (d.minute() / 60) * HOUR_HEIGHT;
}
function durationToHeight(start: string, end: string): number {
  return Math.max((dayjs(end).diff(dayjs(start), 'minute') / 60) * HOUR_HEIGHT, 32);
}
function getScheme(status: string) {
  switch (status) {
    case 'Confirmed': return { bg: 'bg-teal-100', border: 'border-teal-600', text: 'text-teal-900' };
    case 'Arrived': return { bg: 'bg-cyan-100', border: 'border-cyan-600', text: 'text-cyan-900' };
    case 'Canceled': return { bg: 'bg-red-100', border: 'border-red-600', text: 'text-red-900' };
    default: return { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-800' };
  }
}

export function WeekView({ date, appointments = [], loading = false }: { date: Dayjs; appointments?: any[]; loading?: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const now = dayjs();
  const startOfWeek = date.startOf('week');
  const days = Array.from({ length: 7 }).map((_, i) => startOfWeek.add(i, 'day'));
  const nowTop = now.hour() * HOUR_HEIGHT + (now.minute() / 60) * HOUR_HEIGHT;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = Math.max((now.hour() - 1) * HOUR_HEIGHT - 32, 0);
    }
  }, [date]);

  return (
    <>
      <div className="border-b bg-surface-container-low shrink-0"
        style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)' }}>
        <div className="h-16 border-r border-surface-container-high" />
        {days.map((d, i) => {
          const isToday = d.isSame(now, 'day');
          return (
            <div key={i} className="h-16 flex items-center justify-center border-r border-surface-container-high last:border-r-0">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 capitalize">{d.format('ddd')}</p>
                <span className={`text-sm font-black w-8 h-8 flex items-center justify-center rounded-full mx-auto ${isToday ? 'bg-primary text-white' : 'text-on-surface'}`}>
                  {d.format('D')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <Skeleton loading={loading} active paragraph={{ rows: 8 }} className="p-4">
          <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', minHeight: `${HOUR_HEIGHT * 24}px` }}>
            <div className="border-r border-surface-container-high bg-surface-container-low/30">
              {HOURS.map(h => (
                <div key={h} className="border-b border-slate-100 flex items-start justify-end pr-3 pt-1" style={{ height: HOUR_HEIGHT }}>
                  <span className="text-[11px] font-bold text-slate-400">{String(h).padStart(2, '0')}:00</span>
                </div>
              ))}
            </div>
            {days.map((d, i) => {
              const isToday = d.isSame(now, 'day');
              const dateStr = d.format('YYYY-MM-DD');
              const dayAppts = appointments.filter(a => dayjs(a.start_time).format('YYYY-MM-DD') === dateStr);
              return (
                <div key={i} className={`relative border-r border-surface-container-high last:border-r-0 ${isToday ? 'bg-teal-50/20' : ''}`}>
                  {HOURS.map(h => <div key={h} className="border-b border-slate-100" style={{ height: HOUR_HEIGHT }} />)}
                  {isToday && (
                    <div className="absolute left-0 right-0 flex items-center z-20 pointer-events-none" style={{ top: nowTop }}>
                      <div className="w-2 h-2 bg-red-500 rounded-full shrink-0 -ml-1" />
                      <div className="flex-1 h-px bg-red-400/60" />
                    </div>
                  )}
                  {dayAppts.map(a => (
                    <Appointment key={a.id}
                      top={`${timeToTop(a.start_time)}px`}
                      h={`${durationToHeight(a.start_time, a.end_time)}px`}
                      name={`${a.patient.first_name} ${a.patient.last_name}`}
                      time={dayjs(a.start_time).format('HH:mm')}
                      status={a.status} tx={a.treatment}
                      badgeStatus={a.status === 'Confirmed' ? 'success' : a.status === 'Arrived' ? 'processing' : 'error'}
                      scheme={getScheme(a.status)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </Skeleton>
      </div>
    </>
  );
}
