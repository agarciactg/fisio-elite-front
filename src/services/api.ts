export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  document_number?: string;
  phone_number?: string;
}

export interface Therapist {
  id: number;
  first_name: string;
  last_name: string;
  specialty: string;
  document_number?: string;
  email?: string;
  is_active: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function getToken(): string | null {
  return localStorage.getItem('fisio_token') ?? sessionStorage.getItem('fisio_token');
}

export function clearToken() {
  localStorage.removeItem('fisio_token');
  sessionStorage.removeItem('fisio_token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...options?.headers },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.detail ?? `Error ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export const fisioEliteApiService = {

  async login(email: string, password: string): Promise<{ access_token: string; token_type: string }> {
    const body = new URLSearchParams({
      grant_type: 'password',
      username: email,
      password,
      scope: '',
      client_id: '',
      client_secret: '',
    });

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.detail ?? `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  },

  async register(email: string, password: string, name: string, document_number: string): Promise<unknown> {
    return apiFetch('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, document_number }),
    });
  },

  async getDashboardStats(): Promise<unknown> {
    return apiFetch('/api/v1/dashboard/stats');
  },

  async getTherapists(specialtyId?: string): Promise<Therapist[]> {
    const qs = specialtyId ? `?specialty=${specialtyId}` : '';
    return apiFetch(`/api/v1/therapists/${qs}`);
  },

  async getAppointments(): Promise<unknown[]> {
    return apiFetch('/api/v1/appointments/');
  },

  async createAppointment(data: Record<string, unknown>): Promise<{ success: boolean; id: string }> {
    return apiFetch('/api/v1/appointments/', { method: 'POST', body: JSON.stringify(data) });
  },

  async getAppointmentsByDay(date: string, therapistId?: number): Promise<any[]> {
    const qs = new URLSearchParams({ date });
    if (therapistId) qs.set('therapist_id', String(therapistId));
    return apiFetch(`/api/v1/appointments/by-day?${qs}`);
  },
  async getAppointmentsByWeek(date: string, therapistId?: number): Promise<any[]> {
    const qs = new URLSearchParams({ date });
    if (therapistId) qs.set('therapist_id', String(therapistId));
    return apiFetch(`/api/v1/appointments/by-week?${qs}`);
  },
  async getAppointmentsByMonth(year: number, month: number, therapistId?: number): Promise<any[]> {
    const qs = new URLSearchParams({ year: String(year), month: String(month) });
    if (therapistId) qs.set('therapist_id', String(therapistId));
    return apiFetch(`/api/v1/appointments/by-month?${qs}`);
  },

  async getPatients(): Promise<Patient[]> {
    return apiFetch('/api/v1/patients/');
  },

  async createPatient(data: Record<string, unknown>): Promise<unknown> {
    return apiFetch('/api/v1/patients/', { method: 'POST', body: JSON.stringify(data) });
  },

  async getPayments(): Promise<unknown[]> {
    return apiFetch('/api/v1/payments/');
  },

  async createPayment(data: Record<string, unknown>): Promise<unknown> {
    return apiFetch('/api/v1/payments/', { method: 'POST', body: JSON.stringify(data) });
  },

  async updateAppointment(id: number, data: Record<string, any>): Promise<any> {
    return apiFetch(`/api/v1/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async cancelAppointment(id: number): Promise<any> {
    return apiFetch(`/api/v1/appointments/${id}/cancel`, {
      method: 'POST'
    });
  },

  async getFreeSlots(date: string, therapistId?: number, slotMinutes = 60): Promise<{ start: string; end: string; label: string }[]> {
    const qs = new URLSearchParams({ date, slot_minutes: String(slotMinutes) });
    if (therapistId) qs.set('therapist_id', String(therapistId));
    return apiFetch(`/api/v1/appointments/free-slots?${qs}`);
  },

};
