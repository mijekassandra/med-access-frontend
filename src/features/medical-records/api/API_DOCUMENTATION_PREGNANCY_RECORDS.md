# Pregnancy Records API Documentation

## Base URL
```
/api/pregnancy-records
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Get All Pregnancy Records

**GET** `/api/pregnancy-records`

**Description:** Retrieves all pregnancy records. Patients can only see their own records, while doctors and admins can see all records.

**Authorization:**
- ✅ All authenticated users (USER, DOCTOR, ADMIN)
- Patients: Only their own records
- Doctors/Admins: All records

**Query Parameters:** None

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
- **Status:** `200 OK`
- **Body:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "patient": {
        "_id": "507f1f77bcf86cd799439012",
        "firstName": "Jane",
        "lastName": "Doe",
        "username": "jane.doe"
      },
      "firstDayOfLastPeriod": "2024-01-15T00:00:00.000Z",
      "numberOfWeeks": 12,
      "status": "Normal",
      "remarks": "Regular checkups scheduled",
      "checkups": [
        {
          "date": "2024-02-01T00:00:00.000Z",
          "remarks": "First trimester checkup completed"
        }
      ],
      "createdAt": "2024-01-20T10:00:00.000Z",
      "updatedAt": "2024-01-25T15:30:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "Server error fetching pregnancy records"
}
```

---

### 2. Get Pregnancy Record by ID

**GET** `/api/pregnancy-records/:id`

**Description:** Retrieves a specific pregnancy record by ID. Patients can only access their own records.

**Authorization:**
- ✅ All authenticated users (USER, DOCTOR, ADMIN)
- Patients: Only their own records
- Doctors/Admins: All records

**Path Parameters:**
- `id` (string, required): MongoDB ObjectId of the pregnancy record

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
- **Status:** `200 OK`
- **Body:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "patient": {
      "_id": "507f1f77bcf86cd799439012",
      "firstName": "Jane",
      "lastName": "Doe",
      "username": "jane.doe"
    },
    "firstDayOfLastPeriod": "2024-01-15T00:00:00.000Z",
    "numberOfWeeks": 12,
    "status": "Normal",
    "remarks": "Regular checkups scheduled",
    "checkups": [
      {
        "date": "2024-02-01T00:00:00.000Z",
        "remarks": "First trimester checkup completed"
      }
    ],
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-25T15:30:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid record id
```json
{
  "success": false,
  "message": "Invalid record id"
}
```

