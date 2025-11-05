import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types based on backend API documentation
export interface MedicineInventory {
  _id: string;
  name: string;
  brand?: string;
  description?: string;
  dosage?: string;
  stock: number;
  expiration_date: string | null;
  batch_no?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineInventoryCreate {
  name: string;
  brand?: string;
  description?: string;
  dosage?: string;
  stock: number;
  expiration_date?: string | null;
  batch_no?: string;
}

export interface MedicineInventoryUpdate {
  name?: string;
  brand?: string;
  description?: string;
  dosage?: string;
  stock?: number;
  expiration_date?: string | null;
  batch_no?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface MedicineListResponse {
  success: boolean;
  count: number;
  data: MedicineInventory[];
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

export const medicineInventoryApi = createApi({
  reducerPath: "medicineInventoryApi",
  baseQuery: baseQuery,
  tagTypes: ["MedicineInventory"],
  endpoints: (builder) => ({
    // Get all inventory items (supports search via query parameter) -------------------------------------------------------------------
    getMedicines: builder.query<MedicineListResponse, string | void>({
      query: (searchQuery) => {
        const params = searchQuery ? { q: searchQuery } : {};
        return {
          url: "/inventory",
          params,
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(
                ({ _id }) => ({ type: "MedicineInventory", id: _id } as const)
              ),
              { type: "MedicineInventory", id: "LIST" },
            ]
          : [{ type: "MedicineInventory", id: "LIST" }],
    }),

    // Get inventory item by ID -------------------------------------------------------------------
    getMedicineById: builder.query<ApiResponse<MedicineInventory>, string>({
      query: (id) => `/inventory/${id}`,
      providesTags: (_result, _error, id) => [{ type: "MedicineInventory", id }],
    }),

    // Create inventory item -------------------------------------------------------------------
    createMedicine: builder.mutation<ApiResponse<MedicineInventory>, MedicineInventoryCreate>({
      query: (medicineData) => ({
        url: "/inventory",
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: medicineData,
      }),
      invalidatesTags: [{ type: "MedicineInventory", id: "LIST" }],
    }),

    // Update inventory item -------------------------------------------------------------------
    updateMedicine: builder.mutation<ApiResponse<MedicineInventory>, { id: string; data: MedicineInventoryUpdate }>({
      query: ({ id, data }) => ({
        url: `/inventory/${id}`,
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "MedicineInventory", id: "LIST" },
        { type: "MedicineInventory", id },
      ],
    }),

    // Delete inventory item -------------------------------------------------------------------
    deleteMedicine: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({
        url: `/inventory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "MedicineInventory", id: "LIST" },
        { type: "MedicineInventory", id },
      ],
    }),
  }),
});

export const {
  useGetMedicinesQuery,
  useGetMedicineByIdQuery,
  useCreateMedicineMutation,
  useUpdateMedicineMutation,
  useDeleteMedicineMutation
} = medicineInventoryApi;
