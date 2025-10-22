# Login API Documentation

## Overview

The Login API endpoint allows users to authenticate and receive a JWT token for accessing protected resources. The API supports username-based authentication and returns both a JWT token in the response body and sets an HTTP-only cookie for enhanced security.

## Endpoint Details

### **POST** `/api/users/login`

Authenticates a user and returns a JWT token along with user profile information.

---

## Request

### Headers

```http
Content-Type: application/json
```

### Request Body

```json
{
  "username": "string",
  "password": "string"
}
```

#### Request Body Schema

| Field      | Type   | Required | Description                                |
| ---------- | ------ | -------- | ------------------------------------------ |
| `username` | string | Yes      | The user's username (must not be empty)    |
| `password` | string | Yes      | The user's password (minimum 6 characters) |

#### Example Request

```json
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

---

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "username": "john_doe",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "address": "123 Main St, City, State 12345",
      "phone": "+1234567890",
      "gender": "male",
      "dateOfBirth": "1990-01-15T00:00:00.000Z",
      "profilePicture": "https://example.com/profile.jpg",
      "role": "user",
      "isActive": true,
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Responses

#### 400 Bad Request - Missing Password

```json
{
  "success": false,
  "message": "Password is required"
}
```

#### 400 Bad Request - Missing Username

```json
{
  "success": false,
  "message": "Username or email is required"
}
```

#### 401 Unauthorized - Invalid Credentials

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### 401 Unauthorized - Account Deactivated

```json
{
  "success": false,
  "message": "Account is deactivated. Please contact administrator."
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Server error during login"
}
```

---

## Response Headers

### Success Response Headers

```http
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

**Cookie Details:**

- **Name**: `token`
- **Value**: JWT token
- **HttpOnly**: `true` (prevents XSS attacks)
- **Secure**: `true` (HTTPS only in production)
- **SameSite**: `Strict` (CSRF protection)
- **Max-Age**: `604800` seconds (7 days)

---

## User Profile Object Structure

The `user` object in the response contains the following fields:

| Field            | Type    | Description                                  |
| ---------------- | ------- | -------------------------------------------- |
| `id`             | string  | Unique user identifier (MongoDB ObjectId)    |
| `username`       | string  | User's unique username                       |
| `email`          | string  | User's email address (optional)              |
| `firstName`      | string  | User's first name                            |
| `lastName`       | string  | User's last name                             |
| `fullName`       | string  | Computed full name (firstName + lastName)    |
| `address`        | string  | User's address                               |
| `phone`          | string  | User's phone number                          |
| `gender`         | string  | User's gender ("male", "female", "other")    |
| `dateOfBirth`    | string  | User's date of birth (ISO 8601 format)       |
| `profilePicture` | string  | URL to user's profile picture                |
| `role`           | string  | User's role ("user", "admin", "doctor")      |
| `isActive`       | boolean | Whether the user account is active           |
| `lastLogin`      | string  | Last login timestamp (ISO 8601 format)       |
| `createdAt`      | string  | Account creation timestamp (ISO 8601 format) |

---

## JWT Token Details

### Token Payload

The JWT token contains the following claims:

```json
{
  "id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "username": "john_doe",
  "email": "john.doe@example.com",
  "role": "user",
  "iat": 1642248000,
  "exp": 1642852800
}
```

### Token Properties

- **Algorithm**: HS256
- **Expiration**: 7 days from issue time
- **Secret**: Configured via `JWT_SECRET` environment variable

---

## Frontend Integration Examples

### JavaScript/TypeScript (Fetch API)

```javascript
const loginUser = async (username, password) => {
  try {
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for cookies
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Store token in localStorage for API calls
      localStorage.setItem("token", data.data.token);

      // User data is available
      console.log("Logged in user:", data.data.user);

      // Cookie is automatically set by the server
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
};

// Usage
loginUser("john_doe", "securePassword123")
  .then((userData) => {
    console.log("Login successful:", userData);
    // Redirect to dashboard or update UI
  })
  .catch((error) => {
    console.error("Login error:", error);
    // Show error message to user
  });
```

### Axios Example

```javascript
import axios from "axios";

const loginUser = async (username, password) => {
  try {
    const response = await axios.post(
      "/api/users/login",
      {
        username,
        password,
      },
      {
        withCredentials: true, // Important for cookies
      }
    );

    if (response.data.success) {
      // Store token for subsequent API calls
      localStorage.setItem("token", response.data.data.token);

      // Set default authorization header for future requests
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.data.token}`;

      return response.data.data;
    }
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.message);
    } else {
      // Network or other error
      throw new Error("Network error occurred");
    }
  }
};
```

### React Hook Example

```javascript
import { useState } from "react";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.data.token);
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

// Usage in component
const LoginComponent = () => {
  const { login, loading, error } = useLogin();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(formData.username, formData.password);
      console.log("Login successful:", userData);
      // Handle successful login (redirect, update state, etc.)
    } catch (err) {
      // Error is already set in the hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};
```

---

## Security Considerations

### For Frontend Developers

1. **Token Storage**:

   - Store JWT token in localStorage for API calls
   - The HTTP-only cookie provides additional security
   - Never store sensitive data in localStorage

2. **Credentials**:

   - Always include `credentials: 'include'` in fetch requests
   - Use `withCredentials: true` in Axios

3. **Error Handling**:

   - Don't expose detailed error messages to users
   - Handle network errors gracefully
   - Implement proper loading states

4. **Token Usage**:
   - Include token in Authorization header for protected routes
   - Handle token expiration (7 days)
   - Implement automatic logout on 401 responses

### Example Protected API Call

```javascript
const fetchProtectedData = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/api/protected-endpoint", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      // Redirect to login
      window.location.href = "/login";
      return;
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
  }
};
```

---

## Testing

### cURL Example

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securePassword123"
  }' \
  -c cookies.txt
```

### Postman Collection

```json
{
  "name": "Login API",
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
      "raw": "{\n  \"username\": \"john_doe\",\n  \"password\": \"securePassword123\"\n}"
    },
    "url": {
      "raw": "{{base_url}}/api/users/login",
      "host": ["{{base_url}}"],
      "path": ["api", "users", "login"]
    }
  }
}
```

---

## Common Issues and Solutions

### Issue: "Username or email is required"

**Solution**: Ensure the username field is not empty or null.

### Issue: "Password is required"

**Solution**: Ensure the password field is provided in the request body.

### Issue: "Invalid credentials"

**Solution**: Verify the username exists and the password is correct.

### Issue: "Account is deactivated"

**Solution**: Contact administrator to reactivate the account.

### Issue: Cookie not being set

**Solution**: Ensure `credentials: 'include'` is set in fetch requests or `withCredentials: true` in Axios.

### Issue: CORS errors

**Solution**: Ensure the backend is configured to accept credentials from your frontend domain.

---

## Rate Limiting and Best Practices

1. **Rate Limiting**: Implement client-side rate limiting to prevent brute force attacks
2. **Input Validation**: Validate inputs on the frontend before sending requests
3. **Loading States**: Show loading indicators during authentication
4. **Error Messages**: Display user-friendly error messages
5. **Session Management**: Implement proper logout functionality
6. **Token Refresh**: Consider implementing token refresh mechanism for long sessions

---

## Related Endpoints

- **POST** `/api/users/register` - User registration
- **POST** `/api/users/logout` - User logout
- **GET** `/api/users/me` - Get current user profile
- **PUT** `/api/users/:id` - Update user profile
