import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { RootState } from "../../../store";

import type { AnnouncementTable } from "../../../types/database";

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

export const announcementApi = createApi({
  reducerPath: "announcementApi",
  baseQuery: baseQuery,
  tagTypes: ["Announcement"],
  endpoints: (builder) => ({
    getAnnouncements: builder.query<AnnouncementTable[], void>({
      query: () => "/announcements",
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ id }) => ({ type: "Announcement", id } as const)
              ),
              { type: "Announcement", id: "LIST" },
            ]
          : [{ type: "Announcement", id: "LIST" }],
    }),
    addAnnouncement: builder.mutation<AnnouncementTable, Omit<AnnouncementTable, 'id' | 'created_at' | 'updated_at'>>({
      query: (announcementData) => ({
        url: "/announcements",
        method: "POST",
        body: announcementData,
      }),
      invalidatesTags: [{ type: "Announcement", id: "LIST" }],
    }),
    editAnnouncement: builder.mutation<void, {id: string | number, announcement: Partial<AnnouncementTable>}>({
      query: ({id, announcement}) => ({
        url: `/announcements/${id}`,
        method: "PUT",
        body: announcement,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Announcement", id: "LIST" },
        { type: "Announcement", id },
      ],
    }),
    deleteAnnouncement: builder.mutation<void, {id: string | number}>({
      query: ({id}) => ({
        url: `/announcements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Announcement", id }],
    }),
  }),
});

export const { 
  useGetAnnouncementsQuery, 
  useAddAnnouncementMutation, 
  useEditAnnouncementMutation, 
  useDeleteAnnouncementMutation 
} = announcementApi as typeof announcementApi;
