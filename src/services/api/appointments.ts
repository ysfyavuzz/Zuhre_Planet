/**
 * Appointments API Service
 * 
 * @module services/api/appointments
 * @category API Services
 * 
 * Handles all appointment-related API calls:
 * - Creating and managing appointments
 * - Appointment status updates
 * - Appointment history
 * 
 * @example
 * ```typescript
 * import { appointmentsService } from './appointments';
 * 
 * const appointment = await appointmentsService.create({
 *   escortId: '123',
 *   date: '2024-01-15',
 *   duration: 2,
 * });
 * ```
 */

import { apiClient } from './client';

/**
 * Appointment types
 */
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  clientId: string;
  escortId: string;
  escort: {
    id: string;
    name: string;
    avatar?: string;
  };
  date: string;
  time: string;
  duration: number; // in hours
  location: string;
  price: number;
  status: AppointmentStatus;
  notes?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Appointment request types
 */
export interface CreateAppointmentRequest {
  escortId: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  date?: string;
  time?: string;
  duration?: number;
  location?: string;
  notes?: string;
}

/**
 * Appointments Service
 */
export const appointmentsService = {
  /**
   * Create a new appointment
   * 
   * @param data - Appointment data
   * @returns Created appointment
   */
  async create(data: CreateAppointmentRequest): Promise<Appointment> {
    const response = await apiClient.post<Appointment>('/appointments', data);
    return response.data;
  },

  /**
   * Get user's appointments
   * 
   * @param status - Filter by status
   * @returns List of appointments
   */
  async getMyAppointments(status?: AppointmentStatus): Promise<Appointment[]> {
    const response = await apiClient.get<Appointment[]>('/appointments/my', {
      params: status ? { status } : undefined,
    });
    return response.data;
  },

  /**
   * Get appointment by ID
   * 
   * @param id - Appointment ID
   * @returns Appointment details
   */
  async getById(id: string): Promise<Appointment> {
    const response = await apiClient.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },

  /**
   * Update appointment
   * 
   * @param id - Appointment ID
   * @param data - Update data
   * @returns Updated appointment
   */
  async update(id: string, data: UpdateAppointmentRequest): Promise<Appointment> {
    const response = await apiClient.patch<Appointment>(`/appointments/${id}`, data);
    return response.data;
  },

  /**
   * Confirm appointment
   * 
   * @param id - Appointment ID
   * @returns Confirmed appointment
   */
  async confirm(id: string): Promise<Appointment> {
    const response = await apiClient.post<Appointment>(`/appointments/${id}/confirm`);
    return response.data;
  },

  /**
   * Cancel appointment
   * 
   * @param id - Appointment ID
   * @param reason - Cancellation reason
   * @returns Cancelled appointment
   */
  async cancel(id: string, reason?: string): Promise<Appointment> {
    const response = await apiClient.post<Appointment>(`/appointments/${id}/cancel`, {
      reason,
    });
    return response.data;
  },

  /**
   * Complete appointment
   * 
   * @param id - Appointment ID
   * @returns Completed appointment
   */
  async complete(id: string): Promise<Appointment> {
    const response = await apiClient.post<Appointment>(`/appointments/${id}/complete`);
    return response.data;
  },

  /**
   * Delete appointment
   * 
   * @param id - Appointment ID
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/appointments/${id}`);
  },

  /**
   * Get upcoming appointments
   * 
   * @returns List of upcoming appointments
   */
  async getUpcoming(): Promise<Appointment[]> {
    const response = await apiClient.get<Appointment[]>('/appointments/upcoming');
    return response.data;
  },

  /**
   * Get past appointments
   * 
   * @returns List of past appointments
   */
  async getPast(): Promise<Appointment[]> {
    const response = await apiClient.get<Appointment[]>('/appointments/past');
    return response.data;
  },

  /**
   * Check escort availability
   * 
   * @param escortId - Escort ID
   * @param date - Date to check
   * @returns Available time slots
   */
  async checkAvailability(
    escortId: string,
    date: string
  ): Promise<{ time: string; available: boolean }[]> {
    const response = await apiClient.get<{ time: string; available: boolean }[]>(
      `/appointments/availability/${escortId}`,
      {
        params: { date },
      }
    );
    return response.data;
  },
};

export default appointmentsService;
