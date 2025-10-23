# User Registration API Documentation

## Overview

This document provides comprehensive information about the User Registration API endpoint for the MedAccess backend system. This endpoint allows new users to register in the system with their personal information.

## Endpoint Information

### Base URL

```
http://localhost:3001/api/users/register
```

### Method

```
POST
```

### Access Level

```
Public (No authentication required)
```

## Request

### Headers

```http
Content-Type: application/json
```

### Request Body Schema

```typescript
interface IUserRegistration {
  username: string; // Required, unique, max 50 characters
  email?: string; // Optional, must be valid email format if provided
  password: string; // Required, minimum 6 characters
  firstName: string; // Required, max 50 characters
  lastName: string; // Required, max 50 characters
  role?: UserRole; // Optional, defaults to 'user'
  address: string; // Required, max 200 characters
  phone: string; // Required, valid phone number format
  gender: string; // Required, must be 'male', 'female', or 'other'
  dateOfBirth: Date; // Required, valid date
}
```

### User Roles

```typescript
enum UserRole {
  USER = "user",
  ADMIN = "admin",
  DOCTOR = "doctor",
}
```

### Example Request Body

```json
{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "address": "123 Main Street, City, State 12345",
  "phone": "+1234567890",
  "gender": "male",
  "dateOfBirth": "1990-05-15T00:00:00.000Z"
}
```

### Field Validation Rules

| Field         | Type   | Required | Validation Rules                                                                                                                |
| ------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `username`    | string | ✅       | - Must be unique<br>- Maximum 50 characters<br>- Trimmed whitespace                                                             |
| `email`       | string | ❌       | - Must be valid email format<br>- Must be unique if provided<br>- Uses regex: `/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/` |
| `password`    | string | ✅       | - Minimum 6 characters<br>- Will be hashed with bcrypt (12 rounds)                                                              |
| `firstName`   | string | ✅       | - Maximum 50 characters<br>- Trimmed whitespace                                                                                 |
| `lastName`    | string | ✅       | - Maximum 50 characters<br>- Trimmed whitespace                                                                                 |
| `role`        | string | ❌       | - Must be one of: 'user', 'admin', 'doctor'<br>- Defaults to 'user' if not provided                                             |
| `address`     | string | ✅       | - Maximum 200 characters<br>- Trimmed whitespace                                                                                |
| `phone`       | string | ✅       | - Must match regex: `/^[\+]?[1-9][\d]{0,15}$/`<br>- Trimmed whitespace                                                          |
| `gender`      | string | ✅       | - Must be one of: 'male', 'female', 'other'<br>- Trimmed whitespace                                                             |
| `dateOfBirth` | Date   | ✅       | - Must be a valid date                                                                                                          |

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "64f8b2c1a1b2c3d4e5f67890",
    "username": "john_doe",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "address": "123 Main Street, City, State 12345",
    "phone": "+1234567890",
    "gender": "male",
    "dateOfBirth": "1990-05-15T00:00:00.000Z",
    "profilePicture": "",
    "role": "user",
    "isActive": true,
    "lastLogin": null,
    "createdAt": "2023-09-06T10:30:00.000Z"
  }
}
```

### Error Responses

#### 400 Bad Request - User Already Exists

```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

or

```json
{
  "success": false,
  "message": "Username already taken"
}
```

#### 400 Bad Request - Validation Error

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Username is required",
    "Password must be at least 6 characters",
    "Please enter a valid email"
  ]
}
```

#### 400 Bad Request - Duplicate Key Error

```json
{
  "success": false,
  "message": "username already exists"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Server error during registration"
}
```

## Frontend Integration Examples

### JavaScript/TypeScript (Fetch API)

```typescript
interface RegistrationData {
  username: string;
  email?: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "user" | "admin" | "doctor";
  address: string;
  phone: string;
  gender: "male" | "female" | "other";
  dateOfBirth: string; // ISO date string
}

