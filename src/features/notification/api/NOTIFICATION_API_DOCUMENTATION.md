# Notification API Documentation

This documentation provides comprehensive details about the Notification API endpoints, data models, and integration examples for frontend development using RTK Query.

## Table of Contents
- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Data Models](#data-models)
- [API Endpoints](#api-endpoints)
- [RTK Query Integration Examples](#rtk-query-integration-examples)
- [Error Handling](#error-handling)
- [Service Functions (Backend Only)](#service-functions-backend-only)

---

## Overview

The Notification API allows users to:
- Retrieve their notifications
- Filter notifications by status
- Mark individual notifications as read
- Mark all notifications as read

All endpoints require authentication and return notifications specific to the authenticated user.

---

## Base URL

```
http://localhost:3001/api/notifications
```

**Note:** In production, replace `localhost:3001` with your production server URL.

---

## Authentication

All notification endpoints require authentication. Include the JWT token in one of the following ways:

### Option 1: Authorization Header (Recommended)
```
Authorization: Bearer <your_jwt_token>
```

### Option 2: Cookie
The token can also be sent as a cookie named `token` (if your frontend is configured to send cookies with requests).

### Authentication Errors
If authentication fails, you'll receive:
```json
{
  "success": false,
  "message": "Access denied. No authentication token provided."
}
```
**Status Code:** `401 Unauthorized`

---

## Data Models

### Notification Object

```typescript
interface Notification {
  _id: string;                    // MongoDB ObjectId
  user: string;                   // User ObjectId (reference)
  title: string;                  // Max 200 characters
  message: string;                // Max 500 characters
  type: NotificationType;         // See types below
  status: NotificationStatus;     // See statuses below
  relatedId?: string | null;      // ObjectId of related entity (optional)
  relatedType?: RelatedType | null; // Type of related entity (optional)
  createdAt: string;              // ISO 8601 timestamp
  updatedAt: string;              // ISO 8601 timestamp
}
```

### NotificationType

```typescript
type NotificationType = 
  | 'appointment' 
  | 'announcement' 
  | 'health_education' 
  | 'system' 
  | 'medical' 
  | 'inventory' 
  | 'user';
```

### NotificationStatus

```typescript
type NotificationStatus = 'sent' | 'read' | 'acknowledged';
```

- **`sent`**: Notification has been created but not yet read (default)
- **`read`**: User has viewed the notification
- **`acknowledged`**: User has acknowledged the notification (future use)

### RelatedType

```typescript
type RelatedType = 
  | 'appointment' 
  | 'announcement' 
  | 'health_education' 
  | 'medical_record' 
  | 'pregnancy_record';
```

### API Response Structure

All successful responses follow this structure:

```typescript
interface SuccessResponse<T> {
  success: true;
  count?: number;        // Present in GET requests
  data: T;              // Response data
  message?: string;      // Present in PATCH requests
}
```

Error responses:

```typescript
interface ErrorResponse {
  success: false;
  message: string;
}
```

---

## API Endpoints

### 1. Get User Notifications

Retrieve all notifications for the authenticated user.

**Endpoint:** `GET /api/notifications`

**Authentication:** Required

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | `string` | No | Filter by status: `'sent'`, `'read'`, or `'acknowledged'` |

**Request Example:**
```http
GET /api/notifications?status=sent
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user": "507f191e810c19729de860ea",
      "title": "New Appointment Scheduled",
      "message": "Your appointment with Dr. Smith has been scheduled for tomorrow at 2:00 PM.",
      "type": "appointment",
      "status": "sent",
      "relatedId": "507f1f77bcf86cd799439012",
      "relatedType": "appointment",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "user": "507f191e810c19729de860ea",
      "title": "System Maintenance",
      "message": "Scheduled maintenance will occur on January 20th from 2:00 AM to 4:00 AM.",
      "type": "system",
      "status": "read",
      "relatedId": null,
      "relatedType": null,
      "createdAt": "2024-01-14T08:00:00.000Z",
      "updatedAt": "2024-01-14T09:15:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

**Notes:**
- Notifications are sorted by `createdAt` in descending order (newest first)
- If no `status` query parameter is provided, all notifications are returned
- Only notifications belonging to the authenticated user are returned

---

### 2. Mark Notification as Read

Mark a specific notification as read.

**Endpoint:** `PATCH /api/notifications/:id/read`

**Authentication:** Required

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `string` | Yes | Notification ObjectId |

**Request Example:**
```http
PATCH /api/notifications/507f1f77bcf86cd799439011/read
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "user": "507f191e810c19729de860ea",
    "title": "New Appointment Scheduled",
    "message": "Your appointment with Dr. Smith has been scheduled for tomorrow at 2:00 PM.",
    "type": "appointment",
    "status": "read",
    "relatedId": "507f1f77bcf86cd799439012",
    "relatedType": "appointment",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid notification ID format
  ```json
  {
    "success": false,
    "message": "Invalid notification id"
  }
  ```
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Notification not found or doesn't belong to user
  ```json
  {
    "success": false,
    "message": "Notification not found"
  }
  ```
- `500 Internal Server Error`: Server error

**Notes:**
- Only notifications belonging to the authenticated user can be marked as read
- The notification's `status` is updated to `'read'`
- The `updatedAt` timestamp is automatically updated

---

### 3. Mark All Notifications as Read

Mark all unread notifications for the authenticated user as read.

**Endpoint:** `PATCH /api/notifications/mark-all-read`

**Authentication:** Required

**Request Example:**
```http
PATCH /api/notifications/mark-all-read
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

**Notes:**
- Only notifications with status `'sent'` or `'acknowledged'` are updated to `'read'`
- Already read notifications are not affected
- This operation affects all notifications belonging to the authenticated user

---

## RTK Query Integration Examples

### Setup

First, create your RTK Query API slice:

```typescript
// api/notificationsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: 'appointment' | 'announcement' | 'health_education' | 'system' | 'medical' | 'inventory' | 'user';
  status: 'sent' | 'read' | 'acknowledged';
  relatedId?: string | null;
  relatedType?: 'appointment' | 'announcement' | 'health_education' | 'medical_record' | 'pregnancy_record' | null;
  createdAt: string;
  updatedAt: string;
}

interface GetNotificationsResponse {
  success: boolean;
  count: number;
  data: Notification[];
}

interface MarkReadResponse {
  success: boolean;
  message: string;
  data: Notification;
}

interface MarkAllReadResponse {
  success: boolean;
  message: string;
}

interface GetNotificationsParams {
  status?: 'sent' | 'read' | 'acknowledged';
}

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001/api/notifications',
    prepareHeaders: (headers, { getState }) => {
      // Get token from your auth state/store
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    // Get user notifications
    getNotifications: builder.query<GetNotificationsResponse, GetNotificationsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.status) {
          queryParams.append('status', params.status);
        }
        const queryString = queryParams.toString();
        return {
          url: queryString ? `/?${queryString}` : '/',
          method: 'GET',
        };
      },
      providesTags: ['Notification'],
    }),

    // Mark notification as read
    markNotificationRead: builder.mutation<MarkReadResponse, string>({
      query: (notificationId) => ({
        url: `/${notificationId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),

    // Mark all notifications as read
    markAllNotificationsRead: builder.mutation<MarkAllReadResponse, void>({
      query: () => ({
        url: '/mark-all-read',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi;
```

### Usage in Components

#### 1. Fetch Notifications

```typescript
// components/NotificationsList.tsx
import { useGetNotificationsQuery } from '../api/notificationsApi';

function NotificationsList() {
  const { data, error, isLoading, refetch } = useGetNotificationsQuery();

  // Or with status filter
  // const { data, error, isLoading } = useGetNotificationsQuery({ status: 'sent' });

  if (isLoading) return <div>Loading notifications...</div>;
  if (error) return <div>Error loading notifications</div>;

  return (
    <div>
      <h2>Notifications ({data?.count || 0})</h2>
      {data?.data.map((notification) => (
        <div key={notification._id}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
          <span>Status: {notification.status}</span>
          <span>Type: {notification.type}</span>
        </div>
      ))}
    </div>
  );
}
```

#### 2. Mark Single Notification as Read

```typescript
// components/NotificationItem.tsx
import { useMarkNotificationReadMutation } from '../api/notificationsApi';

interface NotificationItemProps {
  notification: {
    _id: string;
    title: string;
    message: string;
    status: string;
  };
}

function NotificationItem({ notification }: NotificationItemProps) {
  const [markAsRead, { isLoading }] = useMarkNotificationReadMutation();

  const handleMarkAsRead = async () => {
    try {
      await markAsRead(notification._id).unwrap();
      // Notification will be automatically refetched due to invalidatesTags
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <div>
      <h3>{notification.title}</h3>
      <p>{notification.message}</p>
      {notification.status !== 'read' && (
        <button onClick={handleMarkAsRead} disabled={isLoading}>
          {isLoading ? 'Marking...' : 'Mark as Read'}
        </button>
      )}
    </div>
  );
}
```

#### 3. Mark All Notifications as Read

```typescript
// components/NotificationsHeader.tsx
import { useMarkAllNotificationsReadMutation, useGetNotificationsQuery } from '../api/notificationsApi';

function NotificationsHeader() {
  const { data } = useGetNotificationsQuery();
  const [markAllAsRead, { isLoading }] = useMarkAllNotificationsReadMutation();

  const unreadCount = data?.data.filter(n => n.status !== 'read').length || 0;

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      // Notifications will be automatically refetched
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return (
    <div>
      <h2>Notifications</h2>
      {unreadCount > 0 && (
        <button onClick={handleMarkAllAsRead} disabled={isLoading}>
          {isLoading ? 'Marking all as read...' : `Mark all ${unreadCount} as read`}
        </button>
      )}
    </div>
  );
}
```

#### 4. Real-time Updates with Polling

```typescript
// components/NotificationsWithPolling.tsx
import { useGetNotificationsQuery } from '../api/notificationsApi';

function NotificationsWithPolling() {
  // Poll every 30 seconds
  const { data, error, isLoading } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div>
      <h2>Notifications (Auto-refreshing every 30s)</h2>
      {data?.data.map((notification) => (
        <div key={notification._id}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
}
```

#### 5. Filtered Notifications

```typescript
// components/UnreadNotifications.tsx
import { useGetNotificationsQuery } from '../api/notificationsApi';

function UnreadNotifications() {
  const { data, error, isLoading } = useGetNotificationsQuery({ status: 'sent' });

  if (isLoading) return <div>Loading unread notifications...</div>;
  if (error) return <div>Error loading notifications</div>;

  return (
    <div>
      <h2>Unread Notifications ({data?.count || 0})</h2>
      {data?.data.map((notification) => (
        <div key={notification._id}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
}
```

### Store Configuration

```typescript
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { notificationsApi } from './api/notificationsApi';
// ... other imports

export const store = configureStore({
  reducer: {
    // ... other reducers
    [notificationsApi.reducerPath]: notificationsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(notificationsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## Error Handling

### Standard Error Response Format

All errors follow this structure:

```typescript
interface ErrorResponse {
  success: false;
  message: string;
}
```

### Common Error Status Codes

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| `400` | Bad Request | Invalid notification ID format |
| `401` | Unauthorized | Missing or invalid authentication token |
| `404` | Not Found | Notification doesn't exist or doesn't belong to user |
| `500` | Internal Server Error | Server-side error |

### Error Handling in RTK Query

RTK Query automatically handles errors. You can access them in your components:

```typescript
const { data, error, isLoading } = useGetNotificationsQuery();

if (error) {
  // Check if it's a fetch error or API error
  if ('status' in error) {
    // API error
    const apiError = error.data as ErrorResponse;
    console.error('API Error:', apiError.message);
  } else {
    // Network error
    console.error('Network Error:', error.message);
  }
}
```

### Custom Error Handling

```typescript
const [markAsRead, { error, isLoading }] = useMarkNotificationReadMutation();

const handleMarkAsRead = async () => {
  try {
    const result = await markAsRead(notificationId).unwrap();
    // Success handling
    toast.success(result.message);
  } catch (error: any) {
    // Error handling
    if (error.status === 404) {
      toast.error('Notification not found');
    } else if (error.status === 401) {
      toast.error('Please log in again');
      // Redirect to login
    } else {
      toast.error(error.data?.message || 'An error occurred');
    }
  }
};
```

---

## Service Functions (Backend Only)

These functions are used internally by the backend to create notifications. They are not exposed as API endpoints but are documented here for reference.

### `createNotification`

Creates a single notification for a specific user.

**Parameters:**
```typescript
interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'announcement' | 'health_education' | 'system' | 'medical' | 'inventory' | 'user';
  relatedId?: string;
  relatedType?: 'appointment' | 'announcement' | 'health_education' | 'medical_record' | 'pregnancy_record';
}
```

**Usage Example (Backend):**
```typescript
import { createNotification } from '../services/notificationService';

await createNotification({
  userId: '507f191e810c19729de860ea',
  title: 'Appointment Reminder',
  message: 'Your appointment is scheduled for tomorrow at 2:00 PM.',
  type: 'appointment',
  relatedId: '507f1f77bcf86cd799439012',
  relatedType: 'appointment'
});
```

### `notifyUsersByRole`

Creates notifications for all users with a specific role.

**Parameters:**
```typescript
notifyUsersByRole(
  role: UserRole,
  title: string,
  message: string,
  type: CreateNotificationParams['type'],
  relatedId?: string,
  relatedType?: CreateNotificationParams['relatedType']
): Promise<void>
```

**Usage Example (Backend):**
```typescript
import { notifyUsersByRole } from '../services/notificationService';
import { UserRole } from '../types';

await notifyUsersByRole(
  UserRole.PATIENT,
  'New Health Education Available',
  'Check out our latest health education article on nutrition.',
  'health_education',
  '507f1f77bcf86cd799439012',
  'health_education'
);
```

### `notifyAllUsers`

Creates notifications for all active users.

**Parameters:**
```typescript
notifyAllUsers(
  title: string,
  message: string,
  type: CreateNotificationParams['type'],
  relatedId?: string,
  relatedType?: CreateNotificationParams['relatedType']
): Promise<void>
```

**Usage Example (Backend):**
```typescript
import { notifyAllUsers } from '../services/notificationService';

await notifyAllUsers(
  'System Maintenance',
  'Scheduled maintenance will occur on January 20th from 2:00 AM to 4:00 AM.',
  'system'
);
```

**Note:** These service functions are designed to not throw errors. If notification creation fails, it logs the error but doesn't interrupt the main application flow.

---

## Best Practices

1. **Polling Strategy**: Use polling sparingly. Consider using WebSockets or Server-Sent Events for real-time updates instead of constant polling.

2. **Caching**: RTK Query automatically caches responses. Use `refetch` or `invalidateTags` when you need fresh data.

3. **Optimistic Updates**: Consider implementing optimistic updates for marking notifications as read to improve perceived performance.

4. **Error Boundaries**: Wrap notification components in error boundaries to handle unexpected errors gracefully.

5. **Loading States**: Always show loading states while fetching notifications to improve user experience.

6. **Pagination**: Currently, the API returns all notifications. If you expect many notifications, consider implementing pagination on the backend.

---

## TypeScript Types Summary

For easy reference, here are all the TypeScript types you'll need:

```typescript
// Notification Types
type NotificationType = 
  | 'appointment' 
  | 'announcement' 
  | 'health_education' 
  | 'system' 
  | 'medical' 
  | 'inventory' 
  | 'user';

type NotificationStatus = 'sent' | 'read' | 'acknowledged';

type RelatedType = 
  | 'appointment' 
  | 'announcement' 
  | 'health_education' 
  | 'medical_record' 
  | 'pregnancy_record';

// Notification Object
interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  relatedId?: string | null;
  relatedType?: RelatedType | null;
  createdAt: string;
  updatedAt: string;
}

// API Responses
interface GetNotificationsResponse {
  success: true;
  count: number;
  data: Notification[];
}

interface MarkReadResponse {
  success: true;
  message: string;
  data: Notification;
}

interface MarkAllReadResponse {
  success: true;
  message: string;
}

interface ErrorResponse {
  success: false;
  message: string;
}
```

---

## Support

For issues or questions about the Notification API, please contact the backend development team or refer to the main project documentation.

