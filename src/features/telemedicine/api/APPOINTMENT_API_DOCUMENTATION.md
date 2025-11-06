# Appointment API Documentation

## Base URL

```
http://localhost:3001/api/appointments
```

## Authentication

All endpoints require authentication via JWT token. Include the token in the request headers:

```
Authorization: Bearer <your_jwt_token>
```

## User Roles

- **USER**: Regular patients who can create and manage their own appointments
- **DOCTOR**: Can view all appointments, accept appointments, and update statuses
- **ADMIN**: Full access to all appointment operations

---

## Endpoints

### 1. Get All Appointments

Retrieve a list of appointments based on user role and optional filters.

**Endpoint:** `GET /api/appointments`

**Authentication:** Required

**Authorization:**

- **USER**: Can only see their own appointments
- **DOCTOR/ADMIN**: Can see all appointments

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date` | string (ISO) | No | Filter appointments by date (e.g., "2024-01-15") |

**Request Example:**

```http
GET /api/appointments?date=2024-01-15
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "patient": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "firstName": "John",
        "lastName": "Doe",
        "username": "johndoe"
      },
      "type": "in-person",
      "status": "pending",
      "date": "2024-01-15T10:00:00.000Z",
      "reason": "Regular checkup",
      "queueNumber": null,
      "createdAt": "2024-01-10T08:00:00.000Z",
      "updatedAt": "2024-01-10T08:00:00.000Z"
    },
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "patient": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "firstName": "John",
        "lastName": "Doe",
        "username": "johndoe"
      },
      "type": "telemedicine",
      "status": "accepted",
      "date": "2024-01-15T14:00:00.000Z",
      "reason": "Follow-up consultation",
      "queueNumber": 1,
      "createdAt": "2024-01-11T09:00:00.000Z",
      "updatedAt": "2024-01-12T10:00:00.000Z"
    }
  ]
}
```

**Error Responses:**

- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Server error

---

### 2. Get Appointment by ID

Retrieve a specific appointment by its ID.

**Endpoint:** `GET /api/appointments/:id`

**Authentication:** Required

**Authorization:**

- **USER**: Can only access their own appointments
- **DOCTOR/ADMIN**: Can access any appointment

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (ObjectId) | Yes | Appointment ID |

**Request Example:**

```http
GET /api/appointments/65a1b2c3d4e5f6g7h8i9j0k1
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "patient": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe"
    },
    "type": "in-person",
    "status": "pending",
    "date": "2024-01-15T10:00:00.000Z",
    "reason": "Regular checkup",
    "queueNumber": null,
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-10T08:00:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Invalid appointment ID format
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User trying to access another user's appointment
- `404 Not Found`: Appointment not found
- `500 Internal Server Error`: Server error

---

### 3. Create Appointment

Create a new appointment. Users create appointments for themselves by default; admins/doctors can create for other patients.

**Endpoint:** `POST /api/appointments`

**Authentication:** Required

**Authorization:** All authenticated users

**Request Body:**

```json
{
  "type": "in-person",
  "date": "2024-01-20T10:00:00.000Z",
  "reason": "Annual physical examination",
  "patient": "65a1b2c3d4e5f6g7h8i9j0k2"
}
```

**Request Body Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | Appointment type: `"telemedicine"` or `"in-person"` |
| `date` | string (ISO) | Yes | Appointment date and time in ISO 8601 format |
| `reason` | string | Yes | Reason for appointment (max 1000 characters) |
| `patient` | string (ObjectId) | No | Patient ID (defaults to authenticated user if not provided) |

**Request Example:**

```http
POST /api/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "telemedicine",
  "date": "2024-01-20T14:30:00.000Z",
  "reason": "Follow-up consultation for medication review"
}
```

**Success Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
    "patient": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe"
    },
    "type": "telemedicine",
    "status": "pending",
    "date": "2024-01-20T14:30:00.000Z",
    "reason": "Follow-up consultation for medication review",
    "queueNumber": null,
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-15T08:00:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Missing required fields, invalid date, or invalid patient ID
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Patient user not found
- `500 Internal Server Error`: Server error

