# Announcement API Documentation

## Overview

The Announcement API provides endpoints for managing announcements in the MedAccess system. Announcements can be created, read, updated, and deleted by authorized users (ADMIN role required for write operations).

## Base URL

```
/api/announcements
```

## Authentication

- **Protected endpoints** require a valid JWT token in the Authorization header
- **Admin-only endpoints** require the user to have `ADMIN` role
- **Public endpoints** can be accessed without authentication

### Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Data Models

### Announcement Object

```typescript
interface Announcement {
  _id: string; // MongoDB ObjectId
  title: string; // Required, max 200 characters
  content: string; // Required
  author: {
    // Populated user object
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: "user" | "admin" | "doctor";
  };
  isPublished: boolean; // Default: false
  attachment?: string | null; // S3 URL or null
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
}
```

### Create/Update Request Body

```typescript
interface AnnouncementCreate {
  title: string; // Required, max 200 characters
  content: string; // Required
  isPublished?: boolean; // Optional, default: false
  attachment?: string | null; // Optional, URL string
}

interface AnnouncementUpdate {
  title?: string; // Optional
  content?: string; // Optional
  isPublished?: boolean; // Optional
  attachment?: string | null; // Optional
}
```

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number; // For list endpoints
}
```

## Endpoints

### 1. Get All Announcements

**GET** `/api/announcements`

**Description:** Retrieve all announcements with optional filtering for published announcements.

**Authentication:** Public (no auth required)

**Query Parameters:**

- `published` (optional): `"true"` to get only published announcements

**Example Request:**

```bash
GET /api/announcements
GET /api/announcements?published=true
```

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012345a",
      "title": "System Maintenance Notice",
      "content": "The system will be under maintenance...",
      "author": {
        "_id": "64a1b2c3d4e5f6789012345b",
        "username": "admin",
        "firstName": "John",
        "lastName": "Doe",
        "role": "admin"
      },
      "isPublished": true,
      "attachment": "https://s3.amazonaws.com/bucket/announcements/1234567890-document.pdf",
      "createdAt": "2023-07-01T10:00:00.000Z",
      "updatedAt": "2023-07-01T10:00:00.000Z"
    }
  ]
}
```

**Status Codes:**

- `200` - Success
- `500` - Server error

---

### 2. Get Announcement by ID

**GET** `/api/announcements/:id`

**Description:** Retrieve a specific announcement by its ID.

**Authentication:** Public (no auth required)

**Path Parameters:**

- `id` (required): MongoDB ObjectId of the announcement

**Example Request:**

```bash
GET /api/announcements/64a1b2c3d4e5f6789012345a
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345a",
    "title": "System Maintenance Notice",
    "content": "The system will be under maintenance...",
    "author": {
      "_id": "64a1b2c3d4e5f6789012345b",
      "username": "admin",
      "firstName": "John",
      "lastName": "Doe",
      "role": "admin"
    },
    "isPublished": true,
    "attachment": "https://s3.amazonaws.com/bucket/announcements/1234567890-document.pdf",
    "createdAt": "2023-07-01T10:00:00.000Z",
    "updatedAt": "2023-07-01T10:00:00.000Z"
  }
}
```

**Status Codes:**

- `200` - Success
- `400` - Invalid announcement ID format
- `404` - Announcement not found
- `500` - Server error

---

### 3. Create Announcement

**POST** `/api/announcements`

**Description:** Create a new announcement. Supports file upload for attachments.

**Authentication:** Required (JWT token)
**Authorization:** ADMIN role required

**Content-Type:** `multipart/form-data` (for file upload) or `application/json`

**Request Body:**

```json
{
  "title": "New Announcement",
  "content": "This is the content of the announcement",
  "isPublished": false,
  "attachment": "https://example.com/file.pdf" // Optional: URL string
}
```

**File Upload:**

- Field name: `attachment`
- Allowed file types: `image/jpeg`, `image/png`, `image/gif`, `application/pdf`
- Maximum file size: 5MB
- Files are uploaded to AWS S3

**Example Request (with file):**

```bash
curl -X POST /api/announcements \
  -H "Authorization: Bearer <jwt_token>" \
  -F "title=New Announcement" \
  -F "content=This is the content" \
  -F "isPublished=false" \
  -F "attachment=@/path/to/file.pdf"
```

**Response:**

