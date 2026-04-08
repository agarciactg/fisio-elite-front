import dayjs from 'dayjs';
import { getWeekDays } from '../helpers/getWeekDays';
import { Appointment } from '../components/Appointment';

export function WeekView() {
  const days = getWeekDays(dayjs());

  return (
    <>
      <div className="calendar-grid border-b bg-surface-container-low">
        <div className="h-16 border-r" />

        {days.map((d, i) => (
          <div key={i} className="h-16 flex items-center justify-center border-r">
            <div className="text-center">
              <p className="text-xs font-bold">
                {d.format('ddd').toUpperCase()}
              </p>
              <p className="text-sm font-black">
                {d.format('DD')}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto relative">
        <div className="calendar-grid min-h-[1200px]">

          <div className="border-r bg-surface-container-low/30">
            {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'].map(t => (
              <div key={t} className="h-24 border-b flex items-start justify-center pt-2 text-[11px] text-slate-400">
                {t}
              </div>
            ))}
          </div>

          {days.map((d, i) => (
            <div key={i} className="relative border-r p-1">

              {i === 1 && (
                <Appointment
                  top="40px"
                  h="80px"
                  name="Paciente X"
                  time="09:00"
                />
              )}

            </div>
          ))}

        </div>
      </div>
    </>
  );
}
