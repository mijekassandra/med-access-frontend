# Medical Record API Documentation

## Base URL

```
http://localhost:3001/api/medical-records
```

**Production Base URL:** Replace `localhost:3001` with your production server URL.

---

## Authentication

### All Endpoints

All medical record endpoints require authentication via JWT token. Include the token in the request:

**Authorization Header:**

```
Authorization: Bearer <your_jwt_token>
```

**Or Cookie:**

```
Cookie: token=<your_jwt_token>
```

### Role-Based Access Control

- **Patients (USER role)**: Can read their own medical records only
- **Doctors (DOCTOR role)**: Can read all medical records and create/update/delete records
- **Admins (ADMIN role)**: Can read all medical records and create/update/delete records

---

## Endpoints

### 1. Get All Medical Records

Get a list of medical records. Patients see only their own records; doctors and admins see all published records.

**Endpoint:** `GET /api/medical-records`

**Authentication:** Required

**Request Headers:**

```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**Response:**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6789012345",
      "patient": {
        "_id": "65a1b2c3d4e5f6789012346",
        "firstName": "John",
        "lastName": "Doe",
        "username": "johndoe"
      },
      "diagnosis": "Type 2 Diabetes",
      "dateOfRecord": "2024-01-15T10:30:00.000Z",
      "treatmentPlan": "Monitor blood sugar levels daily. Take metformin 500mg twice daily with meals. Follow a low-carb diet and exercise regularly. Schedule follow-up appointment in 3 months.",
      "isPublished": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "65a1b2c3d4e5f6789012347",
      "patient": {
        "_id": "65a1b2c3d4e5f6789012346",
        "firstName": "John",
        "lastName": "Doe",
        "username": "johndoe"
      },
      "diagnosis": "Hypertension",
      "dateOfRecord": "2024-01-10T14:20:00.000Z",
      "treatmentPlan": "Take lisinopril 10mg once daily. Monitor blood pressure weekly. Reduce sodium intake. Follow up in 1 month.",
      "isPublished": true,
      "createdAt": "2024-01-10T14:20:00.000Z",
      "updatedAt": "2024-01-10T14:20:00.000Z"
    }
  ]
}
```

**Status Codes:**

- `200 OK` - Success
- `401 Unauthorized` - No authentication token provided
- `500 Internal Server Error` - Server error

---

### 2. Get Medical Record by ID

Get a specific medical record by its ID. Patients can only access their own records.

**Endpoint:** `GET /api/medical-records/:id`

**Authentication:** Required

**URL Parameters:**

- `id` (string, required) - MongoDB ObjectId of the medical record

**Request Headers:**

```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**Example Request:**

```
GET /api/medical-records/65a1b2c3d4e5f6789012345
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "patient": {
      "_id": "65a1b2c3d4e5f6789012346",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe"
    },
    "diagnosis": "Type 2 Diabetes",
    "dateOfRecord": "2024-01-15T10:30:00.000Z",
    "treatmentPlan": "Monitor blood sugar levels daily. Take metformin 500mg twice daily with meals. Follow a low-carb diet and exercise regularly. Schedule follow-up appointment in 3 months.",
    "isPublished": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Status Codes:**

- `200 OK` - Success
- `400 Bad Request` - Invalid ID format
- `401 Unauthorized` - No authentication token provided
- `403 Forbidden` - Patient trying to access another patient's record
- `404 Not Found` - Medical record not found or not published
- `500 Internal Server Error` - Server error

---

### 3. Create Medical Record

Create a new medical record. **Doctor or Admin only.**

**Endpoint:** `POST /api/medical-records`

**Authentication:** Required (Doctor or Admin role)

**Request Headers:**

