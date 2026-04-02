import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PatientLayout } from '../components/layout/PatientLayout';
import { DashboardPage } from '../views/Dashboard/DashboardPage';
import { CalendarPage } from '../views/Calendar/CalendarPage';
import { BookingPage } from '../views/Booking/BookingPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="calendar" element={<CalendarPage />} />
        </Route>
        <Route path="/booking" element={<PatientLayout />}>
          <Route index element={<BookingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
