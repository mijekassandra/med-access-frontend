# Appointments API – Frontend Integration Guide

This document describes how to connect your frontend to the MedAccess backend **Appointments** API. Use it to implement listing, creating, viewing, updating, rescheduling, status updates, prescription uploads, and deleting appointments with correct types, auth, and error handling.

---

## Table of Contents

1. [Base URL & Authentication](#base-url--authentication)
2. [TypeScript / JavaScript Types](#typescript--javascript-types)
3. [Endpoints Overview](#endpoints-overview)
4. [Endpoint Reference](#endpoint-reference)
5. [Error Handling](#error-handling)
6. [Role-Based Access](#role-based-access)
7. [Example Usage (Fetch & Axios)](#example-usage-fetch--axios)

---

## Base URL & Authentication

- **Base path:** `/api/appointments`
- **Full URL (local):** `http://localhost:3001/api/appointments` (or your backend `PORT` from `.env`)

All appointment endpoints require authentication. Send the JWT in one of these ways:

| Method | Description |
|--------|-------------|
| **Authorization header** | `Authorization: Bearer <your_jwt_token>` |
| **Cookie** | Cookie named `token` with the JWT value |

Use the same token your frontend receives after login (e.g. from your auth/login API).

**CORS:** Ensure your frontend origin is allowed. The backend uses `CORS_ORIGIN` from `.env` (e.g. `http://localhost:3000` for a local React app). For cross-origin requests, include `credentials: 'include'` if using cookies.

---

## TypeScript / JavaScript Types

Copy these types into your frontend (e.g. `types/appointment.ts` or `api/appointment.types.ts`) so requests and responses are type-safe.

```typescript
// Enums / literals
export type AppointmentType = 'telemedicine' | 'in-person';
export type AppointmentStatus = 'pending' | 'accepted' | 'serving' | 'completed' | 'denied';

// Create – request body
export interface AppointmentCreate {
  patient?: string;        // Optional; omit to use authenticated user as patient (admins/doctors can pass patient ID)
  type: AppointmentType;
  date: string;            // ISO date string, e.g. "2025-03-15T14:00:00.000Z"
  reason: string;          // Max 1000 characters
}

// Update – request body (only editable while status is 'pending')
export interface AppointmentUpdate {
  type?: AppointmentType;
  date?: string;           // ISO date string
  reason?: string;
}

// Reschedule – request body
export interface AppointmentReschedule {
  date: string;            // ISO date string, required
  reason?: string;
}

// Status update – request body
export interface AppointmentStatusUpdate {
  status: AppointmentStatus;
  doctorCancellationRemarks?: string;  // Required when doctor/admin sets status to 'denied'; max 1000 chars
}

// Populated patient (returned in appointment.patient)
export interface AppointmentPatient {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
}

// Single appointment (API response shape)
export interface Appointment {
  _id: string;
  patient: string | AppointmentPatient;  // Populated in API responses
  type: AppointmentType;
  status: AppointmentStatus;
  date: string;                           // ISO date string in JSON
  reason: string;
  queueNumber?: number | null;            // Assigned when status becomes 'accepted'
  doctorCancellationRemarks?: string | null;
  prescriptionUrl?: string | null;
  prescriptionFileName?: string | null;
  prescriptionUploadedAt?: string | null;  // ISO date
  prescriptionUploadedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Single appointment API response
export interface AppointmentResponse {
  success: boolean;
  data?: Appointment;
  message?: string;
}

// List API response
export interface AppointmentsListResponse {
  success: boolean;
  count?: number;
  data?: Appointment[];
  message?: string;
}
```

---

## Endpoints Overview

| Method | Path | Auth | Roles | Description |
|--------|------|------|--------|-------------|
| `GET` | `/api/appointments` | Required | All | List appointments (patients see own; doctors/admin see all). Optional `?date=YYYY-MM-DD` to filter by day. |
| `GET` | `/api/appointments/:id` | Required | All | Get one appointment by ID |
| `POST` | `/api/appointments` | Required | All | Create an appointment (patient for self; admin/doctor for a patient) |
| `PUT` | `/api/appointments/:id` | Required | Owner, Doctor, Admin | Update appointment details (only while status is `pending`) |
| `PATCH` | `/api/appointments/:id/reschedule` | Required | User, Doctor, Admin | Reschedule date (and optionally reason); sets status back to `pending` |
| `PATCH` | `/api/appointments/:id/status` | Required | User, Doctor, Admin | Update status (patients: `denied` or `pending`; doctors/admins: any status) |
| `PATCH` | `/api/appointments/:id/accept` | Required | Doctor, Admin | Accept a pending appointment (assigns queue number) |
| `PATCH` | `/api/appointments/:id/prescription` | Required | Doctor, Admin | Upload prescription file (multipart/form-data, field: `prescription`) |
| `DELETE` | `/api/appointments/:id` | Required | Owner, Doctor, Admin | Delete an appointment |

---

## Endpoint Reference

### 1. List appointments

**Request**

- **Method:** `GET`
- **URL:** `GET /api/appointments` or `GET /api/appointments?date=2025-03-15`
- **Headers:** `Authorization: Bearer <token>` (or cookie `token`)
- **Query (optional):** `date` – ISO date string (e.g. `2025-03-15`) to filter appointments for that day only
- **Body:** None

**Response (200)**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "patient": {
        "_id": "...",
        "firstName": "Jane",
        "lastName": "Doe",
        "username": "jane.doe"
      },
      "type": "telemedicine",
      "status": "pending",
      "date": "2025-03-15T14:00:00.000Z",
      "reason": "Follow-up consultation",
      "queueNumber": null,
      "doctorCancellationRemarks": null,
      "prescriptionUrl": null,
      "prescriptionFileName": null,
      "prescriptionUploadedAt": null,
      "prescriptionUploadedBy": null,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

- **Patients (USER):** Only appointments where they are the `patient`.
- **Doctors/Admins:** All appointments (optionally filtered by `date`).

---

### 2. Get one appointment

**Request**

- **Method:** `GET`
- **URL:** `GET /api/appointments/:id`
- **Headers:** `Authorization: Bearer <token>` (or cookie `token`)
- **Params:** `id` – MongoDB ObjectId of the appointment

**Response (200)**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "patient": { "_id": "...", "firstName": "...", "lastName": "...", "username": "..." },
    "type": "in-person",
    "status": "accepted",
    "date": "2025-03-15T09:00:00.000Z",
    "reason": "...",
    "queueNumber": 3,
    "doctorCancellationRemarks": null,
    "prescriptionUrl": "https://...",
    "prescriptionFileName": "prescription.pdf",
    "prescriptionUploadedAt": "2025-03-15T10:00:00.000Z",
    "prescriptionUploadedBy": "Dr. John Smith",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors**

- `400` – Invalid appointment id (not a valid ObjectId).
- `403` – Patient trying to access another patient’s appointment.
- `404` – Appointment not found.

---

### 3. Create appointment

**Request**

- **Method:** `POST`
- **URL:** `POST /api/appointments`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:** `AppointmentCreate`

```json
{
  "type": "telemedicine",
  "date": "2025-03-20T14:00:00.000Z",
  "reason": "Annual check-up"
}
```

For **admin/doctor** creating on behalf of a patient:

```json
{
  "patient": "507f1f77bcf86cd799439011",
  "type": "in-person",
  "date": "2025-03-20T09:00:00.000Z",
  "reason": "Follow-up"
}
```

**Response (201)**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "patient": { "_id": "...", "firstName": "...", "lastName": "...", "username": "..." },
    "type": "telemedicine",
    "status": "pending",
    "date": "2025-03-20T14:00:00.000Z",
    "reason": "Annual check-up",
    "queueNumber": null,
    "doctorCancellationRemarks": null,
    "prescriptionUrl": null,
    "prescriptionFileName": null,
    "prescriptionUploadedAt": null,
    "prescriptionUploadedBy": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors**

- `400` – Missing required fields (`type`, `date`, `reason`), invalid date, or invalid patient id.
- `401` – Unauthorized (no/invalid token).
- `404` – Patient user not found (when `patient` is provided).

---

### 4. Update appointment (only while pending)

**Request**

- **Method:** `PUT`
- **URL:** `PUT /api/appointments/:id`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Params:** `id` – Appointment ObjectId
- **Body:** `AppointmentUpdate` (only send fields to change)

```json
{
  "type": "in-person",
  "date": "2025-03-21T10:00:00.000Z",
  "reason": "Updated reason for visit"
}
```

**Response (200)**

Same shape as create: `{ "success": true, "data": <Appointment> }`.

**Errors**

- `400` – Invalid appointment id, invalid date, or appointment is not `pending` (only pending appointments can be edited).
- `403` – Not owner, doctor, or admin.
- `404` – Appointment not found.

---

### 5. Reschedule appointment

**Request**

- **Method:** `PATCH`
- **URL:** `PATCH /api/appointments/:id/reschedule`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Params:** `id` – Appointment ObjectId
- **Body:** `AppointmentReschedule`

```json
{
  "date": "2025-03-25T15:00:00.000Z",
  "reason": "Optional updated reason"
}
```

- Rescheduling sets status back to `pending`, clears `queueNumber` and `doctorCancellationRemarks`.
- Completed appointments cannot be rescheduled.

**Response (200)**

`{ "success": true, "data": <Appointment> }`.

**Errors**

- `400` – Invalid appointment id, missing `date`, invalid date, or appointment is `completed`.
- `403` – Not owner, doctor, or admin.
- `404` – Appointment not found.

---

### 6. Update appointment status

**Request**

- **Method:** `PATCH`
- **URL:** `PATCH /api/appointments/:id/status`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Params:** `id` – Appointment ObjectId
- **Body:** `AppointmentStatusUpdate`

```json
{
  "status": "accepted"
}
```

When **denying** as doctor/admin, remarks are required:

```json
{
  "status": "denied",
  "doctorCancellationRemarks": "Fully booked for that day; please choose another date."
}
```

**Status rules**

- **Patients:** Can only set `denied` (cancel) or `pending` on their own appointments. Cannot set `accepted`, `serving`, or `completed`.
- **Doctors/Admins:** Can set any status. When setting `denied`, `doctorCancellationRemarks` is required (max 1000 characters).
- **Accepted:** When status is set to `accepted`, the backend assigns a `queueNumber` for that day (max 100 per day).

**Response (200)**

`{ "success": true, "data": <Appointment> }`.

**Errors**

- `400` – Invalid appointment id; when denying as doctor/admin, missing or too long `doctorCancellationRemarks`; or daily queue limit (100) reached when accepting.
- `403` – Not allowed to set this status (e.g. patient trying to set `accepted`).
- `404` – Appointment not found.

---

### 7. Accept appointment (doctor/admin shortcut)

**Request**

- **Method:** `PATCH`
- **URL:** `PATCH /api/appointments/:id/accept`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Params:** `id` – Appointment ObjectId
- **Body:** None (or empty object)

Equivalent to `PATCH /api/appointments/:id/status` with `{ "status": "accepted" }`. Assigns queue number if within daily limit.

**Response (200)**

`{ "success": true, "data": <Appointment> }`.

**Errors**

- Same as status update with `status: "accepted"` (400 invalid id, queue limit, 403/404).

---

### 8. Upload prescription

**Request**

- **Method:** `PATCH`
- **URL:** `PATCH /api/appointments/:id/prescription`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Params:** `id` – Appointment ObjectId
- **Body:** Form data with a **single file** under the field name **`prescription`**.

**Allowed file types:** JPEG, PNG, GIF, PDF. Max size: **5MB**.

**Example (JavaScript FormData)**

```javascript
const formData = new FormData();
formData.append('prescription', file);  // file from <input type="file" />
```

**Response (200)**

`{ "success": true, "data": <Appointment> }` with updated `prescriptionUrl`, `prescriptionFileName`, `prescriptionUploadedAt`, `prescriptionUploadedBy`. The patient is notified.

**Errors**

- `400` – Invalid appointment id or no file in field `prescription`.
- `401` – Unauthorized.
- `403` – Not Doctor or Admin.
- `404` – Appointment not found.
- `502` – Prescription upload to S3 failed (backend storage not configured or error).

---

### 9. Delete appointment

**Request**

- **Method:** `DELETE`
- **URL:** `DELETE /api/appointments/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Params:** `id` – Appointment ObjectId
- **Body:** None

**Response (200)**

```json
{
  "success": true,
  "message": "Appointment deleted"
}
```

**Errors**

- `400` – Invalid appointment id.
- `403` – Not owner, doctor, or admin.
- `404` – Appointment not found.

---

## Error Handling

All error responses use this shape:

```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

Use the same `AppointmentResponse` / `AppointmentsListResponse` types and treat `success === false` as error, reading `message` for the user.

**Status codes**

| Code | Meaning |
|------|--------|
| 400 | Bad request (validation, invalid id, business rule) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (wrong role or not owner) |
| 404 | Resource not found |
| 500 | Server error |
| 502 | External service error (e.g. S3 upload failed) |

---

## Role-Based Access

| Role   | List | Get one | Create | Update (PUT) | Reschedule | Status | Accept | Prescription | Delete |
|--------|------|---------|--------|--------------|------------|--------|--------|---------------|--------|
| Patient (USER) | Own only | Own only | Own | Own, pending only | Own | Own: `denied`/`pending` only | No | No | Own |
| Doctor | All | All | Any patient | Any | Any | Any | Yes | Yes | Any |
| Admin  | All | All | Any patient | Any | Any | Any | Yes | Yes | Any |

- **List:** Patients see only appointments where they are the `patient`; doctors and admins see all (optional `?date=` filter).
- **Get one:** Patients can only open an appointment if they are the `patient`.
- **Status:** Patients may only set `denied` or `pending` on their own appointments; doctors/admins may set any status and must provide `doctorCancellationRemarks` when denying.

---

## Example Usage (Fetch & Axios)

Replace `API_BASE` and `getToken()` with your app’s config and auth.

### Configuration

```typescript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function getAuthHeaders(): HeadersInit {
  const token = getToken(); // Your function to get JWT from storage/cookie
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
```

### Fetch

```typescript
// List (optional date filter)
const listAppointments = async (date?: string): Promise<AppointmentsListResponse> => {
  const url = date ? `${API_BASE}/api/appointments?date=${date}` : `${API_BASE}/api/appointments`;
  const res = await fetch(url, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch appointments');
  return json;
};

// Get one
const getAppointment = async (id: string): Promise<AppointmentResponse> => {
  const res = await fetch(`${API_BASE}/api/appointments/${id}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch appointment');
  return json;
};

// Create
const createAppointment = async (body: AppointmentCreate): Promise<AppointmentResponse> => {
  const res = await fetch(`${API_BASE}/api/appointments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to create appointment');
  return json;
};

// Update (only while pending)
const updateAppointment = async (id: string, body: AppointmentUpdate): Promise<AppointmentResponse> => {
  const res = await fetch(`${API_BASE}/api/appointments/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update appointment');
  return json;
};

// Reschedule
const rescheduleAppointment = async (id: string, body: AppointmentReschedule): Promise<AppointmentResponse> => {
  const res = await fetch(`${API_BASE}/api/appointments/${id}/reschedule`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to reschedule appointment');
  return json;
};

// Update status
const updateAppointmentStatus = async (id: string, body: AppointmentStatusUpdate): Promise<AppointmentResponse> => {
  const res = await fetch(`${API_BASE}/api/appointments/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update status');
  return json;
};

// Accept (doctor/admin)
const acceptAppointment = async (id: string): Promise<AppointmentResponse> => {
  const res = await fetch(`${API_BASE}/api/appointments/${id}/accept`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({}),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to accept appointment');
  return json;
};

// Upload prescription (doctor/admin) – use FormData, do not set Content-Type (browser sets multipart boundary)
const uploadPrescription = async (id: string, file: File): Promise<AppointmentResponse> => {
  const formData = new FormData();
  formData.append('prescription', file);
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/appointments/${id}/prescription`, {
    method: 'PATCH',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: 'include',
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to upload prescription');
  return json;
};

// Delete
const deleteAppointment = async (id: string): Promise<AppointmentResponse> => {
  const res = await fetch(`${API_BASE}/api/appointments/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to delete appointment');
  return json;
};
```

### Axios

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const appointmentsApi = {
  list: (date?: string) =>
    api.get<AppointmentsListResponse>('/api/appointments', date ? { params: { date } } : undefined),
  getById: (id: string) => api.get<AppointmentResponse>(`/api/appointments/${id}`),
  create: (body: AppointmentCreate) => api.post<AppointmentResponse>('/api/appointments', body),
  update: (id: string, body: AppointmentUpdate) => api.put<AppointmentResponse>(`/api/appointments/${id}`, body),
  reschedule: (id: string, body: AppointmentReschedule) =>
    api.patch<AppointmentResponse>(`/api/appointments/${id}/reschedule`, body),
  updateStatus: (id: string, body: AppointmentStatusUpdate) =>
    api.patch<AppointmentResponse>(`/api/appointments/${id}/status`, body),
  accept: (id: string) => api.patch<AppointmentResponse>(`/api/appointments/${id}/accept`, {}),
  uploadPrescription: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('prescription', file);
    return api.patch<AppointmentResponse>(`/api/appointments/${id}/prescription`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id: string) => api.delete<AppointmentResponse>(`/api/appointments/${id}`),
};
```

---

## Quick checklist for frontend

- [ ] Set `API_BASE` / `baseURL` to your backend (e.g. `http://localhost:3001`).
- [ ] Send JWT via `Authorization: Bearer <token>` or cookie `token` on every request.
- [ ] Use `AppointmentCreate` for POST, `AppointmentUpdate` for PUT, `AppointmentReschedule` for reschedule, `AppointmentStatusUpdate` for status.
- [ ] Use ISO date strings for `date` (e.g. `"2025-03-15T14:00:00.000Z"`).
- [ ] When doctor/admin denies an appointment, always send `doctorCancellationRemarks` (max 1000 characters).
- [ ] Prescription upload: use `multipart/form-data` with field name **`prescription`**; allowed types JPEG/PNG/GIF/PDF, max 5MB.
- [ ] Check `response.success` and `response.message` for errors.
- [ ] Restrict accept and prescription upload to Doctor and Admin; allow patients to create/update/reschedule/cancel their own appointments only.
- [ ] Only allow editing (PUT) when `status === 'pending'`; use reschedule for date changes on non-pending appointments (except completed).

This guide is aligned with `src/models/Appointment.ts`, `src/controllers/appointmentController.ts`, `src/routes/appointmentRoutes.ts`, and `src/types/appointment.types.ts` in the MedAccess backend.
