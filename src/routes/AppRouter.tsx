import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PatientLayout } from '../components/layout/PatientLayout';
import { DashboardPage } from '../views/Dashboard/DashboardPage';
import { CalendarPage } from '../views/Calendar/CalendarPage';
import { PatientsPage } from '../views/Patients/PatientsPage';
import { BookingPage } from '../views/Booking/BookingPage';
import { LoginPage } from '../views/Login/LoginPage';
import { getToken, type UserRole } from '../services/api';
import { getRole } from '../helpers/token';


function PrivateRoute() {
  return getToken() ? <Outlet /> : <Navigate to="/login" replace />;
}
function PublicOnlyRoute() {
  return getToken() ? <Navigate to="/" replace /> : <Outlet />;
}

function RoleRoute({ allowed }: { allowed: UserRole[] }) {
  const role = getRole();
  if (!role) return <Navigate to="/login" replace />;
  return allowed.includes(role) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
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

            <Route element={<RoleRoute allowed={['admin']} />}>
              <Route index element={<DashboardPage />} />
            </Route>

            <Route element={<RoleRoute allowed={['admin', 'therapist']} />}>
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="patients" element={<PatientsPage />} />
            </Route>

          </Route>
        </Route>

        <Route path="/booking" element={<PatientLayout />}>
          <Route index element={<BookingPage />} />
        </Route>
        <Route
          path="/unauthorized"
          element={<UnauthorizedPage />}
        />

        <Route
          path="*"
          element={<Navigate to={getToken() ? '/' : '/login'} replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

function UnauthorizedPage() {
  const role = getRole();
  const homeByRole: Record<UserRole, string> = {
    admin: '/',
    therapist: '/calendar',
    patient: '/booking',
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
      <div className="text-6xl">🔒</div>
      <h1 className="text-2xl font-black text-on-surface font-headline tracking-tight">
        Acceso denegado
      </h1>
      <p className="text-sm text-slate-500">No tienes permisos para ver esta página.</p>
      {role && (
        <a
          href={homeByRole[role]}
          className="text-sm font-bold text-primary underline"
        >
          Volver a mi área
        </a>
      )}
    </div>
  );
}
