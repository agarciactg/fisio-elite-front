import { Drawer, Tag, Badge, Divider, Button, message, Popconfirm } from 'antd';
import {
    UserOutlined,
    MedicineBoxOutlined,
    PhoneOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    CalendarOutlined,
    EditOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import duration from 'dayjs/plugin/duration';
import { useState } from 'react';
import { fisioEliteApiService } from '../../../services/api';

dayjs.extend(duration);
dayjs.locale('es');

interface AppointmentDetailDrawerProps {
    appointment: any | null;
    open: boolean;
    onClose: () => void;
    onRefresh?: () => void;
    onEdit?: (appointment: any) => void;
}

function StatusTag({ status }: { status: string }) {
    const map: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
        Confirmed: { color: 'success', label: 'Confirmada', icon: <CheckCircleOutlined /> },
        Arrived: { color: 'processing', label: 'Presente', icon: <Badge status="processing" /> },
        Canceled: { color: 'error', label: 'Cancelada', icon: <CloseCircleOutlined /> },
    };
    const s = map[status] ?? { color: 'default', label: status, icon: null };
    return (
        <Tag color={s.color} icon={s.icon} className="rounded-full px-3 py-0.5 font-bold uppercase tracking-wider border-0 text-xs">
            {s.label}
        </Tag>
    );
}

export function AppointmentDetailDrawer({ appointment: a, open, onClose, onRefresh, onEdit }: AppointmentDetailDrawerProps) {
    const [loading, setLoading] = useState(false);

    if (!a) return null;

    const handleCancel = async () => {
        try {
            setLoading(true);
            await fisioEliteApiService.cancelAppointment(a.id);
            message.success("Cita cancelada correctamente");
            onRefresh?.();
            onClose();
        } catch (error: any) {
            message.error(error.message || "Error al cancelar");
        } finally {
            setLoading(false);
        }
    };

    const start = dayjs(a.start_time);
    const end = dayjs(a.end_time);
    const mins = end.diff(start, 'minute');
    const durationText = mins >= 60
        ? `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? `${mins % 60}min` : ''}`.trim()
        : `${mins} min`;

    const patientName = a.patient ? `${a.patient.first_name} ${a.patient.last_name}` : '—';
    const therapistName = a.therapist ? `${a.therapist.first_name} ${a.therapist.last_name}` : '—';

    return (
        <Drawer
            open={open}
            onClose={onClose}
            width={400}
            closable={false}
            styles={{ body: { padding: 0 } }}
            title={null}
        >
            <div className={`px-6 pt-8 pb-6 transition-colors duration-300 ${a.status === 'Canceled' ? 'bg-red-50' :
                a.status === 'Arrived' ? 'bg-cyan-50' : 'bg-teal-50'
                }`}>
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                            Detalle de Cita #{a.id}
                        </p>
                        <h2 className="text-xl font-black tracking-tight text-on-surface mb-0">
                            {patientName}
                        </h2>
                    </div>
                    <StatusTag status={a.status} />
                </div>

                <div className="flex items-center gap-3 mt-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">
                            {start.format('MMM')}
                        </span>
                        <span className="text-xl font-black text-primary leading-tight">
                            {start.format('D')}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-black text-on-surface mb-0">
                            {start.format('HH:mm')} – {end.format('HH:mm')}
                        </p>
                        <p className="text-xs text-slate-500 mb-0 capitalize">
                            {start.format('dddd, D [de] MMMM [de] YYYY')} · {durationText}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6 space-y-5">
                <InfoRow
                    icon={<UserOutlined />}
                    label="Fisioterapeuta"
                    value={therapistName}
                    sub={a.therapist?.specialty}
                />

                {a.treatment && (
                    <InfoRow
                        icon={<MedicineBoxOutlined />}
                        label="Tratamiento"
                        value={a.treatment}
                    />
                )}

                {a.patient?.phone_number && (
                    <InfoRow
                        icon={<PhoneOutlined />}
                        label="Teléfono"
                        value={a.patient.phone_number}
                    />
                )}

                {a.patient?.document_number && (
                    <InfoRow
                        icon={<CalendarOutlined />}
                        label="Documento"
                        value={a.patient.document_number}
                    />
                )}

                <Divider className="my-2" />

                <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest mb-0.5">Creada</p>
                        <p className="text-slate-600 font-semibold mb-0">
                            {a.created_at ? dayjs(a.created_at).format('D MMM YYYY, HH:mm') : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest mb-0.5">Actualizada</p>
                        <p className="text-slate-600 font-semibold mb-0">
                            {a.updated_at ? dayjs(a.updated_at).format('D MMM YYYY, HH:mm') : '—'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-6 pb-6 flex gap-3 mt-auto">
                {a.status !== 'Canceled' && (
                    <Popconfirm
                        title="¿Cancelar esta cita?"
                        description="Esta acción marcará la cita como cancelada y liberará el espacio."
                        onConfirm={handleCancel}
                        okText="Sí, cancelar"
                        cancelText="No"
                        okButtonProps={{ danger: true, loading }}
                    >
                        <Button danger block className="rounded-xl font-bold h-10">
                            Cancelar cita
                        </Button>
                    </Popconfirm>
                )}

                <Button
                    type="primary"
                    block
                    icon={<EditOutlined />}
                    className="rounded-xl font-bold h-10"
                    onClick={() => onEdit?.(a)}
                    disabled={a.status === 'Canceled'}
                >
                    Editar
                </Button>
            </div>
        </Drawer>
    );
}

function InfoRow({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0">{label}</p>
                <p className="text-sm font-bold text-on-surface mb-0">{value}</p>
                {sub && <p className="text-xs text-slate-400 mb-0">{sub}</p>}
            </div>
        </div>
    );
}
