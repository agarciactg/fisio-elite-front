import dayjs, { Dayjs } from 'dayjs';

interface MonthViewProps {
  date: Dayjs;
  appointments?: any[];
  loading?: boolean;
}

const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function MonthView({ date, appointments = [] }: MonthViewProps) {
  const today = dayjs();
  const startOfGrid = date.startOf('month').startOf('week');
  const days = Array.from({ length: 42 }).map((_, i) => startOfGrid.add(i, 'day'));

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 border-b bg-surface-container-low shrink-0">
        {DAY_LABELS.map(d => (
          <div key={d} className="h-10 flex items-center justify-center border-r last:border-r-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1 overflow-y-auto">
        {days.map((d, i) => {
          const isCurrentMonth = d.month() === date.month();
          const isToday = d.isSame(today, 'day');
          const isSelected = d.isSame(date, 'day');
          const dateStr = d.format('YYYY-MM-DD');

          const dayAppts = appointments.filter(a =>
            dayjs(a.start_time).format('YYYY-MM-DD') === dateStr
          );

          return (
            <div
              key={i}
              className={`
                min-h-[100px] p-2 border-b border-r transition-colors
                ${!isCurrentMonth ? 'bg-slate-50/50' : 'bg-white hover:bg-teal-50/20 cursor-pointer'}
                ${isSelected && isCurrentMonth ? 'ring-2 ring-inset ring-primary/30' : ''}
              `}
            >
              <span className={`
                text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1
                ${!isCurrentMonth ? 'text-slate-300' : isToday ? 'bg-primary text-white' : 'text-slate-600'}
              `}>
                {d.date()}
              </span>

              <div className="space-y-0.5">
                {dayAppts.slice(0, 3).map((a: any) => {
                  const patientName = a.patient
                    ? `${a.patient.first_name} ${a.patient.last_name}`
                    : '—';
                  const time = a.start_time
                    ? dayjs(a.start_time).format('HH:mm')
                    : '';
                  const statusKey = (a.status ?? '').toLowerCase();

                  return (
                    <div
                      key={a.id}
                      className={`
                        text-[10px] px-1.5 py-0.5 rounded font-semibold truncate
                        ${statusKey === 'canceled' ? 'bg-red-100 text-red-700'
                          : statusKey === 'arrived' ? 'bg-cyan-100 text-cyan-800'
                            : 'bg-teal-100 text-teal-800'}
                      `}
                    >
                      {time} {patientName}
                    </div>
                  );
                })}
                {dayAppts.length > 3 && (
                  <p className="text-[9px] text-slate-400 font-bold pl-1">
                    +{dayAppts.length - 3} más
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
