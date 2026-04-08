import { CalendarOutlined } from '@ant-design/icons';
import { Appointment } from '../components/Appointment';
import { HeaderCell } from '../components/HeaderCell';

function calculateTop(time: string) {
    const [h, m] = time.split(':').map(Number);
    return `${(h - 8) * 96 + (m / 60) * 96}px`;
}

function getAppointmentScheme(status: string) {
    switch (status) {
        case 'confirmed':
            return {
                bg: 'bg-teal-100',
                border: 'border-teal-600',
                text: 'text-teal-900',
            };
        case 'arrived':
            return {
                bg: 'bg-cyan-100',
                border: 'border-cyan-600',
                text: 'text-cyan-900',
            };
        case 'canceled':
            return {
                bg: 'bg-red-100',
                border: 'border-red-600',
                text: 'text-red-900',
            };
        default:
            return {
                bg: 'bg-gray-100',
                border: 'border-gray-400',
                text: 'text-gray-800',
            };
    }
}

export function DayView({ appointments = [], doctors = [] }: any) {
    return (
        <>
            <div className="calendar-grid border-b border-surface-container-high bg-surface-container-low">
                <div className="h-16 flex items-center justify-center border-r border-surface-container-high">
                    <CalendarOutlined className="text-slate-400 text-xl" />
                </div>

                {doctors.map((doc: any, i: number) => (
                    <HeaderCell
                        key={doc.id}
                        name={doc.name}
                        spec={doc.specialty}
                        img={doc.avatar}
                        color="text-teal-600"
                        noBorder={i === doctors.length - 1}
                    />
                ))}
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar relative">

                <div className="absolute top-[320px] left-0 w-full flex items-center z-10 pointer-events-none">
                    <div className="w-20 text-right pr-2 text-[10px] font-black text-red-500">
                        11:30
                    </div>
                    <div className="flex-1 h-px bg-red-400/40 relative">
                        <div className="absolute left-0 -top-1 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                    </div>
                </div>

                <div className="calendar-grid min-h-[1200px]">

                    <div className="border-r bg-surface-container-low/30">
                        {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'].map(t => (
                            <div
                                key={t}
                                className="h-24 border-b flex items-start justify-center pt-2 text-[11px] font-bold text-slate-400"
                            >
                                {t}
                            </div>
                        ))}
                    </div>

                    {doctors.map((doc: any, i: number) => (
                        <div
                            key={doc.id}
                            className={`relative border-r p-1 ${i % 2 === 1 ? 'bg-surface-container-low/10' : ''
                                }`}
                        >
                            {appointments
                                .filter((a: any) => a.doctorId === doc.id)
                                .map((a: any) => (
                                    <Appointment
                                        key={a.id}
                                        top={calculateTop(a.time)}
                                        h="90px"
                                        name={a.patient}
                                        time={a.time}
                                        status={a.status}
                                        badgeStatus={
                                            a.status === 'confirmed'
                                                ? 'success'
                                                : a.status === 'arrived'
                                                    ? 'processing'
                                                    : 'error'
                                        }
                                        scheme={getAppointmentScheme(a.status)}
                                        tx={a.treatment}
                                    />
                                ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
