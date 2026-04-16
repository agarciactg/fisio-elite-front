import { useEffect, useState } from 'react';
import { Table, Progress, Button, Avatar, Spin, Typography, Card } from 'antd';
import { FilterOutlined, UserAddOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { fisioEliteApiService, type PatientDirectoryResponse, type PatientDirectoryDetail } from '../../services/api';
import NewPatientModal from '../Dashboard/NewPatientModal';
import { PatientDetailDrawer } from './components/PatientDetailDrawer';

const { Title, Text } = Typography;

export function PatientsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<PatientDirectoryResponse | null>(null);
  const [openModalPatient, setOpenModalPatient] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientDirectoryDetail | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchDirectory();
  }, []);

  const fetchDirectory = async () => {
    setLoading(true);
    try {
      const response = await fisioEliteApiService.getPatientDirectory();
      setData(response);
    } catch (err) {
      console.error('Failed to fetch patient directory', err);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, { bg: string, text: string }> = {
    'ACTIVE': { bg: '#b2f5ea', text: '#234e52' },
    'PACKAGE PENDING': { bg: '#fed7d7', text: '#742a2a' },
    'INACTIVE': { bg: '#e2e8f0', text: '#4a5568' }
  };

  const columns = [
    {
      title: 'INFORMACIÓN DEL PACIENTE',
      key: 'patientInfo',
      render: (record: PatientDirectoryDetail) => (
        <div className="flex items-center gap-3">
          {record.avatar_url ? (
            <Avatar size={40} src={record.avatar_url} />
          ) : (
            <Avatar size={40} style={{ backgroundColor: '#81e6d9', color: '#234e52', fontWeight: 600 }}>
              {record.first_name.charAt(0)}{record.last_name.charAt(0)}
            </Avatar>
          )}
          <div className="flex flex-col">
            <Text className="font-bold text-slate-800 text-sm">{record.first_name} {record.last_name}</Text>
            <Text className="text-xs text-slate-500">
              {record.email && `${record.email} • `}
              {record.phone_number || ''}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'ÚLTIMA VISITA',
      key: 'lastVisit',
      render: (record: PatientDirectoryDetail) => (
        <div className="flex flex-col">
          <Text className="font-bold text-slate-800 text-sm">{record.last_visit_date || '—'}</Text>
          <Text className="text-xs text-slate-500">{record.last_visit_reason || '—'}</Text>
        </div>
      ),
    },
    {
      title: 'PAQUETES DE SESIONES',
      key: 'sessionPackages',
      render: (record: PatientDirectoryDetail) => {
        if (record.session_total === 0) {
          return <Text className="text-xs text-slate-500">No hay paquetes activos</Text>;
        }
        const percent = Math.round((record.session_used / record.session_total) * 100);
        const strokeColor = record.status === 'PACKAGE PENDING' ? '#e53e3e' : '#047857';
        return (
          <div className="flex flex-col w-48">
            <div className="flex justify-between mb-1">
              <Text className="text-xs font-bold text-slate-700">{record.session_used} / {record.session_total} en uso</Text>
              <Text className="text-xs text-slate-500">{record.status === 'PACKAGE PENDING' ? 'Expired' : `${percent}%`}</Text>
            </div>
            <Progress percent={percent} showInfo={false} size="small" strokeColor={strokeColor} />
          </div>
        );
      },
    },
    {
      title: 'ESTADO',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorConfig = statusColors[status] || statusColors['INACTIVE'];
        return (
          <span
            className="px-3 py-1 rounded-full text-xs font-bold font-label tracking-wider"
            style={{ backgroundColor: colorConfig.bg, color: colorConfig.text }}
          >
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="w-full flex-grow pb-12">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white shrink-0 mt-8 mb-6 gap-4 border-b border-slate-100">
        <div>
          <Title level={2} className="!mb-1 font-headline tracking-tight text-slate-800">
            Directorio de Pacientes
          </Title>
          <Text className="text-slate-500 text-sm">
            Gestionar los expedientes de los pacientes y su evolución clínica.
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <Button
            icon={<FilterOutlined />}
            className="rounded-full bg-slate-100 hover:bg-slate-200 border-none text-slate-600 font-semibold h-10 px-6 font-label"
          >
            Filters
          </Button>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => { setOpenModalPatient(true) }}
            className="rounded-full bg-teal-700 hover:bg-teal-600 border-none h-10 px-6 font-label"
          >
            Agregar nuevos Pacientes
          </Button>
          <NewPatientModal
            open={openModalPatient}
            onClose={() => { setOpenModalPatient(false) }}
            onSuccess={() => { fetchDirectory() }}
          />
        </div>
      </div>

      {loading && !data ? (
        <div className="flex justify-center p-12">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 mb-8">
            <Card variant="borderless" className="bg-slate-50 border border-slate-100">
              <Text className="text-[10px] font-bold text-slate-500 tracking-widest font-label uppercase">TOTAL DE PACIENTES</Text>
              <div className="mt-1 mb-2">
                <span className="text-4xl font-headline font-bold text-teal-800">{(data?.summary.total_patients || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <ArrowUpOutlined className="text-[10px]" />
                <span>{data?.summary.total_patients_trend}</span>
              </div>
            </Card>

            <Card variant="borderless" className="bg-slate-50 border border-slate-100">
              <Text className="text-[10px] font-bold text-slate-500 tracking-widest font-label uppercase">ACTIVOS AHORA</Text>
              <div className="mt-1 mb-3">
                <span className="text-4xl font-headline font-bold text-teal-800">{(data?.summary.active_now || 0).toLocaleString()}</span>
              </div>
              <div className="flex -space-x-2">
                {/* Mock avatars mimicking the image */}
                <Avatar size="small" src="https://xsgames.co/randomusers/assets/avatars/female/1.jpg" />
                <Avatar size="small" src="https://xsgames.co/randomusers/assets/avatars/male/2.jpg" />
                <Avatar size="small" style={{ backgroundColor: '#14b8a6', fontSize: '10px' }} className="border border-white">
                  +{((data?.summary.active_now || 0) - 2) > 0 ? ((data?.summary.active_now || 0) - 2) : 0}
                </Avatar>
              </div>
            </Card>

            <Card variant="borderless" className="bg-slate-50 border border-slate-100">
              <Text className="text-[10px] font-bold text-slate-500 tracking-widest font-label uppercase">PAQUETES PENDIENTES</Text>
              <div className="mt-1 mb-2">
                <span className="text-4xl font-headline font-bold text-red-600">{(data?.summary.package_pending || 0).toLocaleString()}</span>
              </div>
              <Text className="text-[11px] italic text-slate-500">Requiere seguimiento administrativo</Text>
            </Card>

            <Card variant="borderless" className="bg-slate-50 border border-slate-100">
              <Text className="text-[10px] font-bold text-slate-500 tracking-widest font-label uppercase">SESIONES HOY</Text>
              <div className="mt-1 mb-2">
                <span className="text-4xl font-headline font-bold text-teal-800">{(data?.summary.sessions_today || 0).toLocaleString()}</span>
              </div>
              <Text className="text-[11px] font-semibold text-emerald-600">Capacidad al {data?.summary.capacity_percentage}%</Text>
            </Card>
          </div>

          {/* Table */}
          <div className="px-6 bg-white rounded-xl shadow-sm border border-slate-100 mx-6 pb-6 overflow-hidden">
              <Table
              dataSource={data?.patients || []}
              columns={columns}
              rowKey="id"
              pagination={{
                position: ['bottomRight'],
                pageSize: 10,
                showTotal: (total, range) => `Mostrando ${range[1]} de ${total} pacientes`
              }}
              className="custom-patient-table"
              rowClassName="cursor-pointer hover:bg-slate-50 transition-colors"
              onRow={(record) => {
                return {
                  onClick: () => {
                    setSelectedPatient(record);
                    setDrawerOpen(true);
                  }
                };
              }}
            />
          </div>
          <PatientDetailDrawer 
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            patient={selectedPatient}
            onRefresh={() => fetchDirectory()}
          />
        </>
      )}
    </div>
  );
}
