# Health Education API Documentation

## Overview

This API provides endpoints for managing health education content including articles and videos. The API supports CRUD operations with role-based access control.

**Base URL:** `http://localhost:3001/api/health-education`

## Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Content Types

- **article**: Text-based educational content
- **video**: Video-based educational content

## Data Models

### Health Education Object

```typescript
{
  _id: string;                    // MongoDB ObjectId
  title: string;                  // Required, max 200 characters
  headline: string;               // Required, max 300 characters
  contentType: 'article' | 'video'; // Required
  body: string;                   // Required, main content
  url?: string | null;            // Optional, external URL
  createdAt: Date;                // Auto-generated timestamp
  updatedAt: Date;                // Auto-generated timestamp
}
```

## API Endpoints

### 1. Get All Health Education Items

**GET** `/api/health-education`

**Description:** Retrieve all health education items (public access)

**Headers:**

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
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "title": "Understanding Diabetes",
      "headline": "Learn about diabetes management and prevention",
      "contentType": "article",
      "body": "Diabetes is a chronic condition...",
      "url": null,
      "createdAt": "2023-09-01T10:00:00.000Z",
      "updatedAt": "2023-09-01T10:00:00.000Z"
    }
  ]
}
```

**Status Codes:**

- `200` - Success
- `500` - Server error

---

### 2. Get Health Education by ID

**GET** `/api/health-education/:id`

**Description:** Retrieve a specific health education item by ID (public access)

**Parameters:**

- `id` (string, required) - MongoDB ObjectId of the health education item

**Headers:**

```
Content-Type: application/json
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "title": "Understanding Diabetes",
    "headline": "Learn about diabetes management and prevention",
    "contentType": "article",
    "body": "Diabetes is a chronic condition...",
    "url": null,
    "createdAt": "2023-09-01T10:00:00.000Z",
    "updatedAt": "2023-09-01T10:00:00.000Z"
  }
}
```

**Status Codes:**

- `200` - Success
- `400` - Invalid ID format
- `404` - Health education not found
- `500` - Server error

---

### 3. Create Health Education Item

**POST** `/api/health-education`

**Description:** Create a new health education item (Admin only)

**Authentication:** Required (Admin role)

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "title": "Understanding Diabetes",
  "headline": "Learn about diabetes management and prevention",
  "contentType": "article",
  "body": "Diabetes is a chronic condition that affects how your body turns food into energy...",
  "url": "https://example.com/diabetes-guide"
}
```

**Field Validation:**

- `title`: Required, string, max 200 characters
- `headline`: Required, string, max 300 characters
- `contentType`: Required, must be "article" or "video"
- `body`: Required, string
- `url`: Optional, string or null

**Response:**

```json
{
  "success": true,
  "message": "Health education created",
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "title": "Understanding Diabetes",
    "headline": "Learn about diabetes management and prevention",
    "contentType": "article",
    "body": "Diabetes is a chronic condition that affects how your body turns food into energy...",
    "url": "https://example.com/diabetes-guide",
    "createdAt": "2023-09-01T10:00:00.000Z",
    "updatedAt": "2023-09-01T10:00:00.000Z"
  }
}
```

**Status Codes:**

- `201` - Created successfully
- `400` - Validation error
- `401` - Unauthorized (no token)
- `403` - Forbidden (not admin)
- `500` - Server error

---

### 4. Update Health Education Item

**PUT** `/api/health-education/:id`

**Description:** Update an existing health education item (Admin only)

**Authentication:** Required (Admin role)

**Parameters:**

- `id` (string, required) - MongoDB ObjectId of the health education item

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "title": "Updated Diabetes Guide",
  "headline": "Comprehensive diabetes management guide",
  "contentType": "article",
  "body": "Updated content about diabetes...",
  "url": "https://example.com/updated-diabetes-guide"
}
```

**Note:** All fields are optional in the request body. Only provided fields will be updated.

**Response:**

```json
{
  "success": true,
  "message": "Health education updated",
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "title": "Updated Diabetes Guide",
    "headline": "Comprehensive diabetes management guide",
    "contentType": "article",
    "body": "Updated content about diabetes...",
    "url": "https://example.com/updated-diabetes-guide",
    "createdAt": "2023-09-01T10:00:00.000Z",
    "updatedAt": "2023-09-01T11:30:00.000Z"
  }
}
```

**Status Codes:**

- `200` - Updated successfully
- `400` - Validation error or invalid ID format
- `401` - Unauthorized (no token)
- `403` - Forbidden (not admin)
- `404` - Health education not found
- `500` - Server error

---

### 5. Delete Health Education Item

**DELETE** `/api/health-education/:id`

**Description:** Delete a health education item (Admin only)

**Authentication:** Required (Admin role)

**Parameters:**

- `id` (string, required) - MongoDB ObjectId of the health education item

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "success": true,
  "message": "Health education deleted",
  "data": {}
}
```

