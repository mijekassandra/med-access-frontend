import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface PregnancyRecord {
  _id: string;
  user_id: number;
  doctor_id: number;
  startDate: Date;
  gestationalAge: number;
  milestone: string;
  notes: string;
  status: 'ongoing' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface PregnancyRecordCreate {
  patient_id: number;
  doctor_id: number;
  startDate: Date;
  gestationalAge: number;
  milestone: string;
  notes: string;
  status: 'ongoing' | 'completed';
}

export interface PregnancyRecordUpdate {
  patient_id?: number;
  doctor_id?: number;
  startDate?: Date;
  gestationalAge?: number;
  milestone?: string;
  notes?: string;
  status?: 'ongoing' | 'completed';
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
  }),
});

export const {
  useGetPregnancyRecordsQuery,
  useGetPregnancyRecordByIdQuery,
  useCreatePregnancyRecordMutation,
  useUpdatePregnancyRecordMutation,
  useDeletePregnancyRecordMutation
} = pregnancyRecordApi;
