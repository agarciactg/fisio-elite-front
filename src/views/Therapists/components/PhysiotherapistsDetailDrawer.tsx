import { Drawer, Button, message, Popconfirm, Form, Input } from 'antd';
import {
    EditOutlined,
    SaveOutlined,
    CloseOutlined,
    UserOutlined,
    MailOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { fisioEliteApiService, type Therapist } from '../../../services/api';

interface PhysiotherapistsDetailDrawerProps {
    therapist: Therapist | null;
    open: boolean;
    onClose: () => void;
    onRefresh?: () => void;
}

export function PhysiotherapistsDetailDrawer({ therapist, open, onClose, onRefresh }: PhysiotherapistsDetailDrawerProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (!open) {
            setIsEditing(false);
            form.resetFields();
        }
    }, [open, form]);

    if (!therapist) return null;

    const handleDeleteTherapist = async () => {
        try {
            setLoading(true);
            await fisioEliteApiService.deleteTherapist(therapist.id);
            message.success("Fisioterapeuta eliminado correctamente");
            onRefresh?.();
            onClose();
        } catch (error: any) {
            message.error(error.message || "Error al eliminar el fisioterapeuta");
        } finally {
            setLoading(false);
        }
    };

    const handleEnterEditMode = () => {
        setIsEditing(true);
        form.setFieldsValue({
            first_name: therapist.first_name,
            last_name: therapist.last_name,
            document_number: therapist.document_number,
            specialty: therapist.specialty,
            is_active: therapist.is_active,
            email: therapist.email,
        });
    };

    const handleSaveChanges = async (values: any) => {
        try {
            setLoading(true);
            await fisioEliteApiService.updateTherapist(therapist.id, values);
            message.success("Fisioterapeuta actualizado correctamente");
            onRefresh?.();
            setIsEditing(false);
            onClose();
        } catch (error: any) {
            message.error(error.message || "Error al actualizar el paciente");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-teal-50';
            case 'PACKAGE PENDING': return 'bg-red-50';
            default: return 'bg-slate-50';
        }
    };

    return (
        <Drawer
            open={open}
            onClose={onClose}
            width={400}
            closable={false}
            styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}
            title={null}
        >
            <div className={`px-6 pt-8 pb-6 transition-colors duration-300 ${isEditing ? 'bg-slate-50' : getStatusColor(therapist.is_active ? 'ACTIVE' : 'INACTIVE')}`}>
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                            {isEditing ? 'Editando Fisioterapeuta' : 'Detalle del Fisioterapeuta'}
                        </p>
                        {!isEditing && (
                            <h2 className="text-2xl font-black tracking-tight text-on-surface mb-0">
                                {therapist.first_name} {therapist.last_name}
                            </h2>
                        )}
                    </div>
                </div>

                {!isEditing && (
                    <div className="flex items-center gap-4 mt-4">
                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-xl font-bold text-teal-700">
                            {therapist.first_name.charAt(0)}{therapist.last_name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-on-surface mb-0 font-label tracking-wide uppercase">{therapist.is_active ? 'ACTIVO' : 'INACTIVO'}</p>
                            <p className="text-xs text-slate-500 mb-0">Especialidad: {therapist.specialty || 'N/A'}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="px-6 py-6 flex-1 overflow-y-auto">
                {isEditing ? (
                    <Form layout="vertical" form={form} onFinish={handleSaveChanges} className="space-y-1">
                        <Form.Item name="first_name" label={<span className="font-bold text-xs text-slate-500 uppercase">Nombre</span>} rules={[{ required: true, message: 'Requerido' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item name="last_name" label={<span className="font-bold text-xs text-slate-500 uppercase">Apellido</span>} rules={[{ required: true, message: 'Requerido' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item name="email" label={<span className="font-bold text-xs text-slate-500 uppercase">Email</span>}>
                            <Input type="email" />
                        </Form.Item>
                    </Form>
                ) : (
                    <div className="space-y-5">
                        <InfoRow icon={<MailOutlined />} label="Email" value={therapist.email || '—'} />
                        <InfoRow icon={<UserOutlined />} label="Especialidad" value={therapist.specialty || '—'} />
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
                        <Popconfirm
                            title="¿Eliminar este fisioterapeuta?"
                            description="Esta acción eliminará al fisioterapeuta. Solo se puede eliminar si no tiene citas asociadas."
                            onConfirm={handleDeleteTherapist}
                            okText="Sí, eliminar"
                            cancelText="Cancelar"
                            okButtonProps={{ danger: true, loading }}
                        >
                            <Button danger block className="rounded-xl font-bold h-10">
                                Eliminar
                            </Button>
                        </Popconfirm>

                        <Button
                            type="primary"
                            block
                            icon={<EditOutlined />}
                            className="rounded-xl font-bold h-10"
                            onClick={handleEnterEditMode}
                        >
                            Editar
                        </Button>
                    </>
                )}
            </div>
        </Drawer>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0">{label}</p>
                <p className="text-sm font-bold text-on-surface mb-0">{value}</p>
            </div>
        </div>
    );
}
