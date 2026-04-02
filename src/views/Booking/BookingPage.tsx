import { Card, Button, Alert } from 'antd';
import { 
  RightOutlined, 
  LeftOutlined, 
  CheckCircleFilled, 
  MedicineBoxOutlined, 
  TeamOutlined, 
  CalendarOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useState } from 'react';

export function BookingPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('osteopatia');
  const [selectedDoc, setSelectedDoc] = useState('lucia');
  const [selectedTime, setSelectedTime] = useState('10:00');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Booking Steps */}
      <div className="col-span-12 lg:col-span-8 space-y-8">
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Nueva Cita</h1>
          <p className="text-on-surface-variant">Reserva tu sesión de bienestar en pocos pasos.</p>
        </div>

        <StepOne active={selectedSpecialty} onSelect={setSelectedSpecialty} />
        <StepTwo active={selectedDoc} onSelect={setSelectedDoc} />
        <StepThree activeTime={selectedTime} onSelectTime={setSelectedTime} />
      </div>

      {/* Right Column: Resumen de Cita */}
      <aside className="col-span-12 lg:col-span-4">
        <div className="sticky top-24 space-y-6">
          <BookingSummary />
          <Alert
            message="Política de Cancelación"
            description="Puedes cancelar o reprogramar sin coste hasta 24 horas antes de tu cita."
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            className="rounded-xl border-primary/10 bg-primary/5"
          />
        </div>
      </aside>
    </div>
  );
}

function StepOne({ active, onSelect }: any) {
  return (
    <Card bordered={false} className="shadow-sm rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">1</span>
        <h2 className="text-xl font-bold font-headline mb-0">Seleccionar Especialidad</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SpecialtyCard id="fisioterapia" active={active === 'fisioterapia'} onClick={() => onSelect('fisioterapia')} icon={<MedicineBoxOutlined />} title="Fisioterapia Deportiva" desc="Tratamiento para lesiones de alto rendimiento." />
        <SpecialtyCard id="osteopatia" active={active === 'osteopatia'} onClick={() => onSelect('osteopatia')} icon={<TeamOutlined />} title="Osteopatía" desc="Equilibrio integral de tu estructura corporal." />
        <SpecialtyCard id="rehab" active={active === 'rehab'} onClick={() => onSelect('rehab')} icon={<MedicineBoxOutlined />} title="Rehabilitación" desc="Recuperación post-quirúrgica." />
      </div>
    </Card>
  );
}

function SpecialtyCard({ active, onClick, icon, title, desc }: any) {
  const stateClass = active ? "bg-primary-container/20 ring-2 ring-primary" : "bg-surface-container-lowest hover:ring-2 hover:ring-primary";
  return (
    <div onClick={onClick} className={`group p-5 rounded-xl text-left transition-all cursor-pointer ${stateClass}`}>
      <div className="text-primary text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-on-surface mb-1">{title}</h3>
      <p className="text-xs text-on-surface-variant mb-0">{desc}</p>
    </div>
  );
}

function StepTwo({ active, onSelect }: any) {
  return (
    <Card bordered={false} className="shadow-sm rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">2</span>
        <h2 className="text-xl font-bold font-headline mb-0">Elegir Especialista</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <SpecialistCard id="cualquiera" active={active === 'cualquiera'} onClick={() => onSelect('cualquiera')} name="Cualquier Profesional" spec="Asignación automática" img="" />
        <SpecialistCard id="marcos" active={active === 'marcos'} onClick={() => onSelect('marcos')} name="Dr. Marcos Silva" spec="Esp. en Deporte" img="https://lh3.googleusercontent.com/aida-public/AB6AXuBVbNIb8wB4tF2fRn8F2sOvPrIAKktl3M0HIV6uOHFgAm1_-1zvq7Ss-CrGfIPj8skhhI7DcoCOx7CdEky1yFfOD6gnKngVScwCxZX0rEMmHWP95Z7k3ac4U9e2MguUoKgklztvrd-fWDPHEZInxh3fkx5LcTROFUK7xLmetvy_04JO17y2tocMTAvxaZnbyYy7KJHUfzarWZSuyYTIfNkfEmpL8bTvSuwVjDMGXofKjyrrREpqKsXKPP7oojETD5aWzUPK962rwH6X" />
        <SpecialistCard id="lucia" active={active === 'lucia'} onClick={() => onSelect('lucia')} name="Dra. Lucía Méndez" spec="Osteópata Senior" img="https://lh3.googleusercontent.com/aida-public/AB6AXuAJ8OU_dJJMM2buGFVEWy9ic0vJjCYhN2RoiOfWqmNbesonEbmBAS3EeEQ9BPN8z3GmoiymHCaPWzGAOK0PX2LMTJpDvy8GNIhpgGIfslKTc1cLygqgWMxDA3Rnjyl1h8r3ZDyNNu7Bqqa0x_tPfRLfBa32EeOs4KIHmgEaVtnk1z921kH9uYUrMpmElTBKYyW7lEWgyxcuP0iqG6MlFMYhWz3WsOrB_2ajAWXvpGoYGWfim3Bqv9UceKxeXdeIaKNeK6M9YINOD6pG" />
      </div>
    </Card>
  );
}

