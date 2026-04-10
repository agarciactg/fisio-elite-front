import { useCallback, useEffect, useState } from 'react';
import { Card, Button, Segmented, Table, Progress, Tag, Skeleton, Modal, Descriptions, Space } from 'antd';
import {
  CalendarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  UserAddOutlined,
  SafetyCertificateOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusCircleOutlined,
  WalletOutlined,
  RightOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import { fisioEliteApiService } from '../../services/api';
import NewAppointmentModal from './NewAppointmentModal';
import NewPaymentModal from './NewPaymentModal';
import NewPatientModal from './NewPatientModal';

interface RecentActivityItem {
  patient_name: string;
  patient_initials: string;
  therapist: string;
  treatment: string;
  status: string;
  amount: string;
}

interface WeeklyAppointment {
  week: string;
  current: number;
  previous: number;
}

interface UpcomingAppointment {
  id: number;
  time: string;
  patient_name: string;
  patient_id: number;
  patient_phone: string;
  therapist: string;
  treatment: string;
  status: string;
}

interface TherapistStat {
  name: string;
  count: number;
  percent: number;
}

interface DashboardStats {
  revenue: string;
  revenue_trend: number;
  appointments_completed: number;
  appointments_trend: number;
  new_patients: number;
  new_patients_trend: number;
  attendance_ratio: number;
  attendance_trend: number;
  weekly_appointments: WeeklyAppointment[];
  recent_activity: RecentActivityItem[];
  upcoming_today: UpcomingAppointment[];
  appointments_by_therapist: TherapistStat[];
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    fisioEliteApiService.getDashboardStats()
      .then(data => setStats(data as DashboardStats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const handleRefresh = useCallback(() => setRefreshKey(k => k + 1), []);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <p className="text-xs font-label uppercase tracking-widest text-primary mb-1">Administrative Overview</p>
          <h2 className="text-4xl font-black text-on-surface font-headline tracking-tighter mb-0">Dashboard Administrativo</h2>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-lowest p-1.5 rounded-xl shadow-sm border border-slate-100">
          <Segmented options={['Today', 'Week', 'Month']} className="font-semibold" style={{ padding: '4px' }} />
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <Button type="text" icon={<CalendarOutlined />} className="font-semibold text-slate-600">
            {new Date().toLocaleDateString('es-CO', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Ingresos Totales (Mes)"
          value={stats?.revenue ?? '—'}
          trend={stats?.revenue_trend ?? 0}
          icon={<DollarOutlined />}
          loading={loading}
        />
        <StatCard
          title="Citas Completadas"
          value={stats?.appointments_completed?.toString() ?? '—'}
          trend={stats?.appointments_trend ?? 0}
          icon={<CheckCircleOutlined />}
          loading={loading}
        />
        <StatCard
          title="Nuevos Pacientes"
          value={stats?.new_patients?.toString() ?? '—'}
          trend={stats?.new_patients_trend ?? 0}
          icon={<UserAddOutlined />}
          loading={loading}
        />
        <StatCard
          title="Asistencia (%)"
          value={stats ? `${stats.attendance_ratio}%` : '—'}
          trend={stats?.attendance_trend ?? 0}
          icon={<SafetyCertificateOutlined />}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <WeeklyChart data={stats?.weekly_appointments ?? []} loading={loading} />
          <RecentActivityWidget data={stats?.recent_activity ?? []} loading={loading} />
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <QuickActionsWidget onPaymentCreated={handleRefresh} />
          <UpcomingWidget data={stats?.upcoming_today ?? []} loading={loading} />
          <TherapistStatsWidget data={stats?.appointments_by_therapist ?? []} loading={loading} />
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, trend, icon, loading }: {
  title: string; value: string; trend: number; icon: React.ReactNode; loading: boolean;
}) {
  const isPositive = trend >= 0;
  const trendLabel = `${isPositive ? '+' : ''}${trend}%`;

  return (
    <Card bordered={false} className="shadow-sm rounded-xl hover:shadow-md transition-all relative overflow-hidden group">
      <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
        <div className="flex justify-between items-start mb-4">
          <div className="text-2xl text-primary">{icon}</div>
          <span className={`text-xs font-bold ${isPositive ? 'text-tertiary' : 'text-error'} flex items-center gap-1`}>
            {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {trendLabel}
          </span>
        </div>
        <p className="text-sm font-medium text-on-surface-variant mb-1">{title}</p>
        <h3 className="text-2xl font-black font-headline text-on-surface tracking-tight mb-0">{value}</h3>
        <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity text-8xl text-primary pointer-events-none">
          {icon}
        </div>
      </Skeleton>
    </Card>
  );
}

function WeeklyChart({ data, loading }: { data: WeeklyAppointment[]; loading: boolean }) {
  const maxVal = Math.max(...data.flatMap(d => [d.current, d.previous]), 1);

  return (
    <Card bordered={false} className="shadow-sm rounded-xl">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h4 className="text-xl font-bold font-headline text-on-surface tracking-tight mb-0">Citas por Semana</h4>
          <p className="text-sm text-on-surface-variant mb-0">Comparativo últimas 5 semanas</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-primary rounded-full" /> Actual</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-primary/20 rounded-full" /> Anterior</span>
        </div>
      </div>

      <Skeleton loading={loading} active paragraph={{ rows: 4 }}>
        <div className="h-64 flex items-end justify-between gap-4 relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-b border-slate-100 w-full h-0" />
            ))}
          </div>

          {data.map(col => (
            <div key={col.week} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer z-10 w-full h-full">
              <div className="w-full flex items-end gap-1.5 h-full">
                <div
                  className="flex-1 bg-primary/20 rounded-t-lg transition-all group-hover:bg-primary/40"
                  style={{ height: `${(col.previous / maxVal) * 100}%` }}
                />
                <div
                  className="flex-1 bg-primary rounded-t-lg transition-all group-hover:scale-y-105"
                  style={{ height: `${(col.current / maxVal) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">{col.week}</span>
            </div>
          ))}

          {/* Empty state */}
          {data.every(d => d.current === 0 && d.previous === 0) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-slate-400 font-medium">Sin datos aún</p>
            </div>
          )}
        </div>
      </Skeleton>
    </Card>
  );
}

function RecentActivityWidget({ data, loading }: { data: RecentActivityItem[]; loading: boolean }) {
  const columns = [
    {
      title: 'Paciente',
      dataIndex: 'patient_name',
      key: 'patient_name',
      render: (text: string, record: RecentActivityItem) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            {record.patient_initials}
          </div>
          <span className="font-bold text-sm">{text}</span>
        </div>
      ),
    },
    { title: 'Fisioterapeuta', dataIndex: 'therapist', key: 'therapist' },
    { title: 'Tratamiento', dataIndex: 'treatment', key: 'treatment' },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'paid' ? 'success' : status === 'pending' ? 'processing' : 'error';
        const label = status === 'paid' ? 'Pagado' : status === 'pending' ? 'Pendiente' : 'Cancelado';
        return <Tag color={color} className="font-bold uppercase tracking-wider rounded-full px-3 border-0">{label}</Tag>;
      },
    },
    {
      title: 'Valor',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (amount: string) => <span className="font-black">{amount}</span>,
    },
  ];

  return (
    <Card bordered={false} className="shadow-sm rounded-xl px-0" bodyStyle={{ padding: '24px 0' }}>
      <div className="px-6 flex justify-between items-center mb-4">
        <h4 className="text-xl font-bold font-headline text-on-surface tracking-tight mb-0">Actividad Reciente</h4>
        <Button type="link" className="font-bold text-primary">Ver todo</Button>
      </div>
      <Skeleton loading={loading} active paragraph={{ rows: 3 }} className="px-6">
        {data.length === 0 ? (
          <p className="px-6 text-sm text-slate-400">Sin actividad reciente.</p>
        ) : (
          <Table
            columns={columns}
            dataSource={data.map((d, i) => ({ ...d, key: i }))}
            pagination={false}
            size="middle"
          />
        )}
      </Skeleton>
    </Card>
  );
}

function QuickActionsWidget({ onPaymentCreated }: { onPaymentCreated: () => void }) {
  const [openNewAppointment, setOpenNewAppointment] = useState(false);
  const [openNewPayment, setOpenNewPayment] = useState(false);
  const [openNewPatient, setOpenNewPatient] = useState(false);

  return (
    <Card bordered={false} className="shadow-sm rounded-xl">
      <h4 className="text-lg font-bold font-headline text-on-surface mb-6 tracking-tight">Acciones Rápidas</h4>
      <div className="grid grid-cols-1 gap-3">
        <Button type="primary" onClick={() => setOpenNewAppointment(true)} size="large" icon={<PlusCircleOutlined />} className="h-auto py-4 rounded-xl font-bold flex items-center justify-start text-left text-base shadow-sm">
          Nueva Cita
        </Button>
        <Button size="large" onClick={() => setOpenNewPayment(true)} icon={<WalletOutlined />} className="h-auto py-4 rounded-xl font-bold flex items-center justify-start text-left text-base bg-secondary-container text-on-secondary-container border-0 hover:brightness-105">
          Registrar Pago
        </Button>
        <Button size="large" onClick={() => setOpenNewPatient(true)} icon={<UserAddOutlined />} className="h-auto py-4 rounded-xl font-bold flex items-center justify-start text-left text-base bg-surface-container-high border-0">
          Nuevo Paciente
        </Button>
      </div>
      <NewAppointmentModal
        open={openNewAppointment}
        onClose={() => setOpenNewAppointment(false)}
      />
      <NewPaymentModal
        open={openNewPayment}
        onClose={() => setOpenNewPayment(false)}
        onSuccess={onPaymentCreated}
      />
      <NewPatientModal
        open={openNewPatient}
        onClose={() => setOpenNewPatient(false)}
      />
    </Card>
  );
}

function UpcomingWidget({ data, loading }: { data: UpcomingAppointment[]; loading: boolean }) {
  const [selectedAppt, setSelectedAppt] = useState<UpcomingAppointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (appt: UpcomingAppointment) => {
    setSelectedAppt(appt);
    setIsModalOpen(true);
  };

  return (
    <Card bordered={false} className="shadow-sm rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-bold font-headline text-on-surface tracking-tight mb-0">Próximas Citas</h4>
        <Tag color="cyan" className="rounded-md border-0 bg-primary-fixed text-on-primary-fixed m-0">HOY</Tag>
      </div>
      <Skeleton loading={loading} active paragraph={{ rows: 3 }}>
        {data.length === 0 ? (
          <p className="text-sm text-slate-400">No hay citas pendientes hoy.</p>
        ) : (
          <div className="space-y-4">
            {data.map((appt, i) => (
              <UpcomingRow
                key={i}
                time={appt.time}
                name={appt.patient_name}
                doctor={appt.therapist}
                treatment={appt.treatment}
                onClick={() => handleRowClick(appt)}
              />
            ))}
          </div>
        )}
      </Skeleton>

      <AppointmentDetailModal
        appointment={selectedAppt}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Card>
  );
}

function AppointmentDetailModal({
  appointment,
  open,
  onClose
}: {
  appointment: UpcomingAppointment | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!appointment) return null;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-xl font-bold font-headline pt-2">
          <CalendarOutlined className="text-primary" />
          <span>Detalle de la Cita</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose} className="rounded-lg font-bold">
          Cerrar
        </Button>,
        <Button key="view-record" type="primary" onClick={onClose} className="rounded-lg font-bold bg-primary border-0">
          Ver Ficha del Paciente
        </Button>
      ]}
      centered
      width={500}
      className="p-2"
    >
      <div className="py-4">
        <div className="bg-surface-container-low p-6 rounded-2xl border border-slate-100 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-black">
              {appointment.patient_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-black text-on-surface mb-0 tracking-tight">{appointment.patient_name}</h3>
              <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mb-0 font-medium">
                <PhoneOutlined /> {appointment.patient_phone}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Tag color="processing" className="font-bold border-0 px-3 py-0.5 rounded-full uppercase text-[10px] tracking-wider">
              {appointment.status}
            </Tag>
            <Tag color="cyan" className="font-bold border-0 px-3 py-0.5 rounded-full uppercase text-[10px] tracking-wider">
              Presencial
            </Tag>
          </div>
        </div>

        <Descriptions column={1} className="px-2">
          <Descriptions.Item label={<Space><ClockCircleOutlined /> <span className="font-bold">Hora</span></Space>}>
            <span className="font-medium">{appointment.time} — Hoy</span>
          </Descriptions.Item>
          <Descriptions.Item label={<Space><UserOutlined /> <span className="font-bold">Profesional</span></Space>}>
            <span className="font-medium text-primary uppercase font-bold text-xs tracking-wide">{appointment.therapist}</span>
          </Descriptions.Item>
          <Descriptions.Item label={<Space><MedicineBoxOutlined /> <span className="font-bold">Tratamiento</span></Space>}>
            <span className="font-bold text-on-surface">{appointment.treatment}</span>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
}

function UpcomingRow({
  time,
  name,
  doctor,
  treatment,
  onClick
}: {
  time: string;
  name: string;
  doctor: string;
  treatment: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container transition-colors cursor-pointer group border border-transparent hover:border-slate-200"
    >
      <div className="flex flex-col items-center justify-center min-w-[56px] h-14 bg-teal-50 text-teal-700 rounded-xl font-headline font-black">
        <span className="text-sm">{time}</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-bold text-on-surface mb-0 truncate">{name}</p>
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-bold text-primary uppercase tracking-tighter mb-0">{doctor}</p>
          <span className="text-slate-300 text-[10px]">•</span>
          <p className="text-[11px] text-on-surface-variant font-medium mb-0 truncate">{treatment}</p>
        </div>
      </div>
      <RightOutlined className="text-slate-300 group-hover:text-primary transition-colors" />
    </div>
  );
}

function TherapistStatsWidget({ data, loading }: { data: TherapistStat[]; loading: boolean }) {
  return (
    <Card bordered={false} className="shadow-sm rounded-xl">
      <h4 className="text-lg font-bold font-headline text-on-surface mb-6 tracking-tight">Citas por Terapeuta</h4>
      <Skeleton loading={loading} active paragraph={{ rows: 3 }}>
        {data.length === 0 ? (
          <p className="text-sm text-slate-400">Sin datos este mes.</p>
        ) : (
          <div className="space-y-5">
            {data.map((t, i) => (
              <div key={i}>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-bold text-on-surface-variant">{t.name}</span>
                  <span className="text-primary font-black">{t.count}</span>
                </div>
                <Progress percent={t.percent} showInfo={false} strokeColor="#006874" />
              </div>
            ))}
          </div>
        )}
      </Skeleton>
    </Card>
  );
}
