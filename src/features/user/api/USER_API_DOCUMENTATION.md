# User API Documentation

This document provides comprehensive documentation for the User API endpoints in the MedAccess backend system.

## Table of Contents

1. [Base URL](#base-url)
2. [Authentication](#authentication)
3. [User Roles](#user-roles)
4. [Data Models](#data-models)
5. [API Endpoints](#api-endpoints)
6. [Error Handling](#error-handling)
7. [Frontend Integration Examples](#frontend-integration-examples)

## Base URL

```
http://localhost:5000/api/users
```

## Authentication

The API uses JWT (JSON Web Token) authentication with HTTP-only cookies and Bearer token support.

### Authentication Methods

1. **HTTP-Only Cookie** (Recommended for web applications)
2. **Bearer Token** in Authorization header

### Getting Authentication Token

After successful login, the server sets an HTTP-only cookie with the JWT token. For API clients, you can also use the token from the login response in the Authorization header.

## User Roles

```typescript
enum UserRole {
  USER = "user", // Regular user
  ADMIN = "admin", // Administrator
  DOCTOR = "doctor", // Medical professional
}
```

## Data Models

### User Profile (Response Format)

```typescript
interface IUserProfile {
  id: string;
  username: string;
  email?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  address: string;
  phone: string;
  gender: "male" | "female" | "other";
  dateOfBirth: Date;
  profilePicture: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
}
```

### User Registration Input

```typescript
interface IUserRegistration {
  username: string; // Required, unique, max 50 chars
  email?: string; // Optional, must be valid email format
  password: string; // Required, min 6 chars
  firstName: string; // Required, max 50 chars
  lastName: string; // Required, max 50 chars
  address: string; // Required, max 200 chars
  phone: string; // Required, valid phone format
  gender: "male" | "female" | "other"; // Required
  dateOfBirth: Date; // Required
  role?: UserRole; // Optional, defaults to 'user'
}
```

### User Update Input

```typescript
interface IUserUpdate {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: Date;
  profilePicture?: string;
  role?: UserRole;
  isActive?: boolean;
}
```

### Login Input

```typescript
interface IUserLogin {
  username: string; // Username (not email)
  password: string;
}
```

## API Endpoints

### 1. Register User

**POST** `/api/users/register`

Creates a new user account.

**Access:** Public

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "address": "123 Main St, City, State",
  "phone": "+1234567890",
  "gender": "male",
  "dateOfBirth": "1990-01-15T00:00:00.000Z",
  "role": "user"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "address": "123 Main St, City, State",
    "phone": "+1234567890",
    "gender": "male",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "profilePicture": "",
    "role": "user",
    "isActive": true,
    "lastLogin": null,
    "createdAt": "2023-09-01T10:30:00.000Z"
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 2. Login User

**POST** `/api/users/login`

Authenticates a user and returns a JWT token.

**Access:** Public

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "address": "123 Main St, City, State",
      "phone": "+1234567890",
      "gender": "male",
      "dateOfBirth": "1990-01-15T00:00:00.000Z",
      "profilePicture": "",
      "role": "user",
      "isActive": true,
      "lastLogin": "2023-09-01T10:30:00.000Z",
      "createdAt": "2023-09-01T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 3. Logout User

**POST** `/api/users/logout`

Logs out the current user by clearing the authentication cookie.

**Access:** Private

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 4. Get Current User

**GET** `/api/users/me`

Returns the profile of the currently authenticated user.

**Access:** Private

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "address": "123 Main St, City, State",
    "phone": "+1234567890",
    "gender": "male",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "profilePicture": "",
    "role": "user",
    "isActive": true,
    "lastLogin": "2023-09-01T10:30:00.000Z",
    "createdAt": "2023-09-01T10:30:00.000Z"
  }
}
```

### 5. Get All Users

**GET** `/api/users`

Returns a list of all users in the system.

**Access:** Private (Admin only)

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "address": "123 Main St, City, State",
      "phone": "+1234567890",
      "gender": "male",
      "dateOfBirth": "1990-01-15T00:00:00.000Z",
      "profilePicture": "",
      "role": "user",
      "isActive": true,
      "lastLogin": "2023-09-01T10:30:00.000Z",
      "createdAt": "2023-09-01T10:30:00.000Z"
    },
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "username": "janedoe",
      "email": "jane@example.com",
      "firstName": "Jane",
      "lastName": "Doe",
      "fullName": "Jane Doe",
      "address": "456 Oak Ave, City, State",
      "phone": "+1234567891",
      "gender": "female",
      "dateOfBirth": "1985-05-20T00:00:00.000Z",
      "profilePicture": "",
      "role": "admin",
      "isActive": true,
      "lastLogin": "2023-09-01T09:15:00.000Z",
      "createdAt": "2023-08-15T14:20:00.000Z"
    }
  ]
}
```

### 6. Get Active Users

**GET** `/api/users/active`

Returns a list of all active users in the system.

**Access:** Private (Admin only)

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "address": "123 Main St, City, State",
      "phone": "+1234567890",
      "gender": "male",
      "dateOfBirth": "1990-01-15T00:00:00.000Z",
      "profilePicture": "",
      "role": "user",
      "isActive": true,
      "lastLogin": "2023-09-01T10:30:00.000Z",
      "createdAt": "2023-09-01T10:30:00.000Z"
    }
  ]
}
```

### 7. Get User by ID

**GET** `/api/users/:id`

Returns the profile of a specific user.

**Access:** Private (User can access own profile, Admin can access any profile)

**Headers:**

```
Authorization: Bearer <token>
```

**URL Parameters:**

- `id` (string): User ID

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "address": "123 Main St, City, State",
    "phone": "+1234567890",
    "gender": "male",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "profilePicture": "",
    "role": "user",
    "isActive": true,
    "lastLogin": "2023-09-01T10:30:00.000Z",
    "createdAt": "2023-09-01T10:30:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "User not found"
}
```

### 8. Update User

**PUT** `/api/users/:id`

Updates a user's profile information.

**Access:** Private (User can update own profile, Admin can update any profile)

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**

- `id` (string): User ID

**Request Body:**

```json
{
  "firstName": "Johnny",
  "lastName": "Smith",
  "address": "789 Pine St, New City, State",
  "phone": "+1234567892"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "Johnny",
    "lastName": "Smith",
    "fullName": "Johnny Smith",
    "address": "789 Pine St, New City, State",
    "phone": "+1234567892",
    "gender": "male",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "profilePicture": "",
    "role": "user",
    "isActive": true,
    "lastLogin": "2023-09-01T10:30:00.000Z",
    "createdAt": "2023-09-01T10:30:00.000Z"
  }
}
```

### 9. Delete User

**DELETE** `/api/users/:id`

Deletes a user from the system.

**Access:** Private (Admin only)

**Headers:**

```
Authorization: Bearer <admin_token>
```

**URL Parameters:**

- `id` (string): User ID

**Success Response (200):**

```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {}
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "User not found"
}
```

## Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized (Authentication required)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[]; // For validation errors
}
```

### Common Error Messages

**Authentication Errors:**

- `"Access denied. No authentication token provided."`
- `"Invalid or expired token."`
- `"Token is valid but user no longer exists."`
- `"Account is deactivated. Access denied."`

**Authorization Errors:**

- `"Access denied. Role 'user' is not authorized to access this route."`
- `"Access denied. You can only access your own resources."`

**Validation Errors:**

- `"User with this email already exists"`
- `"Username already taken"`
- `"Validation error"` (with detailed errors array)

**Not Found Errors:**

- `"User not found"`

## Frontend Integration Examples

### 1. User Registration (React/JavaScript)

```javascript
const registerUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (result.success) {
      console.log("User registered:", result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Registration failed:", error.message);
    throw error;
  }
};

// Usage
const userData = {
  username: "johndoe",
  email: "john@example.com",
  password: "password123",
  firstName: "John",
  lastName: "Doe",
  address: "123 Main St, City, State",
  phone: "+1234567890",
  gender: "male",
  dateOfBirth: new Date("1990-01-15"),
  role: "user",
};

registerUser(userData);
```

### 2. User Login (React/JavaScript)

```javascript
const loginUser = async (credentials) => {
  try {
    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include", // Important for cookies
    });

    const result = await response.json();

    if (result.success) {
      // Store token in localStorage for API calls
      localStorage.setItem("token", result.data.token);
      console.log("Login successful:", result.data.user);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
};

// Usage
const credentials = {
  username: "johndoe",
  password: "password123",
};

loginUser(credentials);
```

### 3. Get Current User (React/JavaScript)

```javascript
const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/api/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Failed to get current user:", error.message);
    throw error;
  }
};
```

### 4. Update User Profile (React/JavaScript)

```javascript
const updateUserProfile = async (userId, updateData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
      credentials: "include",
    });

    const result = await response.json();

    if (result.success) {
      console.log("User updated:", result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Update failed:", error.message);
    throw error;
  }
};