```json
{
  "success": true,
  "message": "Announcement created",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345a",
    "title": "New Announcement",
    "content": "This is the content of the announcement",
    "author": "64a1b2c3d4e5f6789012345b",
    "isPublished": false,
    "attachment": "https://s3.amazonaws.com/bucket/announcements/1234567890-file.pdf",
    "createdAt": "2023-07-01T10:00:00.000Z",
    "updatedAt": "2023-07-01T10:00:00.000Z"
  }
}
```

**Status Codes:**

- `201` - Created successfully
- `400` - Validation error
- `401` - Not authenticated
- `403` - Insufficient permissions
- `500` - Server error
- `502` - S3 upload failed

---

### 4. Update Announcement

**PUT** `/api/announcements/:id`

**Description:** Update an existing announcement. Supports file upload for new attachments.

**Authentication:** Required (JWT token)
**Authorization:** ADMIN role required

**Path Parameters:**

- `id` (required): MongoDB ObjectId of the announcement

**Content-Type:** `multipart/form-data` (for file upload) or `application/json`

**Request Body:**

```json
{
  "title": "Updated Announcement Title",
  "content": "Updated content",
  "isPublished": true,
  "attachment": "https://example.com/new-file.pdf" // Optional
}
```

**File Upload:**

- Same specifications as create endpoint
- New file will replace existing attachment

**Example Request:**

```bash
curl -X PUT /api/announcements/64a1b2c3d4e5f6789012345a \
  -H "Authorization: Bearer <jwt_token>" \
  -F "title=Updated Title" \
  -F "content=Updated content" \
  -F "isPublished=true"
```

**Response:**

```json
{
  "success": true,
  "message": "Announcement updated",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345a",
    "title": "Updated Announcement Title",
    "content": "Updated content",
    "author": "64a1b2c3d4e5f6789012345b",
    "isPublished": true,
    "attachment": "https://s3.amazonaws.com/bucket/announcements/1234567890-new-file.pdf",
    "createdAt": "2023-07-01T10:00:00.000Z",
    "updatedAt": "2023-07-01T11:30:00.000Z"
  }
}
```

**Status Codes:**

- `200` - Updated successfully
- `400` - Validation error or invalid ID format
- `401` - Not authenticated
- `403` - Insufficient permissions
- `404` - Announcement not found
- `500` - Server error

---

### 5. Delete Announcement

**DELETE** `/api/announcements/:id`

**Description:** Delete an announcement permanently.

**Authentication:** Required (JWT token)
**Authorization:** ADMIN role required

**Path Parameters:**

- `id` (required): MongoDB ObjectId of the announcement

**Example Request:**

```bash
curl -X DELETE /api/announcements/64a1b2c3d4e5f6789012345a \
  -H "Authorization: Bearer <jwt_token>"
```

**Response:**

```json
{
  "success": true,
  "message": "Announcement deleted",
  "data": {}
}
```

**Status Codes:**

- `200` - Deleted successfully
- `400` - Invalid announcement ID format
- `401` - Not authenticated
- `403` - Insufficient permissions
- `404` - Announcement not found
- `500` - Server error

---

### 6. Update Publish Status

**PATCH** `/api/announcements/:id/publish`

**Description:** Update only the publish status of an announcement.

**Authentication:** Required (JWT token)
**Authorization:** ADMIN role required

**Path Parameters:**

- `id` (required): MongoDB ObjectId of the announcement

**Request Body:**

```json
{
  "isPublished": true
}
```

**Example Request:**

```bash
curl -X PATCH /api/announcements/64a1b2c3d4e5f6789012345a/publish \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"isPublished": true}'
```

**Response:**

```json
{
  "success": true,
  "message": "Publish status updated",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345a",
    "title": "System Maintenance Notice",
    "content": "The system will be under maintenance...",
    "author": "64a1b2c3d4e5f6789012345b",
    "isPublished": true,
    "attachment": "https://s3.amazonaws.com/bucket/announcements/1234567890-document.pdf",
    "createdAt": "2023-07-01T10:00:00.000Z",
    "updatedAt": "2023-07-01T12:00:00.000Z"
  }
}
```

**Status Codes:**

- `200` - Updated successfully
- `400` - Invalid announcement ID format
- `401` - Not authenticated
- `403` - Insufficient permissions
- `404` - Announcement not found
- `500` - Server error

