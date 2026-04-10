import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';


export function useNow(intervalMs = 60_000): Dayjs {
  const [now, setNow] = useState<Dayjs>(dayjs());

  useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}