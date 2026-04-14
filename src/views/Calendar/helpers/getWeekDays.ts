import { Dayjs } from 'dayjs';

export function getWeekDays(date: Dayjs) {
  const start = date.startOf('week');

  return Array.from({ length: 7 }).map((_, i) =>
    start.add(i, 'day')
  );
}