// Usage
const updateData = {
  firstName: "Johnny",
  lastName: "Smith",
  address: "789 Pine St, New City, State",
};

updateUserProfile("64f1a2b3c4d5e6f7g8h9i0j1", updateData);
```

### 5. Logout User (React/JavaScript)

```javascript
const logoutUser = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/api/users/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const result = await response.json();

    if (result.success) {
      // Clear token from localStorage
      localStorage.removeItem("token");
      console.log("Logout successful");
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Logout failed:", error.message);
    throw error;
  }
};
```

### 6. Axios Configuration (Recommended)

```javascript
import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Important for cookies
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Usage examples with axios
export const userAPI = {
  register: (userData) => api.post("/users/register", userData),
  login: (credentials) => api.post("/users/login", credentials),
  logout: () => api.post("/users/logout"),
  getCurrentUser: () => api.get("/users/me"),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getAllUsers: () => api.get("/users"),
  getActiveUsers: () => api.get("/users/active"),
  getUserById: (id) => api.get(`/users/${id}`),
};
```

### 7. React Hook Example

```javascript
import { useState, useEffect } from "react";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const result = await loginUser(credentials);
      setUser(result.user);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
};

export default useAuth;
```

## Security Considerations

1. **Password Requirements**: Minimum 6 characters
2. **Token Expiration**: JWT tokens expire after 7 days
3. **HTTP-Only Cookies**: Prevents XSS attacks
4. **Role-Based Access**: Different endpoints require different user roles
5. **Input Validation**: All inputs are validated on the server
6. **Account Deactivation**: Inactive accounts cannot authenticate

## Rate Limiting

Consider implementing rate limiting for:

- Login attempts
- Registration requests
- Password reset requests

## Testing

Use tools like Postman, Insomnia, or curl to test the API endpoints:

```bash
# Register a new user
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "address": "123 Test St",
    "phone": "+1234567890",
    "gender": "male",
    "dateOfBirth": "1990-01-01T00:00:00.000Z"
  }'

# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }' \
  -c cookies.txt

# Get current user (using cookie)
curl -X GET http://localhost:5000/api/users/me \
  -b cookies.txt
```

This documentation provides everything needed for frontend integration with the User API endpoints.
