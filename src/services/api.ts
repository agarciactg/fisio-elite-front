/**
 * Simulated API Service Layer
 * In a real application, Axios or Fetch would be used here to connect to the backend context.
 */

// export const API_BASE_URL = 'https://api.fisioelite.com/v1';

export const fisioEliteApiService = {
  /**
   * Fetches the dashboard administrative data
   */
  async getDashboardStats() {
    // Simulated fetch
    // const response = await fetch(`${API_BASE_URL}/admin/finance-stats`);
    // return response.json();
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          revenue: '€42,850.00',
          appointmentsCompleted: 1284,
          newPatients: 156,
          attendanceRatio: 94.8
        });
      }, 500);
    });
  },

  /**
   * Retrieves available therapists for booking
   */
  async getTherapists(_specialtyId?: string) {
    // const response = await fetch(`${API_BASE_URL}/therapists${specialtyId ? `?specialty=${specialtyId}` : ''}`);
    return Promise.resolve([
      { id: '1', name: 'Dr. Marcos Silva', specialty: 'Deporte' },
      { id: '2', name: 'Dra. Lucía Méndez', specialty: 'Osteopatía' }
    ]);
  },

  /**
   * Creates a new booking appointment
   */
  async createAppointment(appointmentData: any) {
    // return await axios.post(`${API_BASE_URL}/appointments`, appointmentData);
    console.log('Sending appointment to server:', appointmentData);
    return Promise.resolve({ success: true, bookingId: 'BOOK-' + Math.floor(Math.random() * 1000) });
  }
};
