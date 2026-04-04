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

  async register(email: string, password: string, name: string): Promise<unknown> {
    return apiFetch('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  async getDashboardStats(): Promise<unknown> {
    return apiFetch('/api/v1/dashboard/stats');
  },

  async getTherapists(specialtyId?: string): Promise<{ id: string; name: string; specialty: string }[]> {
    const qs = specialtyId ? `?specialty=${specialtyId}` : '';
    return apiFetch(`/api/v1/therapists/${qs}`);
  },

  async getAppointments(): Promise<unknown[]> {
    return apiFetch('/api/v1/appointments/');
  },

  async createAppointment(data: Record<string, unknown>): Promise<{ success: boolean; id: string }> {
    return apiFetch('/api/v1/appointments/', { method: 'POST', body: JSON.stringify(data) });
  },

  async getPatients(): Promise<unknown[]> {
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
};