---

### 4. Update Appointment

Update appointment details. Only pending appointments can be edited.

**Endpoint:** `PUT /api/appointments/:id`

**Authentication:** Required

**Authorization:**

- **USER**: Can only update their own appointments
- **DOCTOR/ADMIN**: Can update any appointment

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (ObjectId) | Yes | Appointment ID |

**Request Body:**

```json
{
  "type": "telemedicine",
  "date": "2024-01-25T15:00:00.000Z",
  "reason": "Updated reason for appointment"
}
```

**Request Body Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | No | Appointment type: `"telemedicine"` or `"in-person"` |
| `date` | string (ISO) | No | Appointment date and time in ISO 8601 format |
| `reason` | string | No | Reason for appointment (max 1000 characters) |

**Note:** All fields are optional. Only include fields you want to update.

**Request Example:**

```http
PUT /api/appointments/65a1b2c3d4e5f6g7h8i9j0k1
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2024-01-25T15:00:00.000Z",
  "reason": "Rescheduled for better availability"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "patient": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe"
    },
    "type": "in-person",
    "status": "pending",
    "date": "2024-01-25T15:00:00.000Z",
    "reason": "Rescheduled for better availability",
    "queueNumber": null,
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-15T09:30:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Invalid appointment ID, invalid date, or appointment is not pending
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User trying to update another user's appointment
- `404 Not Found`: Appointment not found
- `500 Internal Server Error`: Server error

---

### 5. Update Appointment Status

Update the status of an appointment. Users can only deny their own pending appointments. Doctors/admins can set any status.

**Endpoint:** `PATCH /api/appointments/:id/status`

**Authentication:** Required

**Authorization:**

- **USER**: Can only set status to `"denied"` on their own pending appointments
- **DOCTOR/ADMIN**: Can set any status

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (ObjectId) | Yes | Appointment ID |

**Request Body:**

```json
{
  "status": "accepted"
}
```

**Request Body Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | Yes | Appointment status: `"pending"`, `"accepted"`, `"serving"`, `"completed"`, or `"denied"` |

**Status Transitions:**

- When status changes to `"accepted"`, a queue number is automatically assigned (if daily limit of 100 is not reached)
- Queue numbers are assigned sequentially based on the appointment date

**Request Example:**

```http
PATCH /api/appointments/65a1b2c3d4e5f6g7h8i9j0k1/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "accepted"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "patient": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe"
    },
    "type": "in-person",
    "status": "accepted",
    "date": "2024-01-15T10:00:00.000Z",
    "reason": "Regular checkup",
    "queueNumber": 5,
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Invalid appointment ID or daily queue limit reached (100 appointments per day)
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User trying to set status other than "denied" or accessing another user's appointment
- `404 Not Found`: Appointment not found
- `500 Internal Server Error`: Server error

---

### 6. Accept Appointment

Convenience endpoint to accept a pending appointment. Automatically sets status to "accepted" and assigns a queue number.

**Endpoint:** `PATCH /api/appointments/:id/accept`

**Authentication:** Required

**Authorization:** **DOCTOR/ADMIN** only

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (ObjectId) | Yes | Appointment ID |

**Request Example:**

```http
PATCH /api/appointments/65a1b2c3d4e5f6g7h8i9j0k1/accept
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "patient": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe"
    },
    "type": "in-person",
    "status": "accepted",
    "date": "2024-01-15T10:00:00.000Z",
    "reason": "Regular checkup",
    "queueNumber": 5,
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request`: Invalid appointment ID or daily queue limit reached (100 appointments per day)
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not a doctor or admin
- `404 Not Found`: Appointment not found
- `500 Internal Server Error`: Server error

---

### 7. Delete Appointment

Delete an appointment. Users can only delete their own appointments.

**Endpoint:** `DELETE /api/appointments/:id`

**Authentication:** Required

**Authorization:**