async function registerUser(userData: RegistrationData) {
  try {
    const response = await fetch("http://localhost:3001/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (result.success) {
      console.log("Registration successful:", result.data);
      return result.data;
    } else {
      console.error("Registration failed:", result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

// Usage example
const newUser = {
  username: "jane_smith",
  email: "jane.smith@example.com",
  password: "securePassword123",
  firstName: "Jane",
  lastName: "Smith",
  address: "456 Oak Avenue, Town, State 67890",
  phone: "+1987654321",
  gender: "female",
  dateOfBirth: "1985-12-10T00:00:00.000Z",
};

registerUser(newUser)
  .then((user) => {
    console.log("User registered:", user);
    // Handle successful registration
  })
  .catch((error) => {
    console.error("Registration failed:", error);
    // Handle registration error
  });
```

### React Hook Example

```typescript
import { useState } from "react";

interface UseRegistrationReturn {
  registerUser: (userData: RegistrationData) => Promise<any>;
  loading: boolean;
  error: string | null;
}

export const useRegistration = (): UseRegistrationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = async (userData: RegistrationData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Registration failed");
      }

      return result.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error };
};
```

### Axios Example

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async (userData: RegistrationData) => {
  try {
    const response = await api.post("/users/register", userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
    throw error;
  }
};
```

## Form Validation (Frontend)

### Client-Side Validation Example

```typescript
interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
}

export const validateRegistrationForm = (
  data: RegistrationData
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Username validation
  if (!data.username) {
    errors.username = "Username is required";
  } else if (data.username.length > 50) {
    errors.username = "Username cannot be more than 50 characters";
  }

  // Email validation
  if (data.email) {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = "Please enter a valid email";
    }
  }

  // Password validation
  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  // First name validation
  if (!data.firstName) {
    errors.firstName = "First name is required";
  } else if (data.firstName.length > 50) {
    errors.firstName = "First name cannot be more than 50 characters";
  }

  // Last name validation
  if (!data.lastName) {
    errors.lastName = "Last name is required";
  } else if (data.lastName.length > 50) {
    errors.lastName = "Last name cannot be more than 50 characters";
  }

  // Address validation
  if (!data.address) {
    errors.address = "Address is required";
  } else if (data.address.length > 200) {
    errors.address = "Address cannot be more than 200 characters";
  }

  // Phone validation
  if (!data.phone) {
    errors.phone = "Phone number is required";
  } else {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(data.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
  }

  // Gender validation
  if (!data.gender) {
    errors.gender = "Gender is required";
  } else if (!["male", "female", "other"].includes(data.gender)) {
    errors.gender = "Gender must be male, female, or other";
  }

  // Date of birth validation
  if (!data.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required";
  } else {
    const date = new Date(data.dateOfBirth);
    if (isNaN(date.getTime())) {
      errors.dateOfBirth = "Please enter a valid date";
    }
  }

  return errors;
};
```

## Security Considerations

1. **Password Security**: Passwords are automatically hashed using bcrypt with 12 salt rounds
2. **Input Sanitization**: All inputs are sanitized to prevent XSS and NoSQL injection attacks
3. **Rate Limiting**: The API has rate limiting (1000 requests per 10 minutes per IP)
4. **CORS**: Configured for specific origins in production
5. **Validation**: Both client-side and server-side validation are implemented

## Testing

### cURL Example

```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com",
    "password": "testPassword123",
    "firstName": "Test",
    "lastName": "User",
    "address": "123 Test Street, Test City, TC 12345",
    "phone": "+1234567890",
    "gender": "other",
    "dateOfBirth": "1990-01-01T00:00:00.000Z"
  }'
```

### Postman Collection

```json
{
  "info": {
    "name": "User Registration",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"test_user\",\n  \"email\": \"test@example.com\",\n  \"password\": \"testPassword123\",\n  \"firstName\": \"Test\",\n  \"lastName\": \"User\",\n  \"address\": \"123 Test Street, Test City, TC 12345\",\n  \"phone\": \"+1234567890\",\n  \"gender\": \"other\",\n  \"dateOfBirth\": \"1990-01-01T00:00:00.000Z\"\n}"
        },
        "url": {
          "raw": "http://localhost:3001/api/users/register",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "users", "register"]
        }
      }
    }
  ]
}
```

## Notes

1. **Default Values**: The `role` field defaults to 'user' if not provided
2. **Profile Picture**: The `profilePicture` field is optional and defaults to an empty string
3. **User Status**: New users are created with `isActive: true` by default
4. **Timestamps**: `createdAt` and `updatedAt` are automatically managed by MongoDB
5. **Password**: The password field is excluded from responses for security
6. **Unique Constraints**: Both `username` and `email` must be unique across the system

## Error Handling Best Practices

1. Always check the `success` field in the response
2. Handle validation errors by displaying them to the user
3. Implement proper loading states during registration
4. Provide clear error messages for different failure scenarios
5. Consider implementing retry logic for network errors
