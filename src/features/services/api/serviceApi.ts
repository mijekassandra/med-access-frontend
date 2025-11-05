import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types based on backend API documentation
export interface Service {
  _id: string;
  serviceName: string;
  additionalInfo?: string;
  price: number;
  image?: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCreate {
  serviceName: string;
  additionalInfo?: string;
  price: number;
  image?: File | null;
}

export interface ServiceUpdate {
  serviceName?: string;
  additionalInfo?: string;
  price?: number;
  image?: File | null;
  isPublished?: boolean;
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
        // Always use FormData for file uploads
        if (serviceData instanceof FormData) {
          return {
            url: "/services",
            method: "POST",
            body: serviceData,
          };
        } else {
          // Convert to FormData for consistency with backend
          const formData = new FormData();
          formData.append('serviceName', serviceData.serviceName);
          if (serviceData.additionalInfo) {
            formData.append('additionalInfo', serviceData.additionalInfo);
          }
          formData.append('price', serviceData.price.toString());
          if (serviceData.image) {
            formData.append('image', serviceData.image);
          }
          
          return {
            url: "/services",
            method: "POST",
            body: formData,
          };
        }
      },
      invalidatesTags: [{ type: "Service", id: "LIST" }],
    }),

    // Update service (supports file upload) -------------------------------------------------------------------
    updateService: builder.mutation<ApiResponse<Service>, { id: string; data: ServiceUpdate | FormData }>({
      query: ({ id, data }) => {
        // Always use FormData for file uploads
        if (data instanceof FormData) {
          return {
            url: `/services/${id}`,
            method: "PUT",
            body: data,
          };
        } else {
          // Convert to FormData for consistency with backend
          const formData = new FormData();
          if (data.serviceName) {
            formData.append('serviceName', data.serviceName);
          }
          if (data.additionalInfo !== undefined) {
            formData.append('additionalInfo', data.additionalInfo);
          }
          if (data.price !== undefined) {
            formData.append('price', data.price.toString());
          }
          if (data.isPublished !== undefined) {
            formData.append('isPublished', data.isPublished.toString());
          }
          if (data.image) {
            formData.append('image', data.image);
          }
          
          return {
            url: `/services/${id}`,
            method: "PUT",
            body: formData,
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