```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**Request Body:**

```json
{
  "patient": "65a1b2c3d4e5f6789012346",
  "diagnosis": "Type 2 Diabetes",
  "dateOfRecord": "2024-01-15T10:30:00.000Z",
  "treatmentPlan": "Monitor blood sugar levels daily. Take metformin 500mg twice daily with meals. Follow a low-carb diet and exercise regularly. Schedule follow-up appointment in 3 months."
}
```

**Field Descriptions:**

- `patient` (string, required) - MongoDB ObjectId of the patient user
- `diagnosis` (string, required) - Diagnosis description (max 1000 characters)
- `dateOfRecord` (string, required) - ISO date string of when the record was created
- `treatmentPlan` (string, required) - Detailed treatment plan description

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "patient": {
      "_id": "65a1b2c3d4e5f6789012346",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe"
    },
    "diagnosis": "Type 2 Diabetes",
    "dateOfRecord": "2024-01-15T10:30:00.000Z",
    "treatmentPlan": "Monitor blood sugar levels daily. Take metformin 500mg twice daily with meals. Follow a low-carb diet and exercise regularly. Schedule follow-up appointment in 3 months.",
    "isPublished": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Status Codes:**

- `201 Created` - Medical record created successfully
- `400 Bad Request` - Missing required fields or invalid patient ID
- `401 Unauthorized` - No authentication token provided
- `403 Forbidden` - User does not have Doctor or Admin role
- `404 Not Found` - Patient user not found
- `500 Internal Server Error` - Server error

**Error Response Examples:**

```json
{
  "success": false,
  "message": "Missing required fields"
}
```

```json
{
  "success": false,
  "message": "Invalid patient id"
}
```

```json
{
  "success": false,
  "message": "Patient user not found"
}
```

---

### 4. Update Medical Record

Update an existing medical record. **Doctor or Admin only.**

**Endpoint:** `PUT /api/medical-records/:id`

**Authentication:** Required (Doctor or Admin role)

**URL Parameters:**

- `id` (string, required) - MongoDB ObjectId of the medical record

**Request Headers:**

```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**Request Body:**

All fields are optional. Only include fields you want to update.

```json
{
  "diagnosis": "Type 2 Diabetes - Controlled",
  "dateOfRecord": "2024-01-20T10:30:00.000Z",
  "treatmentPlan": "Updated treatment plan: Continue metformin. Blood sugar levels are now within normal range. Reduce dosage to 500mg once daily."
}
```

**Field Descriptions:**

