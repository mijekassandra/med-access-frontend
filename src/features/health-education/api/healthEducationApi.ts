import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { RootState } from "../../../store";

import type { HealthEducationContentTable } from "../../../types/database";

const { VITE_APP_URL } = import.meta.env;

const baseQuery = fetchBaseQuery({
  baseUrl: VITE_APP_URL || "http://localhost:3000", // Use localhost:3000 as fallback
  // prepareHeaders: (headers, { getState }) => {
  //     const state = getState() as RootState;
  //     const token = state.auth.token;

  //     if (token) {
  //         headers.set("Authorization", `Bearer ${token}`);
  //     }
  //     return headers;
  // },
});

export const healthEducationApi = createApi({
  reducerPath: "healthEducationApi",
  baseQuery: baseQuery,
  tagTypes: ["HealthEducation"],
  endpoints: (builder) => ({
    getHealthEducation: builder.query<HealthEducationContentTable[], void>({
      query: () => "/health-education",
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ id }) => ({ type: "HealthEducation", id } as const)
              ),
              { type: "HealthEducation", id: "LIST" },
            ]
          : [{ type: "HealthEducation", id: "LIST" }],
    }),
    addHealthEducation: builder.mutation<HealthEducationContentTable, Omit<HealthEducationContentTable, 'id' | 'created_at'>>({
      query: (healthEducationData) => ({
        url: "/health-education",
        method: "POST",
        body: healthEducationData,
      }),
      invalidatesTags: [{ type: "HealthEducation", id: "LIST" }],
    }),
    editHealthEducation: builder.mutation<void, {id: string | number, healthEducation: Partial<HealthEducationContentTable>}>({
      query: ({id, healthEducation}) => ({
        url: `/health-education/${id}`,
        method: "PUT",
        body: healthEducation,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "HealthEducation", id: "LIST" },
        { type: "HealthEducation", id },
      ],
    }),
    deleteHealthEducation: builder.mutation<void, {id: string | number}>({
      query: ({id}) => ({
        url: `/health-education/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "HealthEducation", id }],
    }),
  }),
});

export const { 
  useGetHealthEducationQuery, 
  useAddHealthEducationMutation, 
  useEditHealthEducationMutation, 
  useDeleteHealthEducationMutation 
} = healthEducationApi as typeof healthEducationApi;
