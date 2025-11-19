# Video Call API Documentation

## Base URL
```
/api/video-calls
```

## Authentication
All endpoints require authentication. Include the authentication token in the request headers:
```
Authorization: Bearer <token>
```

---

## Video Call Status Enum

```typescript
enum VideoCallStatus {
  INITIATED = 'initiated',
  RINGING = 'ringing',
  ACTIVE = 'active',
  ENDED = 'ended',
  MISSED = 'missed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}
```

---

## TypeScript Types for Frontend

```typescript
// Video Call Status
export enum VideoCallStatus {
  INITIATED = 'initiated',
  RINGING = 'ringing',
  ACTIVE = 'active',
  ENDED = 'ended',
  MISSED = 'missed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

// User reference (populated)
export interface UserReference {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  role: string;
}

// Video Call Response
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

// Create Video Call Request
export interface CreateVideoCallRequest {
  receiverId: string;
  appointmentId?: string;
}

// Update Video Call Status Request
export interface UpdateVideoCallStatusRequest {
  status: VideoCallStatus;
  duration?: number; // in seconds
}

// End Video Call Request
export interface EndVideoCallRequest {
  duration?: number; // in seconds
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
}

// Error Response
export interface ErrorResponse {
  success: false;
  message: string;
}
```

---

## Endpoints

### 1. Initiate Video Call

Create a new video call between the authenticated user (caller) and a receiver.

**Endpoint:** `POST /api/video-calls`

**Request Body:**
```json
{
  "receiverId": "507f1f77bcf86cd799439011",
  "appointmentId": "507f1f77bcf86cd799439012" // optional
}
```

**Request TypeScript:**
```typescript
interface CreateVideoCallRequest {
  receiverId: string;
  appointmentId?: string;
}
```

**Success Response:** `201 Created`
```json
{
  "success": true,
  "message": "Video call initiated",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "caller": {
      "_id": "507f1f77bcf86cd799439010",
      "username": "doctor_john",
      "firstName": "John",
      "lastName": "Doe",
      "profilePicture": "https://example.com/avatar.jpg",
      "role": "doctor"
    },
    "receiver": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "patient_jane",
      "firstName": "Jane",
      "lastName": "Smith",
      "profilePicture": "https://example.com/avatar2.jpg",
      "role": "patient"
    },
    "status": "initiated",
    "startedAt": null,
    "endedAt": null,
    "duration": 0,
    "appointmentId": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request` - Missing or invalid receiver ID
```json
{
  "success": false,
  "message": "Receiver ID is required"
}
```

- `400 Bad Request` - Invalid receiver ID format
```json
{
  "success": false,
  "message": "Invalid receiver ID format"
}
```

- `400 Bad Request` - Cannot call yourself
```json
{
  "success": false,
  "message": "Cannot call yourself"
}
```

- `400 Bad Request` - Invalid appointment ID format
```json
{
  "success": false,
  "message": "Invalid appointment ID format"
}
```

- `401 Unauthorized` - Not authenticated
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "Server error initiating video call"
}
```

---

### 2. Get All Video Calls

Retrieve all video calls where the authenticated user is either the caller or receiver.

**Endpoint:** `GET /api/video-calls`

**Query Parameters:**
- `status` (optional): Filter by status (`initiated`, `ringing`, `active`, `ended`, `missed`, `rejected`, `cancelled`)
- `page` (optional): Page number (default: `1`)
- `limit` (optional): Items per page (default: `50`)

**Example Request:**
```
GET /api/video-calls?status=active&page=1&limit=20
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "caller": {
        "_id": "507f1f77bcf86cd799439010",
        "username": "doctor_john",
        "firstName": "John",
        "lastName": "Doe",
        "profilePicture": "https://example.com/avatar.jpg",
        "role": "doctor"
      },
      "receiver": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "patient_jane",
        "firstName": "Jane",
        "lastName": "Smith",
        "profilePicture": "https://example.com/avatar2.jpg",
        "role": "patient"
      },
      "status": "active",
      "startedAt": "2024-01-15T10:35:00.000Z",
      "endedAt": null,
      "duration": 0,
      "appointmentId": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    }
    // ... more video calls
  ]
}
```

**Error Responses:**

- `401 Unauthorized` - Not authenticated
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "Server error fetching video calls"
}
```

