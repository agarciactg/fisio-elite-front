import { Card, Button, Select, Badge, Tooltip } from 'antd';
import { 
  FilterOutlined, 
  PlusOutlined, 
  CalendarOutlined, 
  LeftOutlined, 
  RightOutlined
} from '@ant-design/icons';

const { Option } = Select;

export function CalendarPage() {
  return (
    <>
      {/* Header & View Toggles */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-black font-headline tracking-tight text-on-surface mb-0">Agenda de Citas</h2>
          <p className="text-on-surface-variant font-label text-sm mt-1 mb-0">Martes, 14 de Mayo, 2024</p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-xl">
          <Button type="text" className="px-6 rounded-lg text-sm font-bold bg-white text-teal-700 shadow-sm transition-all hover:bg-white hover:text-teal-800">Hoy</Button>
          <Button type="text" className="px-6 rounded-lg text-sm font-bold text-slate-500 hover:bg-white/50 transition-all">Semana</Button>
          <Button type="text" className="px-6 rounded-lg text-sm font-bold text-slate-500 hover:bg-white/50 transition-all">Mes</Button>
        </div>
        <div className="flex items-center gap-3">
          <Button icon={<FilterOutlined />} size="large" className="bg-surface-container-lowest text-on-surface-variant font-bold border-0 rounded-xl hover:bg-teal-50">
            Filtrar
          </Button>
          <Button type="primary" icon={<PlusOutlined />} size="large" className="bg-gradient-to-br from-primary to-primary-container px-6 border-0 rounded-xl shadow-lg shadow-primary/20 font-bold">
            Agendar Nueva Cita
          </Button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-[calc(100vh-12rem)] relative">
        {/* Calendar Grid Container */}
        <Card bordered={false} className="flex-1 rounded-3xl shadow-sm body-no-padding overflow-hidden" bodyStyle={{ padding: 0 }}>
          {/* Therapist Headers */}
          <div className="calendar-grid border-b border-surface-container-high bg-surface-container-low">
            <div className="h-16 flex items-center justify-center border-r border-surface-container-high">
              <CalendarOutlined className="text-slate-400 text-xl" />
            </div>
            <HeaderCell name="Dr. Marcos Silva" spec="Fisioterapia Deportiva" img="https://lh3.googleusercontent.com/aida-public/AB6AXuB5wUglMnrP9y18a_ZzQ3sFzv60MF7G9TlRsfgvwWwc7QxiYMemKjnrK02bDAC0HQqEOvczvdQ2ZjwoPTxyPIhd8fRZqWplmilSPjysQcJ3JD9WKOYx1JGzs82xmvcdyn4BhQXNI2zfp3eqxa81unL5rYMO2tPt6i36xiyvg8JX07LPqcj_7GahnvmbvRdbGXTWtMiMOvbjMQulbzzdUw_JyAq-ck4t5OzuTlTwZ64DFVar3jr1X5vSUi5qTqLaOBUtceMqDOIM6uTF" color="text-teal-600" />
            <HeaderCell name="Dra. Lucía Méndez" spec="Osteopatía" img="https://lh3.googleusercontent.com/aida-public/AB6AXuBb1c7aSi_Sr1-WDH2WPVKWc6zH_WUqeVRQtsBN-8kCSEY-O-xX-pq5aePYuWEbirx67vnyQIVe_V_hdCj84uDsfF_qtZLUq-x2n3RimayokPd74G0SCJl3FehPckIJFqZXJy7XgvhRcvCN--LERWMrYPf5XHIgkuUNmZsxLs2Y3c0Iz2FSBWTbwwZnGFi0XAtbwC3qvI4gaDFQ2Gk-oIqG7yHAhS5vnPTfAYcXYxVDpU69cBniUQbctG20nlGIyYs0EB5zFrFtadvf" color="text-tertiary" />
            <HeaderCell name="Dr. Javier Ruiz" spec="Rehabilitación" img="https://lh3.googleusercontent.com/aida-public/AB6AXuBwG04EJHWGcge4EI8EYDXwJsJrd0AEMNaGFvpdII4kgCU3BxciPrzFAN673DYvFlHmWZwmHSBcEHz7mS38AyPePtIM5HtfNbNy9-O3-RWthAZ5rLwCybfwoiZeslDkT0jymJvO3wTKFYmcq3wFrSM0YOB1Psaqavx8yPM013IObvNE7O6kPIJYtCeiZlcEApd4rZJZgeY9wCkrzbvLblsFBdfgPFVLCVHB1B5409kzGahqOrfvzqeELNOq8bXHHgEs9LOuAJMpmRkn" color="text-secondary" noBorder />
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar relative">
            <div className="absolute top-[320px] left-0 w-full flex items-center z-10 pointer-events-none">
              <div className="w-20 text-right pr-2 text-[10px] font-black text-error">11:30</div>
              <div className="flex-1 h-px bg-error/40 relative">
                <div className="absolute left-0 -top-1 w-2.5 h-2.5 bg-error rounded-full"></div>
              </div>
            </div>
            
            <div className="calendar-grid min-h-[1200px]">
              <div className="border-r border-surface-container-high bg-surface-container-low/30">
                {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'].map(t => (
                  <div key={t} className="h-24 border-b border-surface-container-high/50 flex items-start justify-center pt-2 text-[11px] font-bold text-slate-400">{t}</div>
                ))}
              </div>
              <div className="relative border-r border-surface-container-high p-1">
                <Appointment top="24px" h="68px" name="Ricardo Gómez" time="08:15" 
                             scheme={{bg: 'bg-primary-fixed/40', border: 'border-primary', text: 'text-on-primary-fixed'}}
                             status="Confirmed" badgeStatus="success" />
                <Appointment top="288px" h="90px" name="Sofía Valera" time="11:00" 
                             scheme={{bg: 'bg-primary-fixed/40', border: 'border-primary', text: 'text-on-primary-fixed'}}
                             status="Arrived" badgeStatus="processing" />
              </div>
              <div className="relative border-r border-surface-container-high p-1 bg-surface-container-low/10">
                <Appointment top="120px" h="90px" name="Marta Sánchez" time="09:15" 
                             scheme={{bg: 'bg-tertiary-fixed/40', border: 'border-tertiary', text: 'text-on-tertiary-fixed'}}
                             status="Confirmed" badgeStatus="success" />
              </div>
              <div className="relative p-1">
                <Appointment top="48px" h="140px" name="Ignacio López" time="08:30" 
                             scheme={{bg: 'bg-secondary-fixed/40', border: 'border-secondary', text: 'text-on-secondary-fixed'}}
                             status="Canceled" badgeStatus="error" tx="Rehab. Post-quirúrgica de rodilla (Sesión 4/12)" />
              </div>
            </div>
          </div>
        </Card>

        {/* Sidebar Mini Calendar & Avail */}
        <aside className="w-80 flex flex-col gap-6">
          <Card bordered={false} className="shadow-sm rounded-3xl" bodyStyle={{ padding: '24px' }}>
            <MiniCalendar />
          </Card>
          <Card bordered={false} className="shadow-sm rounded-3xl flex-1 flex flex-col" bodyStyle={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <QuickAvailability />
          </Card>
        </aside>
      </div>
      
      <Button 
        type="primary" 
        shape="circle" 
        icon={<PlusOutlined />} 
        size="large"
        className="fixed bottom-10 right-10 w-16 h-16 text-2xl shadow-2xl z-50 hover:scale-110 transition-transform flex items-center justify-center bg-gradient-to-br from-primary to-primary-container border-0"
      />
    </>
  );
}

