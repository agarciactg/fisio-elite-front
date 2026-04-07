import React, { useEffect, useState } from "react";
import { Modal, Form, Select, InputNumber, message } from "antd";
import { fisioEliteApiService } from "../../services/api";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

interface NewPaymentModalProps {
    open: boolean;
    onClose: () => void;
}

const NewPaymentModal: React.FC<NewPaymentModalProps> = ({ open, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [form] = Form.useForm();

    const appointmentsOptions = appointments.map((a) => ({
        value: a.id,
        label: `${a.patient?.document_number} - ${a.patient?.first_name} ${a.patient?.last_name} - ${a.therapist?.first_name} / (${dayjs(a.start_time).format("D MMM, HH:mm")} - ${dayjs(a.end_time).format("HH:mm")})`,
    }));

    useEffect(() => {
        if (open) {
            fetchAppointments();
        }
    }, [open]);

    const fetchAppointments = async () => {
        try {
            const data = await fisioEliteApiService.getAppointments();
            setAppointments(data);
        } catch (error) {
            message.error("Error cargando citas");
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);

            const payload = {
                amount: values.amount,
                status: values.status,
                payment_method: values.payment_method,
                appointment_id: values.appointment_id,
            };

            await fisioEliteApiService.createPayment(payload);

            message.success("Pago registrado correctamente 💰");
            form.resetFields();
            onClose();
        } catch (error: any) {
            message.error(error.message || "Error al registrar el pago");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Registrar Pago"
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={loading}
        >
            <Form layout="vertical" form={form} onFinish={handleSubmit}>

                <Form.Item
                    name="appointment_id"
                    label="Cita"
                    rules={[{ required: true, message: "Selecciona una cita" }]}
                >
                    <Select
                        placeholder="Seleccionar cita"
                        loading={!appointments.length}
                        showSearch={{
                            optionFilterProp: "label"
                        }}
                        options={appointmentsOptions}
                    />
                </Form.Item>

                <Form.Item
                    name="amount"
                    label="Monto"
                    rules={[{ required: true, message: "Ingresa el monto" }]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Ej: 50000"
                    />
                </Form.Item>

                <Form.Item
                    name="payment_method"
                    label="Método de Pago"
                    rules={[{ required: true, message: "Selecciona método" }]}
                >
                    <Select
                        placeholder="Método de pago"
                        options={[
                            { value: "Cash", label: "Efectivo" },
                            { value: "Credit Card", label: "Tarjeta" },
                            { value: "Transfer", label: "Transferencia" },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Estado"
                    initialValue="PENDING"
                >
                    <Select
                        placeholder="Estado"
                        options={[
                            { value: "PENDING", label: "Pendiente" },
                            { value: "PAID", label: "Pagado" },
                            { value: "CANCELED", label: "Cancelado" },
                        ]}
                    />
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default NewPaymentModal;