- `403 Forbidden` - Access denied (patient trying to access another patient's record)
```json
{
  "success": false,
  "message": "Access denied"
}
```

- `404 Not Found` - Record not found
```json
{
  "success": false,
  "message": "Pregnancy record not found"
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "Server error fetching pregnancy record"
}
```

---

### 3. Create Pregnancy Record

**POST** `/api/pregnancy-records`

**Description:** Creates a new pregnancy record. Only doctors and admins can create records.

**Authorization:**
- ✅ DOCTOR, ADMIN only
- ❌ USER (patients cannot create their own records)

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```typescript
{
  patient: string;                    // Required: User ID (MongoDB ObjectId)
  firstDayOfLastPeriod: string;       // Required: ISO date string (e.g., "2024-01-15")
  numberOfWeeks: number;               // Required: Number between 0-45
  status?: string;                     // Optional: Max 100 characters (default: "")
  remarks?: string;                     // Optional: Max 2000 characters (default: "")
  checkups?: Array<{                   // Optional: Array of checkups
    date: string;                      // ISO date string
    remarks: string;                   // Max 1000 characters
  }>;
}
```

**Example Request:**
```json
{
  "patient": "507f1f77bcf86cd799439012",
  "firstDayOfLastPeriod": "2024-01-15",
  "numberOfWeeks": 12,
  "status": "Normal",
  "remarks": "Regular checkups scheduled",
  "checkups": [
    {
      "date": "2024-02-01",
      "remarks": "First trimester checkup scheduled"
    }
  ]
}
```

**Response:**
- **Status:** `201 Created`
- **Body:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "patient": {
      "_id": "507f1f77bcf86cd799439012",
      "firstName": "Jane",
      "lastName": "Doe",
      "username": "jane.doe"
    },
    "firstDayOfLastPeriod": "2024-01-15T00:00:00.000Z",
    "numberOfWeeks": 12,
    "status": "Normal",
    "remarks": "Regular checkups scheduled",
    "checkups": [
      {
        "date": "2024-02-01T00:00:00.000Z",
        "remarks": "First trimester checkup scheduled"
      }
    ],
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields
```json
{
  "success": false,
  "message": "Missing required fields: patient, firstDayOfLastPeriod, and numberOfWeeks are required"
}
```

- `400 Bad Request` - Invalid patient id
```json
{
  "success": false,
  "message": "Invalid patient id"
}
```

- `404 Not Found` - Patient user not found
```json
{
  "success": false,
  "message": "Patient user not found"
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "Server error creating pregnancy record"
}
```

---

### 4. Update Pregnancy Record

**PUT** `/api/pregnancy-records/:id`

**Description:** Updates an existing pregnancy record. Only doctors and admins can update records.

**Authorization:**
- ✅ DOCTOR, ADMIN only
- ❌ USER (patients cannot update records)

**Path Parameters:**
- `id` (string, required): MongoDB ObjectId of the pregnancy record

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```typescript
{
  firstDayOfLastPeriod?: string;  // Optional: ISO date string
  numberOfWeeks?: number;          // Optional: Number between 0-45
  status?: string;                 // Optional: Max 100 characters (can be empty string)
  remarks?: string;                // Optional: Max 2000 characters (can be empty string)
}
```

**Example Request:**
```json
{
  "numberOfWeeks": 14,
  "status": "Normal - Second Trimester",
  "remarks": "Updated after second checkup"
}
```

**Response:**
- **Status:** `200 OK`
- **Body:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "patient": {
      "_id": "507f1f77bcf86cd799439012",
      "firstName": "Jane",
      "lastName": "Doe",
      "username": "jane.doe"
    },
    "firstDayOfLastPeriod": "2024-01-15T00:00:00.000Z",
    "numberOfWeeks": 14,
    "status": "Normal - Second Trimester",
    "remarks": "Updated after second checkup",
    "checkups": [...],
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-25T15:30:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid record id
```json
{
  "success": false,
  "message": "Invalid record id"
}
```

- `404 Not Found` - Record not found
```json
{
  "success": false,
  "message": "Pregnancy record not found"
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "Server error updating pregnancy record"
}
```

---

### 5. Delete Pregnancy Record

**DELETE** `/api/pregnancy-records/:id`

**Description:** Deletes a pregnancy record. Only doctors and admins can delete records.

**Authorization:**
- ✅ DOCTOR, ADMIN only
- ❌ USER (patients cannot delete records)

**Path Parameters:**
- `id` (string, required): MongoDB ObjectId of the pregnancy record

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response:**
- **Status:** `200 OK`
- **Body:**
```json
{
  "success": true,
  "message": "Pregnancy record deleted successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid record id
```json
{
  "success": false,
  "message": "Invalid record id"
}
```

- `404 Not Found` - Record not found
```json
{
  "success": false,
  "message": "Pregnancy record not found"
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "Server error deleting pregnancy record"
}
```

---

### 6. Add Checkup to Pregnancy Record

**POST** `/api/pregnancy-records/:id/checkups`

**Description:** Adds a checkup entry to an existing pregnancy record. Only doctors and admins can add checkups.

**Authorization:**
- ✅ DOCTOR, ADMIN only
- ❌ USER (patients cannot add checkups)

**Path Parameters:**
- `id` (string, required): MongoDB ObjectId of the pregnancy record

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```typescript
{
  date: string;      // Required: ISO date string (e.g., "2024-02-01")
  remarks: string;   // Required: Max 1000 characters
}
```

**Example Request:**
```json
{
  "date": "2024-02-15",
  "remarks": "Second trimester checkup - All vitals normal, baby heartbeat detected"
}
```

**Response:**
- **Status:** `200 OK`
- **Body:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "patient": {
      "_id": "507f1f77bcf86cd799439012",
      "firstName": "Jane",
      "lastName": "Doe",
      "username": "jane.doe"
    },
    "firstDayOfLastPeriod": "2024-01-15T00:00:00.000Z",
    "numberOfWeeks": 12,
    "status": "Normal",
    "remarks": "Regular checkups scheduled",
    "checkups": [
      {
        "date": "2024-02-01T00:00:00.000Z",
        "remarks": "First trimester checkup completed"
      },
      {
        "date": "2024-02-15T00:00:00.000Z",
        "remarks": "Second trimester checkup - All vitals normal, baby heartbeat detected"
      }
    ],
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-25T15:30:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid record id
```json
{
  "success": false,
  "message": "Invalid record id"
}
```

- `400 Bad Request` - Missing required fields
```json
{
  "success": false,
  "message": "Date and remarks are required"
}
```

- `404 Not Found` - Record not found
```json
{
  "success": false,
  "message": "Pregnancy record not found"
}
```

- `500 Internal Server Error`
```json
{
  "success": false,
  "message": "Server error adding checkup"
}
```

---

## Data Models

### Pregnancy Record
```typescript
{
  _id: string;                        // MongoDB ObjectId
  patient: {                           // Populated User object
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
  firstDayOfLastPeriod: Date;         // ISO date string
  numberOfWeeks: number;              // 0-45
  status: string;                     // Max 100 characters (default: "")
  remarks: string;                    // Max 2000 characters (default: "")
  checkups: Array<{                   // Array of checkup objects
    date: Date;                       // ISO date string
    remarks: string;                  // Max 1000 characters
  }>;
  createdAt: Date;                    // Auto-generated
  updatedAt: Date;                    // Auto-generated
}
```

### Checkup
```typescript
{
  date: Date;        // ISO date string
  remarks: string;   // Max 1000 characters
}
```

---

## Validation Rules

### Pregnancy Record
- `patient`: Required, must be valid MongoDB ObjectId, must exist in User collection
- `firstDayOfLastPeriod`: Required, must be valid date
- `numberOfWeeks`: Required, must be number between 0-45
- `status`: Optional, max 100 characters
- `remarks`: Optional, max 2000 characters

### Checkup
- `date`: Required, must be valid date
- `remarks`: Required, max 1000 characters

---

## RTK Query Integration Examples

### TypeScript Types for RTK Query

```typescript
// types/pregnancyRecord.ts
export interface PregnancyRecord {
  _id: string;
  patient: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
  firstDayOfLastPeriod: string;
  numberOfWeeks: number;
  status: string;
  remarks: string;
  checkups: Checkup[];
  createdAt: string;
  updatedAt: string;
}

export interface Checkup {
  date: string;
  remarks: string;
}

export interface CreatePregnancyRecordRequest {
  patient: string;
  firstDayOfLastPeriod: string;
  numberOfWeeks: number;
  status?: string;
  remarks?: string;
  checkups?: Checkup[];
}

export interface UpdatePregnancyRecordRequest {
  firstDayOfLastPeriod?: string;
  numberOfWeeks?: number;
  status?: string;
  remarks?: string;
}

export interface AddCheckupRequest {
  date: string;
  remarks: string;
}

export interface PregnancyRecordResponse {
  success: boolean;
  data?: PregnancyRecord;
  message?: string;
}

export interface PregnancyRecordsResponse {
  success: boolean;
  count?: number;
  data?: PregnancyRecord[];
  message?: string;
}
```

### RTK Query API Slice Example

```typescript
// api/pregnancyRecordsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  PregnancyRecord,
  PregnancyRecordsResponse,
  PregnancyRecordResponse,
  CreatePregnancyRecordRequest,
  UpdatePregnancyRecordRequest,
  AddCheckupRequest,
} from '../types/pregnancyRecord';

export const pregnancyRecordsApi = createApi({
  reducerPath: 'pregnancyRecordsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/pregnancy-records',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token; // Adjust based on your auth state
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['PregnancyRecord'],
  endpoints: (builder) => ({
    // Get all pregnancy records
    getPregnancyRecords: builder.query<PregnancyRecordsResponse, void>({
      query: () => '/',
      providesTags: ['PregnancyRecord'],
    }),

    // Get pregnancy record by ID
    getPregnancyRecordById: builder.query<PregnancyRecordResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'PregnancyRecord', id }],
    }),

    // Create pregnancy record
    createPregnancyRecord: builder.mutation<
      PregnancyRecordResponse,
      CreatePregnancyRecordRequest
    >({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['PregnancyRecord'],
    }),

    // Update pregnancy record
    updatePregnancyRecord: builder.mutation<
      PregnancyRecordResponse,
      { id: string; data: UpdatePregnancyRecordRequest }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'PregnancyRecord', id },
        'PregnancyRecord',
      ],
    }),

    // Delete pregnancy record
    deletePregnancyRecord: builder.mutation<
      PregnancyRecordResponse,
      string
    >({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PregnancyRecord'],
    }),

    // Add checkup to pregnancy record
    addCheckup: builder.mutation<
      PregnancyRecordResponse,
      { id: string; data: AddCheckupRequest }
    >({
      query: ({ id, data }) => ({
        url: `/${id}/checkups`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'PregnancyRecord', id },
        'PregnancyRecord',
      ],
    }),
  }),
});