function SpecialistCard({ active, onClick, name, spec, img }: any) {
  const stateClass = active ? "ring-2 ring-primary" : "ring-1 ring-outline-variant/30 hover:ring-primary";
  return (
    <div onClick={onClick} className={`flex flex-col items-center justify-center p-6 bg-surface-container-lowest rounded-xl transition-all cursor-pointer relative ${stateClass}`}>
      {active && (
        <CheckCircleFilled className="absolute top-2 right-2 text-primary" />
      )}
      {img ? (
        <img className="w-16 h-16 rounded-full object-cover mb-3" src={img} alt={name} />
      ) : (
        <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-3">
          <TeamOutlined className="text-3xl text-outline" />
        </div>
      )}
      <h3 className="font-bold text-sm mb-0">{name}</h3>
      <p className="text-xs text-on-surface-variant mb-0">{spec}</p>
    </div>
  );
}

function StepThree({ activeTime, onSelectTime }: any) {
  return (
    <Card bordered={false} className="shadow-sm rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">3</span>
        <h2 className="text-xl font-bold font-headline mb-0">Seleccionar Fecha y Hora</h2>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold mb-0">Octubre 2023</h4>
            <div className="flex gap-2">
              <Button type="text" shape="circle" icon={<LeftOutlined />} />
              <Button type="text" shape="circle" icon={<RightOutlined />} />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4">
            <span className="text-outline">LU</span><span className="text-outline">MA</span><span className="text-outline">MI</span><span className="text-outline">JU</span><span className="text-outline">VI</span><span className="text-outline">SA</span><span className="text-outline">DO</span>
            <div className="py-2.5 rounded-full hover:bg-surface-variant cursor-pointer">12</div>
            <div className="py-2.5 rounded-full hover:bg-surface-variant cursor-pointer">13</div>
            <div className="py-2.5 rounded-full hover:bg-surface-variant cursor-pointer">14</div>
            <div className="py-2.5 rounded-full bg-primary text-white font-bold cursor-pointer shadow-md">15</div>
            <div className="py-2.5 rounded-full hover:bg-surface-variant cursor-pointer">16</div>
            <div className="py-2.5 rounded-full text-outline/50 cursor-not-allowed">17</div>
            <div className="py-2.5 rounded-full text-outline/50 cursor-not-allowed">18</div>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-bold mb-4">Horarios Disponibles</h4>
          <div className="grid grid-cols-3 gap-2">
            {['09:00', '10:00', '11:30', '13:00', '16:30', '18:00'].map(t => (
               <Button
                key={t}
                type={activeTime === t ? 'primary' : 'default'}
                className={`w-full rounded-xl ${activeTime === t ? 'bg-primary-container text-on-primary-container border-0' : ''}`}
                onClick={() => onSelectTime(t)}
               >
                 {t}
               </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function BookingSummary() {
  return (
    <Card bordered={false} className="shadow-sm rounded-xl">
      <h2 className="text-2xl font-extrabold mb-6 font-headline">Resumen de Cita</h2>
      <ul className="space-y-6 m-0 p-0" style={{ listStyle: 'none' }}>
        <li className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center shrink-0">
            <MedicineBoxOutlined className="text-primary text-xl" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-0">Especialidad</p>
            <p className="font-bold mb-0">Osteopatía</p>
          </div>
        </li>
        <li className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary-container/30 flex items-center justify-center shrink-0">
            <TeamOutlined className="text-secondary text-xl" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-0">Profesional</p>
            <p className="font-bold mb-0">Dra. Lucía Méndez</p>
          </div>
        </li>
        <li className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-tertiary-fixed-dim/20 flex items-center justify-center shrink-0">
            <CalendarOutlined className="text-tertiary text-xl" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-0">Fecha y Hora</p>
            <p className="font-bold mb-0">15 de Octubre, 10:00 AM</p>
          </div>
        </li>
      </ul>
      <div className="mt-8 pt-6 border-t border-surface-container">
        <div className="flex justify-between items-center mb-6">
          <span className="text-on-surface-variant font-medium">Sesión inicial (60 min)</span>
          <span className="text-xl font-extrabold font-headline">65,00€</span>
        </div>
        <Button 
           type="primary" 
           size="large" 
           className="w-full bg-gradient-to-br from-primary to-primary-container h-12 rounded-xl font-bold border-0 shadow-lg"
           icon={<RightOutlined />} 
           iconPosition="end"
        >
          Confirmar Reserva
        </Button>
      </div>
    </Card>
  );
}
