import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { fisioEliteApiService } from "../../services/api";

interface NewPatientModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const NewPatientModal: React.FC<NewPatientModalProps> = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      await fisioEliteApiService.createPatient(values);

      message.success("Paciente creado correctamente 👤");
      form.resetFields();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      message.error(error.message || "Error al crear el paciente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Nuevo Paciente"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>

        <Form.Item
          name="first_name"
          label="Nombre"
          rules={[{ required: true, message: "Ingresa el nombre" }]}
        >
          <Input placeholder="Ej: Daniela" />
        </Form.Item>

        <Form.Item
          name="last_name"
          label="Apellido"
          rules={[{ required: true, message: "Ingresa el apellido" }]}
        >
          <Input placeholder="Ej: Rueda Castaño" />
        </Form.Item>

        <Form.Item
          name="document_number"
          label="Número de Documento"
          rules={[{ required: true, message: "Ingresa el número de documento" }]}
        >
          <Input placeholder="Ej: 1020304050" />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label="Teléfono"
        >
          <Input placeholder="Ej: 3202399493" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Correo electrónico"
          rules={[
            { type: "email", message: "Correo inválido" },
          ]}
        >
          <Input placeholder="Ej: daniela@mail.com" />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default NewPatientModal;
