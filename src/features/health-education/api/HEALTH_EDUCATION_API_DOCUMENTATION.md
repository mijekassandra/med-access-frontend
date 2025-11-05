# Health Education API Documentation

## Base URL

```
http://localhost:3001/api/health-education
```

**Production Base URL:** Replace `localhost:3001` with your production server URL.

---

## Authentication

### Admin Endpoints

Admin-only endpoints require authentication via JWT token. Include the token in the request:

**Authorization Header:**

```
Authorization: Bearer <your_jwt_token>
```

**Or Cookie:**

```
Cookie: token=<your_jwt_token>
```

### Public Endpoints

Read endpoints (GET) are publicly accessible and do not require authentication.

---

## Endpoints

### 1. Get All Health Education Items

Get a list of all published health education items.

**Endpoint:** `GET /api/health-education`

**Authentication:** Not required (Public)

**Request Headers:**

```
Content-Type: application/json
```

**Response:**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6789012345",
      "title": "Understanding Diabetes",
      "headline": "Learn about diabetes prevention and management",
      "contentType": "article",
      "body": "Diabetes is a chronic condition...",
      "url": "https://example.com/diabetes-article",
      "isPublished": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "65a1b2c3d4e5f6789012346",
      "title": "Healthy Eating Habits",
      "headline": "Tips for maintaining a balanced diet",
      "contentType": "video",
      "body": "Watch this video to learn about...",
      "url": "https://youtube.com/watch?v=example",
      "isPublished": true,
      "createdAt": "2024-01-16T14:20:00.000Z",
      "updatedAt": "2024-01-16T14:20:00.000Z"
    }
  ]
}
```

**Status Codes:**

- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

### 2. Get Health Education Item by ID

Get a specific health education item by its ID.

**Endpoint:** `GET /api/health-education/:id`

**Authentication:** Not required (Public)

**URL Parameters:**

- `id` (string, required) - MongoDB ObjectId of the health education item

**Request Headers:**

```
Content-Type: application/json
```

**Example Request:**

```
GET /api/health-education/65a1b2c3d4e5f6789012345
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "title": "Understanding Diabetes",
    "headline": "Learn about diabetes prevention and management",
    "contentType": "article",
    "body": "Diabetes is a chronic condition...",
    "url": "https://example.com/diabetes-article",
    "isPublished": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Status Codes:**

- `200 OK` - Success
- `404 Not Found` - Health education item not found or not published
- `400 Bad Request` - Invalid ID format
- `500 Internal Server Error` - Server error

---

### 3. Create Health Education Item

Create a new health education item. **Admin only.**

**Endpoint:** `POST /api/health-education`

**Authentication:** Required (Admin role)

**Request Headers:**

```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**Request Body:**

```json
{
  "title": "Understanding Diabetes",
  "headline": "Learn about diabetes prevention and management",
  "contentType": "article",
  "body": "Diabetes is a chronic condition that affects how your body processes blood sugar...",
  "url": "https://example.com/diabetes-article"
}
```

**Field Descriptions:**

- `title` (string, required) - Title of the health education item (max 200 characters)
- `headline` (string, required) - Short headline/summary (max 300 characters)
- `contentType` (string, required) - Type of content: `"article"` or `"video"`
- `body` (string, required) - Main content/description of the health education item
- `url` (string, optional) - URL to external content (e.g., article link or video URL)

**Response:**

```json
{
  "success": true,
  "message": "Health education created",
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "title": "Understanding Diabetes",
    "headline": "Learn about diabetes prevention and management",
    "contentType": "article",
    "body": "Diabetes is a chronic condition that affects how your body processes blood sugar...",
    "url": "https://example.com/diabetes-article",
    "isPublished": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Status Codes:**

- `201 Created` - Health education item created successfully
- `400 Bad Request` - Validation error (missing required fields, invalid contentType, etc.)
- `401 Unauthorized` - No authentication token provided
- `403 Forbidden` - User does not have Admin role
- `500 Internal Server Error` - Server error

**Validation Errors Example:**

```json
{
  "success": false,
  "message": "Validation error: Title is required, Content type is required"
}
```

---

### 4. Update Health Education Item

Update an existing health education item. **Admin only.**

**Endpoint:** `PUT /api/health-education/:id`

**Authentication:** Required (Admin role)

**URL Parameters:**

- `id` (string, required) - MongoDB ObjectId of the health education item

**Request Headers:**

```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
All fields are optional. Only include fields you want to update.

```json
{
  "title": "Updated Title",
  "headline": "Updated headline",
  "contentType": "video",
  "body": "Updated body content",
  "url": "https://example.com/updated-url"
}
```

**Field Descriptions:**

- `title` (string, optional) - Title of the health education item (max 200 characters)
- `headline` (string, optional) - Short headline/summary (max 300 characters)
- `contentType` (string, optional) - Type of content: `"article"` or `"video"`
- `body` (string, optional) - Main content/description
- `url` (string, optional) - URL to external content (can be set to `null`)

**Response:**

```json
{
  "success": true,
  "message": "Health education updated",
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "title": "Updated Title",
    "headline": "Updated headline",
    "contentType": "video",
    "body": "Updated body content",
    "url": "https://example.com/updated-url",
    "isPublished": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T14:20:00.000Z"
  }
}
```

**Status Codes:**

- `200 OK` - Health education item updated successfully
- `400 Bad Request` - Validation error or invalid ID format
- `401 Unauthorized` - No authentication token provided
- `403 Forbidden` - User does not have Admin role
- `404 Not Found` - Health education item not found
- `500 Internal Server Error` - Server error

---

### 5. Delete Health Education Item

Delete (unpublish) a health education item. This sets `isPublished` to `false` instead of actually deleting the record. **Admin only.**

**Endpoint:** `DELETE /api/health-education/:id`

**Authentication:** Required (Admin role)

**URL Parameters:**

- `id` (string, required) - MongoDB ObjectId of the health education item

**Request Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Example Request:**

```
DELETE /api/health-education/65a1b2c3d4e5f6789012345
```

**Response:**

```json
{
  "success": true,
  "message": "Health education unpublished",
  "data": {}
}
```

**Status Codes:**

- `200 OK` - Health education item unpublished successfully
- `400 Bad Request` - Invalid ID format
- `401 Unauthorized` - No authentication token provided
- `403 Forbidden` - User does not have Admin role
- `404 Not Found` - Health education item not found
- `500 Internal Server Error` - Server error

---

## Data Models

### Health Education Item

```typescript
interface HealthEducationItem {
  _id: string; // MongoDB ObjectId
  title: string; // Required, max 200 characters
  headline: string; // Required, max 300 characters
  contentType: "article" | "video"; // Required
  body: string; // Required
  url: string | null; // Optional, can be null
  isPublished: boolean; // Default: true
  createdAt: Date; // Auto-generated timestamp
  updatedAt: Date; // Auto-generated timestamp
}
```

### Content Type Enum

- `"article"` - Text-based article content
- `"video"` - Video content (typically with URL to video)

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

- **400 Bad Request** - Invalid input, validation errors, or malformed request
- **401 Unauthorized** - Missing or invalid authentication token
- **403 Forbidden** - Authenticated user lacks required permissions (Admin role)
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server-side error

---

## Frontend Integration Examples

### JavaScript/TypeScript (Fetch API)

#### Get All Health Education Items

```javascript
const getHealthEducations = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/health-education", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.success) {
      console.log("Health education items:", data.data);
      console.log("Total count:", data.count);
    } else {
      console.error("Error:", data.message);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};