---

### 3. Get Video Call by ID

Retrieve a specific video call by its ID. The authenticated user must be either the caller or receiver.

**Endpoint:** `GET /api/video-calls/:id`

**URL Parameters:**
- `id`: Video call ID

**Example Request:**
```
GET /api/video-calls/507f1f77bcf86cd799439013
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "caller": {
      "_id": "507f1f77bcf86cd799439010",
      "username": "doctor_john",
      "firstName": "John",
      "lastName": "Doe",
      "profilePicture": "https://example.com/avatar.jpg",
      "role": "doctor"
    },
    "receiver": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "patient_jane",
      "firstName": "Jane",
      "lastName": "Smith",
      "profilePicture": "https://example.com/avatar2.jpg",
      "role": "patient"
    },
    "status": "active",
    "startedAt": "2024-01-15T10:35:00.000Z",
    "endedAt": null,
    "duration": 0,
    "appointmentId": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid video call ID format
```json
{
  "success": false,
  "message": "Invalid video call ID format"
}
```

- `401 Unauthorized` - Not authenticated
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

- `403 Forbidden` - User is not part of this call
```json
{
  "success": false,
  "message": "Access denied. You are not part of this call."
}
```

- `404 Not Found` - Video call not found
```json
{
  "success": false,
  "message": "Video call not found"
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "Server error fetching video call"
}
```

---

### 4. Update Video Call Status

Update the status of a video call (e.g., accept, reject, mark as ringing). The authenticated user must be either the caller or receiver.

**Endpoint:** `PATCH /api/video-calls/:id/status`

**URL Parameters:**
- `id`: Video call ID

**Request Body:**
```json
{
  "status": "active",
  "duration": 120 // optional, in seconds
}
```

**Request TypeScript:**
```typescript
interface UpdateVideoCallStatusRequest {
  status: VideoCallStatus;
  duration?: number; // in seconds
}
```

**Status Transitions:**
- When status is set to `active` and `startedAt` is null, it will be automatically set to the current time
- When status is set to `ended`, `missed`, `rejected`, or `cancelled`, `endedAt` will be automatically set
- If `duration` is not provided and `startedAt` exists, duration will be calculated automatically

**Example Request:**
```
PATCH /api/video-calls/507f1f77bcf86cd799439013/status
Content-Type: application/json

{
  "status": "active"
}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Video call status updated",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "caller": {
      "_id": "507f1f77bcf86cd799439010",
      "username": "doctor_john",
      "firstName": "John",
      "lastName": "Doe",
      "profilePicture": "https://example.com/avatar.jpg",
      "role": "doctor"
    },
    "receiver": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "patient_jane",
      "firstName": "Jane",
      "lastName": "Smith",
      "profilePicture": "https://example.com/avatar2.jpg",
      "role": "patient"
    },
    "status": "active",
    "startedAt": "2024-01-15T10:35:00.000Z",
    "endedAt": null,
    "duration": 0,
    "appointmentId": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid status
```json
{
  "success": false,
  "message": "Valid status is required"
}
```

- `400 Bad Request` - Invalid video call ID format
```json
{
  "success": false,
  "message": "Invalid video call ID format"
}
```

- `401 Unauthorized` - Not authenticated
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

- `403 Forbidden` - User is not part of this call
```json
{
  "success": false,
  "message": "Access denied. You are not part of this call."
}
```

- `404 Not Found` - Video call not found
```json
{
  "success": false,
  "message": "Video call not found"
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "Server error updating video call status"
}
```

---

### 5. End Video Call

End a video call. The authenticated user must be either the caller or receiver. Duration will be calculated automatically if not provided.

**Endpoint:** `PATCH /api/video-calls/:id/end`

**URL Parameters:**
- `id`: Video call ID

**Request Body:**
```json
{
  "duration": 300 // optional, in seconds
}
```

