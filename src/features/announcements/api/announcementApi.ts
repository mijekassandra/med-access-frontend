import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types based on backend API documentation
export interface Announcement {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: "user" | "admin" | "doctor";
  };
  isPublished: boolean;
  attachment?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementCreate {
  title: string;
  content: string;
  isPublished?: boolean;
  attachment?: string | null;
}

export interface AnnouncementUpdate {
  title?: string;
  content?: string;
  isPublished?: boolean;
  attachment?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface AnnouncementListResponse {
  success: boolean;
  count: number;
  data: Announcement[];
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

export const announcementApi = createApi({
  reducerPath: "announcementApi",
  baseQuery: baseQuery,
  tagTypes: ["Announcement"],
  endpoints: (builder) => ({
    // Get all announcements with optional published filter -------------------------------------------------------------------
    getAnnouncements: builder.query<AnnouncementListResponse, { published?: boolean } | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params?.published !== undefined) {
          searchParams.append('published', params.published.toString());
        }
        return {
          url: `/announcements${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(
                ({ _id }) => ({ type: "Announcement", id: _id } as const)
              ),
              { type: "Announcement", id: "LIST" },
            ]
          : [{ type: "Announcement", id: "LIST" }],
    }),

    // Get announcement by ID ------------------------------------------------
    getAnnouncementById: builder.query<ApiResponse<Announcement>, string>({
      query: (id) => `/announcements/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Announcement", id }],
    }),

    // Create announcement (supports file upload) -------------------------------------------------------------------
    createAnnouncement: builder.mutation<ApiResponse<Announcement>, AnnouncementCreate | FormData>({
      query: (announcementData) => {
        // Check if it's FormData (file upload) or regular object
        if (announcementData instanceof FormData) {
          return {
            url: "/announcements",
            method: "POST",
            body: announcementData,
          };
        } else {
          return {
            url: "/announcements",
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: announcementData,
          };
        }
      },
      invalidatesTags: [{ type: "Announcement", id: "LIST" }],
    }),

    // Update announcement (supports file upload) -------------------------------------------------------------------
    updateAnnouncement: builder.mutation<ApiResponse<Announcement>, { id: string; data: AnnouncementUpdate | FormData }>({
      query: ({ id, data }) => {
        // Check if it's FormData (file upload) or regular object
        if (data instanceof FormData) {
          return {
            url: `/announcements/${id}`,
            method: "PUT",
            body: data,
          };
        } else {
          return {
            url: `/announcements/${id}`,
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
            },
            body: data,
          };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Announcement", id: "LIST" },
        { type: "Announcement", id },
      ],
    }),

    // Delete announcement -------------------------------------------------------------------
    deleteAnnouncement: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({
        url: `/announcements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Announcement", id: "LIST" },
        { type: "Announcement", id },
      ],
    }),

    // Update publish status only -------------------------------------------------------------------
    updatePublishStatus: builder.mutation<ApiResponse<Announcement>, { id: string; isPublished: boolean }>({
      query: ({ id, isPublished }) => ({
        url: `/announcements/${id}/publish`,
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: { isPublished },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Announcement", id: "LIST" },
        { type: "Announcement", id },
      ],
    }),
  }),
});

export const { 
  useGetAnnouncementsQuery, 
  useGetAnnouncementByIdQuery,
  useCreateAnnouncementMutation, 
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useUpdatePublishStatusMutation
} = announcementApi;