**Status Codes:**

- `200` - Deleted successfully
- `400` - Invalid ID format
- `401` - Unauthorized (no token)
- `403` - Forbidden (not admin)
- `404` - Health education not found
- `500` - Server error

## Error Responses

### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation error: Title is required, Content type must be either 'article' or 'video'"
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "message": "Access denied. No authentication token provided."
}
```

### Forbidden (403)

```json
{
  "success": false,
  "message": "Access denied. Role 'USER' is not authorized to access this route."
}
```

### Not Found (404)

```json
{
  "success": false,
  "message": "Health education not found"
}
```

### Server Error (500)

```json
{
  "success": false,
  "message": "Server error creating health education"
}
```

## Frontend Integration Examples

### JavaScript/TypeScript Examples

#### Fetch All Health Education Items

```javascript
const fetchHealthEducation = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/health-education");
    const data = await response.json();

    if (data.success) {
      console.log("Health education items:", data.data);
      return data.data;
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
      body: JSON.stringify(healthEducationData),
    });

    const data = await response.json();

    if (data.success) {
      console.log("Created:", data.data);
      return data.data;
    } else {
      console.error("Error:", data.message);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

// Usage
const newItem = {
  title: "Heart Health Basics",
  headline: "Essential information about cardiovascular health",
  contentType: "article",
  body: "Your heart is a vital organ...",
  url: "https://example.com/heart-health",
};

createHealthEducation(newItem, "your-jwt-token");
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
        body: JSON.stringify(updates),
      }
    );

    const data = await response.json();

    if (data.success) {
      console.log("Updated:", data.data);
      return data.data;
    } else {
      console.error("Error:", data.message);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

// Usage
const updates = {
  title: "Updated Heart Health Guide",
  body: "Updated content about heart health...",
};

updateHealthEducation("64f1a2b3c4d5e6f7g8h9i0j1", updates, "your-jwt-token");
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
      console.log("Deleted successfully");
      return true;
    } else {
      console.error("Error:", data.message);
      return false;
    }
  } catch (error) {
    console.error("Network error:", error);
    return false;
  }
};
```

### React Hook Example

```javascript
import { useState, useEffect } from "react";

const useHealthEducation = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3001/api/health-education"
      );
      const data = await response.json();

      if (data.success) {
        setItems(data.data);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return { items, loading, error, refetch: fetchItems };
};
```

## Rate Limiting

The API implements rate limiting:

- **Limit:** 1000 requests per 10 minutes per IP
- **Headers:** Rate limit information is included in response headers

## Security Features

- JWT authentication
- Role-based access control
- Input validation and sanitization
- XSS protection
- NoSQL injection prevention
- CORS enabled for specific origins
- Helmet security headers

## Environment Variables

Make sure these environment variables are set:

- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)

## Testing the API

### Using curl

#### Get all items:

```bash
curl -X GET http://localhost:3001/api/health-education
```

#### Create item (replace with your admin token):

```bash
curl -X POST http://localhost:3001/api/health-education \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Article",
    "headline": "Test headline",
    "contentType": "article",
    "body": "Test content"
  }'
```

#### Get item by ID:

```bash
curl -X GET http://localhost:3001/api/health-education/64f1a2b3c4d5e6f7g8h9i0j1
```

#### Update item:

```bash
curl -X PUT http://localhost:3001/api/health-education/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Updated Title"
  }'
```

#### Delete item:

```bash
curl -X DELETE http://localhost:3001/api/health-education/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Notes

- All timestamps are in ISO 8601 format
- MongoDB ObjectIds are 24-character hexadecimal strings
- The API returns consistent response formats with `success`, `message`, and `data` fields
- Admin authentication is required for create, update, and delete operations
- Read operations are public and don't require authentication
