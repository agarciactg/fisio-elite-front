import { useEffect, useRef } from 'react';
import { CalendarOutlined } from '@ant-design/icons';
import { Skeleton, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { HeaderCell } from '../components/HeaderCell';

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

interface DayViewProps {
    date: Dayjs;
    doctors: any[];
    appointments?: any[];
    loading?: boolean;
    onAppointmentClick?: (appointment: any) => void;
}

export function DayView({ date, doctors, appointments = [], loading = false, onAppointmentClick }: DayViewProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const now = dayjs();
    const isToday = date.isSame(now, 'day');
    const nowTop = now.hour() * HOUR_HEIGHT + (now.minute() / 60) * HOUR_HEIGHT;

    useEffect(() => {
        if (scrollRef.current) {
            const h = isToday ? now.hour() - 1 : 8;
            scrollRef.current.scrollTop = Math.max(h * HOUR_HEIGHT - 32, 0);
        }
    }, [date]);

    return (
        <>
            <div className="border-b border-surface-container-high bg-surface-container-low shrink-0"
                style={{ display: 'grid', gridTemplateColumns: `80px repeat(${doctors.length}, 1fr)` }}>
                <div className="h-16 flex items-center justify-center border-r border-surface-container-high">
                    <CalendarOutlined className="text-slate-400 text-xl" />
                </div>
                {doctors.map((doc, i) => (
                    <HeaderCell key={doc.id} name={doc.name} spec={doc.specialty} img={doc.avatar}
                        color="text-teal-600" noBorder={i === doctors.length - 1} />
                ))}
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto">
                <Skeleton loading={loading} active paragraph={{ rows: 8 }} className="p-4">
                    <div style={{ display: 'grid', gridTemplateColumns: `80px repeat(${doctors.length}, 1fr)`, minHeight: `${HOUR_HEIGHT * 24}px` }}>
                        <div className="border-r border-surface-container-high bg-surface-container-low/30">
                            {HOURS.map(h => (
                                <div key={h} className="border-b border-slate-100 flex items-start justify-end pr-3 pt-1" style={{ height: HOUR_HEIGHT }}>
                                    <span className="text-[11px] font-bold text-slate-400">{String(h).padStart(2, '0')}:00</span>
                                </div>
                            ))}
                        </div>
                        {doctors.map((doc, i) => {
                            const docAppts = appointments.filter(a => String(a.therapist?.id ?? a.therapist_id) === String(doc.id));
                            return (
                                <div key={doc.id} className={`relative border-r border-surface-container-high ${i % 2 === 1 ? 'bg-slate-50/30' : ''}`}>
                                    {HOURS.map(h => <div key={h} className="border-b border-slate-100" style={{ height: HOUR_HEIGHT }} />)}
                                    {isToday && (
                                        <div className="absolute left-0 right-0 flex items-center z-20 pointer-events-none" style={{ top: nowTop }}>
                                            {i === 0 ? <><div className="w-2 h-2 bg-red-500 rounded-full shrink-0 -ml-1" /><div className="flex-1 h-px bg-red-400/60" /></>
                                                : <div className="w-full h-px bg-red-400/20" />}
                                        </div>
                                    )}
                                    {docAppts.map(a => {
                                        const s = getScheme(a.status);
                                        const name = a.patient ? `${a.patient.first_name} ${a.patient.last_name}` : '—';
                                        return (
                                            <Tooltip key={a.id} title={`${name} · ${dayjs(a.start_time).format('HH:mm')} – ${dayjs(a.end_time).format('HH:mm')}`}>
                                                <div
                                                    onClick={() => onAppointmentClick?.(a)}
                                                    className={`absolute left-1 right-1 ${s.bg} border-l-4 ${s.border} ${s.opacity ?? ''} rounded-lg p-2 cursor-pointer hover:brightness-95 transition-all z-10`}
                                                    style={{ top: timeToTop(a.start_time), height: durationToHeight(a.start_time, a.end_time) }}
                                                >
                                                    <p className={`text-[11px] font-black ${s.text} truncate mb-0 leading-tight`}>{name}</p>
                                                    <p className={`text-[10px] ${s.text} opacity-70 mb-0`}>{dayjs(a.start_time).format('HH:mm')}</p>
                                                    {a.treatment && <p className={`text-[9px] ${s.text} opacity-60 truncate mb-0 italic`}>{a.treatment}</p>}
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
