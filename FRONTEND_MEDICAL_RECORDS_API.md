# Medical Records API – Frontend Integration Guide

This document describes how to connect your frontend to the MedAccess backend **Medical Records** API. Use it to implement listing, creating, viewing, updating, and deleting medical records with correct types, auth, and error handling.

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

- **Base path:** `/api/medical-records`
- **Full URL (local):** `http://localhost:3001/api/medical-records` (or your backend `PORT` from `.env`)

All medical record endpoints require authentication. Send the JWT in one of these ways:

| Method | Description |
|--------|-------------|
| **Authorization header** | `Authorization: Bearer <your_jwt_token>` |
| **Cookie** | Cookie named `token` with the JWT value |

Use the same token your frontend receives after login (e.g. from your auth/login API).

**CORS:** Ensure your frontend origin is allowed. The backend uses `CORS_ORIGIN` from `.env` (e.g. `http://localhost:3000` for a local React app). For cross-origin requests, include `credentials: 'include'` if using cookies.

---

## TypeScript / JavaScript Types

Copy these types into your frontend (e.g. `types/medicalRecord.ts` or `api/medicalRecord.types.ts`) so requests and responses are type-safe.

```typescript
// Create – request body
export interface MedicalRecordCreate {
  patient: string;           // User ID (MongoDB ObjectId) of the patient
  diagnosis: string;
  dateOfRecord: string;      // ISO date string, e.g. "2025-03-15"
  treatmentPlan: string;
}

// Update – request body (all fields optional)
export interface MedicalRecordUpdate {
  diagnosis?: string;
  dateOfRecord?: string;     // ISO date string
  treatmentPlan?: string;
}

// Populated patient (returned in record.patient)
export interface MedicalRecordPatient {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
}

// Single medical record (API response shape)
export interface MedicalRecord {
  _id: string;
  patient: string | MedicalRecordPatient;  // Populated in API responses
  doctorName: string;
  diagnosis: string;
  dateOfRecord: string;      // ISO date string in JSON
  treatmentPlan: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Single record API response
export interface MedicalRecordResponse {
  success: boolean;
  data?: MedicalRecord;
  message?: string;
}

// List API response
export interface MedicalRecordsListResponse {
  success: boolean;
  count?: number;
  data?: MedicalRecord[];
  message?: string;
}
```

---

## Endpoints Overview

| Method | Path | Auth | Roles | Description |
|--------|------|------|--------|-------------|
| `GET` | `/api/medical-records` | Required | All | List records (patients see own; doctors/admin see all) |
| `GET` | `/api/medical-records/:id` | Required | All | Get one record by ID |
| `POST` | `/api/medical-records` | Required | Doctor, Admin | Create a record |
| `PUT` | `/api/medical-records/:id` | Required | Doctor, Admin | Update a record |
| `DELETE` | `/api/medical-records/:id` | Required | Doctor, Admin | Soft-delete (unpublish) a record |

---

## Endpoint Reference

### 1. List medical records

**Request**

- **Method:** `GET`
- **URL:** `GET /api/medical-records`
- **Headers:** `Authorization: Bearer <token>` (or cookie `token`)
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
      "doctorName": "Dr. John Smith",
      "diagnosis": "...",
      "dateOfRecord": "2025-03-15T00:00:00.000Z",
      "treatmentPlan": "...",
      "isPublished": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

- **Patients (USER):** Only records where `patient` equals their user ID.
- **Doctors/Admins:** All published records.

---

### 2. Get one medical record

**Request**

- **Method:** `GET`
- **URL:** `GET /api/medical-records/:id`
- **Headers:** `Authorization: Bearer <token>` (or cookie `token`)
- **Params:** `id` – MongoDB ObjectId of the record

**Response (200)**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "patient": { "_id": "...", "firstName": "...", "lastName": "...", "username": "..." },
    "doctorName": "...",
    "diagnosis": "...",
    "dateOfRecord": "2025-03-15T00:00:00.000Z",
    "treatmentPlan": "...",
    "isPublished": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors**

- `400` – Invalid record id (not a valid ObjectId).
- `403` – Patient trying to access another patient’s record.
- `404` – Record not found or not published.

---

### 3. Create medical record

**Request**

- **Method:** `POST`
- **URL:** `POST /api/medical-records`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:** `MedicalRecordCreate`

```json
{
  "patient": "507f1f77bcf86cd799439011",
  "diagnosis": "Hypertension, controlled",
  "dateOfRecord": "2025-03-15",
  "treatmentPlan": "Continue current medication; follow up in 3 months."
}
```

**Response (201)**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "patient": { "_id": "...", "firstName": "...", "lastName": "...", "username": "..." },
    "doctorName": "Dr. John Smith",
    "diagnosis": "Hypertension, controlled",
    "dateOfRecord": "2025-03-15T00:00:00.000Z",
    "treatmentPlan": "Continue current medication; follow up in 3 months.",
    "isPublished": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors**