function HeaderCell({ name, spec, img, color, noBorder }: any) {
  return (
    <div className={`h-16 px-6 flex items-center gap-4 ${noBorder ? '' : 'border-r border-surface-container-high'}`}>
      <img alt={name} className="w-8 h-8 rounded-full object-cover" src={img} />
      <div>
        <p className="text-sm font-bold mb-0">{name}</p>
        <p className={`text-[10px] ${color} font-bold uppercase tracking-wider mb-0`}>{spec}</p>
      </div>
    </div>
  );
}

function Appointment({ top, h, name, time, scheme, status, badgeStatus, tx }: any) {
  return (
    <Tooltip title={`${name} - ${time} (${status})`}>
      <div className={`absolute left-1 right-1 ${scheme.bg} border-l-4 ${scheme.border} rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-colors`} style={{ top, height: h }}>
        <div className="flex justify-between items-start mb-1">
          <p className={`text-[11px] font-black ${scheme.text} leading-tight mb-0`}>{name}</p>
          <span className={`text-[9px] bg-white/80 px-1.5 py-0.5 rounded-full font-bold shadow-sm ${scheme.text}`}>{time}</span>
        </div>
        {tx && <div className={`text-[9px] ${scheme.text} opacity-80 line-clamp-2 italic mb-0`}>{tx}</div>}
        <div className="flex items-center gap-1 mt-auto pt-1">
          <Badge status={badgeStatus} size="small" />
          <span className={`text-[9px] font-bold ${scheme.text} opacity-80 mb-0`}>{status}</span>
        </div>
      </div>
    </Tooltip>
  );
}

function MiniCalendar() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-black font-headline mb-0">Mayo 2024</p>
        <div className="flex gap-1">
          <Button type="text" shape="circle" icon={<LeftOutlined />} size="small" />
          <Button type="text" shape="circle" icon={<RightOutlined />} size="small" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
        <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Demo values */}
        <span className="text-[11px] p-2 text-slate-300">29</span>
        <span className="text-[11px] p-2 text-slate-300">30</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">1</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">2</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">3</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">4</span>
        <span className="text-[11px] p-2 bg-primary text-white rounded-full shadow-sm font-bold cursor-pointer">5</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">6</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">7</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">8</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">9</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">10</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">11</span>
        <span className="text-[11px] p-2 hover:bg-teal-50 rounded-lg cursor-pointer">12</span>
      </div>
    </div>
  );
}

function QuickAvailability() {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-sm font-black font-headline mb-4">Disponibilidad Rápida</h3>
      <div className="space-y-4 flex-1">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Seleccionar Especialista</label>
          <Select defaultValue="all" className="w-full" size="large" bordered={false} style={{ backgroundColor: '#f3f4f5', borderRadius: '8px' }}>
            <Option value="all">Todos los Especialistas</Option>
            <Option value="ms">Dr. Marcos Silva</Option>
            <Option value="lm">Dra. Lucía Méndez</Option>
          </Select>
        </div>
        <div className="pt-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Huecos Libres Hoy</p>
          <div className="space-y-2">
            {['12:30 - 13:30', '15:00 - 16:00', '17:30 - 18:30'].map(t => (
              <Button key={t} type="text" block className="h-auto p-3 flex justify-between items-center bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-xl transition-colors">
                <span className="text-xs">{t}</span>
                <PlusOutlined className="text-teal-600" />
              </Button>
            ))}
          </div>
        </div>
      </div>
      <Button type="primary" block className="mt-6 bg-secondary-container text-on-secondary-container border-0 font-black h-12 rounded-xl text-xs hover:brightness-105 shadow-sm">
        Asignación Automática
      </Button>
    </div>
  );
}
