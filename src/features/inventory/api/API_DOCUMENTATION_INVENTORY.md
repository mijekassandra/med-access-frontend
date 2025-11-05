# Medical Inventory API Documentation

## Base URL

```
/api/inventory
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

### 1. Get All Inventory Items

**Endpoint:** `GET /api/inventory`

**Description:** Retrieves all inventory items. Supports search functionality via query parameter.

**Authentication:** Not required (Public)

**Query Parameters:**

- `q` (string, optional) - Search query to filter by name, brand, or batch number (case-insensitive)

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Paracetamol 500mg",
      "brand": "Tylenol",
      "description": "Pain reliever and fever reducer",
      "dosage": "500mg per tablet",
      "stock": 150,
      "expiration_date": "2025-12-31T00:00:00.000Z",
      "batch_no": "BATCH-2024-001",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Aspirin 100mg",
      "brand": "Bayer",
      "description": "Blood thinner and pain reliever",
      "dosage": "100mg per tablet",
      "stock": 75,
      "expiration_date": null,
      "batch_no": "BATCH-2024-002",
      "createdAt": "2024-01-16T08:20:00.000Z",
      "updatedAt": "2024-01-16T08:20:00.000Z"
    }
  ]
}
```

**Status Codes:**

- `200 OK` - Success
- `500 Internal Server Error` - Server error

**Example Request (cURL):**

```bash
# Get all inventory items
curl -X GET http://localhost:3001/api/inventory

# Search inventory items
curl -X GET "http://localhost:3001/api/inventory?q=Paracetamol"
```

**Example Request (JavaScript/Fetch):**

```javascript
// Get all inventory items
const response = await fetch("http://localhost:3001/api/inventory");
const data = await response.json();
console.log(data);

// Search inventory items
const searchResponse = await fetch(
  "http://localhost:3001/api/inventory?q=Paracetamol"
);
const searchData = await searchResponse.json();
```

---

### 2. Get Inventory Item by ID

**Endpoint:** `GET /api/inventory/:id`

**Description:** Retrieves a single inventory item by its ID.

**Authentication:** Not required (Public)

**URL Parameters:**

- `id` (string, required) - MongoDB ObjectId of the inventory item

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Paracetamol 500mg",
    "brand": "Tylenol",
    "description": "Pain reliever and fever reducer",
    "dosage": "500mg per tablet",
    "stock": 150,
    "expiration_date": "2025-12-31T00:00:00.000Z",
    "batch_no": "BATCH-2024-001",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Status Codes:**

- `200 OK` - Success
- `400 Bad Request` - Invalid inventory ID format
- `404 Not Found` - Inventory item not found
- `500 Internal Server Error` - Server error

**Example Request (cURL):**

```bash
curl -X GET http://localhost:3001/api/inventory/507f1f77bcf86cd799439011
```

**Example Request (JavaScript/Fetch):**

