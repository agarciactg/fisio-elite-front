import dayjs from 'dayjs';

export function MonthView() {
  const start = dayjs().startOf('month').startOf('week');

  const days = Array.from({ length: 42 }).map((_, i) =>
    start.add(i, 'day')
  );

  return (
    <div className="grid grid-cols-7 gap-2 p-4">
      {days.map((d, i) => (
        <div
          key={i}
          className="h-28 bg-white rounded-xl p-2 shadow-sm"
        >
          <div className="text-xs font-bold mb-1">
            {d.date()}
          </div>

          {/* demo citas */}
          {i % 5 === 0 && (
            <div className="text-[10px] bg-teal-100 px-1 rounded">
              08:00 Cita
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
