import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type:
    | "appointment"
    | "announcement"
    | "health_education"
    | "system"
    | "medical"
    | "inventory"
    | "user";
  status: "sent" | "read" | "acknowledged";
  relatedId?: string | null;
  relatedType?:
    | "appointment"
    | "announcement"
    | "health_education"
    | "medical_record"
    | "pregnancy_record"
    | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetNotificationsResponse {
  success: boolean;
  count: number;
  data: Notification[];
}

export interface MarkReadResponse {
  success: boolean;
  message: string;
  data: Notification;
}

export interface MarkAllReadResponse {
  success: boolean;
  message: string;
}

export interface GetNotificationsParams {
  status?: "sent" | "read" | "acknowledged";
}

const baseUrl = import.meta.env.VITE_APP_BE_URL || "http://localhost:3001";

const baseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl}/api`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: baseQuery,
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    // Get user notifications -------------------------------------------------------------------
    getNotifications: builder.query<
      GetNotificationsResponse,
      GetNotificationsParams | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.status) {
          queryParams.append("status", params.status);
        }
        const queryString = queryParams.toString();
        return {
          url: queryString ? `/notifications?${queryString}` : "/notifications",
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(
                ({ _id }) => ({ type: "Notification", id: _id } as const)
              ),
              { type: "Notification", id: "LIST" },
            ]
          : [{ type: "Notification", id: "LIST" }],
    }),

    // Mark notification as read -------------------------------------------------------------------
    markNotificationRead: builder.mutation<MarkReadResponse, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id },
      ],
    }),

    // Mark all notifications as read -------------------------------------------------------------------
    markAllNotificationsRead: builder.mutation<MarkAllReadResponse, void>({
      query: () => ({
        url: "/notifications/mark-all-read",
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationApi;
