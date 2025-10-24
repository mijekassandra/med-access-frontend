import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types based on backend API documentation
export interface User {
  id: string;
  username: string;
  email?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  address: string;
  phone: string;
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  profilePicture: string;
  role: "user" | "admin" | "doctor";
  prcLicenseNumber?: string;
  specialization?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  
}

export interface UserRegistration {
  username: string;
  email?: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  prcLicenseNumber?: string;
  specialization?: string;
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  role?: "user" | "admin" | "doctor";
}

export interface UserUpdate {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: string;
  profilePicture?: string;
  role?: "user" | "admin" | "doctor";
  isActive?: boolean;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface UserListResponse {
  success: boolean;
  count: number;
  data: User[];
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
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

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Register User
    registerUser: builder.mutation<ApiResponse<User>, UserRegistration>({
      query: (userData) => ({
        url: "/users/register",
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: userData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // Login User
    loginUser: builder.mutation<LoginResponse, UserLogin>({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: credentials,
      }),
    }),

    // Logout User
    logoutUser: builder.mutation<ApiResponse<{}>, void>({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
    }),

    // Get Current User
    getCurrentUser: builder.query<ApiResponse<User>, void>({
      query: () => "/users/me",
      providesTags: [{ type: "User", id: "CURRENT" }],
    }),

    // Get All Users (Admin only)
    getAllUsers: builder.query<UserListResponse, void>({
      query: () => "/users",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(
                ({ id }) => ({ type: "User", id } as const)
              ),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    // Get Active Users (Admin only)
    getActiveUsers: builder.query<UserListResponse, void>({
      query: () => "/users/active",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(
                ({ id }) => ({ type: "User", id } as const)
              ),
              { type: "User", id: "ACTIVE_LIST" },
            ]
          : [{ type: "User", id: "ACTIVE_LIST" }],
    }),

    // Get User by ID
    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    // Update User
    updateUser: builder.mutation<ApiResponse<User>, { id: string; data: UserUpdate }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id: "LIST" },
        { type: "User", id: "ACTIVE_LIST" },
        { type: "User", id: "CURRENT" },
        { type: "User", id },
      ],
    }),

    // Delete User (Admin only)
    deleteUser: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "User", id: "LIST" },
        { type: "User", id: "ACTIVE_LIST" },
        { type: "User", id },
      ],
    }),
  }),
});

export const { 
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetCurrentUserQuery,
  useGetAllUsersQuery,
  useGetActiveUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation
} = userApi;
