import { useEffect, useState, useCallback } from 'react';
import { Card, Button, Progress, Tag, Skeleton, Modal, Form, Input, Select, message, Tooltip } from 'antd';
import {
    PlusOutlined,
    CalendarOutlined,
    EditOutlined,
    UserOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { fisioEliteApiService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { PhysiotherapistsDetailDrawer } from './components/PhysiotherapistsDetailDrawer';

interface TherapistItem {
    id: number;
    first_name: string;
    last_name: string;
    specialty: string;
    document_number?: string;
    email?: string;
    is_active: boolean;
    status: 'Disponible' | 'En sesión' | 'Fuera';
    workload_hours: number;
    workload_capacity: number;
    appointments_today: number;
    total_appointments: number;
}

interface Performance {
    total_consultations: number;
    avg_rating: number;
    retention_percentage: number;
}

interface DirectoryResponse {
    therapists: TherapistItem[];
    performance: Performance;
}

const STATUS_CONFIG = {
    'Disponible': { color: 'success', dot: 'bg-emerald-400', label: 'Disponible' },
    'En sesión': { color: 'processing', dot: 'bg-cyan-400', label: 'En sesión' },
    'Fuera': { color: 'default', dot: 'bg-slate-300', label: 'Fuera' },
} as const;

function getWorkloadColor(used: number, capacity: number): string {
    const pct = (used / capacity) * 100;
    if (pct >= 90) return '#ef4444';
    if (pct >= 70) return '#006874';
    return '#006874';
}

function getInitials(first: string, last: string): string {
    return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
}

export function PhysiotherapistsPage() {
    const navigate = useNavigate();
    const [data, setData] = useState<DirectoryResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTherapist, setSelectedTherapist] = useState<TherapistItem | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = useCallback(() => setRefreshKey(k => k + 1), []);

    useEffect(() => {
        setLoading(true);
        fisioEliteApiService.getTherapistDirectory()
            .then(d => setData(d as DirectoryResponse))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [refreshKey]);

    const therapists = data?.therapists ?? [];
    const performance = data?.performance;

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
                        Equipo Médico
                    </p>
                    <h2 className="text-4xl font-black text-on-surface font-headline tracking-tighter mb-1">
                        El Equipo Médico
                    </h2>
                    <p className="text-sm text-on-surface-variant mb-0">
                        Gestionar a nuestros especialistas de élite y su disponibilidad clínica.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        size="large"
                        icon={<CalendarOutlined />}
                        onClick={() => navigate('/calendar')}
                        className="rounded-xl font-bold border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                    >
                        Gestionar Agenda
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={() => setModalOpen(true)}
                        className="rounded-xl font-bold px-6 border-0 shadow-sm"
                    >
                        Añadir Fisioterapeuta
                    </Button>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                {loading
                    ? [...Array(3)].map((_, i) => (
                        <Card key={i} bordered={false} className="shadow-sm rounded-2xl">
                            <Skeleton active avatar paragraph={{ rows: 1 }} />
                        </Card>
                    ))
                    : therapists.length === 0
                        ? (
                            <Card bordered={false} className="shadow-sm rounded-2xl py-10 text-center">
                                <TeamOutlined className="text-4xl text-slate-300 mb-3" />
                                <p className="text-slate-400 font-medium">No hay terapeutas registrados aún.</p>
                            </Card>
                        )
                        : therapists.map(t => (
                            <TherapistRow 
                                key={t.id} 
                                therapist={t} 
                                onClick={() => setSelectedTherapist(t)}
                            />
                        ))
                }
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-7">
                    <TeamPerformanceCard performance={performance} loading={loading} />
                </div>
                <div className="col-span-12 lg:col-span-5">
                    <Card
                        bordered={false}
                        className="rounded-2xl h-full shadow-sm overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)' }}
                        bodyStyle={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    >
                        <div>
                            <h3 className="text-xl font-black font-headline text-teal-900 tracking-tight mb-3">
                                Potencia el<br />trabajo de tu equipo
                            </h3>
                            <p className="text-sm text-teal-700 leading-relaxed mb-0">
                                Desbloquea análisis clínicos avanzados y rutas de recuperación personalizadas para tus especialistas.
                            </p>
                        </div>
                        <Button
                            type="primary"
                            size="large"
                            className="mt-6 rounded-xl font-black border-0 shadow-md w-fit"
                            style={{ background: '#006874' }}
                            onClick={() => navigate('/')}
                        >
                            Actualizar a Atelier+
                        </Button>
                    </Card>
                </div>
            </div>

            <AddTherapistModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={triggerRefresh}
            />

            {selectedTherapist && (
                <PhysiotherapistsDetailDrawer
                    open={!!selectedTherapist}
                    onClose={() => setSelectedTherapist(null)}
                    therapist={selectedTherapist}
                    onRefresh={triggerRefresh}
                />
            )}
        </>
    );
}

function TherapistRow({ therapist: t, onClick }: { therapist: TherapistItem, onClick?: () => void }) {
    const cfg = STATUS_CONFIG[t.status];
    const pct = Math.round((t.workload_hours / t.workload_capacity) * 100);
    const initials = getInitials(t.first_name, t.last_name);

    return (
        <Card
            bordered={false}
            className="shadow-sm rounded-2xl hover:shadow-md transition-all cursor-pointer"
            bodyStyle={{ padding: '20px 24px' }}
            onClick={onClick}
        >
            <div className="flex items-center gap-6 flex-wrap">

                <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg font-headline">
                        {initials}
                    </div>
                    <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${cfg.dot}`} />
                </div>

                <div className="flex-1 min-w-[140px]">
                    <p className="text-sm font-black text-on-surface mb-0 leading-tight">
                        {t.first_name} {t.last_name}
                    </p>
                    <p className="text-xs text-primary font-semibold mb-0">{t.specialty}</p>
                </div>

                <div className="flex flex-col items-start gap-1 min-w-[110px]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Estado</span>
                    <Tag
                        className="rounded-full px-3 font-bold border-0 text-xs m-0"
                        color={cfg.color}
                    >
                        {cfg.label}
                    </Tag>
                </div>

                <div className="flex-1 min-w-[180px]">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-slate-400 font-semibold">Carga de trabajo</span>
                        <span className="font-black text-on-surface">
                            {t.workload_hours}/{t.workload_capacity} hrs
                        </span>
                    </div>
                    <Progress
                        percent={pct}
                        showInfo={false}
                        strokeColor={getWorkloadColor(t.workload_hours, t.workload_capacity)}
                        trailColor="#f1f5f9"
                        strokeWidth={6}
                    />
                </div>

                <Tooltip title="Citas hoy">
                    <div className="flex flex-col items-center gap-0.5 min-w-[48px]">
                        <span className="text-lg font-black text-primary">{t.appointments_today}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">hoy</span>
                    </div>
                </Tooltip>


                <div className="flex items-center gap-2 shrink-0">
                    <Tooltip title="Editar">
                        <Button type="text" shape="circle" icon={<EditOutlined />}
                            className="text-slate-400 hover:text-primary hover:bg-teal-50" />
                    </Tooltip>
                </div>
            </div>
        </Card>
    );
}


function TeamPerformanceCard({ performance, loading }: { performance?: Performance; loading: boolean }) {
    const stats = [
        { label: 'Consultas', value: performance?.total_consultations ?? 0, icon: <CheckCircleOutlined /> },
        { label: 'Rating Promedio', value: performance?.avg_rating ?? 0, icon: <UserOutlined /> },
        { label: 'Retención', value: `${performance?.retention_percentage ?? 0}%`, icon: <SyncOutlined /> },
    ];

    return (
        <Card bordered={false} className="shadow-sm rounded-2xl h-full" bodyStyle={{ padding: '28px' }}>
            <div className="flex gap-6 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                    <h3 className="text-xl font-black font-headline text-on-surface tracking-tight mb-2">
                        Resumen del rendimiento del equipo
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                        Las tasas de recuperación de los pacientes han aumentado un 14% este trimestre gracias a la colaboración integrada del equipo.
                    </p>

                    <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
                        <div className="flex gap-6 flex-wrap">
                            {stats.map(s => (
                                <div key={s.label} className="text-center">
                                    <p className="text-2xl font-black text-primary font-headline mb-0">{s.value}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </Skeleton>
                </div>

                <div className="w-40 h-32 flex items-end justify-between gap-1 self-end shrink-0">
                    {[30, 55, 40, 70, 50, 85, 65].map((h, i) => (
                        <div
                            key={i}
                            className="flex-1 rounded-t-sm transition-all"
                            style={{
                                height: `${h}%`,
                                background: i === 5 ? '#006874' : 'rgba(0,104,116,0.15)',
                            }}
                        />
                    ))}
                </div>
            </div>
        </Card>
    );
}

interface AddTherapistModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

function AddTherapistModal({ open, onClose, onSuccess }: AddTherapistModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            await fisioEliteApiService.createTherapist(values);
            message.success('Terapeuta añadido correctamente.');
            form.resetFields();
            onSuccess?.();
            onClose();
        } catch (err: any) {
            message.error(err.message || 'Error al crear el terapeuta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={loading}
            title={
                <div className="flex items-center gap-2 pt-2">
                    <PlusOutlined className="text-primary" />
                    <span className="text-lg font-black font-headline">Nuevo Fisioterapeuta</span>
                </div>
            }
            okText="Añadir"
            cancelText="Cancelar"
            centered
            width={480}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false} className="mt-4">
                <div className="grid grid-cols-2 gap-x-4">
                    <Form.Item name="first_name" label={<span className="font-semibold text-sm">Nombre</span>}
                        rules={[{ required: true, message: 'Requerido' }]}>
                        <Input size="large" placeholder="Elena" className="rounded-xl" />
                    </Form.Item>
                    <Form.Item name="last_name" label={<span className="font-semibold text-sm">Apellido</span>}
                        rules={[{ required: true, message: 'Requerido' }]}>
                        <Input size="large" placeholder="Rodríguez" className="rounded-xl" />
                    </Form.Item>
                </div>

                <Form.Item name="specialty" label={<span className="font-semibold text-sm">Especialidad</span>}
                    rules={[{ required: true, message: 'Requerido' }]}>
                    <Select size="large" placeholder="Selecciona especialidad" className="rounded-xl"
                        options={[
                            { value: 'Fisioterapia Deportiva', label: 'Fisioterapia Deportiva' },
                            { value: 'Osteopatía', label: 'Osteopatía' },
                            { value: 'Rehabilitación', label: 'Rehabilitación' },
                            { value: 'Suelo Pélvico', label: 'Suelo Pélvico' },
                            { value: 'Neurológica', label: 'Neurológica' },
                            { value: 'Deportiva & Recuperación', label: 'Deportiva & Recuperación' },
                        ]}
                    />
                </Form.Item>

                <Form.Item name="email" label={<span className="font-semibold text-sm">Correo</span>}
                    rules={[{ type: 'email', message: 'Correo inválido' }]}>
                    <Input size="large" placeholder="elena@fisioelite.com" className="rounded-xl" />
                </Form.Item>

                <Form.Item name="document_number" label={<span className="font-semibold text-sm">Documento</span>}>
                    <Input size="large" placeholder="12345678" className="rounded-xl" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
