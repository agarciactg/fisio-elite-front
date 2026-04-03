import { Card, Button, Segmented, Table, Progress, Tag } from 'antd';
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
  RightOutlined
} from '@ant-design/icons';

export function DashboardPage() {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <p className="text-xs font-label uppercase tracking-widest text-primary mb-1">Administrative Overview</p>
          <h2 className="text-4xl font-black text-on-surface font-headline tracking-tighter mb-0">Dashboard Administrativo</h2>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-lowest p-1.5 rounded-xl shadow-sm border border-slate-100">
          <Segmented
            options={['Today', 'Week', 'Month']}
            className="font-semibold"
            style={{ padding: '4px' }}
          />
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          <Button type="text" icon={<CalendarOutlined />} className="font-semibold text-slate-600">
            Oct 1, 2026 - Oct 31, 2026
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Ingresos Totales (Mes)" value="€42,850.00" trend="+12.5%" icon={<DollarOutlined />} isPositive />
        <StatCard title="Citas Completadas" value="1,284" trend="+5.2%" icon={<CheckCircleOutlined />} isPositive />
        <StatCard title="Nuevos Pacientes" value="156" trend="-2.1%" icon={<UserAddOutlined />} />
        <StatCard title="Asistencia (%)" value="94.8%" trend="+0.8%" icon={<SafetyCertificateOutlined />} isPositive />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <Card bordered={false} className="shadow-sm rounded-xl">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h4 className="text-xl font-bold font-headline text-on-surface tracking-tight mb-0">Citas por Semana</h4>
                <p className="text-sm text-on-surface-variant mb-0">Performance analysis over the last 6 weeks</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-primary rounded-full"></span> This Month</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-secondary-fixed-dim rounded-full"></span> Last Month</span>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-4 relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-slate-100 w-full h-0"></div>
                <div className="border-b border-slate-100 w-full h-0"></div>
                <div className="border-b border-slate-100 w-full h-0"></div>
                <div className="border-b border-slate-100 w-full h-0"></div>
              </div>
              {[
                { w: 'Week 1', h1: '40%', h2: '60%' },
                { w: 'Week 2', h1: '45%', h2: '75%' },
                { w: 'Week 3', h1: '55%', h2: '65%' },
                { w: 'Week 4', h1: '40%', h2: '90%' },
                { w: 'Week 5', h1: '60%', h2: '80%' },
              ].map(col => (
                <div key={col.w} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer z-10 w-full h-full">
                  <div className="w-full flex items-end gap-1.5 h-full">
                    <div className="flex-1 bg-primary/20 rounded-t-lg transition-all group-hover:bg-primary/40" style={{ height: col.h1 }}></div>
                    <div className="flex-1 bg-primary rounded-t-lg transition-all group-hover:scale-y-105" style={{ height: col.h2 }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{col.w}</span>
                </div>
              ))}
            </div>
          </Card>
          <RecentActivityWidget />
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <QuickActionsWidget />
          <UpcomingWidget />
          <TherapistStatsWidget />
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, trend, icon, isPositive }: any) {
  return (
    <Card bordered={false} className="shadow-sm rounded-xl hover:shadow-md transition-all relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div className={`text-2xl text-primary`}>
          {icon}
        </div>
        <span className={`text-xs font-bold ${isPositive ? 'text-tertiary' : 'text-error'} flex items-center gap-1`}>
          {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {trend}
        </span>
      </div>
      <p className="text-sm font-medium text-on-surface-variant mb-1">{title}</p>
      <h3 className="text-2xl font-black font-headline text-on-surface tracking-tight mb-0">{value}</h3>
      <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity text-8xl text-primary pointer-events-none">
        {icon}
      </div>
    </Card>
  );
}

function RecentActivityWidget() {
  const columns = [
    {
      title: 'Patient Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{record.initials}</div>
          <span className="font-bold text-sm">{text}</span>
        </div>
      ),
    },
    { title: 'Physiotherapist', dataIndex: 'doctor', key: 'doctor' },
    { title: 'Treatment', dataIndex: 'tx', key: 'tx' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = status === 'Paid' ? 'success' : status === 'Pending' ? 'processing' : 'error';
        return <Tag color={color} className="font-bold uppercase tracking-wider rounded-full px-3 border-0">{status}</Tag>;
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (amount: string) => <span className="font-black">{amount}</span>,
    },
  ];

  const data = [
    { key: '1', initials: 'MR', name: 'Mateo Rossi', doctor: 'Dr. Elena Valeri', tx: 'Rehab Post-Op', status: 'Paid', amount: '€65.00' },
    { key: '2', initials: 'SC', name: 'Sofia Conti', doctor: 'Lic. Marco Polo', tx: 'Electrotherapy', status: 'Pending', amount: '€45.00' },
    { key: '3', initials: 'MB', name: 'Marta Bruno', doctor: 'Lic. Marco Polo', tx: 'Postural Evaluation', status: 'Canceled', amount: '€0.00' },
  ];

  return (
    <Card bordered={false} className="shadow-sm rounded-xl px-0" bodyStyle={{ padding: '24px 0' }}>
      <div className="px-6 flex justify-between items-center mb-4">
        <h4 className="text-xl font-bold font-headline text-on-surface tracking-tight mb-0">Recent Activity</h4>
        <Button type="link" className="font-bold text-primary">View all</Button>
      </div>
      <Table columns={columns} dataSource={data} pagination={false} size="middle" />
    </Card>
  );
}

