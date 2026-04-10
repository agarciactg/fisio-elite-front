import { Drawer, Tag, Badge, Divider, Button, message, Popconfirm, Form, Select, DatePicker, Input, Spin } from 'antd';
import {
    UserOutlined,
    MedicineBoxOutlined,
    PhoneOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    CalendarOutlined,
    EditOutlined,
    SaveOutlined,
    CloseOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import duration from 'dayjs/plugin/duration';
import { useState, useEffect } from 'react';
import { fisioEliteApiService, type Patient, type Therapist } from '../../../services/api';

dayjs.extend(duration);
dayjs.locale('es');

const { RangePicker } = DatePicker;

interface AppointmentDetailDrawerProps {
    appointment: any | null;
    open: boolean;
    onClose: () => void;
    onRefresh?: () => void;
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

export function AppointmentDetailDrawer({ appointment: a, open, onClose, onRefresh }: AppointmentDetailDrawerProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchingLists, setFetchingLists] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        if (!open) {
            setIsEditing(false);
            form.resetFields();
        }
    }, [open, form]);

    if (!a) return null;

    const handleCancelAppointment = async () => {
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

    const handleEnterEditMode = async () => {
        setIsEditing(true);

        form.setFieldsValue({
            patient_id: a.patient.id,
            therapist_id: a.therapist.id,
            status: a.status,
            treatment: a.treatment,
            time: [dayjs(a.start_time), dayjs(a.end_time)],
        });

        if (patients.length === 0 || therapists.length === 0) {
            try {
                setFetchingLists(true);
                const [pData, tData] = await Promise.all([
                    fisioEliteApiService.getPatients(),
                    fisioEliteApiService.getTherapists(),
                ]);
                setPatients(pData);
                setTherapists(tData);
            } catch (error) {
                message.error("Error cargando pacientes y terapeutas");
            } finally {
                setFetchingLists(false);
            }
        }
    };

    const handleSaveChanges = async (values: any) => {
        try {
            setLoading(true);
            const payload = {
                patient_id: values.patient_id,
                therapist_id: values.therapist_id,
                start_time: values.time[0].format('YYYY-MM-DD HH:mm:ss'),
                end_time: values.time[1].format('YYYY-MM-DD HH:mm:ss'),
                status: values.status,
                treatment: values.treatment,
            };

            await fisioEliteApiService.updateAppointment(a.id, payload);
            message.success("Cita actualizada correctamente");
            onRefresh?.();
            setIsEditing(false);
            onClose();
        } catch (error: any) {
            console.error(error);
            message.error(error.response?.data?.detail || "Error al actualizar la cita");
        } finally {
            setLoading(false);
        }
    };

    const start = dayjs(a.start_time);
    const end = dayjs(a.end_time);
    const mins = end.diff(start, 'minute');
    const durationText = mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? `${mins % 60}min` : ''}`.trim() : `${mins} min`;
    const patientName = a.patient ? `${a.patient.first_name} ${a.patient.last_name}` : '—';
    const therapistName = a.therapist ? `${a.therapist.first_name} ${a.therapist.last_name}` : '—';

    return (
        <Drawer
            open={open}
            onClose={onClose}
            width={400}
            closable={false}
            styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}
            title={null}
        >
            <div className={`px-6 pt-8 pb-6 transition-colors duration-300 ${isEditing ? 'bg-slate-50' :
                a.status === 'Canceled' ? 'bg-red-50' :
                    a.status === 'Arrived' ? 'bg-cyan-50' : 'bg-teal-50'
                }`}>
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                            {isEditing ? 'Editando Cita' : 'Detalle de Cita'} #{a.id}
                        </p>
                        {!isEditing && (
                            <h2 className="text-xl font-black tracking-tight text-on-surface mb-0">
                                {patientName}
                            </h2>
                        )}
                    </div>
                    {!isEditing && <StatusTag status={a.status} />}
                </div>

                {!isEditing && (
                    <div className="flex items-center gap-3 mt-4">
                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex flex-col items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">{start.format('MMM')}</span>
                            <span className="text-xl font-black text-primary leading-tight">{start.format('D')}</span>
                        </div>
                        <div>
                            <p className="text-sm font-black text-on-surface mb-0">{start.format('HH:mm')} – {end.format('HH:mm')}</p>
                            <p className="text-xs text-slate-500 mb-0 capitalize">{start.format('dddd, D [de] MMMM')} · {durationText}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="px-6 py-6 flex-1 overflow-y-auto">
                {isEditing ? (
                    <Spin spinning={fetchingLists} tip="Cargando datos...">
                        <Form layout="vertical" form={form} onFinish={handleSaveChanges} className="space-y-4">
                            <Form.Item name="patient_id" label={<span className="font-bold text-xs text-slate-500 uppercase">Paciente</span>} rules={[{ required: true, message: 'Requerido' }]}>
                                <Select
                                    showSearch optionFilterProp="label"
                                    options={patients.map(p => ({ value: p.id, label: `${p.first_name} ${p.last_name}` }))}
                                />
                            </Form.Item>

                            <Form.Item name="therapist_id" label={<span className="font-bold text-xs text-slate-500 uppercase">Terapeuta</span>} rules={[{ required: true, message: 'Requerido' }]}>
                                <Select
                                    showSearch optionFilterProp="label"
                                    options={therapists.map(t => ({ value: t.id, label: `${t.first_name} ${t.last_name}` }))}
                                />
                            </Form.Item>

                            <Form.Item name="time" label={<span className="font-bold text-xs text-slate-500 uppercase">Horario</span>} rules={[{ required: true, message: 'Requerido' }]}>
                                <RangePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item name="status" label={<span className="font-bold text-xs text-slate-500 uppercase">Estado</span>}>
                                <Select options={[
                                    { value: "Confirmed", label: "Confirmada" },
                                    { value: "Arrived", label: "Presente" },
                                    { value: "Canceled", label: "Cancelada" },
                                ]} />
                            </Form.Item>

                            <Form.Item name="treatment" label={<span className="font-bold text-xs text-slate-500 uppercase">Tratamiento</span>}>
                                <Input.TextArea rows={3} placeholder="Descripción del tratamiento" />
                            </Form.Item>
                        </Form>
                    </Spin>
                ) : (
                    <div className="space-y-5">
                        <InfoRow icon={<UserOutlined />} label="Fisioterapeuta" value={therapistName} sub={a.therapist?.specialty} />
                        {a.treatment && <InfoRow icon={<MedicineBoxOutlined />} label="Tratamiento" value={a.treatment} />}
                        {a.patient?.phone_number && <InfoRow icon={<PhoneOutlined />} label="Teléfono" value={a.patient.phone_number} />}
                        {a.patient?.document_number && <InfoRow icon={<CalendarOutlined />} label="Documento" value={a.patient.document_number} />}

                        <Divider className="my-2" />
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <p className="text-slate-400 font-bold uppercase tracking-widest mb-0.5">Creada</p>
                                <p className="text-slate-600 font-semibold mb-0">{a.created_at ? dayjs(a.created_at).format('D MMM YYYY, HH:mm') : '—'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 font-bold uppercase tracking-widest mb-0.5">Actualizada</p>
                                <p className="text-slate-600 font-semibold mb-0">{a.updated_at ? dayjs(a.updated_at).format('D MMM YYYY, HH:mm') : '—'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex gap-3 mt-auto bg-white">
                {isEditing ? (
                    <>
                        <Button
                            block
                            icon={<CloseOutlined />}
                            className="rounded-xl font-bold h-10"
                            onClick={() => setIsEditing(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="primary"
                            block
                            icon={<SaveOutlined />}
                            className="rounded-xl font-bold h-10"
                            onClick={() => form.submit()}
                            loading={loading}
                        >
                            Guardar
                        </Button>
                    </>
                ) : (
                    <>
                        {a.status !== 'Canceled' && (
                            <Popconfirm
                                title="¿Cancelar esta cita?"
                                description="Esta acción marcará la cita como cancelada."
                                onConfirm={handleCancelAppointment}
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
                            onClick={handleEnterEditMode}
                            disabled={a.status === 'Canceled'}
                        >
                            Editar
                        </Button>
                    </>
                )}
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
