import { useEffect, useRef } from 'react';
import { CalendarOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Appointment } from '../components/Appointment';
import { HeaderCell } from '../components/HeaderCell';

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

export function DayView({
    date,
    doctors = [],
    appointments = [],
    loading = false,
}: {
    date: Dayjs;
    doctors: any[];
    appointments?: any[];
    loading?: boolean;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const now = dayjs();
    const isToday = date.isSame(now, 'day');
    const nowTop = now.hour() * HOUR_HEIGHT + (now.minute() / 60) * HOUR_HEIGHT;

    useEffect(() => {
        if (scrollRef.current) {
            const targetHour = isToday ? now.hour() - 1 : 8;
            scrollRef.current.scrollTop = Math.max(targetHour * HOUR_HEIGHT - 32, 0);
        }
    }, [date]);

    const cols = `80px repeat(${doctors.length}, 1fr)`;

    return (
        <>
            <div className="border-b border-surface-container-high bg-surface-container-low shrink-0"
                style={{ display: 'grid', gridTemplateColumns: cols }}>
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
                    <div style={{ display: 'grid', gridTemplateColumns: cols, minHeight: `${HOUR_HEIGHT * 24}px` }}>
                        <div className="border-r border-surface-container-high bg-surface-container-low/30">
                            {HOURS.map(h => (
                                <div key={h} className="border-b border-slate-100 flex items-start justify-end pr-3 pt-1" style={{ height: HOUR_HEIGHT }}>
                                    <span className="text-[11px] font-bold text-slate-400">{String(h).padStart(2, '0')}:00</span>
                                </div>
                            ))}
                        </div>
                        {doctors.map((doc, i) => {
                            const docAppts = appointments.filter(a =>
                                String(a.therapist?.id ?? a.therapist_id) === String(doc.id)
                            );
                            return (
                                <div key={doc.id} className={`relative border-r border-surface-container-high ${i % 2 === 1 ? 'bg-surface-container-low/10' : ''}`}>
                                    {HOURS.map(h => <div key={h} className="border-b border-slate-100" style={{ height: HOUR_HEIGHT }} />)}
                                    {isToday && (
                                        <div className="absolute left-0 right-0 flex items-center z-20 pointer-events-none" style={{ top: nowTop }}>
                                            {i === 0
                                                ? <><div className="w-2 h-2 bg-red-500 rounded-full shrink-0 -ml-1" /><div className="flex-1 h-px bg-red-400/60" /></>
                                                : <div className="w-full h-px bg-red-400/30" />
                                            }
                                        </div>
                                    )}
                                    {docAppts.map(a => (
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