function QuickActionsWidget() {
  return (
    <Card bordered={false} className="shadow-sm rounded-xl">
      <h4 className="text-lg font-bold font-headline text-on-surface mb-6 tracking-tight">Acciones Rápidas</h4>
      <div className="grid grid-cols-1 gap-3">
        <Button type="primary" size="large" icon={<PlusCircleOutlined />} className="h-auto py-4 rounded-xl font-bold flex items-center justify-start text-left text-base shadow-sm">
          Nueva Cita
        </Button>
        <Button size="large" icon={<WalletOutlined />} className="h-auto py-4 rounded-xl font-bold flex items-center justify-start text-left text-base bg-secondary-container text-on-secondary-container border-0 hover:brightness-105">
          Registrar Pago
        </Button>
        <Button size="large" icon={<UserAddOutlined />} className="h-auto py-4 rounded-xl font-bold flex items-center justify-start text-left text-base bg-surface-container-high border-0">
          Nuevo Paciente
        </Button>
      </div>
    </Card>
  );
}

function UpcomingWidget() {
  return (
    <Card bordered={false} className="shadow-sm rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-bold font-headline text-on-surface tracking-tight mb-0">Próximas Citas</h4>
        <Tag color="cyan" className="rounded-md border-0 bg-primary-fixed text-on-primary-fixed m-0">TODAY</Tag>
      </div>
      <div className="space-y-4">
        <UpcomingRow time="14:30" name="Giulia Bianchi" doctor="Dr. Elena V." />
        <UpcomingRow time="15:15" name="Paolo Verdi" doctor="Lic. Marco P." />
        <UpcomingRow time="16:00" name="Chiara Gialli" doctor="Dr. Elena V." />
      </div>
    </Card>
  );
}

function UpcomingRow({ time, name, doctor }: any) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container transition-colors cursor-pointer group border border-transparent hover:border-slate-200">
      <div className="flex flex-col items-center justify-center w-14 h-14 bg-teal-50 text-teal-700 rounded-xl font-headline font-black">
        <span className="text-sm">{time}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-on-surface mb-0">{name}</p>
        <p className="text-xs text-on-surface-variant flex items-center gap-1 mb-0">
          {doctor}
        </p>
      </div>
      <RightOutlined className="text-slate-300 group-hover:text-primary transition-colors" />
    </div>
  );
}

function TherapistStatsWidget() {
  return (
    <Card bordered={false} className="shadow-sm rounded-xl">
      <h4 className="text-lg font-bold font-headline text-on-surface mb-6 tracking-tight">Appointments by Therapist</h4>
      <div className="space-y-5">
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-on-surface-variant">Dr. Elena Valeri</span>
            <span className="text-primary font-black">142</span>
          </div>
          <Progress percent={85} showInfo={false} strokeColor="#006874" />
        </div>
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-on-surface-variant">Lic. Marco Polo</span>
            <span className="text-primary font-black">98</span>
          </div>
          <Progress percent={65} showInfo={false} strokeColor="#006874" />
        </div>
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-on-surface-variant">Lic. Sara Gallo</span>
            <span className="text-primary font-black">74</span>
          </div>
          <Progress percent={50} showInfo={false} strokeColor="#006874" />
        </div>
      </div>
    </Card>
  );
}
