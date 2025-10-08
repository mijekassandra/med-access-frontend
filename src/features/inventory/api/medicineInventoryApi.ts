import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { RootState } from "../../../store";

import type { MedicineTable } from "../../../types/database";

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

export const medicineInventoryApi = createApi({
  reducerPath: "medicineInventoryApi",
  baseQuery: baseQuery,
  tagTypes: ["MedicineInventory"],
  endpoints: (builder) => ({
    getMedicineInventory: builder.query<MedicineTable[], void>({
      query: () => "/inventory",
      providesTags: (result) =>
        result
            ? [
                  ...result.map(
                      ({ id }) => ({ type: "MedicineInventory", id } as const)
                  ),
                  { type: "MedicineInventory", id: "LIST" },
              ]
            : [{ type: "MedicineInventory", id: "LIST" }],
      }),
      addMedicineInventory: builder.mutation<MedicineTable, Omit<MedicineTable, 'id'>>({
        query: (medicineData) => ({
          url: "/inventory",
          method: "POST",
          body: medicineData,
        }),
        invalidatesTags: [{ type: "MedicineInventory", id: "LIST" }],
      }),
      editMedicineInventory: builder.mutation<void, {id: string | number, medicine: object}>({
        query: ({id, medicine}) => ({
          url: `/inventory/${id}`,
          method: "PUT",
          body: medicine,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: "MedicineInventory", id: "LIST" },
          { type: "MedicineInventory", id },
      ],
      }),
      deleteMedicineInventory: builder.mutation<void, {id: string | number}>({
        query: ({id}) => ({
          url: `/inventory/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (_result, _error, { id }) => [{ type: "MedicineInventory", id }],
      }),
  }),
});

export const { useGetMedicineInventoryQuery, useAddMedicineInventoryMutation, useEditMedicineInventoryMutation, useDeleteMedicineInventoryMutation } = medicineInventoryApi as typeof medicineInventoryApi;