**Request TypeScript:**
```typescript
interface EndVideoCallRequest {
  duration?: number; // in seconds
}
```

**Note:** If `duration` is not provided and `startedAt` exists, the duration will be automatically calculated based on the time difference.

**Example Request:**
```
PATCH /api/video-calls/507f1f77bcf86cd799439013/end
Content-Type: application/json

{
  "duration": 300
}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Video call ended",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "caller": {
      "_id": "507f1f77bcf86cd799439010",
      "username": "doctor_john",
      "firstName": "John",
      "lastName": "Doe",
      "profilePicture": "https://example.com/avatar.jpg",
      "role": "doctor"
    },
    "receiver": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "patient_jane",
      "firstName": "Jane",
      "lastName": "Smith",
      "profilePicture": "https://example.com/avatar2.jpg",
      "role": "patient"
    },
    "status": "ended",
    "startedAt": "2024-01-15T10:35:00.000Z",
    "endedAt": "2024-01-15T10:40:00.000Z",
    "duration": 300,
    "appointmentId": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:40:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid video call ID format
```json
{
  "success": false,
  "message": "Invalid video call ID format"
}
```

- `401 Unauthorized` - Not authenticated
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

- `403 Forbidden` - User is not part of this call
```json
{
  "success": false,
  "message": "Access denied. You are not part of this call."
}
```

- `404 Not Found` - Video call not found
```json
{
  "success": false,
  "message": "Video call not found"
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "Server error ending video call"
}
```

---

## RTK Query Integration Examples

### Setup RTK Query API Slice

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  VideoCall,
  VideoCallStatus,
  CreateVideoCallRequest,
  UpdateVideoCallStatusRequest,
  EndVideoCallRequest,
  ApiResponse,
} from './types/videoCall.types';

// Get base URL from environment or config
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const videoCallApi = createApi({
  reducerPath: 'videoCallApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/video-calls`,
    prepareHeaders: (headers, { getState }) => {
      // Get token from your auth state
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['VideoCall'],
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
          ...params,
          page: params.page?.toString(),
          limit: params.limit?.toString(),
        },
      }),
      providesTags: ['VideoCall'],
    }),

    // Get video call by ID
    getVideoCallById: builder.query<ApiResponse<VideoCall>, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'VideoCall', id }],
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
      invalidatesTags: (result, error, { id }) => [
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
      invalidatesTags: (result, error, { id }) => [
        { type: 'VideoCall', id },
        'VideoCall',
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useInitiateVideoCallMutation,
  useGetVideoCallsQuery,
  useGetVideoCallByIdQuery,
  useUpdateVideoCallStatusMutation,
  useEndVideoCallMutation,
} = videoCallApi;
```

### Usage in React Components

```typescript
import React from 'react';
import {
  useInitiateVideoCallMutation,
  useGetVideoCallsQuery,
  useGetVideoCallByIdQuery,
  useUpdateVideoCallStatusMutation,
  useEndVideoCallMutation,
  VideoCallStatus,
} from '../store/api/videoCallApi';

// Example: Initiate a video call
function VideoCallButton({ receiverId, appointmentId }: { receiverId: string; appointmentId?: string }) {
  const [initiateCall, { isLoading, error }] = useInitiateVideoCallMutation();

  const handleCall = async () => {
    try {
      const result = await initiateCall({
        receiverId,
        appointmentId,
      }).unwrap();
      
      console.log('Call initiated:', result.data);
      // Handle success (e.g., navigate to call screen, show notification)
    } catch (err) {
      console.error('Failed to initiate call:', err);
      // Handle error
    }
  };

  return (
    <button onClick={handleCall} disabled={isLoading}>
      {isLoading ? 'Calling...' : 'Start Video Call'}
    </button>
  );
}

// Example: Get all video calls
function VideoCallList() {
  const { data, isLoading, error, refetch } = useGetVideoCallsQuery({
    status: VideoCallStatus.ACTIVE,
    page: 1,
    limit: 20,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading calls</div>;

  return (
    <div>
      <h2>Video Calls ({data?.total || 0})</h2>
      <button onClick={() => refetch()}>Refresh</button>
      {data?.data?.map((call) => (
        <div key={call._id}>
          <p>Status: {call.status}</p>
          <p>Duration: {call.duration}s</p>
        </div>
      ))}
    </div>
  );
}

// Example: Get specific video call
function VideoCallDetails({ callId }: { callId: string }) {
  const { data, isLoading } = useGetVideoCallByIdQuery(callId);

  if (isLoading) return <div>Loading...</div>;
  if (!data?.data) return <div>Call not found</div>;

  const call = data.data;
  return (
    <div>
      <h3>Call Details</h3>
      <p>Status: {call.status}</p>
      <p>Started: {call.startedAt}</p>
      <p>Duration: {call.duration}s</p>
    </div>
  );
}

// Example: Accept/Reject a call
function CallControls({ callId }: { callId: string }) {
  const [updateStatus, { isLoading }] = useUpdateVideoCallStatusMutation();
  const [endCall] = useEndVideoCallMutation();

  const handleAccept = async () => {
    try {
      await updateStatus({
        id: callId,
        body: { status: VideoCallStatus.ACTIVE },
      }).unwrap();
    } catch (err) {
      console.error('Failed to accept call:', err);
    }
  };

  const handleReject = async () => {
    try {
      await updateStatus({
        id: callId,
        body: { status: VideoCallStatus.REJECTED },
      }).unwrap();
    } catch (err) {
      console.error('Failed to reject call:', err);
    }
  };

  const handleEnd = async () => {
    try {
      await endCall({ id: callId }).unwrap();
    } catch (err) {
      console.error('Failed to end call:', err);
    }
  };

  return (
    <div>
      <button onClick={handleAccept} disabled={isLoading}>
        Accept
      </button>
      <button onClick={handleReject} disabled={isLoading}>
        Reject
      </button>
      <button onClick={handleEnd} disabled={isLoading}>
        End Call
      </button>
    </div>
  );
}
```

### Store Configuration

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { videoCallApi } from './api/videoCallApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [videoCallApi.reducerPath]: videoCallApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(videoCallApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## Common Workflows

### 1. Initiating and Managing a Video Call

```typescript
// 1. User initiates a call
const { data: callData } = await initiateVideoCall({
  receiverId: 'user123',
  appointmentId: 'appointment456', // optional
}).unwrap();

const callId = callData._id;

// 2. Update status to ringing (if needed)
await updateVideoCallStatus({
  id: callId,
  body: { status: VideoCallStatus.RINGING },
}).unwrap();

// 3. Receiver accepts the call
await updateVideoCallStatus({
  id: callId,
  body: { status: VideoCallStatus.ACTIVE },
}).unwrap();

// 4. End the call
await endVideoCall({ id: callId }).unwrap();
```

### 2. Fetching User's Call History

```typescript
// Get all calls
const { data } = useGetVideoCallsQuery({
  page: 1,
  limit: 50,
});

// Get only active calls
const { data: activeCalls } = useGetVideoCallsQuery({
  status: VideoCallStatus.ACTIVE,
});

// Get only ended calls
const { data: endedCalls } = useGetVideoCallsQuery({
  status: VideoCallStatus.ENDED,
});
```

---

## Notes

1. **Authentication**: All endpoints require a valid authentication token in the `Authorization` header.

2. **Authorization**: Users can only access video calls where they are either the caller or receiver.

3. **Status Transitions**: 
   - When a call is set to `active`, `startedAt` is automatically set if not already set
   - When a call is ended/rejected/missed/cancelled, `endedAt` is automatically set
   - Duration is calculated automatically if not provided when ending a call

4. **Pagination**: The `getVideoCalls` endpoint supports pagination with `page` and `limit` query parameters.

5. **Populated Fields**: Responses include populated `caller`, `receiver`, and `appointmentId` fields with user/appointment details.

6. **Real-time Updates**: Consider using WebSocket/Socket.io for real-time call status updates in addition to these REST endpoints.

