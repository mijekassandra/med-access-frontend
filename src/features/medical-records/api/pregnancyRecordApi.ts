import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface Checkup {
  date: string;
  remarks: string;
}

export interface PregnancyRecord {
  _id: string;
  patient: Patient | null; // Can be null if patient was deleted
  firstDayOfLastPeriod: string;
  numberOfWeeks: number;
  status: string;
  remarks: string;
  checkups: Checkup[];
  createdAt: string;
  updatedAt: string;
}

export interface PregnancyRecordCreate {
  patient: string; // MongoDB ObjectId of the patient user
  firstDayOfLastPeriod: string; // ISO date string
  numberOfWeeks: number; // 0-45
  status?: string; // Optional, max 100 characters
  remarks?: string; // Optional, max 2000 characters
  checkups?: Checkup[]; // Optional array of checkups
}

export interface PregnancyRecordUpdate {
  firstDayOfLastPeriod?: string; // ISO date string
  numberOfWeeks?: number; // 0-45
  status?: string; // Optional, max 100 characters (can be empty string)
  remarks?: string; // Optional, max 2000 characters (can be empty string)
}

export interface AddCheckupRequest {
  date: string; // ISO date string
  remarks: string; // Max 1000 characters
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface PregnancyRecordListResponse {
  success: boolean;
  count: number;
  data: PregnancyRecord[];
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

export const pregnancyRecordApi = createApi({
  reducerPath: "pregnancyRecordApi",
  baseQuery: baseQuery,
  tagTypes: ["PregnancyRecord"],
  endpoints: (builder) => ({
    // Get all pregnancy records -------------------------------------------------------------------
    getPregnancyRecords: builder.query<PregnancyRecordListResponse, void>({
      query: () => "/pregnancy-records",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(
                ({ _id }) => ({ type: "PregnancyRecord", id: _id } as const)
              ),
              { type: "PregnancyRecord", id: "LIST" },
            ]
          : [{ type: "PregnancyRecord", id: "LIST" }],
    }),

    // Get pregnancy record by ID -------------------------------------------------------------------
    getPregnancyRecordById: builder.query<ApiResponse<PregnancyRecord>, string>({
      query: (id) => `/pregnancy-records/${id}`,
      providesTags: (_result, _error, id) => [{ type: "PregnancyRecord", id }],
    }),

    // Create pregnancy record -------------------------------------------------------------------
    createPregnancyRecord: builder.mutation<ApiResponse<PregnancyRecord>, PregnancyRecordCreate>({
      query: (pregnancyRecordData) => ({
        url: "/pregnancy-records",
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: pregnancyRecordData,
      }),
      invalidatesTags: [{ type: "PregnancyRecord", id: "LIST" }],
    }),

    // Update pregnancy record -------------------------------------------------------------------
    updatePregnancyRecord: builder.mutation<ApiResponse<PregnancyRecord>, { id: string; data: PregnancyRecordUpdate }>({
      query: ({ id, data }) => ({
        url: `/pregnancy-records/${id}`,
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "PregnancyRecord", id: "LIST" },
        { type: "PregnancyRecord", id },
      ],
    }),

    // Delete pregnancy record -------------------------------------------------------------------
    deletePregnancyRecord: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({
        url: `/pregnancy-records/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "PregnancyRecord", id: "LIST" },
        { type: "PregnancyRecord", id },
      ],
    }),

    // Add checkup to pregnancy record -------------------------------------------------------------------
    addCheckup: builder.mutation<ApiResponse<PregnancyRecord>, { id: string; data: AddCheckupRequest }>({
      query: ({ id, data }) => ({
        url: `/pregnancy-records/${id}/checkups`,
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "PregnancyRecord", id: "LIST" },
        { type: "PregnancyRecord", id },
      ],
    }),
  }),
});

export const {
  useGetPregnancyRecordsQuery,
  useGetPregnancyRecordByIdQuery,
  useCreatePregnancyRecordMutation,
  useUpdatePregnancyRecordMutation,
  useDeletePregnancyRecordMutation,
  useAddCheckupMutation,
} = pregnancyRecordApi;
