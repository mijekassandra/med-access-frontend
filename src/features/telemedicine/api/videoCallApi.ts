import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types based on backend API documentation
export const VideoCallStatus = {
  INITIATED: 'initiated',
  RINGING: 'ringing',
  ACTIVE: 'active',
  ENDED: 'ended',
  MISSED: 'missed',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
} as const;

export type VideoCallStatus = typeof VideoCallStatus[keyof typeof VideoCallStatus];

export interface UserReference {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  role: string;
}

export interface VideoCall {
  _id: string;
  caller: UserReference | string;
  receiver: UserReference | string;
  status: VideoCallStatus;
  startedAt?: string | null;
  endedAt?: string | null;
  duration?: number; // in seconds
  appointmentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVideoCallRequest {
  receiverId: string;
  appointmentId?: string;
}

export interface UpdateVideoCallStatusRequest {
  status: VideoCallStatus;
  duration?: number; // in seconds
}

export interface EndVideoCallRequest {
  duration?: number; // in seconds
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
}

const baseUrl = import.meta.env.VITE_APP_BE_URL || 'http://localhost:3001';

const baseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl}/api/video-calls`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const videoCallApi = createApi({
  reducerPath: "videoCallApi",
  baseQuery: baseQuery,
  tagTypes: ["VideoCall"],
  endpoints: (builder) => ({
    // Initiate video call
    initiateVideoCall: builder.mutation<
      ApiResponse<VideoCall>,
      CreateVideoCallRequest
    >({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['VideoCall'],
    }),

    // Get all video calls
    getVideoCalls: builder.query<
      ApiResponse<VideoCall[]> & {
        count: number;
        total: number;
        page: number;
        pages: number;
      },
      {
        status?: VideoCallStatus;
        page?: number;
        limit?: number;
      }
    >({
      query: (params = {}) => ({
        url: '/',
        params: {
          ...(params.status && { status: params.status }),
          ...(params.page && { page: params.page.toString() }),
          ...(params.limit && { limit: params.limit.toString() }),
        },
      }),
      providesTags: ['VideoCall'],
    }),

    // Get video call by ID
    getVideoCallById: builder.query<ApiResponse<VideoCall>, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'VideoCall', id }],
    }),

    // Update video call status
    updateVideoCallStatus: builder.mutation<
      ApiResponse<VideoCall>,
      { id: string; body: UpdateVideoCallStatusRequest }
    >({
      query: ({ id, body }) => ({
        url: `/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'VideoCall', id },
        'VideoCall',
      ],
    }),

    // End video call
    endVideoCall: builder.mutation<
      ApiResponse<VideoCall>,
      { id: string; body?: EndVideoCallRequest }
    >({
      query: ({ id, body }) => ({
        url: `/${id}/end`,
        method: 'PATCH',
        body: body || {},
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'VideoCall', id },
        'VideoCall',
      ],
    }),
  }),
});

export const {
  useInitiateVideoCallMutation,
  useGetVideoCallsQuery,
  useGetVideoCallByIdQuery,
  useUpdateVideoCallStatusMutation,
  useEndVideoCallMutation,
} = videoCallApi;

