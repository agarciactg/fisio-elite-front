import { useEffect, useRef } from 'react';
import { Skeleton, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useNow } from '../../../hook/useNow';

const HOUR_HEIGHT = 64;
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function timeToTop(dt: string) { const d = dayjs(dt); return d.hour() * HOUR_HEIGHT + (d.minute() / 60) * HOUR_HEIGHT; }
function durationToHeight(s: string, e: string) { return Math.max((dayjs(e).diff(dayjs(s), 'minute') / 60) * HOUR_HEIGHT, 40); }
function getScheme(status: string) {
  switch (status) {
    case 'Confirmed': return { bg: 'bg-teal-100', border: 'border-l-teal-600', text: 'text-teal-900' };
    case 'Arrived': return { bg: 'bg-cyan-100', border: 'border-l-cyan-600', text: 'text-cyan-900' };
    case 'Canceled': return { bg: 'bg-red-100', border: 'border-l-red-600', text: 'text-red-900', opacity: 'opacity-60' };
    default: return { bg: 'bg-gray-100', border: 'border-l-gray-400', text: 'text-gray-800' };
  }
}

interface WeekViewProps {
  date: Dayjs;
  appointments?: any[];
  loading?: boolean;
  onAppointmentClick?: (appointment: any) => void;
}

export function WeekView({ date, appointments = [], loading = false, onAppointmentClick }: WeekViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const now = useNow();                        // ← se actualiza cada minuto
  const startOfWeek = date.startOf('week');
  const days = Array.from({ length: 7 }).map((_, i) => startOfWeek.add(i, 'day'));
  const nowTop = now.hour() * HOUR_HEIGHT + (now.minute() / 60) * HOUR_HEIGHT;

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = Math.max((now.hour() - 1) * HOUR_HEIGHT - 32, 0);
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
                  <span className={`text-[11px] font-bold transition-colors ${h === now.hour() ? 'text-red-400' : 'text-slate-400'}`}>
                    {String(h).padStart(2, '0')}:00
                  </span>
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
                    <div
                      className="absolute left-0 right-0 flex items-center z-20 pointer-events-none"
                      style={{ top: nowTop, transition: 'top 1s linear' }}
                    >
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full shrink-0 -ml-1 shadow-sm" />
                      <div className="flex-1 h-px bg-red-400/70" />
                    </div>
                  )}

                  {dayAppts.map(a => {
                    const s = getScheme(a.status);
                    const name = a.patient ? `${a.patient.first_name} ${a.patient.last_name}` : '—';
                    return (
                      <Tooltip key={a.id} title={`${name} · ${dayjs(a.start_time).format('HH:mm')}`}>
                        <div
                          onClick={() => onAppointmentClick?.(a)}
                          className={`absolute left-0.5 right-0.5 ${s.bg} border-l-4 ${s.border} ${s.opacity ?? ''} rounded-md p-1.5 cursor-pointer hover:brightness-95 transition-all z-10`}
                          style={{ top: timeToTop(a.start_time), height: durationToHeight(a.start_time, a.end_time) }}
                        >
                          <p className={`text-[10px] font-black ${s.text} truncate mb-0 leading-tight`}>{name}</p>
                          <p className={`text-[9px] ${s.text} opacity-70 mb-0`}>{dayjs(a.start_time).format('HH:mm')}</p>
                        </div>
                      </Tooltip>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </Skeleton>
      </div>
    </>
  );
}
