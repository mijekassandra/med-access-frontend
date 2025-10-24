import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types based on backend API documentation
export interface HealthEducationItem {
  _id: string;
  title: string;
  headline: string;
  contentType: 'article' | 'video';
  body: string;
  url?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HealthEducationCreate {
  title: string;
  headline: string;
  contentType: 'article' | 'video';
  body: string;
  url?: string | null;
}

export interface HealthEducationUpdate {
  title?: string;
  headline?: string;
  contentType?: 'article' | 'video';
  body?: string;
  url?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface HealthEducationListResponse {
  success: boolean;
  count: number;
  data: HealthEducationItem[];
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

export const healthEducationApi = createApi({
  reducerPath: "healthEducationApi",
  baseQuery: baseQuery,
  tagTypes: ["HealthEducation"],
  endpoints: (builder) => ({
    // Get all health education items -------------------------------------------------------------------
    getHealthEducation: builder.query<HealthEducationListResponse, void>({
      query: () => "/health-education",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(
                ({ _id }) => ({ type: "HealthEducation", id: _id } as const)
              ),
              { type: "HealthEducation", id: "LIST" },
            ]
          : [{ type: "HealthEducation", id: "LIST" }],
    }),

    // Get health education by ID --------------------------------------------------
    getHealthEducationById: builder.query<ApiResponse<HealthEducationItem>, string>({
      query: (id) => `/health-education/${id}`,
      providesTags: (_result, _error, id) => [{ type: "HealthEducation", id }],
    }),

    // Create health education item -------------------------------------------------------------------
    createHealthEducation: builder.mutation<ApiResponse<HealthEducationItem>, HealthEducationCreate>({
      query: (healthEducationData) => ({
        url: "/health-education",
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: healthEducationData,
      }),
      invalidatesTags: [{ type: "HealthEducation", id: "LIST" }],
    }),

    // Update health education item -------------------------------------------------------------------
    updateHealthEducation: builder.mutation<ApiResponse<HealthEducationItem>, { id: string; data: HealthEducationUpdate }>({
      query: ({ id, data }) => ({
        url: `/health-education/${id}`,
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "HealthEducation", id: "LIST" },
        { type: "HealthEducation", id },
      ],
    }),

    // Delete health education item -------------------------------------------------------------------
    deleteHealthEducation: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({
        url: `/health-education/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "HealthEducation", id: "LIST" },
        { type: "HealthEducation", id },
      ],
    }),
  }),
});

export const { 
  useGetHealthEducationQuery, 
  useGetHealthEducationByIdQuery,
  useCreateHealthEducationMutation, 
  useUpdateHealthEducationMutation, 
  useDeleteHealthEducationMutation 
} = healthEducationApi;