export const {
  useGetPregnancyRecordsQuery,
  useGetPregnancyRecordByIdQuery,
  useCreatePregnancyRecordMutation,
  useUpdatePregnancyRecordMutation,
  useDeletePregnancyRecordMutation,
  useAddCheckupMutation,
} = pregnancyRecordsApi;
```

### Usage Example in React Component

```typescript
// components/PregnancyRecords.tsx
import {
  useGetPregnancyRecordsQuery,
  useCreatePregnancyRecordMutation,
  useUpdatePregnancyRecordMutation,
  useDeletePregnancyRecordMutation,
  useAddCheckupMutation,
} from '../api/pregnancyRecordsApi';

function PregnancyRecords() {
  const { data, isLoading, error } = useGetPregnancyRecordsQuery();
  const [createRecord] = useCreatePregnancyRecordMutation();
  const [updateRecord] = useUpdatePregnancyRecordMutation();
  const [deleteRecord] = useDeletePregnancyRecordMutation();
  const [addCheckup] = useAddCheckupMutation();

  const handleCreate = async () => {
    try {
      const result = await createRecord({
        patient: '507f1f77bcf86cd799439012',
        firstDayOfLastPeriod: '2024-01-15',
        numberOfWeeks: 12,
        status: 'Normal',
        remarks: 'Regular checkups scheduled',
      }).unwrap();
      console.log('Created:', result.data);
    } catch (err) {
      console.error('Error creating record:', err);
    }
  };

  const handleAddCheckup = async (recordId: string) => {
    try {
      const result = await addCheckup({
        id: recordId,
        data: {
          date: '2024-02-15',
          remarks: 'Second trimester checkup completed',
        },
      }).unwrap();
      console.log('Checkup added:', result.data);
    } catch (err) {
      console.error('Error adding checkup:', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading records</div>;

  return (
    <div>
      <button onClick={handleCreate}>Create Record</button>
      {data?.data?.map((record) => (
        <div key={record._id}>
          <h3>Record for {record.patient.firstName}</h3>
          <p>Weeks: {record.numberOfWeeks}</p>
          <button onClick={() => handleAddCheckup(record._id)}>
            Add Checkup
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## Notes

1. **Date Format**: All dates should be sent as ISO 8601 strings (e.g., `"2024-01-15"` or `"2024-01-15T00:00:00.000Z"`). The API will convert them to Date objects.

2. **Authorization**: 
   - All endpoints require authentication
   - CREATE, UPDATE, DELETE, and ADD_CHECKUP require DOCTOR or ADMIN role
   - READ endpoints are available to all authenticated users, but patients can only see their own records

3. **Patient Population**: The `patient` field is automatically populated with user information (firstName, lastName, username) in all responses.

4. **Checkups**: Checkups are stored as an array within the pregnancy record. They cannot be updated or deleted individually - you would need to update the entire record.

5. **Empty Strings**: The `status` and `remarks` fields can be set to empty strings (`""`) to clear them.

6. **Validation**: 
   - `numberOfWeeks` must be between 0-45
   - `status` max length: 100 characters
   - `remarks` max length: 2000 characters
   - `checkup.remarks` max length: 1000 characters