- `diagnosis` (string, optional) - Diagnosis description (max 1000 characters)
- `dateOfRecord` (string, optional) - ISO date string of when the record was created
- `treatmentPlan` (string, optional) - Detailed treatment plan description

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "patient": {
      "_id": "65a1b2c3d4e5f6789012346",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe"
    },
    "diagnosis": "Type 2 Diabetes - Controlled",
    "dateOfRecord": "2024-01-20T10:30:00.000Z",
    "treatmentPlan": "Updated treatment plan: Continue metformin. Blood sugar levels are now within normal range. Reduce dosage to 500mg once daily.",
    "isPublished": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z"
  }
}
```

**Status Codes:**

- `200 OK` - Medical record updated successfully
- `400 Bad Request` - Invalid ID format
- `401 Unauthorized` - No authentication token provided
- `403 Forbidden` - User does not have Doctor or Admin role
- `404 Not Found` - Medical record not found
- `500 Internal Server Error` - Server error

---

### 5. Delete Medical Record

Delete (unpublish) a medical record. This sets `isPublished` to `false` instead of actually deleting the record. **Doctor or Admin only.**

**Endpoint:** `DELETE /api/medical-records/:id`

**Authentication:** Required (Doctor or Admin role)

**URL Parameters:**

- `id` (string, required) - MongoDB ObjectId of the medical record

**Request Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Example Request:**

```
DELETE /api/medical-records/65a1b2c3d4e5f6789012345
```

**Response:**

```json
{
  "success": true,
  "message": "Medical record unpublished"
}
```

**Status Codes:**

- `200 OK` - Medical record unpublished successfully
- `400 Bad Request` - Invalid ID format
- `401 Unauthorized` - No authentication token provided
- `403 Forbidden` - User does not have Doctor or Admin role
- `404 Not Found` - Medical record not found
- `500 Internal Server Error` - Server error

---

## Data Models

### Medical Record

```typescript
interface MedicalRecord {
  _id: string; // MongoDB ObjectId
  patient: {
    _id: string; // MongoDB ObjectId
    firstName: string;
    lastName: string;
    username: string;
  };
  diagnosis: string; // Required, max 1000 characters
  dateOfRecord: Date; // Required, ISO date string
  treatmentPlan: string; // Required, long text
  isPublished: boolean; // Default: true
  createdAt: Date; // Auto-generated timestamp
  updatedAt: Date; // Auto-generated timestamp
}
```

### Create Medical Record Request

```typescript
interface CreateMedicalRecordRequest {
  patient: string; // MongoDB ObjectId of the patient user
  diagnosis: string; // Required, max 1000 characters
  dateOfRecord: string; // Required, ISO date string (e.g., "2024-01-15T10:30:00.000Z")
  treatmentPlan: string; // Required
}
```

### Update Medical Record Request

```typescript
interface UpdateMedicalRecordRequest {
  diagnosis?: string; // Optional, max 1000 characters
  dateOfRecord?: string; // Optional, ISO date string
  treatmentPlan?: string; // Optional
}
```

---

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

### Common Error Codes

- **400 Bad Request** - Invalid input, validation errors, missing required fields, or malformed request
- **401 Unauthorized** - Missing or invalid authentication token
- **403 Forbidden** - Authenticated user lacks required permissions (Doctor/Admin role) or patient trying to access another patient's record
- **404 Not Found** - Resource not found (medical record or patient user)
- **500 Internal Server Error** - Server-side error

---

## Frontend Integration Examples

### JavaScript/TypeScript (Fetch API)

#### Get All Medical Records

```javascript
const getMedicalRecords = async (token) => {
  try {
    const response = await fetch("http://localhost:3001/api/medical-records", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      console.log("Medical records:", data.data);
      console.log("Total count:", data.count);
      return data.data;
    } else {
      console.error("Error:", data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Network error:", error);
    throw error;
  }
};
```

#### Get Medical Record by ID

```javascript
const getMedicalRecordById = async (id, token) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/medical-records/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      console.log("Medical record:", data.data);
      return data.data;
    } else {
      console.error("Error:", data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Network error:", error);
    throw error;
  }
};
```

#### Create Medical Record (Doctor/Admin)

```javascript
const createMedicalRecord = async (recordData, token) => {
  try {
    const response = await fetch("http://localhost:3001/api/medical-records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        patient: recordData.patient, // User ID
        diagnosis: recordData.diagnosis,
        dateOfRecord: recordData.dateOfRecord, // ISO date string
        treatmentPlan: recordData.treatmentPlan,
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log("Created:", data.data);
      return data.data;
    } else {
      console.error("Error:", data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Network error:", error);
    throw error;
  }
};

// Usage example
const newRecord = await createMedicalRecord(
  {
    patient: "65a1b2c3d4e5f6789012346",
    diagnosis: "Type 2 Diabetes",
    dateOfRecord: new Date().toISOString(),
    treatmentPlan:
      "Monitor blood sugar levels daily. Take metformin 500mg twice daily with meals.",
  },
  userToken
);
```

#### Update Medical Record (Doctor/Admin)

```javascript
const updateMedicalRecord = async (id, updates, token) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/medical-records/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates), // Only include fields to update
      }
    );

    const data = await response.json();

    if (data.success) {
      console.log("Updated:", data.data);
      return data.data;
    } else {
      console.error("Error:", data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Network error:", error);
    throw error;
  }
};

// Usage example
const updated = await updateMedicalRecord(
  "65a1b2c3d4e5f6789012345",
  {
    diagnosis: "Type 2 Diabetes - Controlled",
    treatmentPlan: "Updated treatment plan...",
  },
  userToken
);
```

#### Delete Medical Record (Doctor/Admin)

```javascript
const deleteMedicalRecord = async (id, token) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/medical-records/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      console.log("Deleted:", data.message);
      return true;
    } else {
      console.error("Error:", data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Network error:", error);
    throw error;
  }
};
```

### React Example Hook

```typescript
import { useState, useEffect } from "react";

interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
}

interface MedicalRecord {
  _id: string;
  patient: Patient;
  diagnosis: string;
  dateOfRecord: string;
  treatmentPlan: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useMedicalRecords = (token: string) => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:3001/api/medical-records",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (data.success) {
          setMedicalRecords(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch medical records");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMedicalRecords();
    }
  }, [token]);

  return { medicalRecords, loading, error };
};
```

### React Component Example

```typescript
import React, { useState } from "react";

interface CreateMedicalRecordFormProps {
  token: string;
  onSuccess?: () => void;
}