```javascript
const inventoryId = "507f1f77bcf86cd799439011";
const response = await fetch(
  `http://localhost:3001/api/inventory/${inventoryId}`
);
const data = await response.json();
```

---

### 3. Create Inventory Item

**Endpoint:** `POST /api/inventory`

**Description:** Creates a new inventory item. Requires admin authentication.

**Authentication:** Required (Admin only)

**Request Format:** `application/json`

**Request Body (JSON):**

```json
{
  "name": "Paracetamol 500mg",
  "brand": "Tylenol",
  "description": "Pain reliever and fever reducer",
  "dosage": "500mg per tablet",
  "stock": 150,
  "expiration_date": "2025-12-31",
  "batch_no": "BATCH-2024-001"
}
```

**Request Body Fields:**

- `name` (string, **required**) - Name of the inventory item (max 150 characters)
- `brand` (string, optional) - Brand name (max 100 characters, defaults to empty string)
- `description` (string, optional) - Description of the item (max 1000 characters, defaults to empty string)
- `dosage` (string, optional) - Dosage information (max 100 characters, defaults to empty string)
- `stock` (number, **required**) - Stock quantity (must be >= 0, defaults to 0)
- `expiration_date` (string, optional) - Expiration date in ISO format (YYYY-MM-DD or ISO 8601, defaults to null)
- `batch_no` (string, optional) - Batch number (max 100 characters, defaults to empty string)

**Response:**

```json
{
  "success": true,
  "message": "Inventory item created",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Paracetamol 500mg",
    "brand": "Tylenol",
    "description": "Pain reliever and fever reducer",
    "dosage": "500mg per tablet",
    "stock": 150,
    "expiration_date": "2025-12-31T00:00:00.000Z",
    "batch_no": "BATCH-2024-001",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Status Codes:**

- `201 Created` - Inventory item created successfully
- `400 Bad Request` - Validation error (missing required fields, invalid data)
- `401 Unauthorized` - No authentication token provided
- `403 Forbidden` - User is not an admin
- `500 Internal Server Error` - Server error

**Example Request (cURL):**

```bash
curl -X POST http://localhost:3001/api/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Paracetamol 500mg",
    "brand": "Tylenol",
    "description": "Pain reliever and fever reducer",
    "dosage": "500mg per tablet",
    "stock": 150,
    "expiration_date": "2025-12-31",
    "batch_no": "BATCH-2024-001"
  }'
```

**Example Request (JavaScript/Fetch):**

```javascript
const response = await fetch("http://localhost:3001/api/inventory", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Admin JWT token
  },
  body: JSON.stringify({
    name: "Paracetamol 500mg",
    brand: "Tylenol",
    description: "Pain reliever and fever reducer",
    dosage: "500mg per tablet",
    stock: 150,
    expiration_date: "2025-12-31",
    batch_no: "BATCH-2024-001",
  }),
});

const data = await response.json();
```

**Example Request (React/Form Submission):**

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = {
    name: e.target.name.value,
    brand: e.target.brand.value || "",
    description: e.target.description.value || "",
    dosage: e.target.dosage.value || "",
    stock: parseInt(e.target.stock.value),
    expiration_date: e.target.expiration_date.value || null,
    batch_no: e.target.batch_no.value || "",
  };

  try {
    const response = await fetch("http://localhost:3001/api/inventory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Admin JWT token
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (result.success) {
      console.log("Inventory item created:", result.data);
    } else {
      console.error("Error:", result.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// HTML Form
<form onSubmit={handleSubmit}>
  <input
    name="name"
    type="text"
    required
    maxLength={150}
    placeholder="Item Name *"
  />
  <input name="brand" type="text" maxLength={100} placeholder="Brand" />
  <textarea name="description" maxLength={1000} placeholder="Description" />
  <input name="dosage" type="text" maxLength={100} placeholder="Dosage" />
  <input name="stock" type="number" min="0" required placeholder="Stock *" />
  <input name="expiration_date" type="date" placeholder="Expiration Date" />
  <input
    name="batch_no"
    type="text"
    maxLength={100}
    placeholder="Batch Number"
  />
  <button type="submit">Create Inventory Item</button>
</form>;
```

---

### 4. Update Inventory Item

**Endpoint:** `PUT /api/inventory/:id`

**Description:** Updates an existing inventory item. Requires admin authentication.

**Authentication:** Required (Admin only)

**URL Parameters:**

- `id` (string, required) - MongoDB ObjectId of the inventory item

**Request Format:** `application/json`

**Request Body (JSON):**

All fields are optional. Only include fields you want to update.

```json
{
  "stock": 200,
  "expiration_date": "2026-01-15",
  "brand": "Updated Brand Name"
}
```

**Request Body Fields (all optional):**

- `name` (string, optional) - Name of the inventory item (max 150 characters)
- `brand` (string, optional) - Brand name (max 100 characters)
- `description` (string, optional) - Description (max 1000 characters)
- `dosage` (string, optional) - Dosage information (max 100 characters)
- `stock` (number, optional) - Stock quantity (must be >= 0)
- `expiration_date` (string, optional) - Expiration date in ISO format (YYYY-MM-DD or ISO 8601, or null to clear)
- `batch_no` (string, optional) - Batch number (max 100 characters)

**Response:**

```json
{
  "success": true,
  "message": "Inventory item updated",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Paracetamol 500mg",
    "brand": "Updated Brand Name",
    "description": "Pain reliever and fever reducer",
    "dosage": "500mg per tablet",
    "stock": 200,
    "expiration_date": "2026-01-15T00:00:00.000Z",
    "batch_no": "BATCH-2024-001",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

**Status Codes:**

- `200 OK` - Inventory item updated successfully
- `400 Bad Request` - Invalid inventory ID or invalid update payload
- `401 Unauthorized` - No authentication token provided
- `403 Forbidden` - User is not an admin
- `404 Not Found` - Inventory item not found
- `500 Internal Server Error` - Server error

**Example Request (cURL):**

```bash
curl -X PUT http://localhost:3001/api/inventory/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "stock": 200,
    "expiration_date": "2026-01-15"
  }'
```

**Example Request (JavaScript/Fetch):**

```javascript
const updates = {
  stock: 200,
  expiration_date: "2026-01-15",
  brand: "Updated Brand Name",
};

const response = await fetch(
  `http://localhost:3001/api/inventory/${inventoryId}`,
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
```

---

### 5. Delete Inventory Item

**Endpoint:** `DELETE /api/inventory/:id`

**Description:** Permanently deletes an inventory item from the database. This is a hard delete operation. Requires admin authentication.

**Authentication:** Required (Admin only)

**URL Parameters:**

- `id` (string, required) - MongoDB ObjectId of the inventory item

**Response:**

```json
{
  "success": true,
  "message": "Inventory item deleted"
}
```

**Status Codes:**

- `200 OK` - Inventory item deleted successfully
- `400 Bad Request` - Invalid inventory ID format
- `401 Unauthorized` - No authentication token provided
- `403 Forbidden` - User is not an admin
- `404 Not Found` - Inventory item not found
- `500 Internal Server Error` - Server error

**Example Request (cURL):**

```bash
curl -X DELETE http://localhost:3001/api/inventory/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Example Request (JavaScript/Fetch):**

```javascript
const response = await fetch(
  `http://localhost:3001/api/inventory/${inventoryId}`,
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

### Inventory Item Object

```typescript
{
  _id: string;                    // MongoDB ObjectId
  name: string;                   // Required, max 150 chars
  brand?: string;                 // Optional, max 100 chars, defaults to ""
  description?: string;           // Optional, max 1000 chars, defaults to ""
  dosage?: string;                // Optional, max 100 chars, defaults to ""
  stock: number;                  // Required, must be >= 0, defaults to 0
  expiration_date?: Date | null;  // Optional, defaults to null
  batch_no?: string;              // Optional, max 100 chars, defaults to ""
  createdAt: Date;                // Auto-generated timestamp
  updatedAt: Date;                // Auto-generated timestamp
}
```

### Inventory Creation Input

```typescript
{
  name: string;                   // Required
  brand?: string;                 // Optional
  description?: string;           // Optional
  dosage?: string;                // Optional
  stock: number;                  // Required, >= 0
  expiration_date?: string;       // Optional, ISO date string (YYYY-MM-DD)
  batch_no?: string;              // Optional
}
```

### Inventory Update Input

```typescript
{
  name?: string;                  // Optional
  brand?: string;                 // Optional
  description?: string;           // Optional
  dosage?: string;                // Optional
  stock?: number;                 // Optional, >= 0
  expiration_date?: string | null; // Optional, ISO date string or null
  batch_no?: string;              // Optional
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

- `"Validation error: Name is required, Stock cannot be negative"` - Validation failed (400)
- `"Invalid inventory id"` - Invalid ObjectId format (400)
- `"Invalid update payload"` - Invalid data in update request (400)

**Not Found:**

- `"Inventory item not found"` - Item doesn't exist (404)

**Server Errors:**

- `"Server error creating inventory item"` - General server error (500)
- `"Server error fetching inventory"` - Server error (500)
- `"Server error updating inventory item"` - Server error (500)
- `"Server error deleting inventory item"` - Server error (500)

---

## Frontend Integration Examples

### Complete React Component Example

```jsx
import React, { useState, useEffect } from "react";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token"); // Get token from storage

  // Fetch all inventory items
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const url = searchQuery
          ? `http://localhost:3001/api/inventory?q=${encodeURIComponent(
              searchQuery
            )}`
          : "http://localhost:3001/api/inventory";
        const response = await fetch(url);
        const data = await response.json();
        if (data.success) {
          setInventory(data.data);
        }
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [searchQuery]);

  // Create inventory item (Admin only)
  const createInventoryItem = async (formData) => {
    try {
      const response = await fetch("http://localhost:3001/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        // Refresh inventory list
        window.location.reload();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error creating inventory item:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Medical Inventory</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name, brand, or batch number..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Inventory List */}
      {inventory.map((item) => (
        <div key={item._id}>
          <h3>{item.name}</h3>
          {item.brand && <p>Brand: {item.brand}</p>}
          {item.description && <p>{item.description}</p>}
          {item.dosage && <p>Dosage: {item.dosage}</p>}
          <p>Stock: {item.stock}</p>
          {item.expiration_date && (
            <p>
              Expires: {new Date(item.expiration_date).toLocaleDateString()}
            </p>
          )}
          {item.batch_no && <p>Batch: {item.batch_no}</p>}
        </div>
      ))}
    </div>
  );
};

export default InventoryPage;
```

### Form Handling Example

```jsx
const InventoryForm = ({ onSubmit, initialData = null }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      brand: e.target.brand.value || "",
      description: e.target.description.value || "",
      dosage: e.target.dosage.value || "",
      stock: parseInt(e.target.stock.value),
      expiration_date: e.target.expiration_date.value || null,
      batch_no: e.target.batch_no.value || "",
    };

    // Validate required fields
    if (!formData.name || formData.stock === undefined || formData.stock < 0) {
      alert("Name and stock (>= 0) are required");
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name *</label>
        <input
          name="name"
          type="text"
          required
          maxLength={150}
          defaultValue={initialData?.name || ""}
        />
      </div>

      <div>
        <label>Brand</label>
        <input
          name="brand"
          type="text"
          maxLength={100}
          defaultValue={initialData?.brand || ""}
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          name="description"
          maxLength={1000}
          defaultValue={initialData?.description || ""}
        />
      </div>

      <div>
        <label>Dosage</label>
        <input
          name="dosage"
          type="text"
          maxLength={100}
          defaultValue={initialData?.dosage || ""}
        />
      </div>

      <div>
        <label>Stock *</label>
        <input
          name="stock"
          type="number"
          min="0"
          required
          defaultValue={initialData?.stock || 0}
        />
      </div>

      <div>
        <label>Expiration Date</label>
        <input
          name="expiration_date"
          type="date"
          defaultValue={
            initialData?.expiration_date
              ? new Date(initialData.expiration_date)
                  .toISOString()
                  .split("T")[0]
              : ""
          }
        />
      </div>

      <div>
        <label>Batch Number</label>
        <input
          name="batch_no"
          type="text"
          maxLength={100}
          defaultValue={initialData?.batch_no || ""}
        />
      </div>

      <button type="submit">
        {initialData ? "Update" : "Create"} Inventory Item
      </button>
    </form>
  );
};
```

### Update Inventory Example

```jsx
const updateInventoryItem = async (id, updates) => {
  try {
    const response = await fetch(`http://localhost:3001/api/inventory/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const result = await response.json();
    if (result.success) {
      console.log("Inventory updated:", result.data);
      return result.data;
    } else {
      console.error("Error:", result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error updating inventory:", error);
    throw error;
  }
};

// Usage example
await updateInventoryItem("507f1f77bcf86cd799439011", {
  stock: 200,
  expiration_date: "2026-01-15",
});
```

### Delete Inventory Example

```jsx
const deleteInventoryItem = async (id) => {
  if (
    !confirm(
      "Are you sure you want to delete this item? This action cannot be undone."
    )
  ) {
    return;
  }

  try {
    const response = await fetch(`http://localhost:3001/api/inventory/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (result.success) {
      console.log("Inventory item deleted");
      // Refresh list or remove from UI
    } else {
      console.error("Error:", result.message);
    }
  } catch (error) {
    console.error("Error deleting inventory:", error);
  }
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

### For POST/PUT Requests

1. Set method to POST or PUT
2. Go to "Body" tab
3. Select "raw"
4. Choose "JSON" from dropdown
5. Add JSON body:

```json
{
  "name": "Paracetamol 500mg",
  "brand": "Tylenol",
  "description": "Pain reliever and fever reducer",
  "dosage": "500mg per tablet",
  "stock": 150,
  "expiration_date": "2025-12-31",
  "batch_no": "BATCH-2024-001"
}
```

### For GET Requests with Search

1. Set method to GET
2. Go to "Params" tab
3. Add query parameter:
   - Key: `q`
   - Value: `Paracetamol`

---

## Field Validation Rules

### Name

- **Required**: Yes
- **Type**: String
- **Max Length**: 150 characters
- **Trim**: Yes (whitespace removed)

### Brand

- **Required**: No
- **Type**: String
- **Max Length**: 100 characters
- **Default**: Empty string
- **Trim**: Yes

### Description

- **Required**: No
- **Type**: String
- **Max Length**: 1000 characters
- **Default**: Empty string
- **Trim**: Yes

### Dosage

- **Required**: No
- **Type**: String
- **Max Length**: 100 characters
- **Default**: Empty string
- **Trim**: Yes

### Stock

- **Required**: Yes
- **Type**: Number (Integer)
- **Min Value**: 0
- **Default**: 0
- **Indexed**: Yes (for efficient queries)

### Expiration Date

- **Required**: No
- **Type**: Date (ISO 8601 string or Date object)
- **Format**: `YYYY-MM-DD` or full ISO 8601 datetime
- **Default**: null
- **Indexed**: Yes (for efficient queries)

### Batch Number

- **Required**: No
- **Type**: String
- **Max Length**: 100 characters
- **Default**: Empty string
- **Trim**: Yes
- **Indexed**: Yes (for efficient queries)

---

## Search Functionality

The GET `/api/inventory` endpoint supports search via the `q` query parameter:

- **Case-insensitive**: Searches are case-insensitive
- **Multi-field**: Searches across `name`, `brand`, and `batch_no` fields
- **Partial match**: Uses regex matching, so partial strings work
- **Examples**:
  - `?q=Paracetamol` - Finds items with "Paracetamol" in name, brand, or batch_no
  - `?q=BATCH-2024` - Finds items with "BATCH-2024" in any searchable field
  - `?q=tylenol` - Finds "Tylenol" (case-insensitive)

---

## Sorting and Ordering

Inventory items are automatically sorted by:

- **Creation Date**: Descending order (newest first)

This sorting is applied by default in the GET `/api/inventory` endpoint.

---

## Notes

1. **Hard Delete**: DELETE endpoint permanently removes the inventory item from the database. This action cannot be undone.
2. **Public Read Access**: All GET endpoints are publicly accessible without authentication
3. **Admin Write Access**: All POST, PUT, and DELETE endpoints require ADMIN role
4. **Date Format**: When sending dates, use ISO 8601 format (YYYY-MM-DD) or full ISO datetime string
5. **Stock Validation**: Stock cannot be negative. Minimum value is 0
6. **Token Expiration**: JWT tokens may expire - handle 401 responses by refreshing the token
7. **Indexed Fields**: `stock`, `expiration_date`, `batch_no`, `name`, and `createdAt` are indexed for better query performance
8. **Search Performance**: The search query searches across multiple fields using regex, which may impact performance on large datasets

---

## Base URL Configuration

Update the base URL based on your environment:

```javascript
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";
```

Then use:

```javascript
fetch(`${API_BASE_URL}/inventory`);
```

---

## Support

For issues or questions, refer to:

- Server logs for detailed error messages
- Network tab in browser DevTools for request/response details
- Check that CORS is properly configured if accessing from frontend
- Verify MongoDB connection if experiencing database errors
