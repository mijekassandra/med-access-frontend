import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { RootState } from "../../../store";

const { VITE_APP_URL } = import.meta.env;

const baseQuery = fetchBaseQuery({
  baseUrl: VITE_APP_URL,
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
  endpoints: (builder) => ({
    // getMedicineInventory: builder.query<MedicineInventory[], void>({
    //   query: () => "/medicine-inventory",
    // }),
  }),
});