- `400` – Missing required fields or invalid patient id.
- `401` – Unauthorized (e.g. no/invalid token or user missing name).
- `403` – User is not Doctor or Admin.
- `404` – Patient user not found.

---

### 4. Update medical record

**Request**

- **Method:** `PUT`
- **URL:** `PUT /api/medical-records/:id`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Params:** `id` – Record ObjectId
- **Body:** `MedicalRecordUpdate` (only send fields to change)

```json
{
  "diagnosis": "Hypertension, well controlled",
  "dateOfRecord": "2025-03-15",
  "treatmentPlan": "Continue medication; next visit in 2 months."
}
```

**Response (200)**

Same shape as create: `{ "success": true, "data": <MedicalRecord> }`.

**Errors**

- `400` – Invalid record id.
- `403` – Not Doctor or Admin.
- `404` – Record not found.

---

### 5. Delete (unpublish) medical record

**Request**

- **Method:** `DELETE`
- **URL:** `DELETE /api/medical-records/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Params:** `id` – Record ObjectId
- **Body:** None

**Response (200)**

```json
{
  "success": true,
  "message": "Medical record unpublished"
}
```

The record is not removed from the database; `isPublished` is set to `false`, so it no longer appears in list/get.

**Errors**

- `400` – Invalid record id.
- `403` – Not Doctor or Admin.
- `404` – Record not found.

---

## Error Handling

All error responses use this shape:

```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

Optional: use the same `MedicalRecordResponse` / `MedicalRecordsListResponse` types and treat `success === false` as error, reading `message` for the user.

**Status codes**

| Code | Meaning |
|------|--------|
| 400 | Bad request (validation, invalid id) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (wrong role or not owner) |
| 404 | Resource not found |
| 500 | Server error |

---

## Role-Based Access

| Role   | List | Get one | Create | Update | Delete |
|--------|------|---------|--------|--------|--------|
| Patient (USER) | Own only | Own only | No | No | No |
| Doctor | All | All | Yes | Yes | Yes |
| Admin  | All | All | Yes | Yes | Yes |

- **List:** Patients get only records where they are the `patient`; doctors and admins get all published records.
- **Get one:** Patients can only open a record if `record.patient` is their user ID.

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
// List
const listRecords = async (): Promise<MedicalRecordsListResponse> => {
  const res = await fetch(`${API_BASE}/api/medical-records`, {
    headers: getAuthHeaders(),
    credentials: 'include', // if using cookies
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch records');
  return json;
};

// Get one
const getRecord = async (id: string): Promise<MedicalRecordResponse> => {
  const res = await fetch(`${API_BASE}/api/medical-records/${id}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch record');
  return json;
};

// Create
const createRecord = async (body: MedicalRecordCreate): Promise<MedicalRecordResponse> => {
  const res = await fetch(`${API_BASE}/api/medical-records`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to create record');
  return json;
};

// Update
const updateRecord = async (id: string, body: MedicalRecordUpdate): Promise<MedicalRecordResponse> => {
  const res = await fetch(`${API_BASE}/api/medical-records/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update record');
  return json;
};

// Delete
const deleteRecord = async (id: string): Promise<MedicalRecordResponse> => {
  const res = await fetch(`${API_BASE}/api/medical-records/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to delete record');
  return json;
};
```

### Axios

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // if using cookies
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const medicalRecordsApi = {
  list: () => api.get<MedicalRecordsListResponse>('/api/medical-records'),
  getById: (id: string) => api.get<MedicalRecordResponse>(`/api/medical-records/${id}`),
  create: (body: MedicalRecordCreate) => api.post<MedicalRecordResponse>('/api/medical-records', body),
  update: (id: string, body: MedicalRecordUpdate) => api.put<MedicalRecordResponse>(`/api/medical-records/${id}`, body),
  delete: (id: string) => api.delete<MedicalRecordResponse>(`/api/medical-records/${id}`),
};
```

---

## Quick checklist for frontend

- [ ] Set `API_BASE` / `baseURL` to your backend (e.g. `http://localhost:3001`).
- [ ] Send JWT via `Authorization: Bearer <token>` or cookie `token` on every request.
- [ ] Use `MedicalRecordCreate` for POST body and `MedicalRecordUpdate` for PUT body.
- [ ] Use ISO date strings for `dateOfRecord` (e.g. `"2025-03-15"`).
- [ ] Check `response.success` and `response.message` for errors.
- [ ] Restrict create/update/delete UI to Doctor and Admin roles; show list/detail to all authenticated users, with patients seeing only their own records.

This guide is aligned with `src/controllers/medicalRecordController.ts` and `src/types/medicalRecord.types.ts` in the MedAccess backend.
