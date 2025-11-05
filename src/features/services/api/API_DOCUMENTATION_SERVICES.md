# Services API Documentation

## Base URL

```
/api/services
```

## Authentication

Some endpoints require authentication. Include the JWT token in one of the following ways:

### Option 1: Authorization Header (Recommended)

```
Authorization: Bearer <your_jwt_token>
```

### Option 2: Cookie

```
Cookie: token=<your_jwt_token>
```

### Authentication Requirements

- **Admin Role Required**: POST, PUT, DELETE endpoints require ADMIN role
- **Public Access**: GET endpoints are publicly accessible (no authentication needed)

---

## Endpoints

### 1. Get All Services (Published Only)

**Endpoint:** `GET /api/services`

**Description:** Retrieves all published services. Unpublished services are not returned.

**Authentication:** Not required (Public)

**Query Parameters:** None

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "serviceName": "General Consultation",
      "additionalInfo": "Comprehensive health checkup",
      "price": 500.0,
      "image": "https://jr-test-ma.s3.ap-southeast-1.amazonaws.com/services/1234567890-service.jpg",
      "isPublished": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Status Codes:**

- `200 OK` - Success
- `500 Internal Server Error` - Server error

**Example Request (cURL):**

```bash
curl -X GET http://localhost:3001/api/services
```

**Example Request (JavaScript/Fetch):**

```javascript
const response = await fetch("http://localhost:3001/api/services");
const data = await response.json();
console.log(data);
```

---

### 2. Get Service by ID

**Endpoint:** `GET /api/services/:id`

**Description:** Retrieves a single service by its ID. Only returns published services.

**Authentication:** Not required (Public)

**URL Parameters:**

- `id` (string, required) - MongoDB ObjectId of the service

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "serviceName": "General Consultation",
    "additionalInfo": "Comprehensive health checkup",
    "price": 500.0,
    "image": "https://jr-test-ma.s3.ap-southeast-1.amazonaws.com/services/1234567890-service.jpg",
    "isPublished": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Status Codes:**

- `200 OK` - Success
- `400 Bad Request` - Invalid service ID format
- `404 Not Found` - Service not found or not published
- `500 Internal Server Error` - Server error

**Example Request (cURL):**

```bash
curl -X GET http://localhost:3001/api/services/507f1f77bcf86cd799439011
```

**Example Request (JavaScript/Fetch):**

```javascript
const serviceId = "507f1f77bcf86cd799439011";
const response = await fetch(`http://localhost:3001/api/services/${serviceId}`);
const data = await response.json();
```

---

### 3. Create Service

**Endpoint:** `POST /api/services`

**Description:** Creates a new service. Requires admin authentication.

**Authentication:** Required (Admin only)

**Request Format:** `multipart/form-data`

**Request Body (Form Data):**

- `serviceName` (string, required) - Name of the service (max 200 characters)
- `additionalInfo` (string, optional) - Additional information about the service (max 1000 characters)
- `price` (number, required) - Price of the service (must be >= 0)
- `image` (file, optional) - Image file for the service
  - Allowed types: `image/jpeg`, `image/png`, `image/gif`
  - Max size: 5MB
  - Field name must be: `image`

**Note:** If no image is provided, a default image URL will be used.

**Response:**

```json
{
  "success": true,
  "message": "Service created",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "serviceName": "General Consultation",
    "additionalInfo": "Comprehensive health checkup",
    "price": 500.0,
    "image": "https://jr-test-ma.s3.ap-southeast-1.amazonaws.com/services/1234567890-service.jpg",
    "isPublished": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Status Codes:**

- `201 Created` - Service created successfully
- `400 Bad Request` - Validation error (missing required fields, invalid data)
- `401 Unauthorized` - No authentication token provided
- `403 Forbidden` - User is not an admin
- `500 Internal Server Error` - Server error
- `502 Bad Gateway` - S3 upload failed (if image provided)

**Example Request (cURL):**

```bash
curl -X POST http://localhost:3001/api/services \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "serviceName=General Consultation" \
  -F "additionalInfo=Comprehensive health checkup" \
  -F "price=500.00" \
  -F "image=@/path/to/image.jpg"
```

**Example Request (JavaScript/Fetch with FormData):**

```javascript
const formData = new FormData();
formData.append("serviceName", "General Consultation");
formData.append("additionalInfo", "Comprehensive health checkup");
formData.append("price", "500.00");
formData.append("image", imageFile); // File object from input

const response = await fetch("http://localhost:3001/api/services", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`, // Include JWT token
    // Don't set Content-Type header - browser will set it with boundary
  },
  body: formData,
});

