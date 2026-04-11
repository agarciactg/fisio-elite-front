import { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, Alert } from 'antd';
import {
    UserOutlined,
    LockOutlined,
    HeartOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    ArrowRightOutlined,
} from '@ant-design/icons';
import { fisioEliteApiService } from '../../services/api';

interface LoginFormValues {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginPageProps {
    onLoginSuccess?: (token: string) => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form] = Form.useForm<LoginFormValues>();

    const handleSubmit = async (values: LoginFormValues) => {
        setLoading(true);
        setError(null);
        try {
            const { access_token, role } = await fisioEliteApiService.login(values.email, values.password);

            if (values.remember) {
                localStorage.setItem('fisio_token', access_token);
            } else {
                sessionStorage.setItem('fisio_token', access_token);
            }

            const redirectByRole: Record<string, string> = {
                admin: '/',
                therapist: '/calendar',
                patient: '/booking',
            };

            window.location.replace(redirectByRole[role] ?? '/');

        } catch (err: any) {
            setError(err.message ?? 'Error inesperado. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50">

            <div
                className="hidden lg:flex flex-col justify-between p-12 w-[460px] shrink-0 relative overflow-hidden"
                style={{ background: '#006874' }}
            >
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
                <div className="absolute bottom-12 -right-32 w-80 h-80 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                            <HeartOutlined style={{ color: 'white', fontSize: 20 }} />
                        </div>
                        <span className="text-white font-black text-xl tracking-tight font-headline">
                            FisioElite
                        </span>
                    </div>
                    <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        Sistema de Gestión Clínica
                    </p>
                </div>

                <div className="relative z-10">
                    <h1 className="text-5xl font-black font-headline leading-tight tracking-tighter mb-6 text-white">
                        Bienvenido de<br />vuelta.
                    </h1>
                    <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        Gestiona citas, pacientes y pagos desde un solo lugar. Rápido, seguro y diseñado para tu clínica.
                    </p>
                </div>

                <div className="relative z-10 flex gap-8">
                    {[
                        { label: 'Pacientes activos', value: '1,200+' },
                        { label: 'Citas este mes', value: '340' },
                    ].map(s => (
                        <div key={s.label}>
                            <p className="text-2xl font-black font-headline text-white mb-0">{s.value}</p>
                            <p className="text-xs font-medium mb-0" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
                <div className="w-full max-w-md">

                    <div className="flex items-center gap-2 mb-10 lg:hidden">
                        <HeartOutlined style={{ color: '#006874', fontSize: 22 }} />
                        <span className="font-black text-xl tracking-tight font-headline" style={{ color: '#006874' }}>
                            FisioElite
                        </span>
                    </div>

                    <div className="mb-10">
                        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#006874' }}>
                            Portal Administrativo
                        </p>
                        <h2 className="text-4xl font-black font-headline tracking-tighter text-on-surface mb-2">
                            Iniciar Sesión
                        </h2>
                        <p className="text-sm text-on-surface-variant">
                            Ingresa tus credenciales para continuar.
                        </p>
                    </div>

                    {error && (
                        <Alert
                            message={error}
                            type="error"
                            showIcon
                            closable
                            onClose={() => setError(null)}
                            className="mb-6 rounded-xl"
                        />
                    )}

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        requiredMark={false}
                        initialValues={{ remember: true }}
                    >
                        <Form.Item
                            name="email"
                            label={<span className="font-semibold text-sm">Correo electrónico</span>}
                            rules={[
                                { required: true, message: 'Ingresa tu correo.' },
                                { type: 'email', message: 'Correo no válido.' },
                            ]}
                        >
                            <Input
                                size="large"
                                prefix={<UserOutlined style={{ color: '#006874' }} />}
                                placeholder="admin@fisioelite.com"
                                className="rounded-xl"
                                style={{ height: 52 }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label={<span className="font-semibold text-sm">Contraseña</span>}
                            rules={[{ required: true, message: 'Ingresa tu contraseña.' }]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined style={{ color: '#006874' }} />}
                                placeholder="••••••••"
                                className="rounded-xl"
                                style={{ height: 52 }}
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>

                        <div className="flex items-center justify-between mb-6">
                            <Form.Item name="remember" valuePropName="checked" className="mb-0">
                                <Checkbox className="text-sm font-medium">Recordarme</Checkbox>
                            </Form.Item>
                            <button
                                type="button"
                                className="text-sm font-semibold border-none bg-transparent cursor-pointer p-0"
                                style={{ color: '#006874' }}
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>

                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                icon={!loading ? <ArrowRightOutlined /> : undefined}
                                iconPosition="end"
                                className="w-full font-bold rounded-xl shadow-sm"
                                style={{ height: 52, fontSize: 15 }}
                            >
                                {loading ? 'Verificando...' : 'Entrar al sistema'}
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider className="my-8">
                        <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Seguro & Cifrado</span>
                    </Divider>

                    <p className="text-center text-xs text-slate-400">
                        Al ingresar, aceptas los{' '}
                        <span className="underline cursor-pointer" style={{ color: '#006874' }}>Términos de Uso</span>
                        {' '}y la{' '}
                        <span className="underline cursor-pointer" style={{ color: '#006874' }}>Política de Privacidad</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}