```

#### Get Health Education by ID

```javascript
const getHealthEducationById = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/health-education/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      console.log("Health education item:", data.data);
    } else {
      console.error("Error:", data.message);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};
```

#### Create Health Education Item (Admin)

```javascript
const createHealthEducation = async (healthEducationData, token) => {
  try {
    const response = await fetch("http://localhost:3001/api/health-education", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: healthEducationData.title,
        headline: healthEducationData.headline,
        contentType: healthEducationData.contentType, // 'article' or 'video'
        body: healthEducationData.body,
        url: healthEducationData.url || null,
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
const newItem = await createHealthEducation(
  {
    title: "Understanding Diabetes",
    headline: "Learn about diabetes prevention",
    contentType: "article",
    body: "Diabetes is a chronic condition...",
    url: "https://example.com/article",
  },
  userToken
);
```

#### Update Health Education Item (Admin)

```javascript
const updateHealthEducation = async (id, updates, token) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/health-education/${id}`,
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
const updated = await updateHealthEducation(
  "65a1b2c3d4e5f6789012345",
  {
    title: "Updated Title",
    headline: "Updated headline",
  },
  userToken
);
```

#### Delete Health Education Item (Admin)

```javascript
const deleteHealthEducation = async (id, token) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/health-education/${id}`,
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

interface HealthEducationItem {
  _id: string;
  title: string;
  headline: string;
  contentType: "article" | "video";
  body: string;
  url: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useHealthEducations = () => {
  const [healthEducations, setHealthEducations] = useState<
    HealthEducationItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthEducations = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:3001/api/health-education"
        );
        const data = await response.json();

        if (data.success) {
          setHealthEducations(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch health education items");
      } finally {
        setLoading(false);
      }
    };

    fetchHealthEducations();
  }, []);

  return { healthEducations, loading, error };
};
```

---

## Notes

1. **Published Items Only**: The GET endpoints only return items where `isPublished: true`. Deleted items are not actually removed but marked as unpublished.

2. **Authentication**: Admin endpoints require a valid JWT token. Obtain the token by logging in through the user authentication endpoint first.

3. **Content Type**: The `contentType` field must be exactly `"article"` or `"video"` (case-sensitive).

4. **URL Field**: The `url` field is optional and can be `null`. It's typically used for external links to articles or video URLs.

5. **Rate Limiting**: The API has rate limiting (1000 requests per 10 minutes per IP). Be mindful of this when making multiple requests.

6. **CORS**: The API is configured to accept requests from `http://localhost:5173` and `http://localhost:5174`. Update CORS settings in production.

---

## Testing with cURL

### Get All Items

```bash
curl -X GET http://localhost:3001/api/health-education
```

### Get Item by ID

```bash
curl -X GET http://localhost:3001/api/health-education/65a1b2c3d4e5f6789012345
```

### Create Item (Admin)

```bash
curl -X POST http://localhost:3001/api/health-education \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Understanding Diabetes",
    "headline": "Learn about diabetes prevention",
    "contentType": "article",
    "body": "Diabetes is a chronic condition...",
    "url": "https://example.com/article"
  }'
```

### Update Item (Admin)

```bash
curl -X PUT http://localhost:3001/api/health-education/65a1b2c3d4e5f6789012345 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Updated Title"
  }'
```

### Delete Item (Admin)

```bash
curl -X DELETE http://localhost:3001/api/health-education/65a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## User Registration Reference

To register a user and obtain an authentication token for admin operations, use the user registration endpoint:

**Endpoint:** `POST /api/users/register`

**Request Body:**

```json
{
  "username": "admin_user",
  "email": "admin@example.com",
  "password": "secure_password",
  "role": "admin"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "username": "admin_user",
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Use the `token` from the registration response in the `Authorization: Bearer <token>` header for admin operations.
