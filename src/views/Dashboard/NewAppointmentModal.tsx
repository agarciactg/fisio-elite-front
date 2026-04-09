import React, { useEffect, useState } from "react";
import { Modal, Form, Select, DatePicker, Input, message } from "antd";
import { fisioEliteApiService, type Patient } from "../../services/api";

const { RangePicker } = DatePicker;

interface NewAppointmentModalProps {
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ open, onClose, onCreated }) => {
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [therapists, setTherapists] = useState<any[]>([]);
    const [form] = Form.useForm();

    const patientOptions = patients.map((p) => ({
        value: p.id,
        label: `${p.first_name} ${p.last_name} - ${p.document_number}`,
    }));

    const therapistOptions = therapists.map((t) => ({
        value: t.id,
        label: `${t.first_name} ${t.last_name} - ${t.document_number}`,
    }));

    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open]);

    const fetchData = async () => {
        try {
            const [patientsData, therapistsData] = await Promise.all([
                fisioEliteApiService.getPatients(),
                fisioEliteApiService.getTherapists(),
            ]);

            setPatients(patientsData);
            setTherapists(therapistsData);
        } catch (error) {
            message.error("Error cargando datos");
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);

            const payload = {
                patient_id: values.patient_id,
                therapist_id: values.therapist_id,
                start_time: values.time[0].toISOString(),
                end_time: values.time[1].toISOString(),
                status: values.status,
                treatment: values.treatment,
            };

            await fisioEliteApiService.createAppointment(payload);

            message.success("Cita creada correctamente");
            form.resetFields();
            onClose();
            onCreated?.();
        } catch (error: any) {
            message.error(error.message || "Error al crear la cita");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Nueva Cita"
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={loading}
        >
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
                <Form.Item
                    name="patient_id"
                    label="Paciente"
                    rules={[{ required: true, message: "Selecciona un paciente" }]}
                >
                    <Select
                        placeholder="Seleccionar paciente"
                        loading={!patients.length}
                        showSearch={{
                            optionFilterProp: "label"
                        }}
                        options={patientOptions}
                    />
                </Form.Item>

                <Form.Item
                    name="therapist_id"
                    label="Terapeuta"
                    rules={[{ required: true, message: "Selecciona un terapeuta" }]}
                >
                    <Select
                        placeholder="Seleccionar terapeuta"
                        loading={!therapists.length}
                        showSearch={{
                            optionFilterProp: "label"
                        }}
                        options={therapistOptions}
                    />
                </Form.Item>

                <Form.Item
                    name="time"
                    label="Horario"
                    rules={[{ required: true, message: "Selecciona el horario" }]}
                >
                    <RangePicker showTime style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Estado"
                    initialValue="Confirmed"
                >
                    <Select
                        options={[
                            { value: "Confirmed", label: "Confirmada" },
                            { value: "Pending", label: "Pendiente" },
                            { value: "Canceled", label: "Cancelada" },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="treatment"
                    label="Tratamiento"
                    rules={[{ required: true, message: "Ingresa el tratamiento" }]}
                >
                    <Input.TextArea rows={3} placeholder="Descripción del tratamiento" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NewAppointmentModal;