import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface MedicalRecord {
  _id: string;
  patient: Patient;
  diagnosis: string;
  dateOfRecord: string;
  treatmentPlan: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecordCreate {
  patient: string; // MongoDB ObjectId of the patient user
  diagnosis: string;
  dateOfRecord: string; // ISO date string
  treatmentPlan: string;
}

export interface MedicalRecordUpdate {
  diagnosis?: string;
  dateOfRecord?: string; // ISO date string
  treatmentPlan?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface MedicalRecordListResponse {
  success: boolean;
  count: number;
  data: MedicalRecord[];
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

export const medicalRecordsApi = createApi({
  reducerPath: "medicalRecordsApi",
  baseQuery: baseQuery,
  tagTypes: ["MedicalRecord"],
  endpoints: (builder) => ({
    // Get all medical records -------------------------------------------------------------------
    getMedicalRecords: builder.query<MedicalRecordListResponse, void>({
      query: () => "/medical-records",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(
                ({ _id }) => ({ type: "MedicalRecord", id: _id } as const)
              ),
              { type: "MedicalRecord", id: "LIST" },
            ]
          : [{ type: "MedicalRecord", id: "LIST" }],
    }),

    // Get medical record by ID -------------------------------------------------------------------
    getMedicalRecordById: builder.query<ApiResponse<MedicalRecord>, string>({
      query: (id) => `/medical-records/${id}`,
      providesTags: (_result, _error, id) => [{ type: "MedicalRecord", id }],
    }),

    // Create medical record -------------------------------------------------------------------
    createMedicalRecord: builder.mutation<ApiResponse<MedicalRecord>, MedicalRecordCreate>({
      query: (medicalRecordData) => ({
        url: "/medical-records",
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: medicalRecordData,
      }),
      invalidatesTags: [{ type: "MedicalRecord", id: "LIST" }],
    }),

    // Update medical record -------------------------------------------------------------------
    updateMedicalRecord: builder.mutation<ApiResponse<MedicalRecord>, { id: string; data: MedicalRecordUpdate }>({
      query: ({ id, data }) => ({
        url: `/medical-records/${id}`,
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "MedicalRecord", id: "LIST" },
        { type: "MedicalRecord", id },
      ],
    }),

    // Delete medical record -------------------------------------------------------------------
    deleteMedicalRecord: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({
        url: `/medical-records/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "MedicalRecord", id: "LIST" },
        { type: "MedicalRecord", id },
      ],
    }),
  }),
});

export const {
  useGetMedicalRecordsQuery,
  useGetMedicalRecordByIdQuery,
  useCreateMedicalRecordMutation,
  useUpdateMedicalRecordMutation,
  useDeleteMedicalRecordMutation
} = medicalRecordsApi;
