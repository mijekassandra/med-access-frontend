import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types based on backend API documentation
export interface AppointmentPatient {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface Appointment {
  _id: string;
  patient: AppointmentPatient;
  type: "telemedicine" | "in-person";
  status: "pending" | "accepted" | "serving" | "completed" | "denied";
  date: string; // ISO 8601 date string
  reason: string;
  queueNumber: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentCreate {
  type: "telemedicine" | "in-person";
  date: string; // ISO 8601 date string
  reason: string;
  patient?: string; // Patient ID (optional, defaults to authenticated user)
}

export interface AppointmentUpdate {
  type?: "telemedicine" | "in-person";
  date?: string; // ISO 8601 date string
  reason?: string;
}

export interface AppointmentStatusUpdate {
  status: "pending" | "accepted" | "serving" | "completed" | "denied";
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface AppointmentListResponse {
  success: boolean;
  count: number;
  data: Appointment[];
}

const baseUrl = import.meta.env.VITE_APP_BE_URL || 'http://localhost:3001';

const baseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl}/api`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  baseQuery: baseQuery,
  tagTypes: ["Appointment"],
  endpoints: (builder) => ({
    // Get all appointments -------------------------------------------------------------------
    getAppointments: builder.query<AppointmentListResponse, { date?: string } | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params?.date) {
          searchParams.append('date', params.date);
        }
        return {
          url: `/appointments${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(
                ({ _id }) => ({ type: "Appointment", id: _id } as const)
              ),
              { type: "Appointment", id: "LIST" },
            ]
          : [{ type: "Appointment", id: "LIST" }],
    }),

    // Get appointment by ID ------------------------------------------------
    getAppointmentById: builder.query<ApiResponse<Appointment>, string>({
      query: (id) => `/appointments/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Appointment", id }],
    }),

    // Create appointment (admin can set for user) -------------------------------------------------------------------
    createAppointment: builder.mutation<ApiResponse<Appointment>, AppointmentCreate>({
      query: (appointmentData) => ({
        url: "/appointments",
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: appointmentData,
      }),
      invalidatesTags: [{ type: "Appointment", id: "LIST" }],
    }),

    // Update appointment (only when status is pending) -------------------------------------------------------------------
    updateAppointment: builder.mutation<ApiResponse<Appointment>, { id: string; data: AppointmentUpdate }>({
      query: ({ id, data }) => ({
        url: `/appointments/${id}`,
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Appointment", id: "LIST" },
        { type: "Appointment", id },
      ],
    }),

    // Update appointment status -------------------------------------------------------------------
    updateAppointmentStatus: builder.mutation<ApiResponse<Appointment>, { id: string; status: AppointmentStatusUpdate["status"] }>({
      query: ({ id, status }) => ({
        url: `/appointments/${id}/status`,
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Appointment", id: "LIST" },
        { type: "Appointment", id },
      ],
    }),

    // Accept appointment -------------------------------------------------------------------
    acceptAppointment: builder.mutation<ApiResponse<Appointment>, string>({
      query: (id) => ({
        url: `/appointments/${id}/accept`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Appointment", id: "LIST" },
        { type: "Appointment", id },
      ],
    }),

    // Delete appointment -------------------------------------------------------------------
    deleteAppointment: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({
        url: `/appointments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Appointment", id: "LIST" },
        { type: "Appointment", id },
      ],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useUpdateAppointmentStatusMutation,
  useAcceptAppointmentMutation,
  useDeleteAppointmentMutation
} = appointmentApi;