## Error Responses

### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation error: Title is required, Title cannot exceed 200 characters"
}
```

### Authentication Error (401)

```json
{
  "success": false,
  "message": "Not authenticated"
}
```

### Authorization Error (403)

```json
{
  "success": false,
  "message": "Access denied. Admin role required."
}
```

### Not Found Error (404)

```json
{
  "success": false,
  "message": "Announcement not found"
}
```

### Server Error (500)

```json
{
  "success": false,
  "message": "Server error creating announcement"
}
```

### S3 Upload Error (502)

```json
{
  "success": false,
  "message": "File upload to S3 failed. Check AWS_REGION, bucket, and credentials."
}
```

## Frontend Integration Examples

### JavaScript/TypeScript Examples

#### Fetch All Published Announcements

```typescript
const fetchPublishedAnnouncements = async () => {
  try {
    const response = await fetch("/api/announcements?published=true");
    const data = await response.json();

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw error;
  }
};
```

#### Create Announcement with File Upload

```typescript
const createAnnouncement = async (announcementData: {
  title: string;
  content: string;
  isPublished: boolean;
  attachment?: File;
}) => {
  const formData = new FormData();
  formData.append("title", announcementData.title);
  formData.append("content", announcementData.content);
  formData.append("isPublished", announcementData.isPublished.toString());

  if (announcementData.attachment) {
    formData.append("attachment", announcementData.attachment);
  }

  try {
    const response = await fetch("/api/announcements", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }
};
```

#### Update Announcement

```typescript
const updateAnnouncement = async (
  id: string,
  updates: {
    title?: string;
    content?: string;
    isPublished?: boolean;
    attachment?: File;
  }
) => {
  const formData = new FormData();

  if (updates.title) formData.append("title", updates.title);
  if (updates.content) formData.append("content", updates.content);
  if (updates.isPublished !== undefined)
    formData.append("isPublished", updates.isPublished.toString());
  if (updates.attachment) formData.append("attachment", updates.attachment);

  try {
    const response = await fetch(`/api/announcements/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error updating announcement:", error);
    throw error;
  }
};
```

#### Toggle Publish Status

```typescript
const togglePublishStatus = async (id: string, isPublished: boolean) => {
  try {
    const response = await fetch(`/api/announcements/${id}/publish`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isPublished }),
    });

    const data = await response.json();

    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error updating publish status:", error);
    throw error;
  }
};
```

## File Upload Specifications

### Supported File Types

- **Images:** JPEG, PNG, GIF
- **Documents:** PDF
- **Maximum file size:** 5MB

### File Upload Process

1. Files are uploaded to AWS S3
2. File names are sanitized (spaces replaced with underscores)
3. Unique timestamps are prepended to prevent conflicts
4. Public URLs are generated and stored in the database

### File Upload Error Handling

- Invalid file type: Returns validation error
- File too large: Returns validation error
- S3 upload failure: Returns 502 error with specific message

## Best Practices

### Frontend Implementation

1. **Always check response.success** before processing data
2. **Handle file upload progress** for better UX
3. **Validate file types and sizes** on the frontend before upload
4. **Show appropriate loading states** during API calls
5. **Implement proper error handling** with user-friendly messages

### Security Considerations

1. **Store JWT tokens securely** (httpOnly cookies recommended)
2. **Validate user permissions** on the frontend (but always trust backend validation)
3. **Sanitize user input** before sending to API
4. **Handle token expiration** gracefully

### Performance Tips

1. **Use pagination** for large announcement lists (if implemented)
2. **Cache published announcements** for better performance
3. **Implement optimistic updates** for better UX
4. **Use proper loading states** to prevent multiple requests

## Testing

### Test Scenarios

1. **Create announcement** with and without attachments
2. **Update announcement** with partial data
3. **Delete announcement** and verify removal
4. **Toggle publish status** and verify changes
5. **Test file upload** with various file types and sizes
6. **Test authentication** with invalid/expired tokens
7. **Test authorization** with non-admin users

### Sample Test Data

```json
{
  "title": "Test Announcement",
  "content": "This is a test announcement for development purposes.",
  "isPublished": false
}
```

---

This documentation provides comprehensive guidance for frontend integration with the Announcement API. All endpoints are documented with examples, error handling, and best practices for implementation.