const data = await response.json();
```

**Example Request (React/Form Submission):**

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  try {
    const response = await fetch("http://localhost:3001/api/services", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Admin JWT token
      },
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      console.log("Service created:", result.data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// HTML Form
<form onSubmit={handleSubmit}>
  <input name="serviceName" type="text" required />
  <textarea name="additionalInfo"></textarea>
  <input name="price" type="number" step="0.01" required />
  <input name="image" type="file" accept="image/jpeg,image/png,image/gif" />
  <button type="submit">Create Service</button>
</form>;
```

---

### 4. Update Service

**Endpoint:** `PUT /api/services/:id`

**Description:** Updates an existing service. Requires admin authentication.

**Authentication:** Required (Admin only)

**URL Parameters:**

- `id` (string, required) - MongoDB ObjectId of the service

**Request Format:** `multipart/form-data`

**Request Body (Form Data):**

- `serviceName` (string, optional) - Name of the service (max 200 characters)
- `additionalInfo` (string, optional) - Additional information (max 1000 characters)
- `price` (number, optional) - Price (must be >= 0)
- `image` (file, optional) - New image file
  - Allowed types: `image/jpeg`, `image/png`, `image/gif`
  - Max size: 5MB
  - Field name must be: `image`
- `isPublished` (boolean, optional) - Publish status

**Note:** Only include fields you want to update. If image is provided, it will replace the existing image.

**Response:**

```json
{
  "success": true,
  "message": "Service updated",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "serviceName": "Updated Service Name",
    "additionalInfo": "Updated info",
    "price": 600.0,
    "image": "https://jr-test-ma.s3.ap-southeast-1.amazonaws.com/services/1234567891-new-image.jpg",
    "isPublished": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

**Status Codes:**

- `200 OK` - Service updated successfully
- `400 Bad Request` - Invalid service ID or invalid update payload
- `401 Unauthorized` - No authentication token provided
- `403 Forbidden` - User is not an admin
- `404 Not Found` - Service not found
- `500 Internal Server Error` - Server error
- `502 Bad Gateway` - S3 upload failed (if image provided)

**Example Request (cURL):**

```bash
curl -X PUT http://localhost:3001/api/services/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "price=600.00" \
  -F "image=@/path/to/new-image.jpg"
```

**Example Request (JavaScript/Fetch with FormData):**

```javascript
const formData = new FormData();
formData.append("price", "600.00");
formData.append("serviceName", "Updated Service Name");
if (newImageFile) {
  formData.append("image", newImageFile);
}

const response = await fetch(
  `http://localhost:3001/api/services/${serviceId}`,
  {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }
);

const data = await response.json();
```

---

### 5. Delete Service (Soft Delete)

**Endpoint:** `DELETE /api/services/:id`

**Description:** Soft deletes a service by setting `isPublished` to `false`. The service will no longer appear in public GET requests. Requires admin authentication.

**Authentication:** Required (Admin only)

**URL Parameters:**

- `id` (string, required) - MongoDB ObjectId of the service

**Response:**

```json
{
  "success": true,
  "message": "Service unpublished"
}
```

**Status Codes:**

- `200 OK` - Service unpublished successfully
- `400 Bad Request` - Invalid service ID format
- `401 Unauthorized` - No authentication token provided
- `403 Forbidden` - User is not an admin
- `404 Not Found` - Service not found
- `500 Internal Server Error` - Server error

**Example Request (cURL):**

```bash
curl -X DELETE http://localhost:3001/api/services/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Example Request (JavaScript/Fetch):**

