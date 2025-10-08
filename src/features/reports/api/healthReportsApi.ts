import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { RootState } from "../../../store";

import type { HealthReportTable } from "../../../types/database";

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

export const healthReportsApi = createApi({
  reducerPath: "healthReportsApi",
  baseQuery: baseQuery,
  tagTypes: ["HealthReports"],
  endpoints: (builder) => ({
    getHealthReports: builder.query<HealthReportTable[], void>({
      query: () => "/health-reports",
      providesTags: (result) =>
        result
            ? [
                  ...result.map(
                      ({ id }) => ({ type: "HealthReports", id } as const)
                  ),
                  { type: "HealthReports", id: "LIST" },
              ]
            : [{ type: "HealthReports", id: "LIST" }],
      }),
      addHealthReport: builder.mutation<HealthReportTable, Omit<HealthReportTable, 'id'>>({
        query: (reportData) => ({
          url: "/health-reports",
          method: "POST",
          body: reportData,
        }),
        invalidatesTags: [{ type: "HealthReports", id: "LIST" }],
      }),
      editHealthReport: builder.mutation<void, {id: string | number, report: object}>({
        query: ({id, report}) => ({
          url: `/health-reports/${id}`,
          method: "PUT",
          body: report,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: "HealthReports", id: "LIST" },
          { type: "HealthReports", id },
      ],
      }),
      deleteHealthReport: builder.mutation<void, {id: string | number}>({
        query: ({id}) => ({
          url: `/health-reports/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (_result, _error, { id }) => [{ type: "HealthReports", id }],
      }),
  }),
});

export const { 
  useGetHealthReportsQuery, 
  useAddHealthReportMutation, 
  useEditHealthReportMutation, 
  useDeleteHealthReportMutation 
} = healthReportsApi as typeof healthReportsApi;