- **USER**: Can only delete their own appointments
- **DOCTOR/ADMIN**: Can delete any appointment

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (ObjectId) | Yes | Appointment ID |

**Request Example:**

```http
DELETE /api/appointments/65a1b2c3d4e5f6g7h8i9j0k1
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Appointment deleted"
}
```

**Error Responses:**

- `400 Bad Request`: Invalid appointment ID format
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User trying to delete another user's appointment
- `404 Not Found`: Appointment not found
- `500 Internal Server Error`: Server error

---

## Data Models

### Appointment Object

```typescript
{
  _id: string; // MongoDB ObjectId
  patient: {
    // Populated user object
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
  }
  type: "telemedicine" | "in-person";
  status: "pending" | "accepted" | "serving" | "completed" | "denied";
  date: string; // ISO 8601 date string
  reason: string; // Max 1000 characters
  queueNumber: number | null; // Assigned when status becomes "accepted"
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}
```

### Appointment Status Flow

```
pending → accepted → serving → completed
   ↓
denied
```

**Notes:**

- Appointments start with status `"pending"`
- Only pending appointments can be edited
- When status changes to `"accepted"`, a queue number is automatically assigned
- Maximum 100 accepted appointments per day (based on appointment date)
- Users can only cancel (set to `"denied"`) their own pending appointments

---

## Common Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Missing required fields"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Appointment not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Server error [operation description]"
}
```

---

## Frontend Integration Examples

### JavaScript/TypeScript (Fetch API)

#### Create Appointment

```typescript
const createAppointment = async (appointmentData: {
  type: "telemedicine" | "in-person";
  date: string;
  reason: string;
  patient?: string;
}) => {
  const response = await fetch("http://localhost:3001/api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(appointmentData),
  });

  const data = await response.json();
  return data;
};
```

#### Get All Appointments

```typescript
const getAppointments = async (date?: string) => {
  const url = date
    ? `http://localhost:3001/api/appointments?date=${date}`
    : "http://localhost:3001/api/appointments";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};
```

#### Update Appointment Status

```typescript
const updateAppointmentStatus = async (
  appointmentId: string,
  status: "pending" | "accepted" | "serving" | "completed" | "denied"
) => {
  const response = await fetch(
    `http://localhost:3001/api/appointments/${appointmentId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json();
  return data;
};
```

#### Accept Appointment (Doctor/Admin only)

```typescript
const acceptAppointment = async (appointmentId: string) => {
  const response = await fetch(
    `http://localhost:3001/api/appointments/${appointmentId}/accept`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  return data;
};
```

---

## Testing with cURL

### Create Appointment

```bash
curl -X POST http://localhost:3001/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "in-person",
    "date": "2024-01-20T10:00:00.000Z",
    "reason": "Annual checkup"
  }'
```

### Get All Appointments

```bash
curl -X GET http://localhost:3001/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Appointment Status

```bash
curl -X PATCH http://localhost:3001/api/appointments/APPOINTMENT_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "accepted"
  }'
```

---

## Notes for Frontend Developers

1. **Authentication**: Always include the JWT token in the `Authorization` header for all requests.

2. **Date Format**: Use ISO 8601 format for all dates (e.g., `"2024-01-20T10:00:00.000Z"`).

3. **Error Handling**: Check the `success` field in responses. If `false`, display the `message` to the user.

4. **Queue Numbers**: Queue numbers are automatically assigned when an appointment is accepted. They are sequential per day (1-100).

5. **Status Restrictions**:

   - Only pending appointments can be edited
   - Users can only deny their own pending appointments
   - Doctors/admins have full control over status changes

6. **Patient Field**: When creating an appointment as a regular user, omit the `patient` field to automatically use your own ID. Only admins/doctors should specify a different patient ID.

7. **Date Filtering**: When filtering by date, the API returns all appointments for that entire day (00:00:00 to 23:59:59).

8. **Response Structure**: All successful responses follow the pattern:
   ```json
   {
     "success": true,
     "data": { ... },
     "count": number (for list endpoints),
     "message": string (for some operations)
   }
   ```
