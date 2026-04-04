import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PatientLayout } from '../components/layout/PatientLayout';
import { DashboardPage } from '../views/Dashboard/DashboardPage';
import { CalendarPage } from '../views/Calendar/CalendarPage';
import { BookingPage } from '../views/Booking/BookingPage';
import { getToken } from '../services/api';
import { LoginPage } from '../views/Login/LoginPage';

function PrivateRoute() {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function PublicOnlyRoute() {
  const token = getToken();
  if (token) return <Navigate to="/" replace />;
  return <Outlet />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<PublicOnlyRoute />}>
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={() => window.location.replace('/')} />}
          />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="calendar" element={<CalendarPage />} />
          </Route>
        </Route>

        <Route path="/booking" element={<PatientLayout />}>
          <Route index element={<BookingPage />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to={getToken() ? '/' : '/login'} replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}