```javascript
const response = await fetch(
  `http://localhost:3001/api/services/${serviceId}`,
  {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const data = await response.json();
```

---

## Data Models

### Service Object

```typescript
{
  _id: string;                    // MongoDB ObjectId
  serviceName: string;             // Required, max 200 chars
  additionalInfo?: string;         // Optional, max 1000 chars, defaults to ""
  price: number;                   // Required, must be >= 0
  image?: string | null;           // S3 URL or default image URL
  isPublished: boolean;            // Defaults to true
  createdAt: Date;                 // Auto-generated timestamp
  updatedAt: Date;                 // Auto-generated timestamp
}
```

---

## Error Responses

All endpoints return errors in a consistent format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Messages

**Authentication Errors:**

- `"Access denied. No authentication token provided."` - Missing token (401)
- `"Invalid or expired token."` - Invalid/expired token (401)
- `"Access denied. Role 'USER' is not authorized to access this route."` - Insufficient permissions (403)

**Validation Errors:**

- `"Validation error: Service name is required, Price cannot be negative"` - Validation failed (400)
- `"Invalid service id"` - Invalid ObjectId format (400)

**Not Found:**

- `"Service not found"` - Service doesn't exist or not published (404)

**Server Errors:**

- `"Server error creating service"` - General server error (500)
- `"File upload to S3 failed"` - S3 upload error (502)

---

## File Upload Guidelines

### Image Upload Requirements

- **Field Name:** Must be `image` (exactly)
- **Max File Size:** 5MB
- **Allowed MIME Types:**
  - `image/jpeg`
  - `image/png`
  - `image/gif`
- **Content Type:** Use `multipart/form-data`

### Default Image

If no image is provided during creation, the service will use:

```
https://jr-test-ma.s3.ap-southeast-1.amazonaws.com/default.png
```

### Image Storage

- Images are uploaded to AWS S3
- Path format: `services/{timestamp}-{filename}`
- Spaces in filenames are replaced with underscores

---

## Frontend Integration Examples

### Complete React Component Example

```jsx
import React, { useState, useEffect } from "react";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token"); // Get token from storage

  // Fetch all services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/services");
        const data = await response.json();
        if (data.success) {
          setServices(data.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Create service (Admin only)
  const createService = async (formData) => {
    try {
      const response = await fetch("http://localhost:3001/api/services", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        // Refresh services list
        window.location.reload();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Services</h1>
      {services.map((service) => (
        <div key={service._id}>
          <h3>{service.serviceName}</h3>
          <p>{service.additionalInfo}</p>
          <p>Price: ${service.price}</p>
          {service.image && (
            <img src={service.image} alt={service.serviceName} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ServicesPage;
```

### Form Handling Example

```jsx
const ServiceForm = ({ onSubmit }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    // Validate required fields
    if (!formData.get("serviceName") || !formData.get("price")) {
      alert("Service name and price are required");
      return;
    }

    // Validate price
    const price = parseFloat(formData.get("price"));
    if (isNaN(price) || price < 0) {
      alert("Price must be a valid number >= 0");
      return;
    }

    // Validate image if provided
    const imageFile = formData.get("image");
    if (imageFile && imageFile.size > 0) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (imageFile.size > maxSize) {
        alert("Image size must be less than 5MB");
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(imageFile.type)) {
        alert("Image must be JPEG, PNG, or GIF");
        return;
      }
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Service Name *</label>
        <input name="serviceName" type="text" required maxLength={200} />
      </div>

      <div>
        <label>Additional Info</label>
        <textarea name="additionalInfo" maxLength={1000} />
      </div>

      <div>
        <label>Price *</label>
        <input name="price" type="number" step="0.01" min="0" required />
      </div>

      <div>
        <label>Image</label>
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/gif"
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};
```

---

## Testing with Postman

### Setup

1. Create a new request
2. Set method and URL
3. For authenticated endpoints, add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_JWT_TOKEN`

### For POST/PUT with Images

1. Set method to POST or PUT
2. Go to "Body" tab
3. Select "form-data"
4. Add fields:
   - `serviceName` (text)
   - `additionalInfo` (text)
   - `price` (text)
   - `image` (file) - Click dropdown and select "File"
5. Select your image file

---

## Notes

1. **Published Services Only**: GET endpoints only return services where `isPublished: true`
2. **Soft Delete**: DELETE endpoint doesn't actually remove the service, it sets `isPublished: false`
3. **Image Upload**: Images are stored in AWS S3 and URLs are returned
4. **Default Image**: If no image is provided during creation, a default image URL is used
5. **File Size Limit**: Maximum file size is 5MB
6. **Token Expiration**: JWT tokens may expire - handle 401 responses by refreshing the token

---

## Base URL Configuration

Update the base URL based on your environment:

```javascript
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";
```

Then use:

```javascript
fetch(`${API_BASE_URL}/services`);
```

---

## Support

For issues or questions, refer to:

- Server logs for detailed error messages
- Network tab in browser DevTools for request/response details
- Check that CORS is properly configured if accessing from frontend
