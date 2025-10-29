import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types based on the service data structure
export interface Service {
  _id: string;
  name: string;
  price: number;
  description: string;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCreate {
  name: string;
  price: number;
  description: string;
  image?: File | null;
}

export interface ServiceUpdate {
  name?: string;
  price?: number;
  description?: string;
  image?: File | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface ServiceListResponse {
  success: boolean;
  count: number;
  data: Service[];
}

// const baseUrl = import.meta.env.VITE_APP_BE_URL || 'http://localhost:3001';
const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:3000';

const baseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl}`,
//   baseUrl: `${baseUrl}/api`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: baseQuery,
  tagTypes: ["Service"],
  endpoints: (builder) => ({
    // Get all services -------------------------------------------------------------------
    getServices: builder.query<ServiceListResponse, void>({
      query: () => '/services',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(
                ({ _id }) => ({ type: "Service", id: _id } as const)
              ),
              { type: "Service", id: "LIST" },
            ]
          : [{ type: "Service", id: "LIST" }],
    }),

    // Get service by ID ------------------------------------------------
    getServiceById: builder.query<ApiResponse<Service>, string>({
      query: (id) => `/services/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Service", id }],
    }),

    // Create service (supports file upload) -------------------------------------------------------------------
    createService: builder.mutation<ApiResponse<Service>, ServiceCreate | FormData>({
      query: (serviceData) => {
        // Check if it's FormData (file upload) or regular object
        if (serviceData instanceof FormData) {
          return {
            url: "/services",
            method: "POST",
            body: serviceData,
          };
        } else {
          return {
            url: "/services",
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: serviceData,
          };
        }
      },
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),

    // Update service (supports file upload) -------------------------------------------------------------------
    updateService: builder.mutation<ApiResponse<Service>, { id: string; data: ServiceUpdate | FormData }>({
      query: ({ id, data }) => {
        // Check if it's FormData (file upload) or regular object
        if (data instanceof FormData) {
          return {
            url: `/services/${id}`,
            method: "PUT",
            body: data,
          };
        } else {
          return {
            url: `/services/${id}`,
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
            },
            body: data,
          };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Service", id: "LIST" },
        { type: "Service", id },
      ],
    }),

    // Delete service -------------------------------------------------------------------
    deleteService: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Service", id: "LIST" },
        { type: "Service", id },
      ],
    }),
  }),
});

export const { 
  useGetServicesQuery, 
  useGetServiceByIdQuery,
  useCreateServiceMutation, 
  useUpdateServiceMutation,
  useDeleteServiceMutation
} = serviceApi;