const CreateMedicalRecordForm: React.FC<CreateMedicalRecordFormProps> = ({
  token,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    patient: "",
    diagnosis: "",
    dateOfRecord: new Date().toISOString().split("T")[0],
    treatmentPlan: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:3001/api/medical-records",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            dateOfRecord: new Date(formData.dateOfRecord).toISOString(),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Medical record created successfully!");
        if (onSuccess) onSuccess();
        // Reset form
        setFormData({
          patient: "",
          diagnosis: "",
          dateOfRecord: new Date().toISOString().split("T")[0],
          treatmentPlan: "",
        });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to create medical record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Patient ID:
          <input
            type="text"
            value={formData.patient}
            onChange={(e) =>
              setFormData({ ...formData, patient: e.target.value })
            }
            required
          />
        </label>
      </div>
      <div>
        <label>
          Diagnosis:
          <input
            type="text"
            value={formData.diagnosis}
            onChange={(e) =>
              setFormData({ ...formData, diagnosis: e.target.value })
            }
            required
            maxLength={1000}
          />
        </label>
      </div>
      <div>
        <label>
          Date of Record:
          <input
            type="date"
            value={formData.dateOfRecord}
            onChange={(e) =>
              setFormData({ ...formData, dateOfRecord: e.target.value })
            }
            required
          />
        </label>
      </div>
      <div>
        <label>
          Treatment Plan:
          <textarea
            value={formData.treatmentPlan}
            onChange={(e) =>
              setFormData({ ...formData, treatmentPlan: e.target.value })
            }
            required
            rows={5}
          />
        </label>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Medical Record"}
      </button>
    </form>
  );
};
```

---

## Notes

1. **Authentication Required**: All endpoints require a valid JWT token. Obtain the token by logging in through the user authentication endpoint first.

2. **Role-Based Access**:

   - **Patients (USER)**: Can only read their own medical records
   - **Doctors (DOCTOR)**: Can read all records and create/update/delete records
   - **Admins (ADMIN)**: Can read all records and create/update/delete records

3. **Published Records Only**: The GET endpoints only return records where `isPublished: true`. Deleted records are not actually removed but marked as unpublished.

4. **Patient Reference**: The `patient` field must be a valid MongoDB ObjectId that references an existing user with the USER role.

5. **Date Format**: The `dateOfRecord` field should be provided as an ISO 8601 date string (e.g., `"2024-01-15T10:30:00.000Z"`).

6. **Diagnosis Length**: The `diagnosis` field has a maximum length of 1000 characters.

7. **Treatment Plan**: The `treatmentPlan` field accepts long text and should contain detailed information about the patient's treatment.

8. **Rate Limiting**: The API has rate limiting (1000 requests per 10 minutes per IP). Be mindful of this when making multiple requests.

9. **CORS**: The API is configured to accept requests from `http://localhost:5173` and `http://localhost:5174`. Update CORS settings in production.

---

## Testing with cURL

### Get All Medical Records

```bash
curl -X GET http://localhost:3001/api/medical-records \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Medical Record by ID

```bash
curl -X GET http://localhost:3001/api/medical-records/65a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Medical Record (Doctor/Admin)

```bash
curl -X POST http://localhost:3001/api/medical-records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "patient": "65a1b2c3d4e5f6789012346",
    "diagnosis": "Type 2 Diabetes",
    "dateOfRecord": "2024-01-15T10:30:00.000Z",
    "treatmentPlan": "Monitor blood sugar levels daily. Take metformin 500mg twice daily with meals."
  }'
```

### Update Medical Record (Doctor/Admin)

```bash
curl -X PUT http://localhost:3001/api/medical-records/65a1b2c3d4e5f6789012345 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "diagnosis": "Type 2 Diabetes - Controlled",
    "treatmentPlan": "Updated treatment plan..."
  }'
```

### Delete Medical Record (Doctor/Admin)

```bash
curl -X DELETE http://localhost:3001/api/medical-records/65a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## User Registration and Authentication Reference

To use the Medical Records API, you first need to register a user and obtain an authentication token.

### Register a User

**Endpoint:** `POST /api/users/register`

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secure_password",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6789012346",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

**Endpoint:** `POST /api/users/login`

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "secure_password"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6789012346",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Use the `token` from the registration or login response in the `Authorization: Bearer <token>` header for all medical record operations.

### Register a Doctor (for creating/updating records)

To create, update, or delete medical records, you need a user with `DOCTOR` or `ADMIN` role:

```json
{
  "username": "dr_smith",
  "email": "dr.smith@example.com",
  "password": "secure_password",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "doctor",
  "specialization": "Internal Medicine",
  "prcLicenseNumber": "12345"
}
```
